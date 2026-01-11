import express from 'express'
import { ChatController } from '../controller/chat.controller';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
import {io, clients, onlineUsers } from "../sockets/socket";
import {conversationRepository, messageRepository,notificationRepository,userRepository} from "../../../../adapters/config/repositories";
import {notificationService, uuidService} from "../../../../adapters/config/services";
const router = express.Router();

const chatController = new ChatController(conversationRepository, messageRepository, userRepository,uuidService,notificationRepository, notificationService,io,clients,onlineUsers);

router.get("/conversations", verifyTokenAccess,authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => chatController.getPendingConversation(req,res));
router.post("/conversation/create", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT]), (req, res) => chatController.createConversation(req,res));
router.post("/send", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]), (req, res) => chatController.sendMessage(req,res));
router.post("/mark-read", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req,res) => chatController.markMessageAsRead(req,res));
router.post("/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => chatController.transferConversation(req, res));
router.get("/conversations/assigned", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => chatController.getAdvisorConversation(req,res));
router.get("/conversations/client", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT]), (req, res) => chatController.getClientConversation(req,res));
router.get("/:conversationId/messages", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]), (req, res) => chatController.getConversationMessages(req, res));

export default router;

