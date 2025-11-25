import express from 'express'
import { NewsController } from '../controller/news.controller';
import { newsRepository, newsService } from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';

const router = express.Router();
const newsController = new NewsController(newsRepository, newsService);

router.get("/stream", verifyTokenAccess, (req, res) => newsController.subscribe(req, res));
router.post("/create", verifyTokenAccess,  authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => newsController.createNews(req, res));
router.get("/", verifyTokenAccess, (req, res) => newsController.getAllNews(req, res));
router.get("/:id", verifyTokenAccess, (req, res) => newsController.getNewsById(req, res));
router.put("/update", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req,res) => newsController.updateNews(req, res));
router.delete("/delete/:id", verifyTokenAccess, authorizeRoles([RoleEnum.BANK_ADVISOR]), (req, res) => newsController.deleteNews(req, res));

export default router;