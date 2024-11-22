import type { Config } from "tailwindcss";
import daisyui from 'daisyui';
import typoraphy from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
    screens: {
      "xsm": "512px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    }
  },
  plugins: [
    typoraphy,
    daisyui,
  ],
} satisfies Config;
