import * as paintService from "../services/paint.service";

const getAllPaints = async (req: any, res: any) => {
  try {
    const paints = await paintService.getAllPaints();
    return res.status(200).json(paints);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const getPaint = async (req: any, res: any) => {
  try {
    const paint = await paintService.getPaint(Number(req.params.id));
    return res.status(200).json(paint);
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const createPaint = async (req: any, res: any) => {
  try {
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
