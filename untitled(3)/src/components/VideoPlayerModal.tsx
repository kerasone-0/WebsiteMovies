import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { STREAM_SOURCES, StreamSource } from '../services/sources';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  SkipForward, 
  Subtitles, 
  PictureInPicture2, 
  X, 
  Check, 
  Sliders, 
  ChevronRight, 
  FileText, 
  Radio, 
  FastForward,
  Gauge
} from 'lucide-react';

const QUALITIES = ['Auto', '2160p (4K)', '1080p', '720p', '480p', '360p'];
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const SAMPLE_TRANSCRIPT = [
  { start: 5, end: 12, text: "Long ago, before the cities rose, there was only the desert and the wind." },
  { start: 13, end: 24, text: "They say that power belongs not to those who seek it, but to those who endure." },
  { start: 25, end: 36, text: "Can you hear the drums beneath the sands? The storm is gathering." },
  { start: 38, end: 50, text: "If we cross this canyon before sunrise, we might evade their scouts." },
  { start: 52, end: 68, text: "Trust in the path. Everything that has happened was meant to bring us here." },
  { start: 70, end: 95, text: "Take my hand. Whatever comes next, we face it together." },
  { start: 98, end: 130, text: "We are the protectors of this world. Long live the fighters." },
];

export const VideoPlayerModal: React.FC = () => {
  const { 
    playerState, 
    closePlayer, 
    updateProgress, 
    openPlayer, 
    subtitleConfig, 
    updateSubtitleConfig,
    watchParty,
    preferences
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBoosted, setIsBoosted] = useState(false);

  // Source & Engine state
  const [selectedSource, setSelectedSource] = useState<StreamSource>(STREAM_SOURCES[0]);
  const [playerMode, setPlayerMode] = useState<'embed' | 'native'>('embed');

  // Settings menus state
  const [activeMenu, setActiveMenu] = useState<'main' | 'source' | 'quality' | 'subtitles' | 'speed' | 'color' | 'transcript' | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSubLanguage, setSelectedSubLanguage] = useState('English');
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Video Color Adjustments
  const [colorAdjust, setColorAdjust] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
  });

  const { media, season, episode, initialTime } = playerState;

  const tmdbNumericId = media?.tmdbId || (typeof media?.id === 'number' ? media.id : (typeof media?.id === 'string' && media.id.replace(/\D/g, '') ? parseInt(media.id.replace(/\D/g, '')) : 693134));
  
  const currentEmbedUrl = selectedSource.isEmbed
    ? (media?.type === 'movie'
        ? selectedSource.getMovieUrl(tmdbNumericId)
        : selectedSource.getTvUrl(tmdbNumericId, season || 1, episode || 1))
    : '';

  const nativeStreamUrl = media?.type === 'show' && media.seasons
    ? media.seasons.find(s => s.number === season)?.episodes.find(e => e.number === episode)?.streamUrl || media.streamUrl
    : media?.streamUrl;

  const currentSeasonData = media?.seasons?.find(s => s.number === season);
  const hasNextEpisode = currentSeasonData ? currentSeasonData.episodes.some(e => e.number === episode + 1) : false;
  const hasPrevEpisode = (episode || 1) > 1;

  const introStart = 12;
  const introEnd = 75;
  const isInsideIntro = currentTime >= introStart && currentTime <= introEnd;

  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  useEffect(() => {
    if (!media) return;
    const interval = setInterval(() => {
      if (playerMode === 'native' && videoRef.current && videoRef.current.duration > 0) {
        updateProgress(media.id, videoRef.current.currentTime, videoRef.current.duration, season, episode);
      } else if (playerMode === 'embed') {
        setCurrentTime(t => {
          const next = t + 5;
          const estDuration = (media.runtime || 120) * 60;
          updateProgress(media.id, next, estDuration, season, episode);
          return next;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [media, season, episode, updateProgress, playerMode]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !activeMenu && !showTranscript) {
        setShowControls(false);
      }
    }, 3200);
  }, [isPlaying, activeMenu, showTranscript]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' && preferences.holdToBoost && !e.repeat && playerMode === 'native') {
        e.preventDefault();
        if (videoRef.current) {
          setIsBoosted(true);
          videoRef.current.playbackRate = 2.0;
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' && playerMode === 'native') {
        e.preventDefault();
        seekBy(10);
      } else if (e.key === 'ArrowLeft' && playerMode === 'native') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape') {
        if (activeMenu) {
          setActiveMenu(null);
        } else if (showTranscript) {
          setShowTranscript(false);
        } else {
          closePlayer();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && preferences.holdToBoost && playerMode === 'native') {
        if (videoRef.current) {
          setIsBoosted(false);
          videoRef.current.playbackRate = playbackSpeed;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playbackSpeed, preferences.holdToBoost, activeMenu, showTranscript, closePlayer, playerMode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goToNextEpisode = () => {
    if (!media || !hasNextEpisode) return;
    openPlayer(media, season, episode + 1, 0);
  };

  const goToPrevEpisode = () => {
    if (!media || !hasPrevEpisode) return;
    openPlayer(media, season, episode - 1, 0);
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!playerState.isOpen || !media) return null;

  const filteredTranscript = SAMPLE_TRANSCRIPT.filter(t => 
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* 1. EMBED PLAYER MODE */}
      {playerMode === 'embed' && selectedSource.isEmbed ? (
        <div className="relative w-full h-full bg-black flex flex-col">
          <iframe
            src={currentEmbedUrl}
            title={`${media.title} - ${selectedSource.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        /* 2. NATIVE PLAYER MODE */
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={nativeStreamUrl}
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                if (preferences.autoplay && hasNextEpisode && videoRef.current.currentTime >= videoRef.current.duration - 2) {
                  goToNextEpisode();
                }
              }
            }}
            onDurationChange={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onProgress={() => {
              if (videoRef.current && videoRef.current.buffered.length > 0) {
                setBufferedTime(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
              }
            }}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
            style={{
              filter: `brightness(${colorAdjust.brightness}%) contrast(${colorAdjust.contrast}%) saturate(${colorAdjust.saturation}%) hue-rotate(${colorAdjust.hue}deg)`
            }}
          />

          {/* Subtitles Overlay */}
          {selectedSubLanguage !== 'Off' && (
            <div 
              className="absolute bottom-20 inset-x-0 pointer-events-none flex justify-center text-center px-8 z-30"
              style={{
                transform: `translateY(-${(subtitleConfig.size - 1) * 20}px)`
              }}
            >
              {SAMPLE_TRANSCRIPT.find(t => currentTime >= t.start && currentTime <= t.end) && (
                <span
                  className="inline-block transition-all font-mono"
                  style={{
                    color: subtitleConfig.color,
                    fontSize: `${subtitleConfig.size * 1.25}rem`,
                    fontWeight: subtitleConfig.bold ? 'bold' : 'normal',
                    backgroundColor: `rgba(0, 0, 0, ${subtitleConfig.backgroundOpacity})`,
                    backdropFilter: subtitleConfig.backgroundBlur ? 'blur(8px)' : 'none',
                    borderRadius: '0px',
                    padding: '0.4rem 0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {SAMPLE_TRANSCRIPT.find(t => currentTime >= t.start && currentTime <= t.end)?.text}
                </span>
              )}
            </div>
          )}

          {/* Hold-to-Boost Indicator (Square) */}
          {isBoosted && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 px-3 py-1.5 rounded-none bg-white text-black font-mono font-bold text-xs uppercase tracking-wider shadow-2xl animate-pulse">
              <FastForward className="w-3.5 h-3.5 fill-current" />
              <span>2X SPEED BOOST</span>
            </div>
          )}

          {/* Skip Intro Button (Square & Sharp) */}
          {isInsideIntro && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  videoRef.current.currentTime = introEnd + 1;
                }
              }}
              className="absolute bottom-24 right-8 z-40 flex items-center space-x-2 px-4 py-2 rounded-none bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-neutral-200 cursor-pointer shadow-2xl"
            >
              <span>Skip Intro</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Center Play Button on Pause */}
          {!isPlaying && showControls && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="pointer-events-auto w-16 h-16 rounded-none bg-white text-black flex items-center justify-center shadow-2xl border border-white hover:bg-neutral-200 transition-all cursor-pointer"
              >
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Header Overlay (Square & Clean Fade) */}
      <div
        className={`absolute top-0 inset-x-0 z-40 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black via-black/50 to-transparent transition-opacity duration-300 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={closePlayer}
            className="p-2 rounded-none bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider leading-tight">
              {media.title}
            </h2>
            {media.type === 'show' && (
              <p className="text-xs font-mono text-neutral-400">
                S{season} · E{episode}
              </p>
            )}
          </div>
        </div>

        {/* Top Right: Engine Toggle (Square) & Source Selector */}
        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black border border-white/20 p-0.5 text-xs font-mono">
            <button
              onClick={() => setPlayerMode('embed')}
              className={`px-3 py-1 rounded-none font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                playerMode === 'embed'
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Embed
            </button>
            <button
              onClick={() => setPlayerMode('native')}
              className={`px-3 py-1 rounded-none font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                playerMode === 'native'
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Native
            </button>
          </div>

          {/* Source Picker Trigger (Square) */}
          <button
            onClick={() => setActiveMenu(activeMenu === 'source' ? null : 'source')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-black text-white text-xs font-mono font-bold uppercase tracking-wider border border-white/30 hover:border-white transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{selectedSource.codename} ({selectedSource.name})</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-none bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Bottom Timeline & Controls Bar for Native Mode */}
      {playerMode === 'native' && (
        <div
          className={`absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 pt-10 flex flex-col space-y-3 transition-opacity duration-300 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Timeline Scrubber (Square) */}
          <div className="relative group/timeline flex items-center cursor-pointer h-3">
            <div className="relative w-full h-1 group-hover/timeline:h-2 rounded-none bg-neutral-800 transition-all overflow-hidden border-t border-b border-white/10">
              <div
                className="absolute top-0 bottom-0 left-0 bg-neutral-600 transition-all"
                style={{ width: `${(bufferedTime / (duration || 1)) * 100}%` }}
              />
              <div
                className="absolute top-0 bottom-0 left-0 bg-white transition-all"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              {duration > 0 && (
                <div
                  className="absolute top-0 bottom-0 bg-neutral-400 pointer-events-none"
                  style={{
                    left: `${(introStart / duration) * 100}%`,
                    width: `${((introEnd - introStart) / duration) * 100}%`,
                  }}
                  title="Intro"
                />
              )}
            </div>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const target = parseFloat(e.target.value);
                setCurrentTime(target);
                if (videoRef.current) videoRef.current.currentTime = target;
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>

          {/* Lower Control Bar */}
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center space-x-3">
              <button onClick={togglePlay} className="p-1.5 text-white hover:text-neutral-300 transition-colors cursor-pointer">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button onClick={() => seekBy(-10)} className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer" title="Rewind 10s">
                <RotateCcw className="w-4 h-4" />
              </button>

              <button onClick={() => seekBy(10)} className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer" title="Forward 10s">
                <RotateCw className="w-4 h-4" />
              </button>

              {media.type === 'show' && (
                <>
                  <button onClick={goToPrevEpisode} disabled={!hasPrevEpisode} className={`p-1.5 ${hasPrevEpisode ? 'text-neutral-400 hover:text-white cursor-pointer' : 'text-neutral-700'}`}>
                    <SkipForward className="w-4 h-4 transform rotate-180" />
                  </button>
                  <button onClick={goToNextEpisode} disabled={!hasNextEpisode} className={`p-1.5 ${hasNextEpisode ? 'text-neutral-400 hover:text-white cursor-pointer' : 'text-neutral-700'}`}>
                    <SkipForward className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="text-[11px] text-neutral-400 space-x-1 hidden sm:block">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-600">/</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : volume < 0.5 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      videoRef.current.muted = val === 0;
                    }
                    setIsMuted(val === 0);
                  }}
                  className="w-16 accent-white h-1 bg-neutral-800 rounded-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setShowTranscript(!showTranscript)} className={`p-1.5 rounded-none border border-white/10 ${showTranscript ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}>
                <FileText className="w-4 h-4" />
              </button>

              <button onClick={() => setActiveMenu(activeMenu === 'subtitles' ? null : 'subtitles')} className={`p-1.5 rounded-none border border-white/10 ${selectedSubLanguage !== 'Off' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}>
                <Subtitles className="w-4 h-4" />
              </button>

              <button onClick={() => setActiveMenu(activeMenu === 'main' ? null : 'main')} className="p-1.5 rounded-none border border-white/10 text-neutral-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </button>

              <button onClick={togglePiP} className="p-1.5 rounded-none border border-white/10 text-neutral-400 hover:text-white hidden sm:block">
                <PictureInPicture2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Source Picker Menu (Square & Clean Monochrome) */}
      {activeMenu === 'source' && (
        <div 
          className="absolute top-16 right-6 w-80 max-h-[75vh] rounded-none bg-black border border-white/20 p-4 shadow-2xl z-50 overflow-y-auto backdrop-blur-xl animate-fade-in text-xs text-white font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-white" />
              <span>Sources ({STREAM_SOURCES.length})</span>
            </span>
            <button onClick={() => setActiveMenu(null)} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {STREAM_SOURCES.map(src => {
              const isSelected = selectedSource.id === src.id;
              return (
                <button
                  key={src.id}
                  onClick={() => {
                    setSelectedSource(src);
                    if (src.id === 'native') {
                      setPlayerMode('native');
                    } else {
                      setPlayerMode('embed');
                    }
                    setActiveMenu(null);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black border-white/10 text-neutral-300 hover:border-white/50 hover:bg-neutral-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span>{src.codename}</span>
                      <span className={isSelected ? 'text-black/70' : 'text-neutral-500'}>({src.name})</span>
                    </div>
                    <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-black/80' : 'text-neutral-500'}`}>
                      {src.type} · {src.quality}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] ${isSelected ? 'text-black' : 'text-neutral-400'}`}>{src.ping}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Flyout */}
      {activeMenu === 'main' && (
        <div 
          className="absolute bottom-20 right-6 w-60 rounded-none bg-black border border-white/20 shadow-2xl p-2 z-50 text-xs backdrop-blur-xl animate-fade-in text-neutral-300 font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <button
              onClick={() => setActiveMenu('source')}
              className="w-full flex items-center justify-between p-2 hover:bg-neutral-900 hover:text-white text-left transition-colors cursor-pointer"
            >
              <span>Source</span>
              <span className="text-neutral-500 flex items-center">
                {selectedSource.codename}
                <ChevronRight className="w-3 h-3 ml-1" />
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('quality')}
              className="w-full flex items-center justify-between p-2 hover:bg-neutral-900 hover:text-white text-left transition-colors cursor-pointer"
            >
              <span>Quality</span>
              <span className="text-neutral-500 flex items-center">
                {selectedQuality}
                <ChevronRight className="w-3 h-3 ml-1" />
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('speed')}
              className="w-full flex items-center justify-between p-2 hover:bg-neutral-900 hover:text-white text-left transition-colors cursor-pointer"
            >
              <span>Speed</span>
              <span className="text-neutral-500 flex items-center">
                {playbackSpeed}x
                <ChevronRight className="w-3 h-3 ml-1" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Subtitles Menu */}
      {activeMenu === 'subtitles' && (
        <div 
          className="absolute bottom-20 right-6 w-72 rounded-none bg-black border border-white/20 shadow-2xl p-4 z-50 text-xs backdrop-blur-xl animate-fade-in text-neutral-300 font-mono space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-1 border-b border-white/10 font-bold uppercase tracking-wider text-white">
            <span>Subtitles</span>
            <button onClick={() => setActiveMenu(null)} className="text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-1">
            {['English', 'Spanish', 'French', 'Japanese', 'Off'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedSubLanguage(lang)}
                className={`w-full flex items-center justify-between p-2 rounded-none text-left transition-colors cursor-pointer ${
                  selectedSubLanguage === lang ? 'bg-white text-black font-bold' : 'hover:bg-neutral-900 text-neutral-300'
                }`}
              >
                <span>{lang}</span>
                {selectedSubLanguage === lang && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span>Font Size</span>
              <span>{Math.round(subtitleConfig.size * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.6}
              step={0.1}
              value={subtitleConfig.size}
              onChange={(e) => updateSubtitleConfig({ size: parseFloat(e.target.value) })}
              className="w-full accent-white"
            />
          </div>
        </div>
      )}

      {/* Transcript Drawer */}
      {showTranscript && (
        <div 
          className="absolute top-0 right-0 bottom-0 w-80 max-w-full bg-black/95 border-l border-white/20 backdrop-blur-xl z-50 p-5 flex flex-col text-white animate-fade-in shadow-2xl font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-white" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Transcript</h3>
            </div>
            <button onClick={() => setShowTranscript(false)} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={transcriptSearch}
            onChange={(e) => setTranscriptSearch(e.target.value)}
            placeholder="Search dialogue..."
            className="w-full bg-neutral-950 border border-white/20 px-3 py-1.5 rounded-none text-xs outline-none text-white placeholder-neutral-600 mb-3"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredTranscript.map((line, idx) => {
              const isCurrent = currentTime >= line.start && currentTime <= line.end;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = line.start;
                  }}
                  className={`p-2 rounded-none border text-xs cursor-pointer transition-all ${
                    isCurrent 
                      ? 'bg-white text-black border-white font-bold' 
                      : 'bg-neutral-950 border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className={`text-[10px] block mb-0.5 ${isCurrent ? 'text-black' : 'text-neutral-500'}`}>
                    {formatTime(line.start)}
                  </span>
                  <p className="leading-relaxed font-sans">{line.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
