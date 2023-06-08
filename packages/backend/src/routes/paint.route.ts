import * as express from "express";
import * as paintController from "../controllers/paint.controller";

const router = express.Router();

router.get("/", paintController.getAllPaints);
router.get("/:id", paintController.getPaint);
router.post("/", paintController.createPaint);
router.put("/:id", paintController.updatePaint);
router.delete("/:id", paintController.deletePaint);

export default router;
