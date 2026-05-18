/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'app-gradient':
          'radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(236,72,153,0.18), transparent 60%), linear-gradient(180deg, #0b1020 0%, #0a0f1f 100%)',
        'app-gradient-light':
          'radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(236,72,153,0.14), transparent 60%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      },
    },
  },
  plugins: [],
};
