/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "spotify-purple": "#4100F5",
        "spotify-green": "#CEF56A",
        "spotify-white": "#E9E2FF",
        "spotify-pure-green": "#1CD760",
        "spotify-black": "#282828",
        "spotify-dark": "#121212",
        "spotify-gray": "#B9B8B8",
      },
      fontFamily: {
        spotifyMixUI: ["SpotifyMixUI", "sans-serif"],
        spotifyMixVariable: ["SpotifyMixVariable", "sans-serif"],
      },
    },
  },
  plugins: [],
};
