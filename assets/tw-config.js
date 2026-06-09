/* Tema compartilhado (cores/fontes da marca) — usado pelas páginas de blog.
   Carregar SEMPRE depois do script do Tailwind CDN. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: '#0B1521',
        foreground: '#F4F0E8',
        brand: { DEFAULT: '#D8AE54', foreground: '#0B1521' },
        accent: { DEFAULT: '#B85433', foreground: '#F4F0E8' },
        card: { DEFAULT: '#122236', foreground: '#F4F0E8' },
        muted: { DEFAULT: '#16263A', foreground: '#9AA3B2' },
        secondary: { DEFAULT: '#272B33', foreground: '#F4F0E8' },
        border: '#243345',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #D4AE5B 0%, #C9A24B 100%)',
        'card-gradient': 'linear-gradient(160deg, #16283E 0%, #0E1B2C 100%)',
      },
      boxShadow: {
        'brand': '0 10px 26px -14px rgba(216,174,84,.24)',
        'card-soft': '0 24px 60px -24px rgba(0,0,0,.65)',
      },
    },
  },
};
