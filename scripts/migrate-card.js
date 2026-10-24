const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.yprtrwpykeqpvydyvafh:VLtdZb5KRg34DSdfb@aws-1-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const sql = `
    CREATE TABLE IF NOT EXISTS "BusinessCard" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
      "slug" TEXT NOT NULL UNIQUE,
      "fullName" TEXT NOT NULL,
      "role" TEXT,
      "company" TEXT,
      "phone" TEXT,
      "whatsapp" TEXT,
      "email" TEXT,
      "website" TEXT,
      "address" TEXT,
      "city" TEXT,
      "state" TEXT,
      "notes" TEXT,
      "avatarUrl" TEXT,
      "theme" TEXT DEFAULT 'dark',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "BusinessCard_userId_key" ON "BusinessCard"("userId");
    CREATE UNIQUE INDEX IF NOT EXISTS "BusinessCard_slug_key" ON "BusinessCard"("slug");
  `;

  console.log('Connecting to database...');
  await pool.query(sql);
  console.log('BusinessCard table created/verified successfully!');
  await pool.end();
}

main().catch(err => {
  console.error('Error migrating table:', err);
  process.exit(1);
});
