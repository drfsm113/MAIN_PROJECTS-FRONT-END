// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'phone': '320px',    // Extra small devices (phones in portrait mode)
        'sm': '480px',       // Small devices (phones in landscape mode)
        'md': '768px',       // Medium devices (tablets)
        'lg': '1024px',      // Large devices (small desktops)
        'xl': '1280px',      // Extra-large devices (desktops)
        '2xl': '1536px',     // 2X extra-large devices (large desktops)
        '3xl': '1920px',     // Extra extra-large devices (large screens)
        '4xl': '2560px',     // Ultra-wide screens
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
        background: 'var(--background-color)',
        text: {
          DEFAULT: 'var(--text-color)',
          light: 'var(--text-light)',
          muted: 'var(--text-muted)',
        },
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
        border: 'var(--border-color)',
        shadow: 'var(--shadow-color)',

      },
      fontFamily: {
        sans: ['var(--font-family-sans)', 'sans-serif'],
        serif: ['var(--font-family-serif)', 'serif'],
        mono: ['var(--font-family-mono)', 'monospace'],
      },
      transitionProperty: {
        'transform': 'transform',
        'opacity': 'opacity',
      },
      aspectRatio: {
        'w-16': '16',
        'h-9': '9',
      },
      boxShadow: {
        'elevation-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'elevation-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevation-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'elevation-xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        'elevation-2xl': '0 25px 50px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}