
// This file is used to create a single instance of the PrismaClient and export it for use in other parts of the application.
import { PrismaClient } from "@prisma/client";

const globalforPrisma = global as unknown as { 
    prisma: PrismaClient | undefined
 }

export const prisma =
    globalforPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalforPrisma.prisma = prisma;
}