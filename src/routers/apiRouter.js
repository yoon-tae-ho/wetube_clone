import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middelwares";

const router = express.Router();

router.post(`/videos/:id(${process.env.MONGO_RE_FORMAT})/view`, registerView);
router.post(
  `/videos/:id(${process.env.MONGO_RE_FORMAT})/comment`,
  protectorMiddleware,
  createComment
);
router.delete(
  `/comments/:id(${process.env.MONGO_RE_FORMAT})`,
  protectorMiddleware,
  deleteComment
);

export default router;
