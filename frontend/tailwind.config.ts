import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: 'var(--main)',
        background: 'var(--background)',
        'secondary-background': 'var(--secondary-background)',
        foreground: 'var(--foreground)',
        'main-foreground': 'var(--main-foreground)',
        border: 'var(--border)',
        overlay: 'var(--overlay)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      spacing: {
        'box-shadow-x': '2px',
        'box-shadow-y': '2px',
        'reverse-box-shadow-x': '-2px',
        'reverse-box-shadow-y': '-2px',
      },
      borderRadius: {
        base: '5px',
      },
      boxShadow: {
        shadow: '2px 2px 0px 0px var(--border)',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'sans-serif'],
        heading: ['var(--font-quicksand)', 'sans-serif'],
        base: ['var(--font-be-vietnam-pro)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

