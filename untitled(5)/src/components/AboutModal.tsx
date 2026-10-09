import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, ChevronDown, HelpCircle, Film } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: 'General' | 'Playback' | 'Sync' | 'Features';
}

const FAQS: FAQItem[] = [
  {
    category: 'General',
    q: 'What is Kerasoni Cinema?',
    a: 'Kerasoni is a modern, lightweight, ad-free cinema experience designed for discovering and streaming high-definition films and television series with zero bloat.'
  },
  {
    category: 'General',
    q: 'Are Rotten Tomatoes scores real?',
    a: 'Yes! Kerasoni provides Tomatometer critic percentages, verified audience scores, and critical consensus summaries to help you find the highest-rated entertainment.'
  },
  {
    category: 'Playback',
    q: 'How does streaming work?',
    a: 'Kerasoni connects to multiple fast media sources and streams videos directly to your browser with full keyboard navigation and multi-quality playback.'
  },
  {
    category: 'Playback',
    q: 'Can I change subtitles and audio tracks?',
    a: 'Yes, full custom subtitle rendering (colors, sizes, backgrounds, timing sync) is available directly in the video player settings overlay.'
  },
  {
    category: 'Sync',
    q: 'How does Google Account sync work?',
    a: 'Click "Sign In with Google" at the top right to link your Google profile. Kerasoni backs up your bookmarks, folders, and watch history across your devices seamlessly.'
  },
  {
    category: 'Features',
    q: 'What is the AI Cinema Curator?',
    a: 'Our built-in AI Curator understands natural descriptions, emotional vibes, and obscure plot hooks to recommend movies tailored precisely to what you want to watch.'
  },
  {
    category: 'Features',
    q: 'How do Watch Parties work?',
    a: 'You can host or join synchronized rooms with friends. Playback pause, play, and seek events stay aligned in real-time.'
  }
];

export const AboutModal: React.FC = () => {
  const { isAboutOpen, closeAbout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isAboutOpen) return null;

  const categories = ['All', 'General', 'Playback', 'Sync', 'Features'];

  const filteredFaqs = FAQS.filter(f => {
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    const matchesSearch = 
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={closeAbout}
    >
      <div 
        className="relative w-full max-w-2xl rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 sm:p-7 text-white my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-4 h-4 text-white" />
            <h2 className="text-sm sm:text-base font-semibold text-white">About &amp; Frequently Asked Questions</h2>
          </div>
          <button 
            onClick={closeAbout} 
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category filter */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="flex items-center w-full px-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 focus-within:border-neutral-600">
            <Search className="w-3.5 h-3.5 text-neutral-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or topics..."
              className="bg-transparent text-white outline-none w-full placeholder-neutral-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {filteredFaqs.length === 0 ? (
            <p className="text-center text-xs text-neutral-500 py-8">No matching questions found.</p>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-neutral-800/80 bg-neutral-900/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-medium text-white hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-2.5 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-2">
            <Film className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-300">Kerasoni Cinema</span>
          </div>
          <span>Version 5.5.0</span>
        </div>
      </div>
    </div>
  );
};
