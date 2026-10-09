import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, ChevronDown, HelpCircle, ExternalLink } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Where does the content come from?",
    a: "P-Stream does not host any content. When you select a title, it queries public search engines and web sources — the player's Source menu displays the provider being streamed. Nothing is ever uploaded or hosted by P-Stream.",
    category: "General"
  },
  {
    q: "Can I download videos to watch offline?",
    a: "Yes — titles with direct download links display offline options in their source and download menus with file size indicators.",
    category: "General"
  },
  {
    q: "What is Watch Party?",
    a: "Watch Party synchronizes room playback, pause/resume, and seek timing across all connected participants.",
    category: "General"
  },
  {
    q: "How do I switch streaming sources?",
    a: "Open the player controls and select Source from the top bar or settings menu. Choose any provider from the available list.",
    category: "Playback"
  },
  {
    q: "Why is a stream buffering?",
    a: "Buffering typically originates from the third-party provider's bandwidth. Switch to another source in the player (e.g. Lula, Sara, Elsie, Cary) or lower the resolution.",
    category: "Playback"
  },
  {
    q: "Does P-Stream support anime?",
    a: "Yes — anime is integrated directly via AniList with full episodic catalog support.",
    category: "Content"
  },
  {
    q: "How do I customize subtitles?",
    a: "Open the Subtitles menu inside the player. You can change language, adjust font size, background opacity, blur, and fine-tune audio sync with -0.5s / +0.5s offsets.",
    category: "Subtitles"
  }
];

export const AboutModal: React.FC = () => {
  const { isAboutOpen, closeAbout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isAboutOpen) return null;

  const categories = ['All', 'General', 'Playback', 'Content', 'Subtitles'];

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !searchTerm.trim() || 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono"
      onClick={closeAbout}
    >
      <div 
        className="relative w-full max-w-2xl rounded-none bg-black border border-white/20 shadow-2xl p-6 sm:p-8 text-white my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 uppercase tracking-wider">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold">About &amp; FAQ</h2>
          </div>
          <button onClick={closeAbout} className="p-1 rounded-none text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category filter (Square & Clean) */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="flex items-center w-full px-3 py-2 rounded-none bg-neutral-950 border border-white/20">
            <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="bg-transparent text-white outline-none w-full placeholder-neutral-600"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-none uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-black text-neutral-400 hover:text-white border border-white/15'
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
                  className="rounded-none border border-white/10 bg-neutral-950 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-white uppercase tracking-wider hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 text-xs text-neutral-400 leading-relaxed border-t border-white/10 pt-2 font-sans font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer links */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>P-STREAM v5.5.0</span>
          <div className="flex items-center space-x-4">
            <a href="https://discord.gg/pstream" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1">
              <span>Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://codeberg.org/pee" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1">
              <span>Codeberg</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
