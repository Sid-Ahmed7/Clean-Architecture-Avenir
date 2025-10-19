import express from 'express'
import { ChatController } from '../controller/chat.controller';
import { InMemoryConversationRepository } from '../../../../adapters/repositories/InMemoryConversationRepository';
import { InMemoryMessageRepository } from '../../../../adapters/repositories/InMemoryMessageRepository';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';




const router = express.Router();
const conversationRepository = new InMemoryConversationRepository();
const messageRepository = new InMemoryMessageRepository();

const chatController = new ChatController(conversationRepository, messageRepository);

router.post("/send", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT]), (req, res) => chatController.createConversation(req,res));
router.post("/send", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]), (req, res) => chatController.sendMessage(req,res));
router.get("/:conversationId/messages", verifyTokenAccess, authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_ADVISOR]), (req, res) => chatController.getConversationMessages(req, res));
router.post("/mark-read", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req,res) => chatController.markMessageAsRead(req,res));
router.post("/transfer", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => chatController.transferConversation(req, res));

export default router;

