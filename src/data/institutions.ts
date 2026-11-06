// Every K.E.S. institution currently listed (68 in total).
// Names are kept exactly as given — some spellings are awaiting verification (see CONTENT_TODO.md).
// This file is also read by the Mongo seed (server/startingContent.js) and the sitemap script.
import type { Institution, InstitutionCategory, District } from './types.ts';

type Row = [name: string, town: string, extra?: Partial<Institution>];

const kebab = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const hasJr = (name: string) => /junior college|jr\. college/i.test(name);

const groups: { category: InstitutionCategory; medium: 'English' | 'Marathi' | null; rows: Row[] }[] = [
  {
    category: 'homoeopathic-medical',
    medium: null,
    rows: [
      ['Chandrakant Hari Keluskar Homoeopathic Medical College & Hospital', 'Alibag', { website: 'https://keschkhmca.edu.in/' }],
      [
        'Loknete Adv. Datta Patil Vengurla Homoeopathic Medical College & Hospital',
        'Vengurla',
        { website: 'https://kesladphmc.edu.in/', district: 'Sindhudurg' },
      ],
    ],
  },
  {
    category: 'senior-college',
    medium: null,
    rows: [
      ['Dr. Chintamanrao Deshmukh Commerce & Mrs. Kusumtai Tamhane Arts College', 'Roha', { website: 'https://cddcroha.edu.in/' }],
      ['Anandibai Pradhan Science College', 'Nagothane', { website: 'https://apscnagothane.edu.in/' }],
      ['Laxmi-Shalini Arts, Commerce & Science College', 'Pezari, Tal. Alibag', { website: 'https://lswcpezari.edu.in/' }],
    ],
  },
  {
    category: 'english-secondary',
    medium: 'English',
    rows: [
      ['Adv. Nanda Deshmukh English Medium Secondary School & Jr. College', 'Alibag'],
      ['English Medium Secondary School', 'Pen'],
      ['Dagdusheth Parte English Medium Secondary School & Jr. College', 'Mahad'],
      ['Veena Pandit Tendulkar English Medium Secondary School', 'Roha'],
      ['Indubai A. Wajekar English Medium Secondary School', 'Panvel'],
      ['English Medium Secondary School', 'Pezari'],
    ],
  },
  {
    category: 'english-primary',
    medium: 'English',
    rows: [
      ['Sau. Namita P. Naik English Medium School', 'Alibag'],
      ['Little Angels School', 'Pen'],
      ['Dagdusheth Parte English Medium School', 'Mahad'],
      ['English Medium School', 'Revdanda'],
      ['Govind Raje English Medium School', 'Roha'],
      ['Indubai A. Wajekar English Medium School', 'Panvel'],
      ['English Medium School', 'Pezari'],
    ],
  },
  {
    category: 'marathi-secondary',
    medium: 'Marathi',
    rows: [
      ['Mehendale High School & Junior College', 'Roha'],
      ['Vithoba Khandappa High School & Junior College', 'Panvel'],
      ['Genral Arunkumar Vaidy Vidyalay & Industrial Junior College', 'Alibag'],
      ['Jankibai Raghunath Haldawnekar Kanya Shala & Junior College', 'Alibag'],
      ['Sardar Raobahaddur Tendulkar Vidyalay & Vishwnath Mahadev Pilankar Junior College', 'Revdanda'],
      ['Narayan Nagu Patil High School & Junior College', 'Poynad'],
      ['Gangadhar Dattatrey Ambekar High School & Chandrakant Ganpat Mehata Junior College', 'Birwadi'],
      ['Gulabbai Ramniwas Agrawal Vidyamandir & Late Saremal Pratapmal Jain Junior College', 'Nagothane'],
      ['Vinayak Hari Paranjape Vidyamandir', 'Mahad'],
      ['Keshavaji Viraji Kanya Vidyalaya & Junior College', 'Panvel'],
      ['Late Vasudev Ganesh Ranade High School', 'Thal'],
      ['Medhe Vibhag Engraji Shala', 'Medhe'],
      ['Smt. Bamibai Nana Punkar High School', 'Bhilaji-Borghar'],
      ['Late Sau. Parvatibai Mahadeo Tharval Kanyavidyalaya', 'Mahad'],
      ['Sau. Pushpa Dattatray Patil (Mai) Madhyamik Shala', 'Nehuli-Khandala'],
      ['Loknete Adv. Datta Patil High School', 'Beloshi'],
      ['Rambhau Moreshwar Patil High School', 'Bamangaon (Kavir)'],
      ['Madhyamik Vidyalaya', 'Ghosale'],
      ['Prabhakar Narayan Patil Madhyamik Shala', 'Kurdus'],
      ['Adarsha Madhyamik Vidyamandir', 'Shahapur'],
      ['Madhyamik Vidyamandir', 'Shahabaj'],
      ['Madhyamik Vidyamandir', 'Mankule'],
      ['Narayan Kamalya Gaikar Madhyamik Shala', 'Valke'],
      ['Dr. Prabhakar Ramchandra Gavand Vidyalaya', 'Parali'],
      ['Baliram Gana Thakur Vidyalaya', 'Vadhav'],
      ['Prabhakar Narayan Patil Madhyamik Shala', 'Kalsuri'],
      ['Shri. Gurudatta Madhyamik Vidyalaya', 'Waki (Wadacha Mala)'],
      ['Dattatrey Shivram Jadhav Madhyamik Shala', 'Kharsundi'],
      ['Mahadev Hasha Divekar Vidyamandir', 'Vanade-Josaranjan'],
      ['Late Dhanurdhar Shankar Khopkar Madhyamik Shala', 'Parhur-Paspurpada'],
      ['Madhyamik Shala', 'Kelwane'],
      ['Madhyamik Vidyalay', 'Mandale'],
      ['Murad Hamid Tol Vidyalaya', 'Jasawali'],
      ['Bhausaheb Raut Madhyamik Shala', 'Navgaon'],
      ['Yashwant Raghoji Parab Vidyalaya', 'Vasoli'],
      ['Pragati Madhyamik Vidyalaya', 'Kalamb'],
      ['Madhyamik Shala', 'Majgaon'],
      ['Shankar Shivram Patil Madhyamik Vidyalaya', 'Apta'],
      ['Madhyamik Vidyalaya', 'Somatane'],
      ['Madhyamik Shala', 'Dahigaon-Jamghar'],
    ],
  },
  {
    category: 'marathi-primary',
    medium: 'Marathi',
    rows: [
      ['Datusheth Patil Prathamik Shala', 'Panvel'],
      ['Jagdish Shah Prathamik Shala', 'Alibag'],
      ['Phirojbai Bariya Prathamik Shala', 'Pezari'],
      ['Vaman Gopal Gadgil Prathamik Shala', 'Mahad'],
      ['Jainudin Ahmadmiya Mukadam Prathamik Shala', 'Revdanda'],
      ['Prathamik Shala', 'Thal'],
      ['Madhukar Sitaram Gangal Prathamik Shala', 'Roha'],
      ['Amarchandra Jaithamal Jain Prathamik Shala', 'Nagothane'],
      ['Anat Narayan Kotibhaskar Prathamik Shala', 'Birwadi'],
      ['Prathamik Shala', 'Shahabaj'],
    ],
  },
];

const used = new Set<string>();
let order = 0;

export const institutions: Institution[] = groups.flatMap(({ category, medium, rows }) =>
  rows.map(([name, town, extra = {}]) => {
    let slug = kebab(`${name} ${town.split(',')[0]}`);
    while (used.has(slug)) slug += '-2';
    used.add(slug);
    order += 1;
    return {
      slug,
      name,
      town,
      district: 'Raigad' as District,
      category,
      medium,
      hasJuniorCollege: hasJr(name),
      website: '',
      logo: '',
      phone: '',
      email: '',
      principal: '',
      established: null,
      order,
      ...extra,
    };
  })
);
