import express from 'express'
import { JwtTokenService } from '../../../../adapters/services/auth/JwtTokenService';
import { PasswordEncryptionService } from '../../../../adapters/services/auth/PasswordEncryptionService';
import {ResendEmailService} from '../../../../adapters/services/ResendEmailService';
import {RegistrationTokenService} from '../../../../adapters/services/auth/RegistrationTokenService';
import { InMemoryUserRepository } from '../../../../adapters/repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../../../../adapters/repositories/InMemoryRoleRepository';
import { InMemoryUserRoleRepository } from '../../../../adapters/repositories/InMemoryUserRoleRepository';
import { AuthController } from '../controller/auth.controller';
import {registerUserConfirmedSubscriber} from '../../../../subscribers/UserConfirmedSuscriber';
import {eventBus, accountRepository} from './inMemoryInstance';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
const router = express.Router();

const tokenService = new JwtTokenService();
const passwordService = new PasswordEncryptionService();
const emailService = new ResendEmailService();
const registrationTokenGeneratorService = new RegistrationTokenService();
const userRepository = new InMemoryUserRepository(passwordService);
const roleRepository = new InMemoryRoleRepository();
const userRoleRepository = new InMemoryUserRoleRepository(roleRepository, userRepository);
registerUserConfirmedSubscriber(eventBus,accountRepository );
const authController = new AuthController(userRepository, roleRepository, userRoleRepository,tokenService, passwordService, emailService,registrationTokenGeneratorService, eventBus);


router.post("/register", (req, res) => authController.register(req,res));
router.get("/confirm", (req, res) => authController.confirmRegistration(req, res));
router.post("/login", (req, res) => authController.login(req,res));
router.post("/refresh-token", (req, res) => authController.refreshToken(req,res));
router.get("/profile", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT]), (req, res) => authController.getUserProfile(req,res));
router.post("/logout", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]), (req, res) => authController.logout(req,res));

export default router;