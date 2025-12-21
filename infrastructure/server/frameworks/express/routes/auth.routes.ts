import express from 'express'
import { AuthController } from '../controller/auth.controller';
import {registerUserConfirmedSubscriber} from '../../../../subscribers/UserConfirmedSuscriber';
import {accountRepository, userRepository, roleRepository, userRoleRepository,tokenService, passwordService,emailService, emailTemplateService,registrationTokenGeneratorService, localeService, uuidService,eventBus } from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
const router = express.Router();


registerUserConfirmedSubscriber(eventBus,accountRepository );
const authController = new AuthController(userRepository, roleRepository, userRoleRepository,tokenService, passwordService, emailService,emailTemplateService,registrationTokenGeneratorService, localeService, uuidService, eventBus);


router.post("/register", (req, res) => authController.register(req,res));
router.get("/confirm", (req, res) => authController.confirmRegistration(req, res));
router.post("/login", (req, res) => authController.login(req,res));
router.post("/refresh-token", (req, res) => authController.refreshToken(req,res));
router.get("/profile", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => authController.getUserProfile(req,res));
router.post("/logout", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER, RoleEnum.BANK_ADVISOR]), (req, res) => authController.logout(req,res));
router.post("/register/advisor", (req, res) => authController.registerAdvisor(req,res));
router.get(
  "/getAdvisors",
  verifyTokenAccess,
  authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]),
  (req, res) => authController.getAdvisors(req, res),
);
router.post("/create-advisor", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req, res) => authController.registerAdvisor(req, res))
router.post("/create-manager", (req, res) => authController.registerManager(req, res))
export default router;