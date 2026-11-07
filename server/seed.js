// Fills an empty database with the Society's starting content (from src/data/).
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

  await syncAdminFromEnv();
}

/**
 * Keeps the admin login in step with ADMIN_USERNAME / ADMIN_PASSWORD (.env locally, Environment Variables on Vercel):
 * - no admin yet → create it;
 * - the environment values changed since they were last applied → update the username and password;
 * - otherwise → leave it alone, so a password changed in the dashboard keeps working.
 * Local and Vercel share one database, so keep the same values in both places.
 */
export async function syncAdminFromEnv() {
  const username = (process.env.ADMIN_USERNAME || 'admin').trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if ((await Admin.countDocuments()) === 0) console.warn('  ! ADMIN_PASSWORD is not set — no admin account was created.');
    return;
  }
  const fingerprintOk = async (hash) => Boolean(hash) && bcrypt.compare(`${username}\n${password}`, hash);
  const admin = await Admin.findOne().sort({ createdAt: 1 });

  if (!admin) {
    await Admin.create({
      username,
      password_hash: await bcrypt.hash(password, 10),
      env_fingerprint: await bcrypt.hash(`${username}\n${password}`, 10),
    });
    console.log(`  • Created admin account "${username}" (from ADMIN_USERNAME / ADMIN_PASSWORD)`);
    return;
  }
  if (await fingerprintOk(admin.env_fingerprint)) return; // environment unchanged

  // Another account may already use the new username — remove it so the name stays unique.
  await Admin.deleteMany({ _id: { $ne: admin._id }, username });
  admin.username = username;
  admin.password_hash = await bcrypt.hash(password, 10);
  admin.env_fingerprint = await bcrypt.hash(`${username}\n${password}`, 10);
  await admin.save();
  console.log(`  • Admin login updated from ADMIN_USERNAME / ADMIN_PASSWORD (username "${username}")`);
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
