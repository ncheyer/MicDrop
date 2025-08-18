const { neon } = require('@neondatabase/serverless');

async function testConnection() {
  // Try both pooler and direct connections
  const connections = [
    {
      name: 'Pooler connection (with c-2)',
      url: 'postgres://neondb_owner:npg_rT8JXkqOUc5g@ep-aged-mud-adxwyudz-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
    },
    {
      name: 'Direct connection (with c-2)', 
      url: 'postgres://neondb_owner:npg_rT8JXkqOUc5g@ep-aged-mud-adxwyudz.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
    }
  ];

  for (const conn of connections) {
    try {
      console.log(`\nTrying ${conn.name}...`);
      const sql = neon(conn.url);
      const result = await sql`SELECT 1 as connected`;
      console.log(`✅ ${conn.name} successful:`, result);
      return; // Exit on first success
    } catch (error) {
      console.error(`❌ ${conn.name} failed:`, error.message);
    }
  }
}

testConnection();