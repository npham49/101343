import * as paintService from "../services/paint.service";
import auth from "../auth/auth";

const getAllPaints = async (req: any, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // console.log(decoded.decoded.metadata.role);
    // @ts-ignore
    if (decoded.decoded.metadata.role === undefined) {
      return res.status(401).send("Not Authorized");
    }
    console.log(decoded);
    const paints = await paintService.getAllPaints();
    return res.status(200).json(paints);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const getPaint = async (req: any, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
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

const createPaint = async (req: any, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
    // @ts-ignore
    console.log(decoded.decoded.metadata.role);
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

const updatePaint = async (req: any, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
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

const deletePaint = async (req: any, res: any) => {
  try {
    const decoded = await auth(req, res);
    if (decoded.error) {
      return res.status(401).send(decoded.error);
    }
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
