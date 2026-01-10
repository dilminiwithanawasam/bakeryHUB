import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;

// 1. Create the Postgres Pool
const pool = new Pool({ connectionString });

// 2. Create the Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma WITH the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;