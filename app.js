import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import * as config from "./utils/config.js";
import * as logger from "./utils/logger.js";
import * as middleware from "./utils/middleware.js";
import personsRouter from "./controllers/personController.js";

const app = express();

mongoose.set("strictQuery", false);

logger.info("connecting to MongoDB");
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) => logger.error("error connecting to MongoDB:", error.message));

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : "",
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use("/api/persons", personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;