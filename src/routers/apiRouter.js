import express from "express";
import { registerView } from "../controllers/videoController";

const router = express.Router();

router.post("/videos/:id([0-9a-z]{24})/view", registerView);

export default router;
