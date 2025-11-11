import express from "express";
import { NotificationController } from "../controller/notification.controlller";
import {notificationRepository, notificationService} from "../../../../adapters/config/repositories";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";
const router = express.Router();

const notificationController = new NotificationController(notificationRepository, notificationService);

router.get("/subscribe", verifyTokenAccess, (req, res) => notificationController.subscribe(req, res));
router.post("/create", verifyTokenAccess, (req, res) =>  notificationController.createNotification(req, res));
router.post("/send-notification", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) =>  notificationController.sendNotificationToClient(req, res));
router.get("/", verifyTokenAccess, (req, res) => notificationController.getUserNotification(req, res));
router.put("/read", verifyTokenAccess, (req, res) => notificationController.markNotificationAsRead(req, res));
router.delete("/:id", verifyTokenAccess, (req, res) => notificationController.deleteNotification(req, res));

export default router;