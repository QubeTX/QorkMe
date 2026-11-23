import { defineConfig } from 'blume';

const makira = {
  name: 'Makira',
  variants: [
    { src: '../public/fonts/Makira-Regular.woff2', weight: 400 },
    { src: '../public/fonts/Makira-Medium.woff2', weight: 500 },
    { src: '../public/fonts/Makira-SemiBold.woff2', weight: 600 },
    { src: '../public/fonts/Makira-Bold.woff2', weight: 700 },
    { src: '../public/fonts/Makira-Black.woff2', weight: 900 },
  ],
};

export default defineConfig({
  title: 'QorkMe CLI',
  description: 'Install qork and shorten links from your terminal or the QorkMe API.',
  content: { root: 'content' },
  deployment: { site: 'https://qork.me', base: '/install' },
  logo: { text: 'QORK.ME', href: '../' },
  theme: {
    accent: '#1757e8',
    background: '#f6f4ef',
    mode: 'light',
    toggle: false,
    radius: 'md',
    fonts: {
      display: makira,
      body: makira,
      mono: { name: 'Paper Mono', variants: [{ src: '../public/fonts/PaperMono-Variable.woff2' }] },
    },
  },
  markdown: { code: { wrap: true } },
  navigation: {
    actions: [{ label: 'AI & API guide', href: '../llms.txt' }],
  },
  ai: { openInChat: false },
  feedback: false,
  footer: {
    links: [{ label: 'A QubeTX property', href: 'https://www.qubetx.com' }],
  },
});
