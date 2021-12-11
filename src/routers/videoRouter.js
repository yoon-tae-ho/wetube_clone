import express from "express";
import {
  watchVideo,
  editVideo,
  deleteVideo,
  uploadVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watchVideo);
videoRouter.get("/:id(\\d+)/edit", editVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", uploadVideo);

export default videoRouter;
