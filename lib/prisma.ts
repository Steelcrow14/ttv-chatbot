import { PrismaClient } from '@prisma/client';

//WHY THIS IS NEEDED: because we only need ONE active Prisma client across the entire app instead of initialising
//new client in every component it requires. More here:
//https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
