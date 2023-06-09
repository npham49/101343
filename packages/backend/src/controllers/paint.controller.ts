import * as paintService from "../services/paint.service";
import auth from "../auth/auth";
import { Request } from "express";

/**
 * @description This function gets all the paints
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const getAllPaints = async (req: Request, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // Check a user's role which is stored in the metadata
    // @ts-ignore
    if (decoded.decoded.metadata.role === undefined) {
      return res.status(401).send("Not Authorized");
    }
    const paints = await paintService.getAllPaints();
    return res.status(200).json(paints);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * @description This function get a paint by id
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const getPaint = async (req: Request, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // Check a user's role which is stored in the metadata
    // @ts-ignore
    if (decoded.decoded.metadata.role === undefined) {
      return res.status(401).send("Not Authorized");
    }
    const paint = await paintService.getPaint(Number(req.params.id));
    return res.status(200).json(paint);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * @description This function creates a new paint
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const createPaint = async (req: Request, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // Check a user's role which is stored in the metadata
    // @ts-ignore
    if (decoded.decoded.metadata.role !== "edit") {
      return res.status(401).send("Not Authorized");
    }
    const paint = await paintService.createPaint(
      req.body.name,
      Number(req.body.stock),
      req.body.status,
      new Date()
    );
    return res.status(200).json(paint);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * @description This function updates a paint based on the attached request body
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const updatePaint = async (req: Request, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // Check a user's role which is stored in the metadata
    // @ts-ignore
    if (decoded.decoded.metadata.role !== "edit") {
      return res.status(401).send("Not Authorized");
    }
    const paint = await paintService.updatePaint(
      Number(req.params.id),
      req.body.name,
      Number(req.body.stock),
      req.body.status,
      new Date(req.body.updatedAt)
    );
    return res.status(200).json(paint);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * @description This function Deletes paint by id
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const deletePaint = async (req: Request, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // Check a user's role which is stored in the metadata
    // @ts-ignore
    if (decoded.decoded.metadata.role !== "edit") {
      return res.status(401).send("Not Authorized");
    }
    const paint = await paintService.deletePaint(Number(req.params.id));
    return res.status(200).json(paint);
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      return res.status(404).send("Paint not found");
    }
    return res.status(500).send("Internal Server Error");
  }
};

export { getAllPaints, getPaint, createPaint, updatePaint, deletePaint };
