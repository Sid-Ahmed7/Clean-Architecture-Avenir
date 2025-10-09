import express from 'express'
import { JwtTokenService } from '../../../../adapters/services/auth/JwtTokenService';
import { PasswordEncryptionService } from '../../../../adapters/services/auth/PasswordEncryptionService'
import { InMemoryUserRepository } from '../../../../adapters/repositories/InMemoryUserRepository';
import { InMemoryRoleRepository } from '../../../../adapters/repositories/InMemoryRoleRepository';
import { InMemoryUserRoleRepository } from '../../../../adapters/repositories/InMemoryUserRoleRepository';
import { AuthController } from '../controller/auth.controller';
import { verifyTokenAccess } from '../middleware/authMiddleware';

const router = express.Router();

const tokenService = new JwtTokenService();
const passwordService = new PasswordEncryptionService();
const userRepository = new InMemoryUserRepository(passwordService);
const roleRepository = new InMemoryRoleRepository();
const userRoleRepository = new InMemoryUserRoleRepository(roleRepository, userRepository);
const authController = new AuthController(userRepository, roleRepository, userRoleRepository,tokenService, passwordService);


router.post("/register", (req, res) => authController.register(req,res));
router.post("/login", (req, res) => authController.login(req,res));
router.post("/refresh-token", (req, res) => authController.refreshToken(req,res));
router.get("/profile", verifyTokenAccess, (req, res) => authController.getUserProfile(req,res));
router.post("/logout", verifyTokenAccess, (req, res) => authController.logout(req,res));

export default router;