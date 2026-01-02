import { Router } from "express";
import { SavingsAccountController } from "../controller/savings-account.controller";
import {
    savingsAccountRepository,
    accountRepository,
    notificationRepository,
    userRepository,
    savingsProductRepository,
    transactionRepository
} from "../../../../adapters/config/repositories";
import {
    notificationService,
    uuidService
} from "../../../../adapters/config/services";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

const router = Router();

const savingsAccountController = new SavingsAccountController(
    savingsAccountRepository,
    accountRepository,
    notificationRepository,
    notificationService,
    uuidService,
    userRepository,
    savingsProductRepository,
    transactionRepository
);

router.get(
    "/",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.CLIENT]), // Allow both manager and client
    (req, res) => savingsAccountController.getAllSavingsAccounts(req, res)
);

router.post(
    "/", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.createSavingsAccount(req, res)
);

router.get(
    "/:accountNumber", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.getSavingsAccount(req, res)
);

router.put(
    "/:accountNumber", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.updateSavingsAccountConfig(req, res)
);

router.put(
    "/:accountNumber/interest-rate", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.updateInterestRate(req, res)
);

router.put(
    "/:accountNumber/max-deposit", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
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
    authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), 
    (req, res) => savingsAccountController.getInterestSummary(req, res)
);

// Deposit to savings account
router.post(
    "/:accountNumber/deposit",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.CLIENT]),
    (req, res) => savingsAccountController.depositToSavingsAccount(req, res)
);

router.post(
    "/:accountNumber/withdraw",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.CLIENT]),
    (req, res) => savingsAccountController.withdrawFromSavingsAccount(req, res)
);

// Delete savings account
router.delete(
    "/:accountNumber",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER]),
    (req, res) => savingsAccountController.deleteSavingsAccount(req, res)
);

export default router;
