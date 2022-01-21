import express from "express";
import {
  watchVideo,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middelwares";

const videoRouter = express.Router();

videoRouter.get(`/:id(${process.env.MONGO_RE_FORMAT})`, watchVideo);
videoRouter
  .route(`/:id(${process.env.MONGO_RE_FORMAT})/edit`)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get(
  `/:id(${process.env.MONGO_RE_FORMAT})/delete`,
  protectorMiddleware,
  deleteVideo
);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
