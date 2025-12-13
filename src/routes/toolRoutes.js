import express from "express";
import { getToolById } from "../controllers/toolController.js";

const router = express.Router();

router.get("/:id", getToolById);

export default router;
