import express from "express";
import accountRoutes from "./account.routes";
import stockRoutes from "./stock.routes";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import newsRoutes from "./news.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/stock", stockRoutes);
router.use("/chat", chatRoutes);
router.use("/feed", newsRoutes);

export default router;