/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cositimes: ["CosiTimes", "serif"],
        maru: ["GT Maru", "san-serif"],
        maruMega: ["GT Maru Mega", "sans-serif"],
        sectraDisplay: ['GT Sectra Display', 'serif'],
        sectra: ['GT Sectra Fine', 'serif'],
        tabi: ['Tabi', 'serif'],
        wulkan: ['Wulkan Display', 'serif']
      }
    },
  },
  plugins: [],
}
