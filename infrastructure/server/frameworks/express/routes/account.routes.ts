import express from 'express'
import { AccountController } from '../controller/account.controller'
import { GenerateAccountNumberService } from '../../../../adapters/services/GenerateAccountNumberService'
import { GenerateIbanService } from '../../../../adapters/services/GenerateIbanService'
import { accountRepository, accountNumberGenerator, ibanGenerator, transactionRepository, uuidService, transferLimitService, transferValidationService } from '../../../../adapters/config/repositories'
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
const router = express.Router();

const accountController = new AccountController(accountRepository, accountNumberGenerator, ibanGenerator, transactionRepository, uuidService, transferLimitService, transferValidationService);
router.get("/my-accounts", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.getUserAccounts(req, res));
router.post("/create", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.createAnAccount(req,res));
router.post("/create/sub", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.createSubAccount(req,res));
router.put("/update", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateAccount(req,res));
router.get("/:accountNumber",verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAccount(req,res));
router.get("/", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAllAccount(req,res));
router.delete("/:accountNumber",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.deleteAccount(req,res));
router.get("/iban/:iban", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAccountByIban(req,res));
router.put("/:accountNumber/status",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.changeStatusOfAccount(req,res));
router.put("/:accountNumber/name",verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateAccountName(req,res));
router.put("/:accountNumber/withdrawal-limit",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateWithdrawalLimit(req,res));
router.put("/:accountNumber/transfer-limit",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateTransferLimit(req,res));
router.put("/:accountNumber/overdraft-limit",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateOverdraftLimit(req,res));
router.put("/:accountNumber/active", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.toggleAccountActive(req,res));
router.post("/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.transferBetweenAccounts(req,res));
router.get("/transactions/history", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getTransactionHistory(req,res));


export default router;