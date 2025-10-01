import express from "express";
import accountRoutes from "./account.routes";

const router = express.Router();

router.use("/accounts", accountRoutes);

export default router;