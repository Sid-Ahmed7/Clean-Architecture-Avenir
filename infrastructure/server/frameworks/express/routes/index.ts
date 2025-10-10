import express from "express";
import accountRoutes from "./account.routes";
import stockRoutes from "./stock.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/stock", stockRoutes);


export default router;