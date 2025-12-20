import express from 'express';
import { BeneficiaryGroupController } from '../controller/beneficiary-group.controller';
import { uuidService, beneficiaryGroupRepository, beneficiaryRepository, accountRepository, transactionRepository } from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';

const router = express.Router();

const beneficiaryGroupController = new BeneficiaryGroupController(beneficiaryGroupRepository, beneficiaryRepository, uuidService, accountRepository, transactionRepository);

router.post("/", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.createBeneficiaryGroup(req, res));
router.get("/", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.getGroupsByUser(req, res));
router.post("/:groupId/beneficiaries", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.addBeneficiaryToGroup(req, res));
router.delete("/:groupId/beneficiaries/:beneficiaryId", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.removeBeneficiaryFromGroup(req, res));
router.delete("/:groupId", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.deleteBeneficiaryGroup(req, res));
router.post("/:groupId/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => beneficiaryGroupController.transferToGroup(req, res));

export default router;
