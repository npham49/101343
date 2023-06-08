import { Paint } from "@/typings";
import axios from "axios";

const paintApi = axios.create({
  baseURL: process.env.API_URL ?? "http://localhost:8000",
});

export const getAllPaints = async () => {
  const response = await paintApi.get("/paint");
  console.log(response.data);
  return response.data;
};

export const getPaint = async (id: number) => {
  return await paintApi.get(`/paint/${id}`);
};

export const createPaint = async (paint: Paint) => {
  if (paint.stock <= 5) {
    paint.status = "Running Low";
  } else if (paint.stock <= 0) {
    paint.status = "Out of Stock";
  } else if (paint.stock > 5) {
    paint.status = "Available";
  }
  return await paintApi.post("/paint", paint);
};

export const updatePaint = async (paint: Paint) => {
  if (paint.stock <= 5 && paint.stock > 0) {
    paint.status = "Running Low";
  } else if (paint.stock <= 0) {
    paint.status = "Out of Stock";
  } else if (paint.stock > 5) {
    paint.status = "Available";
  }
  return await paintApi.put(`/paint/${paint.id}`, paint);
};

export const deletePaint = async (id: number) => {
  return await paintApi.delete(`/paint/${id}`);
};

export default paintApi;
