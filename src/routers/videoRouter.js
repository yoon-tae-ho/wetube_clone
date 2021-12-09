import express from "express";
import {
  watchVideo,
  editVideo,
  deleteVideo,
  uploadVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id", watchVideo);
videoRouter.get("/upload", uploadVideo);
videoRouter.get("/edit", editVideo);
videoRouter.get("/delete", deleteVideo);

export default videoRouter;
