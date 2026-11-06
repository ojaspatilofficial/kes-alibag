// Shared content types. Used by the public site, the admin dashboard and the Mongo seed.

export type InstitutionCategory =
  | 'homoeopathic-medical'
  | 'senior-college'
  | 'english-secondary'
  | 'english-primary'
  | 'marathi-secondary'
  | 'marathi-primary';

export type District = 'Raigad' | 'Sindhudurg' | 'Thane';

export interface Institution {
  id?: string;
  slug: string;
  name: string;
  town: string;
  district: District;
  category: InstitutionCategory;
  medium: 'English' | 'Marathi' | null;
  hasJuniorCollege: boolean;
  website?: string;
  logo?: string;
  phone?: string;
  email?: string;
  principal?: string;
  established?: number | null;
  /** Marks the Smt. J.R.H. Kanyashala record, whose website URL comes from settings / VITE_JRH_SITE_URL. */
  isJrh?: boolean;
  order?: number;
}

export interface Leader {
  id?: string;
  name: string;
  label: string;
  line: string;
  photo_url: string;
  order: number;
}

export type BoardGroup = 'office-bearer' | 'director' | 'administration';

export interface BoardMember {
  id?: string;
  name: string;
  role: string;
  group: BoardGroup;
  photo_url: string;
  order: number;
}

export interface TimelineItem {
  id?: string;
  date_label: string;
  sort_year: number;
  title: string;
  description: string;
  image_url?: string;
  highlight?: boolean;
}

export type DocumentType = 'ssc-result' | 'hsc-result' | 'competition' | 'magazine' | 'form';

export interface DocumentItem {
  id?: string;
  type: DocumentType;
  year: string;
  title: string;
  file_url: string;
  file_name?: string;
  file_size?: string;
  cover_image?: string;
}

export interface NoticeItem {
  id?: string;
  title: string;
  category: string;
  publish_date: string;
  description?: string;
  attachment_url?: string;
  attachment_name?: string;
  is_pinned?: boolean;
}

export interface GalleryItem {
  id?: string;
  title: string;
  album: string;
  image_url: string;
  description?: string;
  is_archive?: boolean;
  order?: number;
}

export interface SiteSettings {
  org_name: string;
  org_name_mr: string;
  head_office: string;
  street_address: string;
  city_line: string;
  phone: string;
  phone_alt: string;
  email: string;
  office_hours: string;
  registration: string;
  map_query: string;
  show_extended_stats: boolean;
  stat_institutions: string;
  stat_students: string;
  stat_staff: string;
  social_facebook: string;
  social_youtube: string;
  social_instagram: string;
  social_x: string;
  jrh_site_url: string;
  announcement: string;
}
