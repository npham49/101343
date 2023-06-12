import {
  createPaint,
  getAllPaints,
  updatePaint,
  deletePaint,
} from "../../services/paint.service";
import { prismaMock } from "../../db/singleton";

test("should create new Paint ", async () => {
  const paint = {
    id: 1,
    name: "Black",
    status: "Available",
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.paint.create.mockResolvedValue(paint);

  await expect(
    createPaint(paint.name, paint.stock, paint.status, paint.updatedAt)
  ).resolves.toEqual({
    id: expect.any(Number),
    name: "Black",
    status: "Available",
    stock: 10,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });
});

test("should update a Paint ", async () => {
  const paint = {
    id: 30,
    name: "Black",
    status: "Available",
    stock: 10,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  prismaMock.paint.create.mockResolvedValue(paint);
  prismaMock.paint.update.mockResolvedValue(paint);

  await expect(
    updatePaint(
      paint.id,
      paint.name,
      paint.stock,
      paint.status,
      paint.updatedAt
    )
  ).resolves.toEqual({
    id: expect.any(Number),
    name: "Black",
    status: "Available",
    stock: 10,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });
});
