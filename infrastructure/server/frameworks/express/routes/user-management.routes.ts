import express from 'express';
import { UserManagementController } from '../controller/user-management.controller';
import {
    userRepository,
    roleRepository,
    userRoleRepository,
    accountRepository,
    savingsAccountRepository,
    notificationRepository
} from '../../../../adapters/config/repositories';
import {
    notificationService,
    uuidService
} from '../../../../adapters/config/services';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';

const router = express.Router();

const userManagementController = new UserManagementController(
    userRepository,
    roleRepository,
    userRoleRepository,
    accountRepository,
    savingsAccountRepository,
    notificationRepository,
    notificationService,
    uuidService
);

router.get(
    "/", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => userManagementController.getAllUsers(req, res)
);

router.get(
    "/clients", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => userManagementController.getClientUsers(req, res)
);

router.get(
    "/advisors", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => userManagementController.getAdvisorUsers(req, res)
);

router.put(
    "/:id", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => userManagementController.updateUser(req, res)
);

router.delete(
    "/:id", 
    verifyTokenAccess, 
    authorizeRoles([RoleEnum.BANK_MANAGER]), 
    (req, res) => userManagementController.deleteUser(req, res)
);

router.put(
    "/:id/ban",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER]),
    (req, res) => userManagementController.banUser(req, res)
);

router.put(
    "/:id/unban",
    verifyTokenAccess,
    authorizeRoles([RoleEnum.BANK_MANAGER]),
    (req, res) => userManagementController.unbanUser(req, res)
);

export default router;
