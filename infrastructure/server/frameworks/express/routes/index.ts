import express from "express";
import accountRoutes from "./account.routes";
import stockRoutes from "./stock.routes";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import newsRoutes from "./news.routes";
import mediaRoutes from "./media.routes";
import contentRoutes from "./content.routes";
import loanRoutes from "./loan.routes";
import savingsAccountRoutes from "./savings-account.routes";
import savingsProductRoutes from "./savings-product.routes";
import stockOrder from "./stockOrder.routes";
import stockPosition from "./stockPositions.routes";
import stockTransaction from "./stockTransactions.routes";
import userManagementRoutes from "./user-management.routes";
import directorAccountsRoutes from "./director-accounts.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/savings-accounts", savingsAccountRoutes);
router.use("/savings-products", savingsProductRoutes);
router.use("/stock/order", stockOrder);
router.use("/stock/position", stockPosition);
router.use("/stock/transaction", stockTransaction);
router.use("/stock", stockRoutes);
router.use("/chat", chatRoutes);
router.use("/feed", newsRoutes);
router.use("/media", mediaRoutes);
router.use("/content", contentRoutes);
router.use("/users", userManagementRoutes);
router.use("/director", directorAccountsRoutes);
router.use("/loan", loanRoutes);

export default router;