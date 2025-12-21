import express from "express";
import { ContentController } from "../controller/content.controller";
import { contentRepository, orderService, uuidService } from "../../../../adapters/config/repositories";
import { verifyTokenAccess } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

const router = express.Router();
const contentController = new ContentController(contentRepository, orderService, uuidService);

router.post("/create",verifyTokenAccess,authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => contentController.create(req, res));
router.get("/:id", verifyTokenAccess, (req, res) => contentController.getById(req, res));
router.get("/news/:newsId", verifyTokenAccess, (req, res) => contentController.getByNewsId(req, res));
router.put("/update",verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => contentController.update(req, res));
router.delete("/:id", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => contentController.delete(req, res));
router.post("/reorder/:newsId", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => contentController.reorder(req, res));

export default router;
