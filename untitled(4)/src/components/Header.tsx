import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { KerasoniLogo, AnimalIcon, GoogleLogo } from './Icons';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Users, 
  ChevronDown,
  Palette
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userProfile, 
    openSettings, 
    openAbout, 
    openWatchParty, 
    watchParty,
    openAICurator,
    openGoogleAuth,
    googleUser,
    customization,
    openCustomizer
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Dynamic Fadey Brand Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-neutral-900 transition-all duration-300 group cursor-pointer"
            title="Kerasoni Home"
          >
            <KerasoniLogo 
              className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-105" 
              variant={customization.logoStyle}
              fadeEffect={customization.logoFadeEffect}
              fadeIntensity={customization.logoFadeIntensity}
            />
            <div className="flex flex-col text-left">
              <span className="font-bold text-white tracking-wide text-sm sm:text-base leading-none">
                Kerasoni
              </span>
              <span className="text-[10px] text-neutral-400 hidden sm:inline leading-tight mt-0.5">
                Cinema
              </span>
            </div>
          </button>

          {/* AI Cinema Curator Button */}
          <button
            onClick={() => openAICurator()}
            title="AI Curator — Discover movies & shows"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-medium transition-all border border-neutral-800 hover:border-neutral-700 cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-medium">Ask AI</span>
          </button>

          {/* UI Customizer & Themes Button */}
          <button
            onClick={openCustomizer}
            title="Themes & Customization"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-all border border-neutral-800 hover:border-neutral-700 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">Customize</span>
          </button>

          {/* Watch Party Indicator if Active */}
          {watchParty.enabled && (
            <button
              onClick={openWatchParty}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white border border-white/30 text-xs font-mono animate-pulse cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline">Room:</span>
              <span>{watchParty.roomCode}</span>
            </button>
          )}
        </div>

        {/* Right: Google Auth Button & Profile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3" ref={dropdownRef}>
          {/* Google Auth Sign-in Pill */}
          {googleUser ? (
            <button
              onClick={openGoogleAuth}
              title={`Signed in as ${googleUser.email} (Click for Cloud Sync)`}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all text-white cursor-pointer shadow-sm"
            >
              <div className="w-4 h-4 bg-white text-black rounded-full flex items-center justify-center font-bold text-[9px] shrink-0">
                G
              </div>
              <span className="text-xs font-medium text-white max-w-[90px] sm:max-w-[120px] truncate">
                {googleUser.givenName || googleUser.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            </button>
          ) : (
            <button
              onClick={openGoogleAuth}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-medium transition-all shadow-md cursor-pointer"
            >
              <GoogleLogo className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In with Google</span>
            </button>
          )}

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 text-white cursor-pointer"
            >
              <div className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
                <AnimalIcon icon={userProfile.icon} className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-neutral-200 hidden sm:inline">
                {userProfile.nickname}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl py-2 z-50 backdrop-blur-xl animate-fade-in text-xs text-neutral-300">
                <div className="px-3.5 py-2.5 border-b border-neutral-800 mb-1 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0">
                    <AnimalIcon icon={userProfile.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-white truncate">
                      {userProfile.nickname}
                    </span>
                    <span className="text-[11px] text-neutral-400 truncate">
                      {googleUser ? googleUser.email : userProfile.deviceName}
                    </span>
                  </div>
                </div>

                {/* Google Sync Status / Entry */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openGoogleAuth();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <GoogleLogo className="w-3.5 h-3.5" />
                    <span>Google Account</span>
                  </div>
                  {googleUser ? (
                    <span className="text-[11px] text-emerald-400 font-medium">Synced</span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">Connect</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openCustomizer();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Customizer &amp; UI Lab</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openAICurator();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Cinema Curator</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openWatchParty();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Watch Party</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openSettings('appearance');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    openAbout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                  <span>About &amp; FAQ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
