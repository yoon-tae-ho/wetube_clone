import express from "express";
import {
  watchVideo,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-z]{24})", watchVideo);
videoRouter.route("/:id([0-9a-z]{24})/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-z]{24})/delete", deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
