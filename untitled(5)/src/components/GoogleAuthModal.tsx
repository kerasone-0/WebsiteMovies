import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogo, KerasoniLogo } from './Icons';
import { 
  X, 
  CheckCircle2, 
  Check,
  Cloud, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Bookmark, 
  History, 
  Palette,
  ArrowRight
} from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { 
    isGoogleAuthOpen, 
    closeGoogleAuth, 
    googleUser, 
    signInWithGoogle, 
    signOutGoogle,
    syncGoogleCloudData,
    isCloudSyncing,
    lastSyncedText,
    bookmarks,
    watchHistory,
    customization
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  if (!isGoogleAuthOpen) return null;

  const handleInstantSignIn = async (email = 'guest@kerasoni.stream', name = 'Guest') => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle({
        name,
        email,
        givenName: name.split(' ')[0],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSubmitting(true);
    try {
      const name = customName.trim() || customEmail.split('@')[0];
      await signInWithGoogle({
        name,
        email: customEmail.trim(),
        givenName: name.split(' ')[0],
      });
      setShowCustomForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSync = async () => {
    await syncGoogleCloudData();
    setSyncSuccessMsg('Cloud synced successfully');
    setTimeout(() => setSyncSuccessMsg(''), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeGoogleAuth}
    >
      <div 
        className="relative w-full max-w-md rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center space-x-2.5">
            <GoogleLogo className="w-4 h-4" />
            <span className="font-semibold text-sm text-white">
              Google Account Sign-In
            </span>
          </div>
          <button 
            onClick={closeGoogleAuth}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {googleUser ? (
            /* Signed In View */
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg font-bold text-white shrink-0 relative">
                    {googleUser.name ? googleUser.name.charAt(0).toUpperCase() : 'G'}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white text-black rounded-full flex items-center justify-center text-[9px] font-bold">
                      G
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <p className="font-semibold text-sm text-white truncate">{googleUser.name}</p>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-neutral-400 truncate">{googleUser.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] text-neutral-400">Synced &amp; Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sync Status Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Cloud className="w-4 h-4 text-white" />
                    <span className="font-medium">Cloud Data Sync</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {lastSyncedText}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-xs text-neutral-400">
                  <div className="flex items-center space-x-1">
                    <Bookmark className="w-3 h-3 text-neutral-300" />
                    <span>{bookmarks.length} saved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <History className="w-3 h-3 text-neutral-300" />
                    <span>{watchHistory.length} history</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Palette className="w-3 h-3 text-neutral-300" />
                    <span className="capitalize">{customization.accentTheme}</span>
                  </div>
                </div>

                {syncSuccessMsg && (
                  <p className="text-xs text-emerald-400 animate-fade-in pt-1 flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-emerald-400" />
                    <span>{syncSuccessMsg}</span>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleManualSync}
                  disabled={isCloudSyncing}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{isCloudSyncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      signOutGoogle();
                      setShowCustomForm(false);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>

                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Switch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Not Signed In View */
            <div className="space-y-5">
              <div className="text-center space-y-1.5 pb-2">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                    <KerasoniLogo className="w-10 h-10 text-white" variant={customization.logoStyle} fadeEffect={customization.logoFadeEffect} />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-white">
                  Connect Google Account
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Sync your bookmarks, playback history, and customizable settings seamlessly across devices.
                </p>
              </div>

              {/* One-Click Quick Google Sign In */}
              <div className="space-y-2.5">
                <button
                  onClick={() => handleInstantSignIn('guest@kerasoni.stream', 'Guest')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </button>

                {/* Quick Account Pill */}
                <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      G
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">Guest</p>
                      <p className="text-[11px] text-neutral-400 truncate">guest@kerasoni.stream</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInstantSignIn('guest@kerasoni.stream', 'Guest')}
                    disabled={isSubmitting}
                    className="px-3 py-1 text-xs font-medium bg-neutral-800 hover:bg-white text-white hover:text-black rounded-md border border-neutral-700 hover:border-white transition-all cursor-pointer"
                  >
                    Quick Sign-In
                  </button>
                </div>
              </div>

              {/* Or switch to custom input */}
              {!showCustomForm ? (
                <div className="text-center pt-1">
                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    Use another Google email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSignIn} className="space-y-3 pt-2 border-t border-neutral-800 animate-fade-in">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CinemaLover"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg text-xs text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">
                      Google Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="user@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-lg text-xs text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomForm(false)}
                      className="flex-1 py-2 bg-neutral-900 text-neutral-400 hover:text-white text-xs rounded-lg border border-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <span>Authorize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* Privacy badge */}
              <div className="flex items-center space-x-2 pt-2 text-[11px] text-neutral-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Client-side Google Auth · No credentials shared</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
