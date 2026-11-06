import { BookOpen, GraduationCap, Pencil, School, Shapes, Stethoscope, type LucideIcon } from 'lucide-react';
import type { CategoryInfo } from '../../data/categories';
import type { Institution, InstitutionCategory } from '../../data/types';

export const categoryIcons: Record<InstitutionCategory, LucideIcon> = {
  'homoeopathic-medical': Stethoscope,
  'senior-college': GraduationCap,
  'english-secondary': BookOpen,
  'english-primary': Pencil,
  'marathi-secondary': School,
  'marathi-primary': Shapes,
};

/** Text + tint classes for each category tone (small badges and icons only). */
export const toneClasses: Record<CategoryInfo['tone'], { text: string; bg: string; bar: string; border: string }> = {
  medical: { text: 'text-cat-medical', bg: 'bg-cat-medical/10', bar: 'bg-cat-medical', border: 'border-cat-medical/30' },
  senior: { text: 'text-cat-senior', bg: 'bg-cat-senior/10', bar: 'bg-cat-senior', border: 'border-cat-senior/30' },
  secondary: { text: 'text-cat-secondary', bg: 'bg-cat-secondary/10', bar: 'bg-cat-secondary', border: 'border-cat-secondary/30' },
  primary: { text: 'text-gold-800', bg: 'bg-cat-primary/10', bar: 'bg-cat-primary', border: 'border-cat-primary/30' },
};

export const profilePath = (i: Institution) => `/institutions/${i.category}/${i.slug}`;
