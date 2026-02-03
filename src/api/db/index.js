import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

if (!process.env.POSTGRESQL) {
  throw new Error('POSTGRESQL environment variable is not set');
}

const sql = neon(process.env.POSTGRESQL);
export const db = drizzle(sql, { schema });
