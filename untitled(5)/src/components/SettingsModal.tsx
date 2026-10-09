import React from 'react';
import { useApp } from '../context/AppContext';
import { AnimalIcon, GoogleLogo } from './Icons';
import { 
  X, 
  Palette, 
  Sliders, 
  User, 
  Subtitles, 
  Users, 
  Download, 
  Trash2,
  RefreshCw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const PRESET_THEMES = [
  { id: 'default', name: 'Cinema Dark', primary: '#ffffff', secondary: '#171717', bg: '#000000' },
  { id: 'noir', name: 'Obsidian Minimal', primary: '#d4d4d4', secondary: '#141414', bg: '#000000' },
  { id: 'slate', name: 'Midnight Slate', primary: '#f5f5f5', secondary: '#262626', bg: '#0a0a0a' },
  { id: 'ash', name: 'Deep Titanium', primary: '#e5e5e5', secondary: '#1f1f1f', bg: '#080808' },
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
    clearHistory,
    googleUser,
    openGoogleAuth,
    openCustomizer,
    syncGoogleCloudData,
    isCloudSyncing,
    lastSyncedText,
  } = useApp();

  if (!isSettingsOpen) return null;

  const handleExportData = () => {
    const data = {
      kerasoniVersion: '5.5.0',
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
    a.download = `kerasoni-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeSettings}
    >
      <div 
        className="relative w-full max-w-4xl rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col md:flex-row text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-56 bg-neutral-900/60 border-b md:border-b-0 md:border-r border-neutral-800 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0 scrollbar-none text-xs">
          <div className="hidden md:flex items-center px-3 py-3 mb-2 border-b border-neutral-800">
            <span className="font-semibold text-white text-sm">Settings</span>
          </div>

          <button
            onClick={() => setSettingsTab('appearance')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'appearance' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setSettingsTab('playback')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'playback' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Playback</span>
          </button>

          <button
            onClick={() => setSettingsTab('account')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'account' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account &amp; Sync</span>
          </button>

          <button
            onClick={() => setSettingsTab('subtitles')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'subtitles' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Subtitles className="w-4 h-4" />
            <span>Subtitles</span>
          </button>

          <button
            onClick={() => setSettingsTab('watchparty')}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left shrink-0 cursor-pointer ${
              settingsTab === 'watchparty' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Watch Party</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[75vh] md:max-h-[85vh] text-xs">
          <div className="flex justify-between items-center pb-3 mb-6 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-white">
              {settingsTab === 'appearance' && 'Appearance & Customization'}
              {settingsTab === 'playback' && 'Playback & Catalog Preferences'}
              {settingsTab === 'account' && 'Account & Cloud Synchronization'}
              {settingsTab === 'subtitles' && 'Subtitle Styling'}
              {settingsTab === 'watchparty' && 'Watch Party Configuration'}
            </h2>
            <button 
              onClick={closeSettings} 
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: APPEARANCE */}
          {settingsTab === 'appearance' && (
            <div className="space-y-6">
              {/* Quick Link to Deep Customizer */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Interactive Visual Customizer
                    </p>
                    <p className="text-neutral-400 text-xs">
                      Configure fadey logo variants, accent colors, card aspect ratio, and atmospheric fades
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    closeSettings();
                    openCustomizer();
                  }}
                  className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  Open Customizer
                </button>
              </div>

              <div>
                <h3 className="font-semibold text-white text-xs mb-2.5">Color Themes &amp; Ambient Styles</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_THEMES.map(theme => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-white bg-neutral-900 text-white font-semibold' 
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-white" />
                          <span className="w-3.5 h-3.5 rounded-full bg-neutral-800" />
                        </div>
                        <span className="text-xs block truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <h3 className="font-semibold text-white text-xs">Interface Layout</h3>

                <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                  <div>
                    <p className="font-medium text-white">Featured Hero Carousel</p>
                    <p className="text-neutral-400 text-[11px]">Display trending hero banner at top of home screen</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.showFeatured}
                    onChange={(e) => updatePreferences('showFeatured', e.target.checked)}
                    className="accent-white w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                  <div>
                    <p className="font-medium text-white">Discover &amp; Catalog Sections</p>
                    <p className="text-neutral-400 text-[11px]">Show carousels for Trending, Top Rated, and Providers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.showDiscover}
                    onChange={(e) => updatePreferences('showDiscover', e.target.checked)}
                    className="accent-white w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PLAYBACK */}
          {settingsTab === 'playback' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="font-medium text-white">Autoplay Next Episode</p>
                  <p className="text-neutral-400 text-[11px]">Automatically begin subsequent episode when current finishes</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoplay}
                  onChange={(e) => updatePreferences('autoplay', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="font-medium text-white">Auto Skip Outro Credits</p>
                  <p className="text-neutral-400 text-[11px]">Skip final 90 seconds of TV show episodes</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.skipCredits}
                  onChange={(e) => updatePreferences('skipCredits', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* TAB 3: ACCOUNT & DATA */}
          {settingsTab === 'account' && (
            <div className="space-y-5">
              {/* Google Account Card */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <GoogleLogo className="w-4 h-4" />
                    <h3 className="font-semibold text-white text-xs">
                      Google Account &amp; Cloud Sync
                    </h3>
                  </div>
                  {googleUser ? (
                    <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      Guest Mode
                    </span>
                  )}
                </div>

                {googleUser ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                      <div>
                        <p className="font-semibold text-white">{googleUser.name}</p>
                        <p className="text-[11px] text-neutral-400">{googleUser.email}</p>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {lastSyncedText}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={syncGoogleCloudData}
                        disabled={isCloudSyncing}
                        className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                        <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
                      </button>

                      <button
                        onClick={() => {
                          closeSettings();
                          openGoogleAuth();
                        }}
                        className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white text-xs transition-colors cursor-pointer"
                      >
                        Manage Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs text-neutral-400">
                      Sign in with Google to enable automatic cloud backup for your watchlist, history, and custom presets.
                    </p>
                    <button
                      onClick={() => {
                        closeSettings();
                        openGoogleAuth();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <GoogleLogo className="w-3.5 h-3.5" />
                      <span>Sign In with Google</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
                <h3 className="font-semibold text-white text-xs">Profile</h3>

                <div>
                  <label className="text-neutral-400 block mb-1">Nickname</label>
                  <input
                    type="text"
                    value={userProfile.nickname}
                    onChange={(e) => updateUserProfile({ nickname: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-lg text-xs text-white outline-none focus:border-neutral-600"
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
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          userProfile.icon === icon
                            ? 'border-white bg-white text-black'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        <AnimalIcon icon={icon} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Backup */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <h3 className="font-semibold text-white text-xs">Local Data</h3>
                <p className="text-neutral-400 text-xs">
                  Watch progress ({watchHistory.length} items) and watchlist ({bookmarks.length} items) are stored locally.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleExportData}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-neutral-900 text-red-400 border border-red-500/30 hover:border-red-500 text-xs font-medium transition-colors cursor-pointer"
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
              <div className="p-6 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-center min-h-[110px]">
                <span
                  style={{
                    color: subtitleConfig.color,
                    fontSize: `${subtitleConfig.size * 1.15}rem`,
                    fontWeight: subtitleConfig.bold ? 'bold' : 'normal',
                    backgroundColor: `rgba(0, 0, 0, ${subtitleConfig.backgroundOpacity})`,
                    backdropFilter: subtitleConfig.backgroundBlur ? 'blur(6px)' : 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Subtitle preview looks like this.
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Font Size</span>
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
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Background Opacity</span>
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
                  <span className="text-neutral-400">Bold Weight</span>
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
                <label className="text-neutral-400 block mb-2 font-medium">Overlay Corner</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => updateWatchParty({ overlayPosition: pos })}
                      className={`p-2.5 rounded-lg border text-center capitalize transition-colors cursor-pointer text-xs font-medium ${
                        watchParty.overlayPosition === pos
                          ? 'bg-white text-black border-white font-semibold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
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
