import React from 'react';
import { useApp } from '../context/AppContext';
import { KerasoniLogo } from './Icons';
import { 
  X, 
  Palette, 
  Sparkles, 
  Layers, 
  Check, 
  RotateCcw,
  Tv,
  Film
} from 'lucide-react';

const ACCENT_THEMES = [
  { id: 'monochrome', name: 'Pure Cinema White', hex: '#ffffff', desc: 'Crisp cinema white & deep obsidian' },
  { id: 'cyberAmber', name: 'Cyber Amber', hex: '#f59e0b', desc: 'Blade Runner warm tungsten & amber' },
  { id: 'crimson', name: 'Crimson Cinema', hex: '#ef4444', desc: 'Classic 35mm film red & dark carbon' },
  { id: 'titanium', name: 'Studio Titanium', hex: '#e2e8f0', desc: 'Brushed metal slate & platinum' },
  { id: 'emerald', name: 'Emerald Matrix', hex: '#10b981', desc: 'Sci-fi phosphor green & deep carbon' },
  { id: 'violet', name: 'Midnight Violet', hex: '#8b5cf6', desc: 'Neo-noir electric violet & onyx' },
  { id: 'cyan', name: 'Hyper Cyan', hex: '#06b6d4', desc: 'Anamorphic laser lens blue' },
] as const;

const LOGO_STYLES = [
  { id: 'eclipse', label: 'Blank Star', desc: 'Classic clean geometric outline star with hollow blank core' },
  { id: 'horizon', label: 'Celestial Star', desc: 'Blank 4-point cinema spark with anamorphic horizon flare' },
  { id: 'monolith', label: 'Dual Star', desc: 'Architectural concentric blank stars with hollow aperture' },
  { id: 'prism', label: 'Prism Star', desc: 'Faceted blank star outline with precision apex accents' },
] as const;

const LOGO_FADE_EFFECTS = [
  { id: 'breath', label: 'Ambient Breath', desc: 'Subtle slow luminous pulsing fade' },
  { id: 'shimmer', label: 'Luminous Shimmer', desc: 'Smooth opacity shift on hover' },
  { id: 'radiant', label: 'Radiant Glow', desc: 'Soft drop shadow aura fade' },
  { id: 'clean', label: 'Static Razor', desc: 'Clean high-precision static gradient' },
] as const;

export const CustomizerModal: React.FC = () => {
  const { 
    isCustomizerOpen, 
    closeCustomizer, 
    customization, 
    updateCustomization,
    preferences,
    updatePreferences 
  } = useApp();

  if (!isCustomizerOpen) return null;

  const currentAccent = ACCENT_THEMES.find(t => t.id === customization.accentTheme)?.hex || '#ffffff';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeCustomizer}
    >
      <div 
        className="relative w-full max-w-3xl rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center space-x-2.5">
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-sm text-white">
              Kerasoni Customizer &amp; UI Lab
            </span>
          </div>
          <button 
            onClick={closeCustomizer}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-7 scrollbar-thin text-xs">
          
          {/* SECTION 1: LIVE LOGO CUSTOMIZATION & FADEY EFFECT */}
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Logo Aesthetics &amp; Fade Effect</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tune the brand emblem, gradient opacity, and fade animation
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-950 rounded-lg border border-neutral-800 shrink-0">
                <KerasoniLogo
                  className="w-8 h-8"
                  variant={customization.logoStyle}
                  fadeEffect={customization.logoFadeEffect}
                  fadeIntensity={customization.logoFadeIntensity}
                  accentColor={currentAccent}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-white text-xs">
                    Kerasoni
                  </span>
                  <span className="text-[10px] text-neutral-400 capitalize">
                    {customization.logoStyle} · {customization.logoFadeEffect}
                  </span>
                </div>
              </div>
            </div>

            {/* Logo Style Grid */}
            <div className="space-y-2">
              <label className="text-neutral-400 text-xs font-medium block">
                Emblem Architecture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LOGO_STYLES.map(style => {
                  const isSelected = customization.logoStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => updateCustomization('logoStyle', style.id as any)}
                      className={`p-3 text-left border rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-white bg-neutral-900 text-white font-semibold' 
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <KerasoniLogo
                          className="w-5 h-5"
                          variant={style.id as any}
                          fadeEffect="clean"
                          fadeIntensity={1}
                          accentColor={currentAccent}
                        />
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <p className="text-xs text-white font-semibold truncate">{style.label}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2">{style.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Fade Animation */}
            <div className="space-y-2 pt-2">
              <label className="text-neutral-400 text-xs font-medium block">
                Fade Animation Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LOGO_FADE_EFFECTS.map(effect => {
                  const isSelected = customization.logoFadeEffect === effect.id;
                  return (
                    <button
                      key={effect.id}
                      onClick={() => updateCustomization('logoFadeEffect', effect.id as any)}
                      className={`p-2.5 text-left border rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-white bg-neutral-900 text-white font-semibold' 
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white font-medium">{effect.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-1">{effect.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fade Intensity Range Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Logo Fade Luminous Intensity</span>
                <span className="font-semibold text-white">{Math.round(customization.logoFadeIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.0}
                step={0.05}
                value={customization.logoFadeIntensity}
                onChange={(e) => updateCustomization('logoFadeIntensity', parseFloat(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 2: ACCENT THEMES */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-white" />
              <span>Cinematic Color Themes</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Select an accent palette to tone highlights, badges, and focus rings
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {ACCENT_THEMES.map(theme => {
                const isSelected = customization.accentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateCustomization('accentTheme', theme.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-white bg-neutral-900 text-white' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-neutral-700 inline-block"
                          style={{ backgroundColor: theme.hex }}
                        />
                        <span className="text-xs font-semibold text-white">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">{theme.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: CARD & VIEWPORT STYLING */}
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Card Layout &amp; Atmospheric Depth</span>
            </h3>

            {/* Card Style Select */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => updateCustomization('cardStyle', 'poster')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  customization.cardStyle === 'poster'
                    ? 'border-white bg-neutral-900 text-white font-medium'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Vertical Poster (2:3)</span>
                  <Film className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-neutral-400">Classic vertical movie one-sheet layout</p>
              </button>

              <button
                onClick={() => updateCustomization('cardStyle', 'widescreen')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  customization.cardStyle === 'widescreen'
                    ? 'border-white bg-neutral-900 text-white font-medium'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Widescreen (16:9)</span>
                  <Tv className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-neutral-400">Cinematic horizontal backdrop frame</p>
              </button>

              <button
                onClick={() => updateCustomization('cardStyle', 'minimal')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  customization.cardStyle === 'minimal'
                    ? 'border-white bg-neutral-900 text-white font-medium'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">Minimal Direct Play</span>
                  <Film className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-neutral-400">Clicking opens player immediately</p>
              </button>
            </div>

            {/* Corner Radius & Ambient Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="font-medium text-white text-xs">Corner Smoothness</p>
                  <p className="text-[11px] text-neutral-400">
                    {customization.borderSharpness === 'soft' ? 'Soft rounded corners' : 'Sharp precision edges'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={customization.borderSharpness === 'soft'}
                  onChange={(e) => updateCustomization('borderSharpness', e.target.checked ? 'soft' : 'sharp')}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800 cursor-pointer">
                <div>
                  <p className="font-medium text-white text-xs">Ambient Top Gradient</p>
                  <p className="text-[11px] text-neutral-400">Soft atmospheric glow across the header</p>
                </div>
                <input
                  type="checkbox"
                  checked={customization.ambientFade}
                  onChange={(e) => updateCustomization('ambientFade', e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* SECTION 4: STREAM ENGINE & QUALITY PREFERENCE */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <h3 className="font-semibold text-xs text-white">
              Playback &amp; Engine Preferences
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-neutral-300">Default Quality Target</span>
                <select
                  value={customization.defaultQuality}
                  onChange={(e) => updateCustomization('defaultQuality', e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-white text-xs outline-none cursor-pointer"
                >
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                  <option value="720p">720p Standard</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-neutral-300">Hero Carousel Display</span>
                <button
                  onClick={() => updatePreferences('showFeatured', !preferences.showFeatured)}
                  className={`px-3 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    preferences.showFeatured 
                      ? 'bg-white text-black border-white' 
                      : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {preferences.showFeatured ? 'Enabled' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <button
            onClick={() => {
              updateCustomization('logoStyle', 'eclipse');
              updateCustomization('logoFadeEffect', 'breath');
              updateCustomization('logoFadeIntensity', 0.85);
              updateCustomization('accentTheme', 'monochrome');
              updateCustomization('cardStyle', 'poster');
              updateCustomization('ambientFade', true);
              updateCustomization('borderSharpness', 'soft');
            }}
            className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={closeCustomizer}
            className="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
