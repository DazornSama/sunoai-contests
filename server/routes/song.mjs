import express from "express";
import {
  getOne,
  getMore,
  addOne,
  updateOne,
  deleteOne,
} from "../controllers/song.mjs";

const router = express.Router();

router.get("/", getMore);
router.get("/:id", getOne);
router.post("/", addOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
