import express from 'express'
import { transactionRepository} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
import { StockPositionController } from '../controller/stockPosition.controller';
import { StockTransactionController } from '../controller/stockTransaction.controller';
const router = express.Router();
const stockTransactionsController = new StockTransactionController(transactionRepository);

router.get("/", verifyTokenAccess, (req,res) => stockTransactionsController.getUserTransaction(req, res));
router.get("/:symbol", verifyTokenAccess, (req,res) => stockTransactionsController.getTransactionBySymbol(req, res));
export default router;