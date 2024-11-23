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
      typography: {
        white: {
          css: {
            color: '#ffffff',
            'h1, h2, h3, h4, h5, h6': {
              color: '#ffffff',
            },
            a: {
              color: '#ffffff',
              '&:hover': {
                color: '#ffffff', // Optional: Keep links white on hover
              },
            },
            strong: {
              color: '#ffffff',
            },
            p: {
              color: '#ffffff',
            },
            li: {
              color: '#ffffff',
            },
            ol: {
              color: '#ffffff',
            },
            ul: {
              color: '#ffffff',
            },
            blockquote: {
              color: '#ffffff',
            },
            code: {
              color: '#ffffff',
            },
            pre: {
              color: '#ffffff',
              backgroundColor: '#000000',
            },
            "li::marker": {
              color: '#ffffff',
            },
          },
        },
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
