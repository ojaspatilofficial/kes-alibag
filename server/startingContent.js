// Starting content for the database. Generated from src/data/*.ts (the single source of truth) by
// `node scripts/export-data.mjs`, which runs automatically before build, server and seed commands.
// Plain JSON keeps the API independent of TypeScript, so it runs the same locally and on Vercel.
import data from './seed-data.json' with { type: 'json' };

export const { institutions, board, leaders, timeline, documents, notices, gallery, defaultSettings } = data;
