import { prisma } from "../db/config";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const checkUser = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where: {
      clerkId: clerkId,
    },
  });
};

const createUser = async (clerkId: string, permission: string) => {
  return await prisma.user.create({
    data: {
      clerkId: clerkId,
      permission: permission,
    },
  });
};

const updateUser = async (clerkId: string, permission: string) => {
  return await prisma.user.update({
    where: {
      clerkId: clerkId,
    },
    data: {
      permission: permission,
    },
  });
};

const deleteUser = async (clerkId: string) => {
  return await prisma.user.delete({
    where: {
      clerkId: clerkId,
    },
  });
};

export { getAllUsers, checkUser, createUser, updateUser, deleteUser };
