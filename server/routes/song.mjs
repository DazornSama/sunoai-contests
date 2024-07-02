import express from "express";
import { getOne } from "../controllers/song.mjs";

const router = express.Router();

router.get("/", getOne);

export default router;
