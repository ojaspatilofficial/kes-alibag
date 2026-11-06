import type { TKey } from '../i18n/en';

export const aboutLinks: { key: TKey; to: string; desc: TKey }[] = [
  { key: 'nav.history', to: '/about/history', desc: 'desc.history' },
  { key: 'nav.leadership', to: '/about/leadership', desc: 'desc.leadership' },
  { key: 'nav.board', to: '/about/board', desc: 'desc.board' },
  { key: 'nav.office', to: '/about/office', desc: 'desc.office' },
];

export const publicationLinks: { key: TKey; to: string; desc: TKey }[] = [
  { key: 'nav.vikas', to: '/vikas-magazine', desc: 'desc.vikas' },
  { key: 'nav.competition', to: '/competition', desc: 'desc.competition' },
];
