import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware, sessionMiddleware } from "./middelwares";

const app = express();
const logger = morgan("dev");

// Settings
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

// Middlewares
app.use(logger);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(localsMiddleware);

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
