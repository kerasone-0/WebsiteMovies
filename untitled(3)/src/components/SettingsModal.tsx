import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalIcon } from './Icons';
import { 
  X, 
  Palette, 
  Sliders, 
  User, 
  Subtitles, 
  Users, 
  Download, 
  Trash2, 
} from 'lucide-react';

const PRESET_THEMES = [
  { id: 'default', name: 'Monochrome Noir', primary: '#ffffff', secondary: '#171717', bg: '#000000' },
  { id: 'noir', name: 'Obsidian Minimal', primary: '#d4d4d4', secondary: '#141414', bg: '#000000' },
  { id: 'slate', name: 'Silver Slate', primary: '#f5f5f5', secondary: '#262626', bg: '#0a0a0a' },
  { id: 'ash', name: 'Ash Contrast', primary: '#e5e5e5', secondary: '#1f1f1f', bg: '#080808' },
];

const ANIMAL_ICONS = ['cat', 'dog', 'frog', 'dragon'];

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    closeSettings, 
    settingsTab, 
    setSettingsTab, 
    currentTheme, 
    setTheme, 
    userProfile, 
    updateUserProfile, 
    subtitleConfig, 
    updateSubtitleConfig,
    watchParty,
    updateWatchParty,
    preferences,
    updatePreferences,
    bookmarks,
    watchHistory,
    clearHistory
  } = useApp();

  if (!isSettingsOpen) return null;

  const handleExportData = () => {
    const data = {
      pstreamVersion: '5.5.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      bookmarks,
      watchHistory,
      preferences,
      subtitleConfig,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pstream-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono"
      onClick={closeSettings}
    >
      <div 
        className="relative w-full max-w-4xl rounded-none bg-black border border-white/20 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col md:flex-row text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar (Square) */}
        <div className="w-full md:w-56 bg-neutral-950 border-b md:border-b-0 md:border-r border-white/10 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0 scrollbar-none text-xs">
          <div className="hidden md:flex items-center px-3 py-3 mb-2 border-b border-white/10">
            <span className="font-bold tracking-widest uppercase text-white">Settings</span>
          </div>

          <button
            onClick={() => setSettingsTab('appearance')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'appearance' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setSettingsTab('preferences')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'preferences' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setSettingsTab('account')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'account' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setSettingsTab('subtitles')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'subtitles' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Subtitles className="w-4 h-4" />
            <span>Subtitles</span>
          </button>

          <button
            onClick={() => setSettingsTab('watchparty')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'watchparty' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Watch Party</span>
          </button>
        </div>

        {/* Right Content Pane (Clean & Square) */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[88vh] scrollbar-thin text-xs">
          <div className="flex justify-between items-center pb-3 mb-6 border-b border-white/10 uppercase tracking-wider">
            <h2 className="text-sm font-bold text-white">{settingsTab}</h2>
            <button onClick={closeSettings} className="p-1 rounded-none text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: APPEARANCE */}
          {settingsTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider mb-2">Monochrome Themes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_THEMES.map(theme => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`p-3 rounded-none border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-white bg-neutral-900 text-white font-bold' 
                            : 'border-white/15 bg-black text-neutral-400 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className="w-3.5 h-3.5 rounded-none bg-white border border-white" />
                          <span className="w-3.5 h-3.5 rounded-none bg-black border border-white/40" />
                        </div>
                        <span className="text-[11px] block truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider">Interface Layout</h3>

                <label className="flex items-center justify-between p-3 rounded-none bg-neutral-950 border border-white/10 cursor-pointer">
                  <div>
                    <p className="font-bold text-white">Featured Hero Carousel</p>
                    <p className="text-[10px] text-neutral-500">Display trending hero banner at top of home screen</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.showFeatured}
                    onChange={(e) => updatePreferences('showFeatured', e.target.checked)}
                    className="accent-white w-4 h-4 rounded-none cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-none bg-neutral-950 border border-white/10 cursor-pointer">
                  <div>
                    <p className="font-bold text-white">Minimal Poster Cards</p>
                    <p className="text-[10px] text-neutral-500">Hide text metadata under cards for clean image-only layout</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.minimalCards}
                    onChange={(e) => updatePreferences('minimalCards', e.target.checked)}
                    className="accent-white w-4 h-4 rounded-none cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {settingsTab === 'preferences' && (
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-none bg-neutral-950 border border-white/10 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Autoplay Next Episode</p>
                  <p className="text-[10px] text-neutral-500">Continue automatically into next episode</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoplay}
                  onChange={(e) => updatePreferences('autoplay', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-none bg-neutral-950 border border-white/10 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Auto Skip Segments</p>
                  <p className="text-[10px] text-neutral-500">Skip intros and credits automatically</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoSkipSegments}
                  onChange={(e) => updatePreferences('autoSkipSegments', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-none bg-neutral-950 border border-white/10 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Hold Space to Boost 2x</p>
                  <p className="text-[10px] text-neutral-500">Temporarily double playback speed while holding space</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.holdToBoost}
                  onChange={(e) => updatePreferences('holdToBoost', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>

              <div className="p-3 rounded-none bg-neutral-950 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Catalog Region</p>
                  <p className="text-[10px] text-neutral-500">Adjust content catalogs according to selected country</p>
                </div>
                <select
                  value={preferences.contentRegion}
                  onChange={(e) => updatePreferences('contentRegion', e.target.value)}
                  className="bg-black border border-white/20 rounded-none px-2.5 py-1 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="US">United States (US)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="AU">Australia (AU)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="FR">France (FR)</option>
                  <option value="JP">Japan (JP)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & DATA */}
          {settingsTab === 'account' && (
            <div className="space-y-5">
              <div className="p-4 rounded-none bg-neutral-950 border border-white/10 space-y-3.5">
                <h3 className="font-bold text-white uppercase tracking-wider">Profile</h3>

                <div>
                  <label className="text-neutral-400 block mb-1">Nickname</label>
                  <input
                    type="text"
                    value={userProfile.nickname}
                    onChange={(e) => updateUserProfile({ nickname: e.target.value })}
                    className="w-full bg-black border border-white/20 px-3 py-2 rounded-none text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-2">Avatar Icon</label>
                  <div className="flex items-center gap-2.5">
                    {ANIMAL_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => updateUserProfile({ icon })}
                        className={`w-9 h-9 rounded-none border flex items-center justify-center transition-all cursor-pointer ${
                          userProfile.icon === icon
                            ? 'border-white bg-white text-black'
                            : 'border-white/20 bg-black text-neutral-400 hover:border-white'
                        }`}
                      >
                        <AnimalIcon icon={icon} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Backup */}
              <div className="p-4 rounded-none bg-neutral-950 border border-white/10 space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider">Local Data</h3>
                <p className="text-neutral-400 text-[11px]">
                  Watch progress ({watchHistory.length} items) and watchlist ({bookmarks.length} items) are stored locally.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleExportData}
                    className="flex items-center space-x-2 px-4 py-2 rounded-none bg-white text-black font-bold uppercase tracking-wider text-[11px] hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Clear local watch history?')) {
                        clearHistory();
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-none bg-black text-red-400 border border-red-500/30 hover:border-red-500 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUBTITLES */}
          {settingsTab === 'subtitles' && (
            <div className="space-y-5">
              <div className="p-6 rounded-none bg-black border border-white/20 flex items-center justify-center text-center min-h-[110px]">
                <span
                  style={{
                    color: subtitleConfig.color,
                    fontSize: `${subtitleConfig.size * 1.15}rem`,
                    fontWeight: subtitleConfig.bold ? 'bold' : 'normal',
                    backgroundColor: `rgba(0, 0, 0, ${subtitleConfig.backgroundOpacity})`,
                    backdropFilter: subtitleConfig.backgroundBlur ? 'blur(6px)' : 'none',
                    borderRadius: '0px',
                    padding: '0.35rem 0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Subtitle preview looks like this.
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Font Size</span>
                    <span>{Math.round(subtitleConfig.size * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.7}
                    max={1.6}
                    step={0.05}
                    value={subtitleConfig.size}
                    onChange={(e) => updateSubtitleConfig({ size: parseFloat(e.target.value) })}
                    className="w-full accent-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Background Opacity</span>
                    <span>{Math.round(subtitleConfig.backgroundOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={subtitleConfig.backgroundOpacity}
                    onChange={(e) => updateSubtitleConfig({ backgroundOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span>Bold Weight</span>
                  <input
                    type="checkbox"
                    checked={subtitleConfig.bold}
                    onChange={(e) => updateSubtitleConfig({ bold: e.target.checked })}
                    className="accent-white w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WATCH PARTY */}
          {settingsTab === 'watchparty' && (
            <div className="space-y-4">
              <div>
                <label className="text-neutral-400 block mb-2 uppercase tracking-wider">Overlay Corner</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => updateWatchParty({ overlayPosition: pos })}
                      className={`p-2 rounded-none border text-center uppercase tracking-wider transition-colors cursor-pointer ${
                        watchParty.overlayPosition === pos
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-black border-white/15 text-neutral-400 hover:border-white'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
