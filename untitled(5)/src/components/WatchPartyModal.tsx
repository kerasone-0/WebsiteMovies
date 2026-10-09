import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, Copy, Check, Sliders } from 'lucide-react';

export const WatchPartyModal: React.FC = () => {
  const { 
    isWatchPartyOpen, 
    closeWatchParty, 
    watchParty, 
    updateWatchParty, 
    startHostingWatchParty, 
    joinWatchParty, 
    leaveWatchParty 
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [customHostCode, setCustomHostCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isWatchPartyOpen) return null;

  const handleCopyCode = () => {
    if (watchParty.roomCode && navigator.clipboard) {
      navigator.clipboard.writeText(watchParty.roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = joinWatchParty(inputCode);
    if (!ok) {
      setErrorMsg('Invalid party code. Must be at least 3 characters.');
    } else {
      setErrorMsg('');
      closeWatchParty();
    }
  };

  const handleHost = () => {
    startHostingWatchParty(customHostCode);
    closeWatchParty();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={closeWatchParty}
    >
      <div 
        className="relative w-full max-w-md rounded-none bg-black border border-white/20 shadow-2xl p-6 text-white my-auto animate-fade-in font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10 font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-white" />
            <h2 className="text-sm">Watch Party</h2>
          </div>
          <button onClick={closeWatchParty} className="p-1 rounded-none text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {watchParty.enabled ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-none bg-neutral-950 border border-white/15 space-y-3">
              <div className="flex justify-between items-center text-neutral-400 uppercase tracking-wider">
                <span>Room Code</span>
                <span className="flex items-center text-white font-bold">
                  <span className="w-1.5 h-1.5 bg-white mr-1.5" />
                  {watchParty.isHost ? 'HOSTING' : 'GUEST'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-none bg-black border border-white/20">
                <span className="text-xl font-mono font-bold tracking-widest text-white">
                  {watchParty.roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 text-xs text-white border border-white/20 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Viewers in room</span>
                <span className="font-bold text-white">{watchParty.viewerCount}</span>
              </div>
            </div>

            {/* Overlay settings */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-white" />
                <span>Overlay Position</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => (
                  <button
                    key={pos}
                    onClick={() => updateWatchParty({ overlayPosition: pos })}
                    className={`p-2 rounded-none border text-center uppercase tracking-wider transition-colors cursor-pointer ${
                      watchParty.overlayPosition === pos
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-black border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                leaveWatchParty();
                closeWatchParty();
              }}
              className="w-full py-2.5 rounded-none bg-neutral-900 hover:bg-red-900/60 text-white font-bold text-xs uppercase tracking-wider border border-white/20 hover:border-red-500 transition-colors cursor-pointer"
            >
              Leave Party
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Join Section */}
            <div>
              <h3 className="uppercase tracking-wider text-neutral-400 font-bold mb-2">Join a Room</h3>
              <form onSubmit={handleJoin} className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE (E.G. 7482)"
                    maxLength={10}
                    className="flex-1 bg-neutral-950 border border-white/20 px-3 py-2 rounded-none text-xs font-mono tracking-wider outline-none text-white focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-none bg-white text-black font-bold uppercase tracking-wider transition-colors hover:bg-neutral-200 cursor-pointer"
                  >
                    Join
                  </button>
                </div>
                {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
              </form>
            </div>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="px-3 text-[10px] text-neutral-600 font-bold">OR</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Host Section */}
            <div className="space-y-2.5">
              <h3 className="uppercase tracking-wider text-neutral-400 font-bold">Host a New Room</h3>
              <input
                type="text"
                value={customHostCode}
                onChange={(e) => setCustomHostCode(e.target.value.toUpperCase())}
                placeholder="CUSTOM CODE (OPTIONAL)"
                maxLength={8}
                className="w-full bg-neutral-950 border border-white/20 px-3 py-2 rounded-none text-xs font-mono outline-none text-white focus:border-white placeholder-neutral-600"
              />
              <button
                onClick={handleHost}
                className="w-full py-2.5 rounded-none bg-black hover:bg-neutral-900 text-white font-bold uppercase tracking-wider border border-white/30 hover:border-white transition-colors cursor-pointer"
              >
                Host Watch Party
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
