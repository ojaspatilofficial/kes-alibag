// MongoDB collections (Mongoose models) for the K.E.S. organisation website.
// Every schema is strict (unknown fields are dropped) and every text field has a length limit.
import mongoose from 'mongoose';
import { defaultSettings } from './startingContent.js';

const { Schema } = mongoose;

const jsonOptions = {
  timestamps: true,
  toJSON: {
    virtuals: false,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  },
};

// Links may be site-relative ("/uploads/x.pdf") or http(s) — never javascript:, data: etc.
const urlValidator = {
  validator: (v) => !v || /^(https?:\/\/[^\s<>"]+|\/[^\s<>"]*)$/i.test(v),
  message: (p) => `"${p.path.replace(/_/g, ' ')}" must be a web address starting with https:// (or an uploaded file).`,
};
const text = (max, extra = {}) => ({ type: String, default: '', trim: true, maxlength: max, ...extra });
const url = (extra = {}) => ({ type: String, default: '', trim: true, maxlength: 600, validate: urlValidator, ...extra });

export const CATEGORIES = ['homoeopathic-medical', 'senior-college', 'english-secondary', 'english-primary', 'marathi-secondary', 'marathi-primary'];
export const DISTRICTS = ['Raigad', 'Sindhudurg', 'Thane'];
export const DOC_TYPES = ['ssc-result', 'hsc-result', 'competition', 'magazine', 'form'];

const InstitutionSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'The web address name (slug) may only use small letters, numbers and dashes.'],
    },
    name: text(220, { required: true }),
    town: text(120, { required: true }),
    district: { type: String, enum: DISTRICTS, default: 'Raigad' },
    category: { type: String, enum: CATEGORIES, required: true },
    medium: { type: String, enum: ['English', 'Marathi', null], default: null },
    hasJuniorCollege: { type: Boolean, default: false },
    website: url(),
    logo: url(),
    phone: text(40),
    email: text(120, { match: [/^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'] }),
    principal: text(150),
    established: { type: Number, default: null, min: 1800, max: 2100 },
    order: { type: Number, default: 1000 },
  },
  jsonOptions
);

const LeaderSchema = new Schema(
  {
    name: text(150, { required: true }),
    label: text(80),
    line: text(400),
    photo_url: url(),
    order: { type: Number, default: 100 },
  },
  jsonOptions
);

const BoardMemberSchema = new Schema(
  {
    name: text(150, { required: true }),
    role: text(100, { required: true }),
    group: { type: String, enum: ['office-bearer', 'director', 'administration'], default: 'director' },
    photo_url: url(),
    order: { type: Number, default: 100 },
  },
  jsonOptions
);

const TimelineSchema = new Schema(
  {
    date_label: text(40, { required: true }),
    sort_year: { type: Number, required: true, min: 1800, max: 2200 },
    title: text(200, { required: true }),
    description: text(1000),
    image_url: url(),
    highlight: { type: Boolean, default: false },
  },
  jsonOptions
);

const NoticeSchema = new Schema(
  {
    title: text(250, { required: true }),
    category: text(60, { default: 'Circular' }),
    publish_date: { type: String, default: () => new Date().toISOString().slice(0, 10), match: /^\d{4}-\d{2}-\d{2}$/ },
    description: text(5000),
    attachment_url: url(),
    attachment_name: text(200),
    is_pinned: { type: Boolean, default: false },
  },
  jsonOptions
);

const DocumentSchema = new Schema(
  {
    type: { type: String, enum: DOC_TYPES, required: true },
    year: text(20),
    title: text(250, { required: true }),
    file_url: url(),
    file_name: text(200),
    file_size: text(20),
    cover_image: url(),
  },
  jsonOptions
);

const GallerySchema = new Schema(
  {
    title: text(200, { required: true }),
    album: text(120, { default: 'Gallery' }),
    image_url: url({ required: true }),
    description: text(500),
    is_archive: { type: Boolean, default: false },
    order: { type: Number, default: 100 },
  },
  jsonOptions
);

// Settings: one document. Fields and types come from defaultSettings in src/data/site.ts.
const settingsFields = {};
for (const [key, value] of Object.entries(defaultSettings)) {
  if (typeof value === 'boolean') settingsFields[key] = { type: Boolean, default: value };
  else if (key.startsWith('social_') || key.endsWith('_url')) settingsFields[key] = url({ default: value });
  else settingsFields[key] = text(500, { default: value });
}
const SettingsSchema = new Schema(settingsFields, jsonOptions);

// Contact-form enquiries from the public website.
const EnquirySchema = new Schema(
  {
    name: text(100, { required: true }),
    email: text(120, { match: [/^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'] }),
    phone: text(20, { match: [/^$|^[0-9+()\- ]{7,20}$/, 'Please enter a valid phone number.'] }),
    institution: text(300),
    subject: text(150, { required: true }),
    message: text(3000, { required: true }),
    status: { type: String, enum: ['new', 'read'], default: 'new' },
  },
  jsonOptions
);

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    password_hash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Institution = mongoose.model('Institution', InstitutionSchema);
export const Leader = mongoose.model('Leader', LeaderSchema);
export const BoardMember = mongoose.model('BoardMember', BoardMemberSchema);
export const TimelineItem = mongoose.model('TimelineItem', TimelineSchema);
export const Notice = mongoose.model('Notice', NoticeSchema);
export const DocumentItem = mongoose.model('Document', DocumentSchema);
export const GalleryItem = mongoose.model('GalleryItem', GallerySchema);
export const Settings = mongoose.model('Settings', SettingsSchema);
export const Enquiry = mongoose.model('Enquiry', EnquirySchema);
export const Admin = mongoose.model('Admin', AdminSchema);

/** Content types the admin can add / edit / delete, with their display order. */
export const resources = {
  institutions: { model: Institution, sort: { order: 1, _id: 1 } },
  boardMembers: { model: BoardMember, sort: { order: 1, _id: 1 } },
  leaders: { model: Leader, sort: { order: 1, _id: 1 } },
  timeline: { model: TimelineItem, sort: { sort_year: 1, _id: 1 } },
  notices: { model: Notice, sort: { is_pinned: -1, publish_date: -1, _id: -1 } },
  documents: { model: DocumentItem, sort: { type: 1, year: -1, _id: 1 } },
  gallery: { model: GalleryItem, sort: { order: 1, _id: 1 } },
};

/** Public form submissions, readable only by the admin. */
export const forms = {
  enquiries: Enquiry,
};
