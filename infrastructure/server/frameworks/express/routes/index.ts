import express from "express";
import accountRoutes from "./account.routes";
import stockRoutes from "./stock.routes";
const router = express.Router();

router.use("/accounts", accountRoutes);
router.use("/stock", stockRoutes);
export default router;