import { prisma } from "../db/config";

const getAllPaints = async () => {
  return await prisma.paint.findMany();
};

const getPaint = async (id: number) => {
  return await prisma.paint.findUnique({
    where: {
      id: id,
    },
  });
};

const createPaint = async (
  name: string,
  stock: number,
  status: string,
  updatedAt: Date
) => {
  return await prisma.paint.create({
    data: {
      name: name,
      stock: stock,
      status: status,
      updatedAt: updatedAt,
    },
  });
};

const updatePaint = async (
  id: number,
  name: string,
  stock: number,
  status: string,
  updatedAt: Date
) => {
  return await prisma.paint.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      stock: stock,
      status: status,
      updatedAt: updatedAt,
    },
  });
};

const deletePaint = async (id: number) => {
  return await prisma.paint.delete({
    where: {
      id: id,
    },
  });
};

export { getAllPaints, getPaint, createPaint, updatePaint, deletePaint };
