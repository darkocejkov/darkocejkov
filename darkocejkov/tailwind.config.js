/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // cositimes: ["CosiTimes", "serif"],
        // maruMega: ["GT Maru Mega", "sans-serif"],
        // wulkan: ['Wulkan Display', 'serif'],
        // sectraDisplay: ['GT Sectra Display', 'serif'],
        // sectra: ['GT Sectra Fine', 'serif'],

        tabi: ['Tabi', 'serif'],
        maru: ["GT Maru", "san-serif"],
        rubik: ['Rubik', 'sans-serif'],
        aeonik: ['Aeonik TRIAL', 'sans-serif'],
        fira: ['Fira Code', 'sans-serif'],
        unique: ['Unique'],
        kica: ['Kica'],
        kiosk: ['Kiosk'],
        mazaeni: ['Mazaeni'],
        monopol: ['Monopol'],
        nineties: ['Nineties Display'],
      }
    },
  },
}
