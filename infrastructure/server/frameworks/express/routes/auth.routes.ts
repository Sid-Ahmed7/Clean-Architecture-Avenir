import express from 'express'
import { JwtTokenService } from '../../../../adapters/services/auth/JwtTokenService';
import { PasswordEncryptionService } from '../../../../adapters/services/auth/PasswordEncryptionService';
import {ResendEmailService} from '../../../../adapters/services/ResendEmailService';
import {RegistrationTokenService} from '../../../../adapters/services/auth/RegistrationTokenService';
import { InMemoryRoleRepository } from '../../../../adapters/repositories/InMemoryRoleRepository';
import { InMemoryUserRoleRepository } from '../../../../adapters/repositories/InMemoryUserRoleRepository';
import { AuthController } from '../controller/auth.controller';
import {registerUserConfirmedSubscriber} from '../../../../subscribers/UserConfirmedSuscriber';
import {accountRepository, userRepository, roleRepository, userRoleRepository,tokenService, passwordService, emailService, emailTemplateService,registrationTokenGeneratorService, eventBus } from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
import { EmailTemplateService } from '../../../../adapters/services/EmailTemplateService';
const router = express.Router();


registerUserConfirmedSubscriber(eventBus,accountRepository );
const authController = new AuthController(userRepository, roleRepository, userRoleRepository,tokenService, passwordService, emailService, emailTemplateService,registrationTokenGeneratorService, eventBus);


router.post("/register", (req, res) => authController.register(req,res));
router.get("/confirm", (req, res) => authController.confirmRegistration(req, res));
router.post("/login", (req, res) => authController.login(req,res));
router.post("/refresh-token", (req, res) => authController.refreshToken(req,res));
router.get("/profile", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.ADMIN, RoleEnum.BANK_MANAGER]), (req, res) => authController.getUserProfile(req,res));
router.post("/logout", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.ADMIN, RoleEnum.BANK_ADVISOR]), (req, res) => authController.logout(req,res));
router.post("/register/advisor", (req, res) => authController.registerAdvisor(req,res));
router.get("/getAdvisors", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => authController.getAdvisors(req, res))
router.post("/create-advisor", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req, res) => authController.registerAdvisor(req, res))
router.post("/create-manager", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req, res) => authController.registerManager(req, res))
router.post("/create-admin", (req, res) => authController.createAdmin(req, res));
export default router;
