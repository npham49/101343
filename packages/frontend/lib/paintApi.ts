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

export const createPaint = async (paint: any) => {
  return await paintApi.post("/paint", paint);
};

export const updatePaint = async (paint: any) => {
  return await paintApi.put(`/paint/${paint.id}`, paint);
};

export const deletePaint = async (id: number) => {
  return await paintApi.delete(`/paint/${id}`);
};

export default paintApi;
