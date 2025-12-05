import express from "express";
import { altService, fileStorageService, mediaRepository, newsRepository, orderService, uuidService } from "../../../../adapters/config/repositories";
import { MediaController } from "../controller/media.controller";
import { mediaUpload } from "../middleware/mediaMiddleware";


const router = express.Router();


const mediaController = new MediaController(mediaRepository, newsRepository,fileStorageService, orderService, altService, uuidService);

router.post("/upload",mediaUpload("media"),(req, res) => mediaController.uploadMedia(req, res));
router.get("/news/:newsId",(req, res) => mediaController.getMediaByNewsId(req, res));
router.put("/update", (req,res) => mediaController.updateMedia(req, res));
router.delete("/:mediaId",(req, res) => mediaController.deleteMedia(req, res));

export default router;
