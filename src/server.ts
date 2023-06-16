import dotenv from "dotenv";
import app from "./app";

dotenv.config();

app.listen(process.env.SITE_PORT, () => {
  console.log(
    `Application listening at ${process.env.SITE_PATH}:${process.env.SITE_PORT}`
  );
});
