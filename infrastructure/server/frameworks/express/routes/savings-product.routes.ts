import { Router } from "express";
import { SavingsProductController } from "../controller/savings-product.controller";
import { savingsProductRepository, savingsAccountRepository, accountRepository } from "../../../../adapters/repositories/singletons";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

const router = Router();

// Initialize controller with singleton repositories
const savingsProductController = new SavingsProductController(
    savingsProductRepository,
    savingsAccountRepository,
    accountRepository
);

// Routes for savings products
router.post(
    "/",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER]),
    (req, res) => savingsProductController.createProduct(req, res)
);

router.get(
    "/",
    (req, res) => savingsProductController.getAllProducts(req, res) // Public route to see available products
);

router.put(
    "/:productId",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER]),
    (req, res) => savingsProductController.updateProduct(req, res)
);

router.post(
    "/subscribe",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.CLIENT]),
    (req, res) => savingsProductController.subscribeToProduct(req, res)
);

export default router;
