import express from 'express'
import { stockRepository, holdingRepository} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { StockPositionController } from '../controller/stockPosition.controller';
const router = express.Router();
const stockPositionsController = new StockPositionController(stockRepository, holdingRepository);

router.get("/", verifyTokenAccess, (req,res) => stockPositionsController.getUserPositions(req, res));
router.get("/:symbol", verifyTokenAccess, (req,res) => stockPositionsController.getPositionBySymbol(req, res));
export default router;