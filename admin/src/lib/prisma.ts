import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const rawUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const databaseUrl = rawUrl.trim().replace(/^"|"$/g, '');

const cleanedUrl = databaseUrl
  .replace(/([?&])sslmode=[^&]*(&|$)/, '$1')
  .replace(/[?&]$/, '');

const isProd = process.env.NODE_ENV === 'production';
const pool = new pg.Pool({ 
  connectionString: cleanedUrl,
  ...(isProd && { ssl: { rejectUnauthorized: false } })
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
