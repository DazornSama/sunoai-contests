import express from "express";
import {
  addOne,
  deleteOne,
  getMore,
  getOne,
  getSongs,
  updateOne,
} from "../controllers/contest.mjs";

const router = express.Router();

router.get("/", getMore);
router.get("/:id", getOne);
router.get("/:id/songs", getSongs);
router.post("/", addOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
