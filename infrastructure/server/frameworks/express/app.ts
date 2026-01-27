import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index";
import path from "path";
import { runMigrations } from "../../../adapters/config/database/runMigrations";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();
const app = express();
const corsOptions = {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-password"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../../public/uploads")));
app.use("/api", routes)

if (process.env.REPOSITORY_TYPE === 'postgres') {
    runMigrations().then(() => {
        console.log('Migrations completed.');
    }).catch(err => {
        console.error('Migration error:', err);
    });
} else if (process.env.REPOSITORY_TYPE === 'inmemory') {
    console.log(`Using ${process.env.REPOSITORY_TYPE} repository - loading fixtures...`);
    // Dynamically import the fixture loading function
    import('../../../adapters/repositories/loadInMemoryMessagingFixtures.js')
        .then(({ loadInMemoryMessagingFixtures }) => {
            return loadInMemoryMessagingFixtures();
        })
        .then(() => {
            console.log('✅ In-memory fixtures loaded successfully.');
        })
        .catch(err => {
            console.error('❌ Error loading in-memory fixtures:', err);
        });
} else {
    console.log(`Using ${process.env.REPOSITORY_TYPE} repository - no initialization needed.`);
}

export default app;