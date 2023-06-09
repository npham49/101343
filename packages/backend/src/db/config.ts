import { PrismaClient } from "@prisma/client";

// Created a new Prisma Client to be attached to services
export const prisma = new PrismaClient();
