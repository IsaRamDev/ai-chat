/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        surface: {
          0:  '#0a0a0f',
          1:  '#111118',
          2:  '#18181f',
          3:  '#222230',
          4:  '#2e2e3f',
        },
        border: {
          DEFAULT: '#2e2e3f',
          light:   '#3d3d52',
        },
        accent: {
          DEFAULT: '#7c6af7',
          light:   '#9d8eff',
          dark:    '#6351e0',
          glow:    'rgba(124,106,247,0.15)',
        },
        text: {
          primary:  '#f0eff8',
          secondary:'#9998b3',
          muted:    '#5f5e7a',
        },
        user: {
          bg:   '#1e1b3a',
          border:'#3d3570',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'cursor-blink': 'blink 1s step-end infinite',
        'thinking':   'thinking 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                              to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blink:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        thinking:{ '0%,80%,100%': { transform: 'scale(0.6)', opacity: 0.4 }, '40%': { transform: 'scale(1)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
