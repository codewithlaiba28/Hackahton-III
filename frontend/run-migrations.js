require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration(filePath, name) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await client.query(sql);
    console.log(`✓ Migration '${name}' completed successfully`);
    return true;
  } catch (err) {
    console.error(`✗ Migration '${name}' failed:`, err.message);
    return false;
  }
}

async function runMigrations() {
  try {
    await client.connect();
    console.log('✓ Database connected successfully\n');
    
    const migrationsDir = path.join(__dirname, '..', 'infrastructure', 'postgres', 'migrations');
    
    // Run migrations in order
    const migrations = [
      { file: '001_initial_schema.sql', name: 'Initial Schema' },
      { file: '004_better_auth_tables.sql', name: 'Better Auth Tables' }
    ];
    
    for (const migration of migrations) {
      const filePath = path.join(migrationsDir, migration.file);
      if (fs.existsSync(filePath)) {
        console.log(`Running migration: ${migration.name}...`);
        await runMigration(filePath, migration.name);
        console.log('');
      } else {
        console.log(`⚠ Migration file not found: ${filePath}\n`);
      }
    }
    
    // Verify tables exist
    console.log('Verifying tables...\n');
    const tables = ['users', 'sessions', 'accounts', 'verifications', 'progress', 'exercises', 'submissions'];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `);
      const exists = result.rows[0].exists;
      console.log(`${exists ? '✓' : '✗'} Table '${table}' ${exists ? 'exists' : 'DOES NOT EXIST'}`);
    }
    
    await client.end();
    console.log('\n✓ All migrations completed successfully!');
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    await client.end();
    process.exit(1);
  }
}

runMigrations();
