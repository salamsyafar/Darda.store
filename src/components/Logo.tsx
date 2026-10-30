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
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
  }[size];

  // Wordmark "darda.store" typography scale
  const wordmarkSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl sm:text-6xl',
  }[size];

  // Tagline "DARI MASJID UNTUK UMKM" scale
  const taglineSizes = {
    xs: 'text-[7px] tracking-[0.2em]',
    sm: 'text-[8.5px] tracking-[0.22em]',
    md: 'text-[9.5px] sm:text-[10px] tracking-[0.24em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-xs sm:text-sm tracking-[0.34em]',
  }[size];

  // Official Brand Colors from Image 2:
  // Forest Green: #0F3D2E
  // Fresh Green: #2E7D32
  // Warm Gold (dot & dome): #D4AF37
  // Cream: #F8F4E9
  const dardaColor = lightMode ? 'text-[#F8F4E9]' : 'text-[#0F3D2E]';
  const dotColor = 'text-[#D4AF37]';
  const storeColor = lightMode ? 'text-[#5FD068]' : 'text-[#2E7D32]';
  const taglineColor = lightMode ? 'text-[#F8F4E9]/85' : 'text-[#0F3D2E]';

  // Unique SVG gradient ID suffix so multiple logos on page don't collide
  const uid = React.useId().replace(/:/g, '');

  // The new official darda.store emblem (Image 2):
  // Bag Handle + Pointed Mosque Mihrab Arch + Golden Dome & Crescent + 4-Scallop Store Awning & Pillars
  const Emblem = (
    <div
      className={`relative flex items-center justify-center shrink-0 ${iconDimensions} ${
        lightMode ? 'bg-[#F8F4E9] rounded-xl p-1 shadow-xs border border-[#D4AF37]/40' : ''
      }`}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        <defs>
          {/* Forest Green Gradient (#0F3D2E to #1E7A3C) */}
          <linearGradient id={`archGrad-${uid}`} x1="250" y1="80" x2="250" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E7A3C" />
            <stop offset="35%" stopColor="#0F4C35" />
            <stop offset="100%" stopColor="#0A3323" />
          </linearGradient>

          {/* Handle Forest Green */}
          <linearGradient id={`handleGrad-${uid}`} x1="250" y1="20" x2="250" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#145A3E" />
            <stop offset="100%" stopColor="#0B3B28" />
          </linearGradient>

          {/* Warm Gold Dome Gradient (#D4AF37) */}
          <linearGradient id={`goldDome-${uid}`} x1="190" y1="155" x2="315" y2="305" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F6D76B" />
            <stop offset="45%" stopColor="#E0B43B" />
            <stop offset="100%" stopColor="#C49322" />
          </linearGradient>

          {/* Fresh Green Awning Center Scallops (#2E7D32) */}
          <linearGradient id={`freshGreenAwning-${uid}`} x1="250" y1="300" x2="250" y2="395" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E8B40" />
            <stop offset="100%" stopColor="#1B682C" />
          </linearGradient>
        </defs>

        {/* 1. Top Shopping Bag Handle */}
        <path
          d="M 168 144
             L 168 114
             C 168 58, 332 58, 332 114
             L 332 144
             L 304 130
             L 304 114
             C 304 78, 196 78, 196 114
             L 196 130
             Z"
          fill={`url(#handleGrad-${uid})`}
        />

        {/* 2. Outer Pointed Mosque Mihrab Arch & Outer Pillars */}
        <path
          d="M 250 92
             C 292 128, 345 150, 376 188
             C 394 210, 402 238, 402 272
             L 402 458
             C 402 468, 394 476, 384 476
             L 366 476
             L 366 388
             C 386 378, 390 352, 376 328
             L 356 292
             L 356 268
             C 356 240, 348 218, 330 200
             C 306 176, 274 160, 250 136
             C 226 160, 194 176, 170 200
             C 152 218, 144 240, 144 268
             L 144 292
             L 124 328
             C 110 352, 114 378, 134 388
             L 134 476
             L 116 476
             C 106 476, 98 468, 98 458
             L 98 272
             C 98 238, 106 210, 124 188
             C 155 150, 208 128, 250 92
             Z"
          fill={`url(#archGrad-${uid})`}
        />

        {/* Inner Bottom Left & Right Store Pillars */}
        <path
          d="M 146 394 L 184 394 L 184 460 C 184 470, 176 476, 166 476 L 146 476 Z"
          fill="#0A3323"
        />
        <path
          d="M 316 394 L 354 394 L 354 476 L 334 476 C 324 476, 316 470, 316 460 Z"
          fill="#0A3323"
        />

        {/* 3. Warm Gold Mosque Dome & Crescent Moon */}
        {/* Crescent Moon */}
        <path
          d="M 252 158
             C 239 158, 229 168, 229 181
             C 229 194, 239 204, 252 204
             C 260 204, 267 200, 271 194
             C 265 197, 259 197, 254 194
             C 244 190, 241 179, 245 169
             C 247 163, 253 159, 260 159
             C 257 158, 255 158, 252 158
             Z"
          fill={`url(#goldDome-${uid})`}
        />
        {/* Dome Finial Base */}
        <path d="M 250 200 L 258 212 L 242 212 Z" fill={`url(#goldDome-${uid})`} />

        {/* Golden Dome */}
        <path
          d="M 250 208
             C 262 228, 294 240, 316 264
             C 326 275, 331 285, 333 292
             L 167 292
             C 169 285, 174 275, 184 264
             C 206 240, 238 228, 250 208
             Z"
          fill={`url(#goldDome-${uid})`}
        />

        {/* 4. Store Awning / Canopy (4 Scallops: Outer Dark Green, Inner Fresh Green) */}
        {/* Left Outer Scallop */}
        <path
          d="M 152 304
             L 196 304
             L 186 360
             C 183 376, 168 386, 152 384
             C 134 382, 124 364, 132 344
             Z"
          fill="#0B3B28"
        />
        {/* Left Center Scallop (Fresh Green) */}
        <path
          d="M 204 304
             L 246 304
             L 246 358
             C 246 374, 233 386, 217 386
             C 201 386, 190 373, 193 357
             Z"
          fill={`url(#freshGreenAwning-${uid})`}
        />
        {/* Right Center Scallop (Fresh Green) */}
        <path
          d="M 254 304
             L 296 304
             L 307 357
             C 310 373, 299 386, 283 386
             C 267 386, 254 374, 254 358
             Z"
          fill={`url(#freshGreenAwning-${uid})`}
        />
        {/* Right Outer Scallop */}
        <path
          d="M 304 304
             L 348 304
             L 368 344
             C 376 364, 366 382, 348 384
             C 332 386, 317 376, 314 360
             Z"
          fill="#0B3B28"
        />
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
          {/* "darda.store" lowercase geometric wordmark with Gold Dot */}
          <div className={`font-brand ${wordmarkSizes} leading-none tracking-tight flex items-baseline`}>
            <span className={`font-extrabold ${dardaColor}`}>darda</span>
            <span className={`font-extrabold ${dotColor}`}>.</span>
            <span className={`font-bold ${storeColor}`}>store</span>
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
        {/* "darda.store" with Gold Dot */}
        <div className={`font-brand ${wordmarkSizes} leading-none tracking-tight flex items-baseline`}>
          <span className={`font-extrabold ${dardaColor}`}>darda</span>
          <span className={`font-extrabold ${dotColor}`}>.</span>
          <span className={`font-bold ${storeColor}`}>store</span>
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
