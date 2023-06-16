import express from "express";
import cors from "cors";
import routes from "./routers";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import ormconfig from "./ormconfig";

// establish database connection
ormconfig
  .initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database error:", err);
  });

const app = express();

app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(express.json());

routes(app);

export default app;
