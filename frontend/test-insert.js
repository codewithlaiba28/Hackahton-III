require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { schema } = require('./src/lib/schema.ts');

// Create database connection
const client = postgres(process.env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 5,
});

const db = drizzle(client);

async function testInsert() {
    try {
        console.log('Testing direct database insert...');
        
        // Test inserting a user directly
        const { user } = require('./src/lib/schema.ts');
        
        const result = await db.insert(user).values({
            id: 'test-user-' + Date.now(),
            name: 'Test User',
            email: 'test' + Date.now() + '@laiba.com',
            password: '$2b$10$testhash',
            role: 'student',
        }).returning();
        
        console.log('✓ Insert successful:', result);
        
        // Clean up
        await db.delete(user).where((u) => u.email.startsWith('test'));
        console.log('✓ Test data cleaned up');
        
    } catch (err) {
        console.error('✗ Insert failed:', err.message);
        console.error('Full error:', err);
    } finally {
        await client.end();
    }
}

testInsert();
