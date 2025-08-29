import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL not found, using in-memory storage');
}

let db: any = null;

if (connectionString) {
  try {
    const sql = neon(connectionString);
    db = drizzle(sql, { schema });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

export { db };
export type Database = typeof db;