/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#f5f7f2',
        ink: '#173127',
        accent: '#2f9d79',
        chaos: '#d47c57',
        plum: '#8a4fa6',
        smoke: '#75827a',
      },
      boxShadow: {
        cloud: '0 24px 80px rgba(20, 48, 37, 0.08)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        drift: 'drift 4s ease-in-out infinite',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
