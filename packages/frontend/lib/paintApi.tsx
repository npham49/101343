import { Paint } from "@/typings";
import axios from "axios";

const paintApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

/**
 * @description This function gets all the paints using an axios API call
 * @param {string} token
 * @returns {Paint[]} res.data
 */
export const getAllPaints = async (token: string) => {
  const response = await paintApi.get("/paint", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

/**
 * @description This function gets a paint by id using an axios API call
 *  @param {number} id
 * @returns {Paint} res.data
 * */
export const getPaint = async (id: number) => {
  const token = localStorage.getItem("token");
  return await paintApi.get(`/paint/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description This function creates a new paint using an axios API call
 * @param {Paint} paint
 * @returns {Paint} res.data
 * */
export const createPaint = async (paint: Paint) => {
  if (paint.stock <= 5 && paint.stock > 0) {
    paint.status = "Running Low";
  } else if (paint.stock <= 0) {
    paint.status = "Out of Stock";
  } else if (paint.stock > 5) {
    paint.status = "Available";
  }
  const token = localStorage.getItem("token");
  // console.log(token);
  return await paintApi.post("/paint", paint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description This function updates a paint using an axios API call
 * @param {Paint} paint
 * @returns {Paint} res.data
 * */
export const updatePaint = async (paint: Paint) => {
  if (paint.stock <= 5 && paint.stock > 0) {
    paint.status = "Running Low";
  } else if (paint.stock <= 0) {
    paint.status = "Out of Stock";
  } else if (paint.stock > 5) {
    paint.status = "Available";
  }
  const token = localStorage.getItem("token");
  return await paintApi.put(`/paint/${paint.id}`, paint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description This function deletes a paint using an axios API call
 * @param {number} id
 * @returns {Paint} res.data
 * */
export const deletePaint = async (id: number) => {
  const token = localStorage.getItem("token");
  // console.log(token);
  return await paintApi.delete(`/paint/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default paintApi;
