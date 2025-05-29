// // lib/prisma.ts
// import { PrismaClient } from "@prisma/client";

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }


// const client = globalThis.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// export default client;
// import { PrismaClient } from '../app/generated/prisma'
// import { withAccelerate } from '@prisma/extension-accelerate'

// const globalForPrisma = global as unknown as { 
//     prisma: PrismaClient
// }

// const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export default prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;
