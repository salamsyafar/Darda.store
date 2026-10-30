import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'icon';
  className?: string;
  showTagline?: boolean;
  lightMode?: boolean; // When placed on dark Forest Green backgrounds
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
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
  }[size];

  // Wordmark "darda.store" typography scale
  const wordmarkSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl sm:text-6xl',
  }[size];

  // Tagline "DARI MASJID UNTUK UMKM" scale
  const taglineSizes = {
    xs: 'text-[7px] tracking-[0.2em]',
    sm: 'text-[8.5px] tracking-[0.22em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-xs sm:text-sm tracking-[0.34em]',
  }[size];

  // Official Brand Colors from Showcase:
  // Forest Green: #0F3D2E
  // Fresh Green: #2E7D32
  // Warm Gold: #D4AF37
  // Cream: #F8F4E9
  const dardaColor = lightMode ? 'text-[#F8F4E9]' : 'text-[#0F3D2E]';
  const storeColor = lightMode ? 'text-[#5FD068]' : 'text-[#2E7D32]';
  const taglineColor = lightMode ? 'text-[#F8F4E9]/85' : 'text-[#0F3D2E]/85';

  // Unique SVG gradient ID suffix so multiple logos on page don't collide
  const uid = React.useId().replace(/:/g, '');

  // The official darda.store emblem: Lowercase 'd' shopping bag + Cream Mihrab Arch + Warm Gold Mosque Dome & Crescent
  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
      <svg
        viewBox="0 0 500 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none drop-shadow-xs"
      >
        <defs>
          {/* Forest Green 3D Gradient (#0F3D2E) */}
          <linearGradient id={`forestGreen-${uid}`} x1="120" y1="60" x2="390" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1A5C46" />
            <stop offset="45%" stopColor="#0F3D2E" />
            <stop offset="100%" stopColor="#08241B" />
          </linearGradient>

          {/* Forest Green Handle Bevel */}
          <linearGradient id={`forestBevel-${uid}`} x1="150" y1="50" x2="350" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#246B53" />
            <stop offset="55%" stopColor="#0F3D2E" />
            <stop offset="100%" stopColor="#08241B" />
          </linearGradient>

          {/* Warm Gold 3D Mosque Dome Gradient (#D4AF37) */}
          <linearGradient id={`warmGold-${uid}`} x1="200" y1="240" x2="310" y2="410" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7E08A" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="80%" stopColor="#B88E22" />
            <stop offset="100%" stopColor="#9A7414" />
          </linearGradient>

          {/* Cream Mihrab Arch (#F8F4E9) */}
          <linearGradient id={`creamArch-${uid}`} x1="250" y1="185" x2="250" y2="470" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8F4E9" />
            <stop offset="100%" stopColor="#EDE4CE" />
          </linearGradient>

          <filter id={`emblemShadow-${uid}`} x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#072219" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter={`url(#emblemShadow-${uid})`}>
          {/* 1. Shopping Bag Handle at Top (Forest Green #0F3D2E) */}
          <path
            d="M 192 142
               C 192 78, 308 78, 308 142
               L 308 156
               C 295 150, 282 146, 272 144
               L 272 138
               C 272 104, 228 104, 228 138
               L 228 144
               C 218 146, 205 150, 192 156
               Z"
            fill={`url(#forestBevel-${uid})`}
          />

          {/* 2. Main Lowercase 'd' Bowl & Right Vertical Stem (Forest Green #0F3D2E) */}
          <path
            d="M 332 128
               C 332 104, 350 92, 372 92
               L 382 92
               C 390 92, 396 98, 396 106
               L 396 364
               C 396 426, 368 468, 332 480
               L 332 294
               C 332 248, 294 218, 250 182
               C 206 218, 168 248, 168 294
               L 168 476
               C 118 450, 92 396, 92 332
               C 92 232, 164 164, 252 164
               C 284 164, 312 173, 332 188
               Z"
            fill={`url(#forestGreen-${uid})`}
          />

          {/* 3. Cream Mihrab Outer Arch Frame (#F8F4E9) */}
          <path
            d="M 250 182
               C 294 218, 332 248, 332 294
               L 332 480
               L 168 476
               L 168 294
               C 168 248, 206 218, 250 182
               Z"
            fill={`url(#creamArch-${uid})`}
          />

          {/* 4. Crisp White Inner Mihrab Arch */}
          <path
            d="M 250 212
               C 284 242, 312 266, 312 304
               L 312 440
               L 188 440
               L 188 304
               C 188 266, 216 242, 250 212
               Z"
            fill="#FFFFFF"
          />

          {/* 5. Warm Gold Mosque Dome + Crescent Finial (#D4AF37) */}
          {/* Crescent Moon (Hilal) */}
          <path
            d="M 252 242
               C 242 242, 234 250, 234 260
               C 234 270, 242 278, 252 278
               C 258 278, 263 275, 266 271
               C 262 273, 258 273, 254 271
               C 246 268, 243 259, 246 251
               C 248 246, 253 243, 258 243
               C 256 242, 254 242, 252 242
               Z"
            fill={`url(#warmGold-${uid})`}
          />
          {/* Spire Rod */}
          <rect x="248" y="275" width="4" height="16" rx="2" fill={`url(#warmGold-${uid})`} />

          {/* Mosque Dome (Kubah) */}
          <path
            d="M 250 286
               C 256 306, 272 322, 290 338
               C 304 350, 310 368, 310 392
               L 190 392
               C 190 368, 196 350, 210 338
               C 228 322, 244 306, 250 286
               Z"
            fill={`url(#warmGold-${uid})`}
          />

          {/* White Arch Separator Curve Above Base */}
          <path
            d="M 188 392 Q 250 382 312 392 L 312 402 L 188 402 Z"
            fill="#FFFFFF"
          />

          {/* 6. Forest Green Rounded Base Bar Inside Arch (#0F3D2E) */}
          <path
            d="M 212 396
               L 288 396
               C 308 396, 324 412, 324 432
               L 324 474
               C 324 480, 319 484, 313 484
               L 187 484
               C 181 484, 176 480, 176 474
               L 176 432
               C 176 412, 192 396, 212 396
               Z"
            fill={`url(#forestGreen-${uid})`}
          />
        </g>
      </svg>
    </div>
  );

  // Variant: Icon only
  if (variant === 'icon') {
    return Emblem;
  }

  // Variant: Full Stacked Logo (Hero, Splash, Login, About)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {Emblem}
        <div className="mt-2.5 flex flex-col items-center">
          {/* "darda.store" lowercase geometric wordmark */}
          <div className={`font-brand ${wordmarkSizes} leading-none tracking-tight flex items-baseline`}>
            <span className={`font-extrabold ${dardaColor}`}>darda.</span>
            <span className={`font-semibold ${storeColor}`}>store</span>
          </div>

          {/* Official Tagline: "DARI MASJID UNTUK UMKM" */}
          {showTagline && (
            <p className={`uppercase font-semibold ${taglineColor} mt-2 ${taglineSizes}`}>
              DARI MASJID UNTUK UMKM
            </p>
          )}
        </div>
      </div>
    );
  }

  // Variant: Horizontal lockup (Navbar, Footer, Headers)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        {/* "darda.store" */}
        <div className={`font-brand ${wordmarkSizes} leading-none tracking-tight flex items-baseline`}>
          <span className={`font-extrabold ${dardaColor}`}>darda.</span>
          <span className={`font-semibold ${storeColor}`}>store</span>
        </div>

        {/* Tagline: "DARI MASJID UNTUK UMKM" */}
        {showTagline && (
          <span className={`uppercase font-semibold ${taglineColor} mt-1 line-clamp-1 ${taglineSizes}`}>
            DARI MASJID UNTUK UMKM
          </span>
        )}
      </div>
    </div>
  );
};
