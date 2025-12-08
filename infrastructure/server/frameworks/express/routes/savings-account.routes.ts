import { Router } from "express";
import { SavingsAccountController } from "../controller/savings-account.controller";
import { InMemorySavingsAccountRepository } from "../../../../adapters/repositories/InMemorySavingsAccountRepository";
import { InMemoryAccountRepository } from "../../../../adapters/repositories/InMemoryAccountRepository";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

const router = Router();

// Initialize repositories
const savingsAccountRepository = new InMemorySavingsAccountRepository();
const accountRepository = new InMemoryAccountRepository();

// Initialize controller
const savingsAccountController = new SavingsAccountController(savingsAccountRepository, accountRepository);

// Routes
router.post(
    "/", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.createSavingsAccount(req, res)
);

router.get(
    "/:accountNumber", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.getSavingsAccount(req, res)
);

router.put(
    "/:accountNumber", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.updateSavingsAccountConfig(req, res)
);

router.put(
    "/:accountNumber/interest-rate", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.updateInterestRate(req, res)
);

router.put(
    "/:accountNumber/max-deposit", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.updateMaxDeposit(req, res)
);

router.post(
    "/calculate-interest", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.calculateDailyInterest(req, res)
);

router.get(
    "/:accountNumber/interest-summary", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), 
    (req, res) => savingsAccountController.getInterestSummary(req, res)
);

export default router;
