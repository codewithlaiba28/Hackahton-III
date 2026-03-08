require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✓ Database connected successfully');
    
    // Check if tables exist
    const tables = ['users', 'sessions', 'accounts', 'verifications'];
    
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
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
