// Konkan Education Society website API (Express + MongoDB)
// Public:  GET content, POST the enquiry form.   Admin (login required): add / edit / delete, uploads, inbox.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';
import { resources, forms, Settings, Admin } from './models.js';
import { defaultSettings } from './startingContent.js';
import { seedDatabase } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.API_PORT) || 5050;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kes_alibag';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ON_VERCEL = Boolean(process.env.VERCEL);
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

if (!process.env.JWT_SECRET) {
  console.warn(
    ON_VERCEL
      ? 'JWT_SECRET is not set in the Vercel project — admin login is disabled until it is added.'
      : 'JWT_SECRET is not set in .env — admin logins will reset whenever the server restarts.'
  );
}
if (!ON_VERCEL) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(compression());

// Security headers (same policy as vercel.json, used when the built site is served by `npm start`).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.public.blob.vercel-storage.com'],
        frameSrc: ['https://www.google.com', 'https://maps.google.com'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: ON_VERCEL ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  next();
});
// The API is only called by this website itself — no cross-origin access.
app.use('/api', cors({ origin: false }));
app.use(express.json({ limit: '200kb' }));
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '7d',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  })
);

/* ------------------------------- Database ------------------------------- */

let connecting;
export function connectDb() {
  if (ON_VERCEL && !process.env.MONGODB_URI) {
    return Promise.reject(new Error('MONGODB_URI is not set in the Vercel project’s Environment Variables.'));
  }
  connecting ??= mongoose
    // A small pool per serverless instance keeps Atlas (free tier: 500 connections) comfortable.
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000, maxPoolSize: ON_VERCEL ? 5 : 20 })
    .then(async () => {
      console.log('Connected to MongoDB.');
      // On Vercel every cold start runs this: when the database is already set up, skip the full check.
      const ready = ON_VERCEL && (await Settings.exists({})) && (await Admin.exists({}));
      if (!ready) await seedDatabase();
    })
    .catch((err) => {
      connecting = undefined;
      throw err;
    });
  return connecting;
}

app.use('/api', async (_req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    res.status(503).json({ error: 'The K.E.S. database is not reachable right now.' });
  }
});

const handle = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    const status = ['ValidationError', 'CastError'].includes(err.name) ? 400 : err.code === 11000 ? 409 : 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? 'Something went wrong on the server.' : friendlyError(err) });
  });

function friendlyError(err) {
  if (err.code === 11000) return 'An item with the same web address name (slug) already exists.';
  if (err.name === 'ValidationError') {
    return Object.values(err.errors)
      .map((e) => {
        const field = `"${e.path.replace(/_/g, ' ')}"`;
        if (e.kind === 'required') return `${field} is required.`;
        if (e.kind === 'maxlength') return `${field} is too long.`;
        if (e.kind === 'enum') return `${field} has a value that is not allowed.`;
        return e.message;
      })
      .join(' ');
  }
  return 'That item could not be found.';
}

const isObjectId = (id) => mongoose.isValidObjectId(id);

/* ---------------------------- Authentication ---------------------------- */

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  try {
    req.admin = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again.' });
  }
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

app.post(
  '/api/auth/login',
  loginLimiter,
  handle(async (req, res) => {
    // Serverless instances must share one signing secret, or logins break between requests.
    if (ON_VERCEL && !process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Admin login is not set up: add JWT_SECRET in the Vercel project’s Environment Variables and redeploy.' });
    }
    const username = String(req.body?.username ?? '').trim().slice(0, 60);
    const password = String(req.body?.password ?? '').slice(0, 200);
    if (!username || !password) return res.status(400).json({ error: 'Please enter your username and password.' });
    const admin = await Admin.findOne({ username });
    const ok = admin && (await bcrypt.compare(password, admin.password_hash));
    if (!ok) return res.status(401).json({ error: 'Wrong username or password.' });
    const token = jwt.sign({ id: String(admin._id), username: admin.username }, JWT_SECRET, { expiresIn: '12h', algorithm: 'HS256' });
    res.json({ token, username: admin.username });
  })
);

app.get('/api/auth/me', requireAdmin, (req, res) => res.json({ username: req.admin.username }));

app.post(
  '/api/auth/change-password',
  requireAdmin,
  handle(async (req, res) => {
    const current = String(req.body?.current_password ?? '').slice(0, 200);
    const next = String(req.body?.new_password ?? '').slice(0, 200);
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !(await bcrypt.compare(current, admin.password_hash))) {
      return res.status(400).json({ error: 'Your current password is not correct.' });
    }
    if (next.length < 10) return res.status(400).json({ error: 'The new password must be at least 10 characters long.' });
    admin.password_hash = await bcrypt.hash(next, 12);
    await admin.save();
    res.json({ ok: true });
  })
);

/* ------------------------------- Uploads -------------------------------- */

// PDF, JPG, PNG and WebP only — checked by declared type AND by the file's first bytes.
const allowedTypes = {
  'image/jpeg': { ext: '.jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: '.png', magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  'image/webp': { ext: '.webp', magic: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  'application/pdf': { ext: '.pdf', magic: (b) => b.subarray(0, 5).toString() === '%PDF-' },
};

// Vercel functions accept request bodies up to 4.5 MB, so Blob uploads are capped at 4 MB.
const MAX_UPLOAD_MB = USE_BLOB || ON_VERCEL ? 4 : 15;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024, files: 1, fields: 5 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes[file.mimetype]) return cb(null, true);
    req.rejectedFile = true;
    cb(null, false);
  },
});

function safeFilename(file) {
  const base = path
    .parse(file.originalname)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${base || 'file'}${allowedTypes[file.mimetype].ext}`;
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

app.get('/api/upload/limits', (_req, res) => res.json({ maxMb: MAX_UPLOAD_MB, types: ['PDF', 'JPG', 'PNG', 'WebP'] }));

app.post('/api/upload', requireAdmin, (req, res) => {
  if (ON_VERCEL && !USE_BLOB) {
    return res.status(500).json({ error: 'File uploads are not set up yet. Connect Vercel Blob storage to this project.' });
  }
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? `The file is too big. Please keep it under ${MAX_UPLOAD_MB} MB.` : 'The file could not be received.';
      return res.status(400).json({ error: message });
    }
    if (req.rejectedFile) return res.status(400).json({ error: 'Only PDF, JPG, PNG and WebP files can be uploaded.' });
    if (!req.file) return res.status(400).json({ error: 'No file was received.' });
    if (!allowedTypes[req.file.mimetype].magic(req.file.buffer)) {
      return res.status(400).json({ error: 'This file does not look like a real PDF or image. Please export it again and retry.' });
    }

    const filename = safeFilename(req.file);
    let url;
    try {
      if (USE_BLOB) {
        const blob = await put(`uploads/${filename}`, req.file.buffer, { access: 'public', contentType: req.file.mimetype });
        url = blob.url;
      } else {
        fs.writeFileSync(path.join(UPLOAD_DIR, filename), req.file.buffer);
        url = `/uploads/${filename}`;
      }
    } catch (saveErr) {
      console.error('Upload failed:', saveErr);
      return res.status(500).json({ error: 'The file could not be saved. Please try again.' });
    }
    res.json({ url, name: req.file.originalname.slice(0, 200), size: formatSize(req.file.size), type: allowedTypes[req.file.mimetype].ext.slice(1).toUpperCase() });
  });
});

/* ---------------------------- Site settings ----------------------------- */

app.get(
  '/api/settings',
  handle(async (_req, res) => {
    const settings = (await Settings.findOne()) || (await Settings.create({}));
    res.json(settings);
  })
);

app.put(
  '/api/settings',
  requireAdmin,
  handle(async (req, res) => {
    const settings = (await Settings.findOne()) || new Settings();
    const changes = {};
    for (const [key, def] of Object.entries(defaultSettings)) {
      if (!(key in (req.body || {}))) continue;
      const value = req.body[key];
      changes[key] = typeof def === 'boolean' ? Boolean(value) : String(value ?? '');
    }
    settings.set(changes);
    await settings.save();
    res.json(settings);
  })
);

/* ------------------------- Content (CRUD routes) ------------------------ */

function getResource(req, res) {
  const resource = Object.hasOwn(resources, req.params.resource) ? resources[req.params.resource] : null;
  if (!resource) res.status(404).json({ error: 'Unknown section.' });
  return resource;
}

/** Keeps only fields defined in the schema (and never ids / timestamps / Mongo operators). */
function cleanBody(model, body = {}) {
  const allowed = Object.keys(model.schema.paths).filter((p) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(p));
  const out = {};
  for (const key of allowed) {
    if (!(key in body)) continue;
    const v = body[key];
    if (v !== null && typeof v === 'object') continue; // no nested objects / operators
    out[key] = v;
  }
  return out;
}

app.get(
  '/api/content/:resource',
  handle(async (req, res) => {
    const resource = getResource(req, res);
    if (!resource) return;
    res.set('Cache-Control', 'no-cache');
    res.json(await resource.model.find().sort(resource.sort));
  })
);

app.post(
  '/api/content/:resource',
  requireAdmin,
  handle(async (req, res) => {
    const resource = getResource(req, res);
    if (!resource) return;
    const item = new resource.model(cleanBody(resource.model, req.body));
    await item.save();
    res.status(201).json(item);
  })
);

app.put(
  '/api/content/:resource/:id',
  requireAdmin,
  handle(async (req, res) => {
    const resource = getResource(req, res);
    if (!resource) return;
    if (!isObjectId(req.params.id)) return res.status(404).json({ error: 'That item no longer exists.' });
    const item = await resource.model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'That item no longer exists.' });
    item.set(cleanBody(resource.model, req.body));
    await item.save();
    res.json(item);
  })
);

app.delete(
  '/api/content/:resource/:id',
  requireAdmin,
  handle(async (req, res) => {
    const resource = getResource(req, res);
    if (!resource) return;
    if (!isObjectId(req.params.id)) return res.status(404).json({ error: 'That item no longer exists.' });
    await resource.model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  })
);

/* ------------------------- Public form submissions ---------------------- */

const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages from this connection. Please wait a few minutes, or call the office.' },
});

app.post(
  '/api/forms/enquiries',
  formLimiter,
  handle(async (req, res) => {
    const b = req.body || {};
    // Honeypot field: real visitors never fill it in.
    if (b.website) return res.status(201).json({ ok: true });
    const pick = (k, max) => (typeof b[k] === 'string' ? b[k].trim().slice(0, max) : '');
    const data = {
      name: pick('name', 100),
      email: pick('email', 120),
      phone: pick('phone', 20),
      institution: pick('institution', 300),
      subject: pick('subject', 150),
      message: pick('message', 3000),
    };
    if (!data.email && !data.phone) return res.status(400).json({ error: 'Please give an email address or a phone number so we can reply.' });
    await forms.enquiries.create({ ...data, status: 'new' });
    res.status(201).json({ ok: true });
  })
);

app.get(
  '/api/forms/:type',
  requireAdmin,
  handle(async (req, res) => {
    const Model = Object.hasOwn(forms, req.params.type) ? forms[req.params.type] : null;
    if (!Model) return res.status(404).json({ error: 'Unknown form.' });
    res.json(await Model.find().sort({ createdAt: -1 }).limit(500));
  })
);

app.patch(
  '/api/forms/:type/:id',
  requireAdmin,
  handle(async (req, res) => {
    const Model = Object.hasOwn(forms, req.params.type) ? forms[req.params.type] : null;
    if (!Model || !isObjectId(req.params.id)) return res.status(404).json({ error: 'Not found.' });
    const status = req.body?.status === 'new' ? 'new' : 'read';
    res.json(await Model.findByIdAndUpdate(req.params.id, { status }, { new: true }));
  })
);

app.delete(
  '/api/forms/:type/:id',
  requireAdmin,
  handle(async (req, res) => {
    const Model = Object.hasOwn(forms, req.params.type) ? forms[req.params.type] : null;
    if (!Model || !isObjectId(req.params.id)) return res.status(404).json({ error: 'Not found.' });
    await Model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  })
);

/* ---------------------------- Dashboard stats --------------------------- */

app.get(
  '/api/admin/stats',
  requireAdmin,
  handle(async (_req, res) => {
    const counts = {};
    for (const [name, { model }] of Object.entries(resources)) counts[name] = await model.countDocuments();
    const unread = {};
    for (const [name, Model] of Object.entries(forms)) unread[name] = await Model.countDocuments({ status: 'new' });
    const emptyDocuments = await resources.documents.model.countDocuments({ file_url: '' });
    res.json({ counts, unread, emptyDocuments });
  })
);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

/* --------------- Serve the built website (after `npm run build`) -------- */

if (!ON_VERCEL && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: '1h' }));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

/* -------------------------------- Start --------------------------------- */

const startedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (startedDirectly) {
  try {
    await connectDb();
    app.listen(PORT, () => console.log(`K.E.S. API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Could not connect to MongoDB. Is the MongoDB service running?\n', err.message);
    process.exit(1);
  }
}
