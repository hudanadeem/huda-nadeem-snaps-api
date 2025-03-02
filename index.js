import express from "express";
import cors from "cors";
import "dotenv/config";
import photoRoute from "./routes/photos.js";
import tagRoute from "./routes/tags.js";

const app = express();
const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || process.argv[2] || 8080;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/photos", photoRoute);
app.use("/tags", tagRoute);

app.listen(port, () => console.log(`Listening on port ${port}`));
