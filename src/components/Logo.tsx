import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'icon';
  className?: string;
  showTagline?: boolean;
  lightMode?: boolean; // When placed on dark green backgrounds
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  showTagline = true,
  lightMode = false,
}) => {
  // Dimension scalers for Emblem
  const iconDimensions = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  // Title typography scale (Cinzel)
  const titleSizes = {
    xs: 'text-sm font-bold tracking-wider',
    sm: 'text-base font-bold tracking-wider',
    md: 'text-xl font-bold tracking-wider',
    lg: 'text-3xl font-bold tracking-wider',
    xl: 'text-4xl sm:text-5xl font-bold tracking-widest',
  }[size];

  // "STORE" subtitle scale
  const subtitleSizes = {
    xs: 'text-[7px] tracking-[0.2em] font-semibold',
    sm: 'text-[9px] tracking-[0.22em] font-semibold',
    md: 'text-[11px] tracking-[0.25em] font-semibold',
    lg: 'text-xs sm:text-sm tracking-[0.3em] font-semibold',
    xl: 'text-sm sm:text-base tracking-[0.35em] font-semibold',
  }[size];

  // Tagline scale
  const taglineSizes = {
    xs: 'text-[8px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-sm sm:text-base',
  }[size];

  // Colors based on lightMode
  const titleColor = lightMode ? 'text-white' : 'text-[#0C3B29]';
  const taglineColor = lightMode ? 'text-emerald-100/90' : 'text-[#0C3B29]/90';
  const goldStrokeColor = lightMode ? '#FDE047' : '#D4AF37';

  // The custom emblem faithfully matching the official Darda Store identity
  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs select-none"
      >
        <defs>
          <linearGradient id="emblemEmerald" x1="150" y1="80" x2="350" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#145A38" />
            <stop offset="45%" stopColor="#0C3B29" />
            <stop offset="100%" stopColor="#05261A" />
          </linearGradient>

          <linearGradient id="emblemGold" x1="140" y1="160" x2="260" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECC66D" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#8F6B08" />
          </linearGradient>

          <filter id="emblemDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#05261A" floodOpacity="0.18" />
          </filter>
        </defs>

        <g filter="url(#emblemDropShadow)">
          {/* Main "D" Body in Deep Islamic Emerald */}
          <path
            d="M 152 86
               L 152 280
               C 152 280, 210 286, 252 280
               C 320 270, 348 220, 348 180
               C 348 120, 290 86, 230 86
               Z"
            fill="url(#emblemEmerald)"
          />
          <path
            d="M 152 86
               C 152 86, 230 84, 280 102
               C 336 122, 350 178, 344 228
               C 336 284, 290 326, 234 326
               C 200 326, 175 308, 175 308
               L 190 286
               C 190 286, 212 300, 236 300
               C 272 300, 312 268, 318 222
               C 324 180, 310 134, 266 118
               C 226 104, 178 106, 178 106
               Z"
            fill="url(#emblemEmerald)"
          />

          {/* Inner White Islamic Arch (Mihrab) */}
          <path
            d="M 246 112
               C 246 112, 222 144, 204 172
               C 192 192, 192 274, 192 274
               L 298 274
               C 298 274, 298 192, 286 172
               C 268 144, 246 112, 246 112
               Z"
            fill="#FFFFFF"
          />

          {/* Mosque Dome Silhouette (Inside Arch, Emerald) */}
          <path
            d="M 246 160
               C 246 160, 234 184, 216 196
               C 210 200, 210 274, 210 274
               L 280 274
               C 280 274, 280 200, 274 196
               C 256 184, 246 160, 246 160
               Z"
            fill="#0C3B29"
          />

          {/* Golden Crescent Moon (Hilal) */}
          <path
            d="M 246 130
               C 252 130, 258 136, 258 143
               C 258 150, 252 156, 245 156
               C 238 156, 234 150, 234 144
               C 234 140, 236 137, 238 135
               C 236 139, 237 146, 242 149
               C 247 151, 252 148, 252 143
               C 252 137, 248 132, 246 130
               Z"
            fill="url(#emblemGold)"
          />

          {/* Golden Leaf Accent at Bottom-Left */}
          <path
            d="M 152 172
               C 152 172, 142 220, 160 260
               C 176 294, 214 314, 246 312
               C 246 312, 212 300, 194 274
               C 172 240, 176 198, 152 172
               Z"
            fill="url(#emblemGold)"
          />
          <path
            d="M 152 172
               C 152 172, 178 206, 194 246
               C 208 280, 246 312, 246 312
               C 246 312, 222 284, 210 254
               C 192 214, 174 186, 152 172
               Z"
            fill="#F3D17A"
            opacity="0.9"
          />

          {/* Delicate White Central Leaf Vein */}
          <path
            d="M 154 176
               C 174 212, 200 256, 242 310"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );

  // Variant: Icon only
  if (variant === 'icon') {
    return Emblem;
  }

  // Variant: Full Stacked Logo (Hero, Splash, Login, Footer)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {Emblem}
        <div className="mt-3.5 space-y-1">
          {/* "DARDA" in Cinzel */}
          <h1 className={`font-brand ${titleColor} ${titleSizes} tracking-widest drop-shadow-2xs`}>
            DARDA
          </h1>

          {/* "— STORE —" with Golden Horizontal Rules */}
          <div className="flex items-center justify-center gap-2.5 my-1">
            <span 
              className="h-[1.5px] w-8 rounded-full" 
              style={{ backgroundColor: goldStrokeColor }}
            />
            <span 
              className={`uppercase ${subtitleSizes} font-bold`}
              style={{ color: goldStrokeColor }}
            >
              STORE
            </span>
            <span 
              className="h-[1.5px] w-8 rounded-full" 
              style={{ backgroundColor: goldStrokeColor }}
            />
          </div>

          {/* Official Tagline */}
          {showTagline && (
            <p className={`font-serif italic font-medium ${taglineColor} mt-1.5 ${taglineSizes}`}>
              Belanja Berkah, Dukung UMKM Jamaah
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variant: Horizontal lockup (Navbar, Headers, Compact Cards)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col">
        {/* "DARDA" */}
        <div className="flex items-baseline gap-2">
          <span className={`font-brand ${titleColor} ${titleSizes} tracking-wider`}>
            DARDA
          </span>
          <span 
            className={`uppercase ${subtitleSizes} font-bold`}
            style={{ color: goldStrokeColor }}
          >
            STORE
          </span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <span className={`font-serif italic font-medium ${taglineColor} line-clamp-1 ${taglineSizes}`}>
            Belanja Berkah, Dukung UMKM Jamaah
          </span>
        )}
      </div>
    </div>
  );
};
