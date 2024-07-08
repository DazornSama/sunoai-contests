import express from "express";
import {
  addOne,
  deleteOne,
  getInfo,
  getMore,
  getOne,
  updateOne,
} from "../controllers/song.mjs";

const router = express.Router();

router.get("/", getMore);
router.get("/:id", getOne);
router.get("/:id/info", getInfo);
router.post("/", addOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
