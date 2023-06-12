import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
// Created a new Prisma Client to be attached to services
export default client;
