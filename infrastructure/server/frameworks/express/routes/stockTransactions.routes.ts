import express from 'express'
import { stockTransactionRepository} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { StockTransactionController } from '../controller/stockTransaction.controller';
const router = express.Router();
const stockTransactionsController = new StockTransactionController(stockTransactionRepository);

router.get("/", verifyTokenAccess, (req,res) => stockTransactionsController.getUserTransaction(req, res));
router.get("/:symbol", verifyTokenAccess, (req,res) => stockTransactionsController.getTransactionBySymbol(req, res));
export default router;