import express from 'express'
import { AccountController } from '../controller/account.controller'
import { accountRepository, transactionRepository, overdraftRequestRepository, loanRequestRepository, userRepository, notificationRepository} from '../../../../adapters/config/repositories';
import { accountNumberGenerator, ibanGenerator, uuidService, transferLimitService, transferValidationService, transactionEnrichmentService, notificationService, manageAllowedAccountStatusService, statusMessageService} from '../../../../adapters/config/services'
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
const router = express.Router();

const accountController = new AccountController(
    accountRepository,
    accountNumberGenerator,
    ibanGenerator,
    transactionRepository,
    overdraftRequestRepository,
    loanRequestRepository,
    userRepository,
    uuidService,
    transferLimitService,
    transferValidationService,
    transactionEnrichmentService,
    notificationRepository,
    notificationService,
    manageAllowedAccountStatusService,
    statusMessageService
);
router.get("/my-accounts", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.getUserAccounts(req, res));
router.post("/create", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.createAnAccount(req,res));
router.post("/create/sub", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => accountController.createSubAccount(req,res));
router.put("/update", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateAccount(req,res));


router.get("/overdraft-requests", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getPendingOverdraftRequests(req,res));
router.put("/overdraft-requests/:requestId/response", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req,res) => accountController.respondOverdraftIncrease(req,res));
router.get("/overdraft-requests/:requestId/details", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getOverdraftRequestDetails(req,res));
router.post("/:accountNumber/overdraft-limit/request", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.requestOverdraftIncrease(req,res));

router.get("/:accountNumber/rib", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), (req, res) => accountController.downloadRib(req, res));
router.get("/:accountNumber",verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAccount(req,res));
router.get("/", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAllAccount(req,res));
router.delete("/:accountNumber",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.deleteAccount(req,res));
router.get("/iban/:iban", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getAccountByIban(req,res));
router.put("/:accountNumber/status",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.changeStatusOfAccount(req,res));
router.put("/:accountNumber/name",verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateAccountName(req,res));
router.put("/:accountNumber/withdrawal-limit",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateWithdrawalLimit(req,res));
router.put("/:accountNumber/transfer-limit",verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateTransferLimit(req,res));
router.put("/:accountNumber/overdraft-limit",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.updateOverdraftLimit(req,res));
router.put("/:accountNumber/active", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req,res) => accountController.toggleAccountActive(req,res));
router.post("/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.transferBetweenAccounts(req,res));
router.post("/quick-transfer", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.quickTransfer(req,res));
router.get("/transactions/history", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getTransactionHistory(req,res));
router.get("/transactions/last", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req,res) => accountController.getLastTransactions(req,res));


export default router;