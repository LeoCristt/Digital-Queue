import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        secondbackground: 'var(--secondbackground)',
        backgroundHeader: 'var(--backgroundHeader)',
        foreground: 'var(--foreground)',
        foregroundhover: 'var(--foregroundhover)',
        textColor: 'var(--textColor)',
        colorbutton: 'var(--colorbutton)',
        trhirdbackground: 'var(--trhirdbackground)',
        textInput: 'var(--textInput)',
        importantcolorbutton: 'var(--importantcolorbutton)',
        skinsurvivor: 'var(--skinsurvivor)',
        skinlegend: 'var(--skinlegend)',
      },
    },
  },
  plugins: [],
} satisfies Config;
