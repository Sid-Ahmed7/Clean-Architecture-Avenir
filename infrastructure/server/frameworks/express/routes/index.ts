import express from "express";
import accountRoutes from "./account.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/accounts", accountRoutes);
router.use("/auth", authRoutes);

export default router;