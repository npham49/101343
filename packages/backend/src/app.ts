import "dotenv/config"; // To read CLERK_API_KEY
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import paintRouter from "./routes/paint.route";

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 3000;

const corsOptions = {
  origin: process.env.ORIGIN_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(
    "[:date] :method :url :status :res[content-length] - :remote-addr - :response-time ms"
  )
);
app.set("trust proxy", "loopback, linklocal, uniquelocal");
app.use(cors(corsOptions));
app.use(helmet());

app.get("/*", function (req, res, next) {
  res.setHeader("Last-Modified", new Date().toUTCString());
  next();
});

app.use("/paint", paintRouter);

app.use("/", (req: Request, res: Response): void => {
  res.send("Hello world!");
});

app.use(express.static(__dirname + "/static"));

app.listen(PORT, (): void => {
  console.log("SERVER IS UP ON PORT:", PORT);
});
