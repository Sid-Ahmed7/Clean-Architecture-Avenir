
import express from "express";

import { GroupChatController } from "../controller/group-chat.controller";
import { groupConversationRepository, groupMessageRepository, groupParticipantRepository, userRepository } from "../../../../adapters/config/repositories";
import { uuidService } from "../../../../adapters/config/services";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { RoleEnum } from "#domain/enums/RoleEnum";
const router = express.Router();

const groupChatController = new GroupChatController(groupConversationRepository, groupParticipantRepository, groupMessageRepository, userRepository, uuidService);

router.get("/", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.getAllGroups(req, res));
router.post("/create", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.createGroup(req, res));
router.post("/:groupId/join", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.joinGroup(req, res));
router.post("/:groupId/message", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.sendMessage(req, res));
router.get("/:groupId/messages", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.getMessages(req, res));
router.get("/:groupId/participants", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR, RoleEnum.BANK_MANAGER]), (req, res) => groupChatController.getParticipants(req, res));










export default router;