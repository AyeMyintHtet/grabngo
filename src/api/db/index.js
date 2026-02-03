import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from different possible locations (dev vs prod structure)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Local dev
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Alternative
dotenv.config(); // Standard lookup


if (!process.env.POSTGRESQL) {
  throw new Error('POSTGRESQL environment variable is not set');
}

const sql = neon(process.env.POSTGRESQL);
export const db = drizzle(sql, { schema });
