import express from "express";
import { config } from "dotenv";
import cors from "cors";
import routes from "./routes/index";

config();
const app = express();
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(express.json());
app.use("/api", routes)
app.use(cors(corsOptions));

export default app;