import express from 'express';
import { BeneficiaryController } from '../controller/beneficiary.controller';
import { accountRepository, beneficiaryRepository, transactionRepository, notificationRepository, userRepository } from '../../../../adapters/config/repositories';
import { uuidService, notificationService } from '../../../../adapters/config/services';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';

const router = express.Router();

const beneficiaryController = new BeneficiaryController(beneficiaryRepository, accountRepository, uuidService, transactionRepository,userRepository, notificationRepository, notificationService);

router.post("/", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryController.createBeneficiary(req, res));
router.get("/", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryController.getBeneficiariesByUser(req, res));
router.put("/:beneficiaryId", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryController.updateBeneficiary(req, res));
router.delete("/:beneficiaryId", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryController.deleteBeneficiary(req, res));
router.post("/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryController.transferToBeneficiary(req, res));

export default router;
