import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PStreamLogo, AnimalIcon } from './Icons';
import { 
  Sparkles, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Users, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userProfile, 
    openSettings, 
    openAbout, 
    openWatchParty, 
    openAICurator,
    activeCategory, 
    setActiveCategory,
    setSearchQuery,
    watchParty
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/85 backdrop-blur-md border-b border-white/15 transition-all duration-300">
      {/* Left: Brand Wordmark & Quick Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Brand Square Box */}
        <button
          onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-none bg-black hover:bg-neutral-900 text-white transition-all duration-300 border border-white/20 hover:border-white cursor-pointer"
        >
          <PStreamLogo className="w-5 h-5 text-white" />
          <span className="font-bold text-white tracking-wider text-sm uppercase">
            P-Stream
          </span>
        </button>

        {/* Discord community link (Square) */}
        <a
          href="https://discord.gg/pstream"
          target="_blank"
          rel="noreferrer"
          title="Discord Community"
          className="hidden ssm:flex items-center justify-center w-8 h-8 rounded-none bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all duration-300 border border-white/20 hover:border-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>

        {/* Discover shortcut (Square) */}
        <button
          onClick={() => {
            setActiveCategory(activeCategory === 'all' ? 'movies' : 'all');
          }}
          title="Discover Trending"
          className="flex items-center justify-center w-8 h-8 rounded-none bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all duration-300 border border-white/20 hover:border-white cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </button>

        {/* AI Cinema Curator (Square, Clean, Fade) */}
        <button
          onClick={() => openAICurator()}
          title="AI Curator — Suggest movies & shows"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-none bg-black hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-wider transition-all duration-300 border border-white/20 hover:border-white cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline font-bold">Ask AI</span>
        </button>

        {/* Watch Party Indicator if Active (Square) */}
        {watchParty.enabled && (
          <button
            onClick={openWatchParty}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-none bg-neutral-900 text-white border border-white/30 text-xs font-mono tracking-wider animate-pulse cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-white"></span>
            <span>ROOM: {watchParty.roomCode}</span>
          </button>
        )}
      </div>

      {/* Right: User Profile & Menu (Square & Clean) */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-none bg-black hover:bg-neutral-900 border border-white/20 hover:border-white transition-all duration-300 text-white cursor-pointer"
        >
          {/* Avatar Square */}
          <div className="w-5 h-5 rounded-none bg-neutral-800 border border-white/30 flex items-center justify-center text-white">
            <AnimalIcon icon={userProfile.icon} className="w-3.5 h-3.5" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
            {userProfile.nickname}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu - Square & Clean Fade */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-none bg-black border border-white/20 shadow-2xl py-2 z-50 backdrop-blur-xl animate-fade-in text-xs text-neutral-300">
            <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-none bg-neutral-800 border border-white/20 flex items-center justify-center text-white shrink-0">
                <AnimalIcon icon={userProfile.icon} className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white uppercase tracking-wider truncate">{userProfile.nickname}</span>
                <span className="text-[10px] text-neutral-500 truncate">{userProfile.deviceName}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setDropdownOpen(false);
                openAICurator();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>AI Cinema Curator</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                openWatchParty();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>Watch Party</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                openSettings('appearance');
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                openAbout();
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>About &amp; FAQ</span>
            </button>

            <div className="border-t border-white/10 my-1 pt-1">
              <a
                href="https://codeberg.org/pee"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center space-x-2.5 px-3 py-2 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-left text-neutral-400"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Codeberg</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
