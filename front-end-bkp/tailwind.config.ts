import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate'

import { themes } from './tailwind.themes';


const config: Config = {
  darkMode: 'class',
  content: [
    '/app/**/*.{js,ts,jsx,tsx,mdx}',
    '/shared/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      inter: ['var(--font-inter)', 'sans-serif'],
      rubik: ['var(--font-rubik)', 'sans-serif'],
      quicksand: ['var(--font-quicksand)', 'sans-serif'],
    },
    extend: {
      height: {
        3.5: '0.875rem',
        15: '3.75rem'
      },
      fontSize: {
        xs: ['0.625rem', { lineHeight: '0.75rem' }],
        sm: ['0.75rem', { lineHeight: '1rem' }],
        base: ['0.875rem', { lineHeight: '1.25rem' }],
        lg: ['1rem', { lineHeight: '1.5rem' }],
        xl: ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.25rem', { lineHeight: '2rem' }],
        '3xl': ['1.5rem', { lineHeight: '2.25rem' }],
        '4xl': ['1.75rem', { lineHeight: '2.5rem' }],
        '5xl': ['2rem', { lineHeight: '3rem' }],
        '6xl': ['2.5rem', { lineHeight: '3.5rem' }],
        '7xl': ['3rem', { lineHeight: '4rem' }],
        '8xl': ['4rem', { lineHeight: '5rem' }],
        '9xl': ['5rem', { lineHeight: '6rem' }]
      },
      animation: {
        backgroundPositionSpin: 'background-position-spin 3000ms infinite alternate',
        'darken-pulse': 'darken-pulse 1.5s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 8s linear infinite',
        jump: 'jump 1.2s linear infinite 0s',
        'jump-1': 'jump 1.2s linear infinite 0.1s',
        'jump-2': 'jump 1.2s linear infinite 0.2s'
      },
      keyframes: {
        'shine-pulse': {
          '0%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
          to: { 'background-position': '0% 0%' }
        },
        'darken-pulse': {
          '0%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(0.7)' },
          '100%': { filter: 'brightness(1)' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        gradient: {
          to: {
            backgroundPosition: 'var(--bg-size) 0'
          }
        },
        jump: {
          '0%': { opacity: '0.2', transform: 'translateY(0)' },
          '33%': { opacity: '0.6', transform: 'translateY(-8px)' },
          '66%': { opacity: '0.2', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [
    themes,
    tailwindcssAnimate
  ]
};

export default config;
