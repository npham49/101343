import { prisma } from "../db/config";
/**
 * Get all paints
 * @returns {Paint[]} The paint object
 */
const getAllPaints = async () => {
  return await prisma.paint.findMany();
};

/**
 * Get a paint by its id
 * @param {number} id - the id of the paint
 * @returns {Paint} The paint object
 */

const getPaint = async (id: number) => {
  return await prisma.paint.findUnique({
    where: {
      id: id,
    },
  });
};

/**
 * Create a new paint
 * @param {string} name - the name of the paint
 * @param {number} stock - the stock of the paint
 * @param {string} status - the status of the paint
 * @param {Date} updatedAt - the date the paint was created
 * @returns {Paint} The paint object
 */
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

/**
 * Update a paint by its id
 * @param {number} id - the id of the paint
 * @param {string} name - the name of the paint
 * @param {number} stock - the stock of the paint
 * @param {string} status - the status of the paint
 * @param {Date} updatedAt - the date the paint was updated
 * @returns {Paint} The paint object
 */
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

/**
 * Delete a paint by its id
 * @param {number} id - the id of the paint
 * @returns {Paint} The paint object
 */
const deletePaint = async (id: number) => {
  return await prisma.paint.delete({
    where: {
      id: id,
    },
  });
};

export { getAllPaints, getPaint, createPaint, updatePaint, deletePaint };
