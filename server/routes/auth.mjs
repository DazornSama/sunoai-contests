import express from "express";
import { authenticate } from "../controllers/auth.mjs";

const router = express.Router();

router.post("/", authenticate);

export default router;
