import express from 'express';
import { DirectorAccountsController } from '../controller/director-accounts.controller';
import { accountRepository, savingsAccountRepository, userRepository } from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';

const router = express.Router();

const directorAccountsController = new DirectorAccountsController(accountRepository,savingsAccountRepository,userRepository);

router.get("/accounts",verifyTokenAccess,authorizeRoles([RoleEnum.BANK_MANAGER]),(req, res) => directorAccountsController.getAllAccounts(req, res));

router.get("/savings-accounts",verifyTokenAccess,authorizeRoles([RoleEnum.BANK_MANAGER]),(req, res) => directorAccountsController.getAllSavingsAccounts(req, res));

export default router;
