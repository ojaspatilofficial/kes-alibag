import type { InstitutionCategory } from './types.ts';

export interface CategoryInfo {
  key: InstitutionCategory;
  label: string;
  short: string;
  description: string;
  /** Badge accent colour group (tailwind `cat-*`). */
  tone: 'medical' | 'senior' | 'secondary' | 'primary';
}

export const categories: CategoryInfo[] = [
  {
    key: 'homoeopathic-medical',
    label: 'Homoeopathic Medical Colleges',
    short: 'Homoeopathic Medical',
    description: 'Homoeopathic medical colleges with attached hospitals at Alibag and Vengurla.',
    tone: 'medical',
  },
  {
    key: 'senior-college',
    label: 'Senior Colleges',
    short: 'Senior Colleges',
    description: 'Arts, Commerce and Science degree colleges at Roha, Nagothane and Pezari.',
    tone: 'senior',
  },
  {
    key: 'english-secondary',
    label: 'English Medium Secondary Schools & Jr. Colleges',
    short: 'English Secondary',
    description: 'English-medium secondary schools, some with junior colleges.',
    tone: 'secondary',
  },
  {
    key: 'english-primary',
    label: 'English Medium Primary Schools',
    short: 'English Primary',
    description: 'English-medium primary schools in Alibag, Pen, Mahad, Revdanda, Roha, Panvel and Pezari.',
    tone: 'primary',
  },
  {
    key: 'marathi-secondary',
    label: 'Marathi Medium Secondary Schools & Jr. Colleges',
    short: 'Marathi Secondary',
    description: 'The Society’s founding tradition — Marathi-medium high schools across Raigad, many with junior colleges.',
    tone: 'secondary',
  },
  {
    key: 'marathi-primary',
    label: 'Marathi Medium Primary Schools',
    short: 'Marathi Primary',
    description: 'Marathi-medium primary schools (prathamik shala) for the youngest learners.',
    tone: 'primary',
  },
];

export const categoryByKey = (key?: string) => categories.find((c) => c.key === key);
