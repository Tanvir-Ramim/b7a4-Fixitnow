import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notfound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use("/api/v1/payment/webhook", express.raw({ type: 'application/json' }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Fixitnow User");
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
