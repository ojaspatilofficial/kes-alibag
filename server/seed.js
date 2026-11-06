// Fills an empty database with the Society's starting content (from src/data/ — CLAUDE_PROMPT.md §4).
// Runs automatically when the server starts. `npm run seed:reset` wipes and reloads everything.
import bcrypt from 'bcryptjs';
import { board, leaders, timeline, documents, notices, gallery, institutions, defaultSettings } from './startingContent.js';
import { resources, Settings, Admin } from './models.js';

const startingContent = () => ({
  institutions,
  boardMembers: board,
  leaders,
  timeline,
  notices,
  documents,
  gallery,
});

export async function seedDatabase({ reset = false } = {}) {
  const content = startingContent();
  for (const [name, { model }] of Object.entries(resources)) {
    if (reset) await model.deleteMany({});
    if ((await model.countDocuments()) === 0 && content[name]?.length) {
      await model.insertMany(content[name]);
      console.log(`  • Added starting ${name} (${content[name].length})`);
    }
  }

  if (reset) await Settings.deleteMany({});
  if ((await Settings.countDocuments()) === 0) {
    await Settings.create(defaultSettings);
    console.log('  • Added site settings');
  }

  // First admin account from .env (only if no admin exists yet).
  if ((await Admin.countDocuments()) === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.warn('  ! ADMIN_PASSWORD is not set in .env — no admin account was created.');
    } else {
      await Admin.create({ username, password_hash: await bcrypt.hash(password, 10) });
      console.log(`  • Created admin account "${username}" (password from .env)`);
    }
  }
}

// Allow running directly: `node server/seed.js [--reset]`
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/seed.js')) {
  const { default: mongoose } = await import('mongoose');
  await import('dotenv/config');
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kes_alibag';
  await mongoose.connect(uri);
  console.log(process.argv.includes('--reset') ? 'Resetting the database …' : 'Seeding the database …');
  await seedDatabase({ reset: process.argv.includes('--reset') });
  await mongoose.disconnect();
  console.log('Done.');
}
