// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Without this, every hot reload in dev spins up a new client and we run out of
// database connections. Keep one client on globalThis instead.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
