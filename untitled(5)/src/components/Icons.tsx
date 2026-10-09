import React from 'react';

export interface KerasoniLogoProps {
  className?: string;
  variant?: 'eclipse' | 'horizon' | 'monolith' | 'prism';
  fadeEffect?: 'breath' | 'shimmer' | 'radiant' | 'clean';
  fadeIntensity?: number; // 0.2 - 1.0
  withWordmark?: boolean;
  accentColor?: string;
}

export const KerasoniLogo: React.FC<KerasoniLogoProps> = ({ 
  className = 'w-6 h-6',
  variant = 'eclipse',
  fadeEffect = 'breath',
  fadeIntensity = 0.85,
  withWordmark = false,
  accentColor = '#ffffff'
}) => {
  const maskId = React.useId();
  const gradId = React.useId();
  const glowId = React.useId();

  // Animation class based on fadeEffect
  const animClass = 
    fadeEffect === 'breath' ? 'animate-pulse' :
    fadeEffect === 'shimmer' ? 'transition-all duration-700 hover:opacity-100 opacity-90' :
    fadeEffect === 'radiant' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' :
    '';

  const renderSymbol = () => {
    switch (variant) {
      case 'horizon':
        // Celestial Blank 4-point cinema spark with anamorphic horizon flare
        return (
          <g>
            {/* Soft horizon flare beam */}
            <line
              x1="2"
              y1="16"
              x2="30"
              y2="16"
              stroke={`url(#${gradId})`}
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity={fadeIntensity * 0.45}
            />
            {/* Blank 4-point celestial star */}
            <path
              d="M 16 3.5 L 18.6 13.4 L 28.5 16 L 18.6 18.6 L 16 28.5 L 13.4 18.6 L 3.5 16 L 13.4 13.4 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'monolith':
        // Architectural dual concentric blank star
        return (
          <g>
            {/* Outer blank star */}
            <path
              d="M 16 3.5 L 19.1 12.1 L 28.2 12.2 L 20.8 17.5 L 23.6 26.2 L 16 20.8 L 8.4 26.2 L 11.2 17.5 L 3.8 12.2 L 12.9 12.1 Z"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner concentric blank star */}
            <path
              d="M 16 8.5 L 17.8 13.6 L 23.2 13.7 L 18.8 16.9 L 20.5 22.1 L 16 18.9 L 11.5 22.1 L 13.2 16.9 L 8.8 13.7 L 14.2 13.6 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity={fadeIntensity * 0.65}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'prism':
        // Faceted blank star with precision optic accents
        return (
          <g>
            {/* Blank star outline */}
            <path
              d="M 16 3.5 L 19.1 12.1 L 28.2 12.2 L 20.8 17.5 L 23.6 26.2 L 16 20.8 L 8.4 26.2 L 11.2 17.5 L 3.8 12.2 L 12.9 12.1 Z"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Precision apex dots */}
            <circle cx="16" cy="3.5" r="1.1" fill="currentColor" fillOpacity={fadeIntensity} />
            <circle cx="28.2" cy="12.2" r="1.1" fill="currentColor" fillOpacity={fadeIntensity} />
            <circle cx="23.6" cy="26.2" r="1.1" fill="currentColor" fillOpacity={fadeIntensity} />
            <circle cx="8.4" cy="26.2" r="1.1" fill="currentColor" fillOpacity={fadeIntensity} />
            <circle cx="3.8" cy="12.2" r="1.1" fill="currentColor" fillOpacity={fadeIntensity} />
          </g>
        );

      case 'eclipse':
      default:
        // Pure Blank Star: Crisp geometric outline star with hollow blank interior
        return (
          <g>
            <path
              d="M 16 3.5 L 19.1 12.1 L 28.2 12.2 L 20.8 17.5 L 23.6 26.2 L 16 20.8 L 8.4 26.2 L 11.2 17.5 L 3.8 12.2 L 12.9 12.1 Z"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 select-none ${animClass}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className={`${className} transition-all duration-300`}
        fill="currentColor"
      >
        <defs>
          {/* Fadey Gradient Stop - high-end luminous fade */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={1} />
            <stop offset="50%" stopColor={accentColor} stopOpacity={fadeIntensity * 0.7} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.15} />
          </linearGradient>

          {/* Radial soft flare */}
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={fadeIntensity * 0.4} />
            <stop offset="60%" stopColor={accentColor} stopOpacity={fadeIntensity * 0.1} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Ambient fade backdrop aura */}
        <circle cx="16" cy="16" r="15" fill={`url(#${glowId})`} />

        {/* Main emblem */}
        {renderSymbol()}
      </svg>

      {withWordmark && (
        <div className="flex flex-col text-left">
          <span className="font-bold text-white text-sm sm:text-base tracking-wide leading-none">
            Kerasoni
          </span>
          <span className="text-[10px] text-neutral-400 leading-tight mt-0.5">
            Cinema
          </span>
        </div>
      )}
    </div>
  );
};

export const PStreamLogo = KerasoniLogo;

/**
 * Official Google 'G' icon for Google Auth Sign-in
 */
export const GoogleLogo: React.FC<{ className?: string; monochrome?: boolean }> = ({ 
  className = 'w-4 h-4',
  monochrome = false 
}) => {
  if (monochrome) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.35 11.1H12v3.6h5.36c-.53 2.5-2.6 4.3-5.36 4.3-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.39 0 2.65.51 3.63 1.36l2.7-2.7C16.89 4.8 14.59 4 12 4 7.58 4 4 7.58 4 12s3.58 8 8 8c4.61 0 8-3.3 8-8 0-.6-.05-1.3-.65-1.9z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
};

export const AnimalIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = 'w-5 h-5' }) => {
  switch (icon) {
    case 'dog':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 4l2 4-3 1-1-3 2-2zm-12 0l-2 4 3 1 1-3-2-2zm6 2c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19V20h-6v-2.81C7.21 16.15 6 14.22 6 12c0-3.31 2.69-6 6-6zm-2 5a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm-2 2.5c-.83 0-1.5.67-1.5 1.5h3c0-.83-.67-1.5-1.5-1.5z" />
        </svg>
      );
    case 'frog':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 5.5a2.5 2.5 0 00-2.45 2.05C15.6 7.2 13.88 7 12 7s-3.6.2-5.05.55A2.5 2.5 0 104.5 10c.04.5.15.98.32 1.43C3.72 13.04 3 15.38 3 18h2c0-2.12.72-3.88 1.83-5.06C8.5 14.22 10.15 15 12 15s3.5-.78 5.17-2.06C18.28 14.12 19 15.88 19 18h2c0-2.62-.72-4.96-1.82-6.57.17-.45.28-.93.32-1.43a2.5 2.5 0 000-4.5zM6 8a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      );
    case 'dragon':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      );
    case 'cat':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5c-3.86 0-7 2.69-7 6 0 1.95 1.09 3.69 2.78 4.78L7 19l3.41-1.36C10.97 17.84 11.48 18 12 18c3.86 0 7-2.69 7-6s-3.14-6-7-6zm-3.5 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-3.5 4.2c-1.1 0-1.8-.4-2-.7-.2-.3.1-.7.4-.8.3-.1.7.1.9.3.2.1.5.2.7.2s.5-.1.7-.2c.2-.2.6-.4.9-.3.3.1.6.5.4.8-.2.3-.9.7-2 .7zM4 3l4 3M20 3l-4 3" />
        </svg>
      );
  }
};

export const TomatoIcon: React.FC<{ 
  className?: string; 
  status?: 'certified' | 'fresh' | 'rotten';
}> = ({ className = 'w-4 h-4', status = 'fresh' }) => {
  if (status === 'certified') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Certified Fresh Rosette Badge */}
        <circle cx="12" cy="12" r="10.5" fill="#FA320A" />
        <path d="M12 2L13.8 4.6L16.9 3.8L17.8 6.8L20.8 7.3L20.5 10.5L23 12L20.5 13.5L20.8 16.7L17.8 17.2L16.9 20.2L13.8 19.4L12 22L10.2 19.4L7.1 20.2L6.2 17.2L3.2 16.7L3.5 13.5L1 12L3.5 10.5L3.2 7.3L6.2 6.8L7.1 3.8L10.2 4.6L12 2Z" fill="#DC2626" opacity="0.5" />
        <circle cx="12" cy="12" r="7.5" fill="#FA320A" stroke="#FEF08A" strokeWidth="0.75" />
        {/* Gold Star */}
        <path d="M12 6.8L13.3 9.8L16.5 10.1L14 12.3L14.7 15.5L12 13.8L9.3 15.5L10 12.3L7.5 10.1L10.7 9.8L12 6.8Z" fill="#FACC15" />
      </svg>
    );
  }
  
  if (status === 'rotten') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M12 4C8 4 4.5 7.5 4.5 11.5C4.5 14 5.5 15.5 6.5 17C5 18.5 3.5 20.5 5.5 21.5C8 22.5 10.5 20 12.5 20.5C14.5 21 17.5 22.5 19.5 21.5C21.5 20 20 18 18.5 16.5C20 15 20.5 13 20.5 11.5C20.5 7 16.5 4 12 4Z" 
          fill="#65A30D" 
        />
        <path d="M12 3V6M10 5L12 6L14 5" stroke="#3F6212" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Fresh Tomato (Crisp Vector SVG)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13.5" r="8" fill="#FA320A" />
      <path d="M7 11.5C7.5 8.5 10 7.5 12 7.5C14 7.5 16.5 8.5 17 11.5C17.5 15.5 15.5 19.5 12 19.5C8.5 19.5 6.5 15.5 7 11.5Z" fill="#E52E08" />
      <ellipse cx="9.5" cy="11.5" rx="1.8" ry="1.2" fill="white" fillOpacity="0.35" transform="rotate(-20 9.5 11.5)" />
      <path d="M12 4.5V7" stroke="#2E7D32" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7L9 5.5M12 7L15 5.5M12 7L8 8M12 7L16 8M12 7L12 9" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const PopcornIcon: React.FC<{ 
  className?: string; 
  status?: 'fresh' | 'tipped';
}> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9.5L7.5 21H16.5L18 9.5H6Z" fill="#DC2626" />
      <path d="M9.3 9.5L10 21H11.2L10.7 9.5H9.3Z" fill="#F8FAFC" />
      <path d="M13.3 9.5L12.8 21H14L14.7 9.5H13.3Z" fill="#F8FAFC" />
      <rect x="5.5" y="8.5" width="13" height="1.8" rx="0.9" fill="#B91C1C" />
      <circle cx="8" cy="7" r="2.2" fill="#FBBF24" />
      <circle cx="12" cy="5.5" r="2.5" fill="#F59E0B" />
      <circle cx="16" cy="7" r="2.2" fill="#FBBF24" />
      <circle cx="10" cy="6.8" r="2" fill="#FDE68A" />
      <circle cx="14" cy="6.8" r="2" fill="#FDE68A" />
      <circle cx="12" cy="7.5" r="1.8" fill="#F59E0B" />
    </svg>
  );
};

export const ToriiGateIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 5.5C7 4.2 17 4.2 22 5.5" />
    <path d="M4 8.5H20" />
    <path d="M7 8.5V20" />
    <path d="M17 8.5V20" />
    <path d="M12 5V8.5" />
  </svg>
);
