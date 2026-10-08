import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

function getMigrationsDirectory(): string {
  const sourceMigrations = path.resolve(
    __dirname,
    'migrations'
  );

  const builtMigrations = path.resolve(
    __dirname,
    '../src/db/migrations'
  );

  if (fs.existsSync(sourceMigrations)) {
    return sourceMigrations;
  }

  if (fs.existsSync(builtMigrations)) {
    return builtMigrations;
  }

  throw new Error(
    `Migration directory not found. Checked:\n${sourceMigrations}\n${builtMigrations}`
  );
}

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('Starting ECHO database migrations...');

    const migrationsDir = getMigrationsDirectory();

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      throw new Error(
        `No SQL migration files found in ${migrationsDir}`
      );
    }

    for (const file of files) {
      console.log(`Running migration: ${file}`);

      const sql = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      );

      await client.query('BEGIN');

      try {
        await client.query(sql);
        await client.query('COMMIT');

        console.log(`Completed: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log(
      'All ECHO database migrations completed.'
    );
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
