// Describes every editable section of the website for the admin dashboard.
// Each section lists the fields the admin fills in; the dashboard builds the forms from this.
import { Bell, Building2, FileText, Image as ImageIcon, Landmark, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { todayISO } from '../lib/api';
import { categories, categoryByKey } from '../data/categories';
import { imageUrl } from '../brand/images';

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'email' | 'url' | 'select' | 'checkbox' | 'image' | 'file';

export interface Option {
  value: string;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: Option[];
  half?: boolean;
  /** For `file` fields: other fields to fill in automatically after uploading. */
  fileNameField?: string;
  fileSizeField?: string;
  accept?: string;
}

export type Item = Record<string, unknown> & { id?: string };

export interface Section {
  key: string;
  label: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  publicPath: string;
  fields: Field[];
  defaults: () => Item;
  /** Tidy values before saving (e.g. make a slug). */
  prepare?: (item: Item) => Item;
  /** Optional filter chips above the list. */
  filter?: { field: string; options: Option[] };
  display: {
    title: (item: Item) => string;
    subtitle?: (item: Item) => string;
    image?: (item: Item) => string | undefined;
    badges?: (item: Item) => string[];
    warning?: (item: Item) => string | undefined;
  };
  grid?: boolean;
}

const s = (v: unknown) => (v == null ? '' : String(v));
const opts = (...values: string[]) => values.map((v) => ({ value: v, label: v }));
const kebab = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const docTypes: Option[] = [
  { value: 'ssc-result', label: 'SSC result' },
  { value: 'hsc-result', label: 'HSC result' },
  { value: 'competition', label: 'Ceremony of Glory (competition)' },
  { value: 'magazine', label: 'Vikas Magazine' },
  { value: 'form', label: 'Form / download' },
];

export const sections: Section[] = [
  {
    key: 'institutions',
    label: 'Institutions',
    singular: 'institution',
    description: 'Every K.E.S. school and college. Add the website, contact details or principal when you have them — empty fields are hidden on the website.',
    icon: Building2,
    publicPath: '/institutions',
    filter: { field: 'category', options: categories.map((c) => ({ value: c.key, label: c.short })) },
    fields: [
      { name: 'name', label: 'Name of the institution', type: 'text', required: true, help: 'Without the town — the town goes in its own box.' },
      { name: 'town', label: 'Town / village', type: 'text', required: true, half: true },
      { name: 'district', label: 'District', type: 'select', options: opts('Raigad', 'Thane', 'Sindhudurg'), half: true },
      { name: 'category', label: 'Type', type: 'select', required: true, options: categories.map((c) => ({ value: c.key, label: c.label })), half: true },
      { name: 'medium', label: 'Medium', type: 'select', options: [{ value: '', label: 'Not applicable (colleges)' }, ...opts('English', 'Marathi')], half: true },
      { name: 'hasJuniorCollege', label: 'Has a junior college', type: 'checkbox', half: true },
      { name: 'isJrh', label: 'This is Smt. J.R.H. Kanyashala (website comes from Settings)', type: 'checkbox', half: true },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://', help: 'When filled in, the card shows “Visit website”.' },
      { name: 'principal', label: 'Principal', type: 'text', half: true },
      { name: 'established', label: 'Year established', type: 'number', half: true },
      { name: 'phone', label: 'Phone', type: 'text', half: true },
      { name: 'email', label: 'Email', type: 'email', half: true },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'slug', label: 'Web address name (slug)', type: 'text', half: true, help: 'Made automatically from the name if left empty.' },
      { name: 'order', label: 'Order in lists', type: 'number', half: true },
    ],
    defaults: () => ({ name: '', town: '', district: 'Raigad', category: 'marathi-secondary', medium: 'Marathi', hasJuniorCollege: false, isJrh: false, website: '', slug: '', order: 1000 }),
    prepare: (i) => ({
      ...i,
      slug: s(i.slug).trim() || kebab(`${s(i.name)} ${s(i.town).split(',')[0]}`),
      medium: i.medium ? i.medium : null,
      established: i.established === '' || i.established == null ? null : Number(i.established),
    }),
    display: {
      title: (i) => s(i.name),
      subtitle: (i) => `${s(i.town)} · ${s(i.district)} · ${categoryByKey(s(i.category))?.short || ''}`,
      badges: (i) => [i.website ? 'Website' : '', i.hasJuniorCollege ? 'Jr. College' : ''].filter(Boolean),
    },
  },
  {
    key: 'documents',
    label: 'Results & Publications',
    singular: 'document',
    description:
      'SSC/HSC results, Ceremony of Glory files, Vikas Magazine issues and forms. Only documents with a file are shown on the website — open an empty slot and upload its PDF.',
    icon: FileText,
    publicPath: '/results',
    filter: { field: 'type', options: docTypes },
    fields: [
      { name: 'type', label: 'Kind of document', type: 'select', required: true, options: docTypes, half: true },
      { name: 'year', label: 'Academic / publication year', type: 'text', placeholder: 'e.g. 2025-26', half: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'file_url', label: 'File (PDF or image)', type: 'file', accept: '.pdf,image/jpeg,image/png,image/webp', fileNameField: 'file_name', fileSizeField: 'file_size' },
      { name: 'cover_image', label: 'Magazine cover (Vikas only)', type: 'image', help: 'Optional. Without it, a cover with the emblem and year is shown.' },
    ],
    defaults: () => ({ type: 'ssc-result', year: '', title: '', file_url: '' }),
    display: {
      title: (i) => s(i.title),
      subtitle: (i) => [docTypes.find((d) => d.value === i.type)?.label, s(i.year), s(i.file_size)].filter(Boolean).join(' · '),
      warning: (i) => (i.file_url ? undefined : 'No file yet — hidden on the website'),
    },
  },
  {
    key: 'notices',
    label: 'Notices',
    singular: 'notice',
    description: 'Society-wide notices and circulars. They appear on the Notices page, newest first.',
    icon: Bell,
    publicPath: '/notices',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: opts('Circular', 'Announcement', 'Event', 'Examination', 'Admission'), half: true },
      { name: 'publish_date', label: 'Date', type: 'date', half: true },
      { name: 'description', label: 'Details', type: 'textarea' },
      { name: 'attachment_url', label: 'Attachment (optional)', type: 'file', accept: '.pdf,image/jpeg,image/png,image/webp', fileNameField: 'attachment_name' },
      { name: 'is_pinned', label: 'Pin to the top', type: 'checkbox' },
    ],
    defaults: () => ({ title: '', category: 'Circular', publish_date: todayISO(), description: '', attachment_url: '', is_pinned: false }),
    display: {
      title: (i) => s(i.title),
      subtitle: (i) => `${s(i.category)} · ${s(i.publish_date)}`,
      badges: (i) => (i.is_pinned ? ['Pinned'] : []),
    },
  },
  {
    key: 'boardMembers',
    label: 'Board of Directors',
    singular: 'board member',
    description: 'Office-bearers, directors and executive officers shown on the Board page (and the first three on the Home page).',
    icon: Users,
    publicPath: '/about/board',
    fields: [
      { name: 'photo_url', label: 'Portrait (4:5, e.g. 400×500)', type: 'image' },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true, half: true, placeholder: 'e.g. Director' },
      {
        name: 'group',
        label: 'Group',
        type: 'select',
        half: true,
        options: [
          { value: 'office-bearer', label: 'Office-bearer (top row)' },
          { value: 'director', label: 'Director' },
          { value: 'administration', label: 'Administration' },
        ],
      },
      { name: 'order', label: 'Order', type: 'number', half: true },
    ],
    defaults: () => ({ name: '', role: 'Director', group: 'director', photo_url: '', order: 100 }),
    display: { title: (i) => s(i.name), subtitle: (i) => s(i.role), image: (i) => imageUrl(s(i.photo_url)) },
  },
  {
    key: 'leaders',
    label: 'Our Inspiration',
    singular: 'leader',
    description: 'The leaders shown on the Our Inspiration page and the Home page.',
    icon: Sparkles,
    publicPath: '/about/leadership',
    fields: [
      { name: 'photo_url', label: 'Portrait', type: 'image' },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'label', label: 'Label', type: 'text', half: true, placeholder: 'e.g. Our Inspiration' },
      { name: 'order', label: 'Order', type: 'number', half: true },
      { name: 'line', label: 'One factual line', type: 'textarea' },
    ],
    defaults: () => ({ name: '', label: 'Our Inspiration', line: '', photo_url: '', order: 100 }),
    display: { title: (i) => s(i.name), subtitle: (i) => s(i.label), image: (i) => imageUrl(s(i.photo_url)) },
  },
  {
    key: 'timeline',
    label: 'History Timeline',
    singular: 'milestone',
    description: 'Milestones on the History page. The ones marked “highlight” also appear on the Home page.',
    icon: Landmark,
    publicPath: '/about/history',
    fields: [
      { name: 'date_label', label: 'Date as shown', type: 'text', required: true, half: true, placeholder: 'e.g. 14 Nov 1917' },
      { name: 'sort_year', label: 'Year (for ordering)', type: 'number', required: true, half: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image_url', label: 'Photo (optional)', type: 'image' },
      { name: 'highlight', label: 'Highlight (show on Home page)', type: 'checkbox' },
    ],
    defaults: () => ({ date_label: '', sort_year: new Date().getFullYear(), title: '', description: '', image_url: '', highlight: false }),
    display: { title: (i) => `${s(i.date_label)} — ${s(i.title)}`, subtitle: (i) => s(i.description), badges: (i) => (i.highlight ? ['Home page'] : []) },
  },
  {
    key: 'gallery',
    label: 'Gallery',
    singular: 'photo',
    description: 'Photos on the Gallery page, grouped into albums. Use the same album name to group photos together.',
    icon: ImageIcon,
    publicPath: '/gallery',
    grid: true,
    fields: [
      { name: 'image_url', label: 'Photo', type: 'image', required: true },
      { name: 'title', label: 'Caption', type: 'text', required: true },
      { name: 'album', label: 'Album', type: 'text', half: true, placeholder: 'e.g. Centenary 2017' },
      { name: 'order', label: 'Order', type: 'number', half: true },
      { name: 'description', label: 'Description (also used as alt text)', type: 'textarea' },
      { name: 'is_archive', label: 'Old archive photograph (show with sepia “archive” treatment)', type: 'checkbox' },
    ],
    defaults: () => ({ title: '', album: '', image_url: '', description: '', is_archive: false, order: 100 }),
    display: { title: (i) => s(i.title), subtitle: (i) => s(i.album), image: (i) => imageUrl(s(i.image_url)) },
  },
];

export const sectionByKey = (key?: string) => sections.find((sec) => sec.key === key);
