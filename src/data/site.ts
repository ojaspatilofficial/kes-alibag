// Verified Society facts. Do not add anything that has not been confirmed by K.E.S.
// Also read by the Mongo seed (server/startingContent.js).
import type { BoardMember, DocumentItem, GalleryItem, Leader, NoticeItem, SiteSettings, TimelineItem } from './types.ts';

export const identity = {
  name: 'Konkan Education Society',
  shortName: 'K.E.S.',
  place: 'Alibag',
  nameMr: 'कोकण एज्युकेशन सोसायटी, अलिबाग',
  founded: 1917,
  brandLine: 'Lighting the lamp of knowledge across the Konkan since 1917.',
  motto: '॥ कुर्वन् कर्म सुखं दुःखं गणयेन्नात्मवान्नरः ॥',
  mottoGlossMr: 'मनस्वी कार्यार्थी व्यक्तिने कार्य करीत असताना सुख दुःखाची पर्वा करू नये',
  mottoMeaning: 'A determined person at work does not count pleasure or pain.',
  flagMotto: 'प्रज्वालितो ज्ञानमयः प्रदीपः',
  flagMeaning: 'The lamp of knowledge has been lit.',
  award: 'Adarsh Shikshan Sanstha Award',
  awardGloss: 'Model Educational Institution',
  awardBy: 'Government of Maharashtra',
  awardYear: 2002,
  districts: ['Raigad', 'Thane', 'Sindhudurg'],
};

/** Stats band — only these four (§4.2). */
export const stats = [
  { value: '1917', label: 'Established', sub: 'Kulaba Students Association' },
  { value: '100+', label: 'Institutions', sub: 'Schools & colleges' },
  { value: '3', label: 'Districts', sub: 'Raigad · Thane · Sindhudurg' },
  { value: '2002', label: 'Adarsh Shikshan Sanstha', sub: 'Award, Govt. of Maharashtra' },
];

export const founders = [
  'Shri Vasudev Ganesh Ranade',
  'Shri Keshav Ravaji Athavale',
  'Shri Ganesh Damodar Tillu',
  'Shri Sitaram Vinayak Ghate',
  'Shri Narayan Nagu Patil of Pezari (Kharepat Vibhag)',
];

/** The Society's story, rewritten from the old About section. Each string is a paragraph. */
export const history = {
  intro:
    'Konkan Education Society is a pioneering society that has brought education to the rural people of the Konkan for more than a hundred years.',
  origins: [
    'K.E.S. was born before Independence, at a time when missionary convent schools dominated education. Inspired by Lokmanya Tilak’s call for a national system of education rooted in Indian culture, social leaders of the then Kulaba (now Raigad) district founded the Kulaba Students Association — which later became the Konkan Education Society.',
    'Its prominent founding members were Shri Vasudev Ganesh Ranade, Shri Keshav Ravaji Athavale, Shri Ganesh Damodar Tillu and Shri Sitaram Vinayak Ghate, along with Shri Narayan Nagu Patil of Pezari (Kharepat Vibhag). After matriculation and a trained-teacher’s degree, Shri Narayan Nagu Patil declined government service to teach in K.E.S. schools, and stayed attached to the Society even after retirement.',
  ],
  growth: [
    'From 1917 to 1977 the Society worked mainly through secondary Marathi-medium schools in the Alibag, Mahad, Roha and Panvel talukas.',
    'Its golden era began in 1977, when Adv. Datta Patil (Dada) — MLA and much-loved Leader of the Opposition in the Maharashtra Assembly — and his brother Hon. Prabhakar Patil (Bhau), President of Raigad Zilla Parishad, took charge through a democratic election. The number of schools grew from 24 in 1977 to more than 100.',
    'Today K.E.S. runs Marathi- and English-medium schools, junior and senior colleges, and homoeopathic medical colleges in Raigad, Thane and Sindhudurg districts.',
  ],
  today: [
    'Since September 2011, Dada’s legacy has been carried forward by Shri Sanjaybhai Patil, ably assisted by Shri Ajitbhai Shah, funding modern infrastructure for even the remotest school.',
    'Through administrative, financial and legal challenges, the Society has never compromised its first principle:',
  ],
  principle: 'to bring education to the poorest and least-reached members of society.',
};

export const timeline: TimelineItem[] = [
  {
    date_label: '1 Jan 1917',
    sort_year: 1917.0,
    title: 'Kulaba Students Association founded',
    description: 'Founded by social leaders of Kulaba (Colaba) district to bring education to rural areas.',
    highlight: true,
  },
  { date_label: '14 Nov 1917', sort_year: 1917.8, title: 'First school opens at Roha', description: 'The Association’s first school begins classes at Roha.' },
  {
    date_label: '26 May 1918',
    sort_year: 1918.4,
    title: 'Renamed Konkan Education Society',
    description: 'The Kulaba Students Association becomes the Konkan Education Society.',
  },
  {
    date_label: '1917–1977',
    sort_year: 1930,
    title: 'The lamp is lit across the Konkan',
    description: 'Schools open in Panvel, Alibag, Revdanda, Mahad, Roha and beyond — mainly secondary Marathi-medium schools.',
  },
  { date_label: '18 Dec 1944', sort_year: 1944.95, title: 'Silver Jubilee year celebrated', description: 'The Society celebrates its Silver Jubilee year.' },
  {
    date_label: '1977',
    sort_year: 1977,
    title: 'The golden era begins',
    description:
      'Adv. Datta Patil (Dada) becomes Chairman, with his brother Hon. Prabhakar Patil (Bhau). The Society grows from 24 schools to more than 100.',
    image_url: '/images/history/foundation-plaque-dignitaries',
    highlight: true,
  },
  {
    date_label: '2002',
    sort_year: 2002,
    title: 'Adarsh Shikshan Sanstha Award',
    description: 'The Government of Maharashtra confers the Adarsh Shikshan Sanstha (Model Educational Institution) Award.',
    highlight: true,
  },
  {
    date_label: 'Sept 2011',
    sort_year: 2011.7,
    title: 'The legacy carried forward',
    description: 'Shri Sanjaybhai Patil carries Dada’s legacy forward, ably assisted by Shri Ajitbhai Shah.',
  },
  { date_label: '2017', sort_year: 2017, title: 'Centenary celebrated', description: 'The Society’s centenary is celebrated at Alibag in a grand function.', highlight: true },
];

export const archivePhotos = [
  {
    src: '/images/history/ribbon-cutting-inauguration',
    alt: 'Archive photograph: a ribbon-cutting ceremony at the inauguration of a K.E.S. school',
    caption: 'Inauguration of a school building',
  },
  {
    src: '/images/history/foundation-plaque-dignitaries',
    alt: 'Archive photograph: dignitaries beside a garlanded Marathi foundation plaque',
    caption: 'Dignitaries at a foundation plaque',
  },
  {
    src: '/images/history/english-medium-school-bhoomi-pujan',
    alt: 'Archive photograph: Bhoomi Pujan ceremony for an English-medium school',
    caption: 'Bhoomi Pujan of an English-medium school',
  },
  {
    src: '/images/history/leaders-address-gathering',
    alt: 'Archive photograph: a leader addressing a gathering from a podium',
    caption: 'A leader addresses a gathering',
  },
  {
    src: '/images/history/prathamik-shala-bhoomi-pujan',
    alt: 'Archive photograph: Bhoomi Pujan of Jainudin Ahmadmiya Mukadam Prathamik Shala',
    caption: 'Bhoomi Pujan of Jainudin Ahmadmiya Mukadam Prathamik Shala',
  },
];

export const leaders: Leader[] = [
  {
    name: 'Loknete Adv. Datta Patil (Dada)',
    label: 'Our Inspiration',
    line: 'Chairman from 1977; led K.E.S. from 24 to 100+ schools. MLA and Leader of the Opposition in the Maharashtra Assembly.',
    photo_url: '/images/leaders/loknete-adv-datta-patil-dada',
    order: 1,
  },
  {
    name: 'Late Hon. Prabhakar Patil (Bhau)',
    label: 'Our Reverence',
    line: 'President, Raigad Zilla Parishad; partner in the 1977 renewal of the Society.',
    photo_url: '/images/leaders/prabhakar-patil-bhau',
    order: 2,
  },
  {
    name: 'Hon. Sanjay Datta Patil',
    label: 'Our Inspiration',
    line: 'Director, Board of Directors.',
    photo_url: '/images/leaders/sanjay-datta-patil',
    order: 3,
  },
  {
    name: 'Hon. Adv. Siddharth Patil',
    label: 'Youth Guidance',
    line: 'President, Konkan Education Society.',
    photo_url: '/images/leaders/adv-siddharth-patil',
    order: 4,
  },
];

export const board: BoardMember[] = [
  { name: 'Hon. Adv. Siddharth Patil', role: 'President', group: 'office-bearer', photo_url: '/images/board/adv-siddharth-patil-president', order: 1 },
  { name: 'Hon. Rajiv Mali', role: 'Vice-President', group: 'office-bearer', photo_url: '/images/board/rajiv-mali-vice-president', order: 2 },
  { name: 'Hon. Adv. Pallavi Patil', role: 'Secretary', group: 'office-bearer', photo_url: '/images/board/adv-pallavi-patil-secretary', order: 3 },
  { name: 'Hon. Sanjay Datta Patil', role: 'Director', group: 'director', photo_url: '/images/board/sanjay-datta-patil-director', order: 4 },
  { name: 'Hon. Subhash Patil (M.L.A.)', role: 'Director', group: 'director', photo_url: '/images/board/subhash-patil-mla-director', order: 5 },
  { name: 'Hon. Adv. Hemant Gangal', role: 'Director', group: 'director', photo_url: '/images/board/adv-hemant-gangal-director', order: 6 },
  { name: 'Hon. Dilip Parte', role: 'Director', group: 'director', photo_url: '/images/board/dilip-parte-director', order: 7 },
  { name: 'Hon. Vinayak Khopkar', role: 'Chief Executive Officer', group: 'administration', photo_url: '/images/board/vinayak-khopkar-ceo', order: 8 },
  { name: 'Hon. Anita Patil', role: 'Additional C.E.O.', group: 'administration', photo_url: '/images/board/anita-patil-addl-ceo', order: 9 },
];

const years = (from: number, to: number) => {
  const list: string[] = [];
  for (let y = to; y >= from; y--) list.push(`${y}-${String((y + 1) % 100).padStart(2, '0')}`);
  return list;
};

/** Document slots. Only those with a file are shown publicly; the admin uploads into the empty ones. */
export const documents: DocumentItem[] = [
  ...years(2020, 2024).map((year) => ({ type: 'ssc-result' as const, year, title: `SSC Results ${year}`, file_url: '' })),
  ...years(2020, 2024).map((year) => ({ type: 'hsc-result' as const, year, title: `HSC Results ${year}`, file_url: '' })),
  ...years(2014, 2024).map((year) => ({
    type: 'competition' as const,
    year,
    title: `The Ceremony of Glory ${year}`,
    file_url: '',
  })),
  ...years(2020, 2024).map((year) => ({ type: 'magazine' as const, year, title: `Vikas ${year}`, file_url: '', cover_image: '' })),
  {
    type: 'form',
    year: '',
    title: 'SSC & HSC Result Blank Form',
    file_url: '/documents/ssc-hsc-result-blank-form.pdf',
    file_name: 'ssc-hsc-result-blank-form.pdf',
    file_size: '28 KB',
  },
  { type: 'form', year: '', title: 'Application Form for Unaided Schools', file_url: '' },
];

export const notices: NoticeItem[] = [];

export const gallery: GalleryItem[] = [
  ...archivePhotos.map((p, i) => ({
    title: p.caption,
    album: 'From the K.E.S. archive',
    image_url: p.src,
    description: p.alt,
    is_archive: true,
    order: i + 1,
  })),
  {
    title: 'Loknete Adv. Datta Patil Sankul',
    album: 'Our identity',
    image_url: '/images/about/datta-patil-sankul-admin-office',
    description: 'The Administrative Office & Training Center of the Society at Alibag.',
    order: 10,
  },
  {
    title: 'The K.E.S. emblem',
    album: 'Our identity',
    image_url: '/images/brand/kes-emblem',
    description: 'Lotus ring, golden samai with four flames, and the Sanskrit motto.',
    order: 11,
  },
  {
    title: 'The K.E.S. torch flag',
    album: 'Our identity',
    image_url: '/images/brand/kes-torch-flag',
    description: 'प्रज्वालितो ज्ञानमयः प्रदीपः — the lamp of knowledge has been lit.',
    order: 12,
  },
];

export const defaultSettings: SiteSettings = {
  org_name: 'Konkan Education Society, Alibag',
  org_name_mr: 'कोकण एज्युकेशन सोसायटी, अलिबाग',
  head_office: 'Administrative Office & Training Center, Loknete Adv. Datta Patil Sankul',
  street_address: '',
  city_line: 'Alibag, Raigad, Maharashtra 402 201',
  phone: '(02141) 222105',
  phone_alt: '+91 85528 12138',
  email: 'kesalibag@gmail.com',
  office_hours: '',
  registration: 'P.T.R. No. F-7 (K) · Reg. No. 218',
  map_query: 'Konkan Education Society, Alibag',
  show_extended_stats: false,
  stat_institutions: '102',
  stat_students: '51,253',
  stat_staff: '2,029',
  social_facebook: '',
  social_youtube: '',
  social_instagram: '',
  social_x: '',
  announcement: '',
};
