import express from 'express'
import { stockRepository, stockOrderRepository, orderBookService, transactionRepository, holdingRepository, orderService, matchingService, orderValidationService, accountService} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
import { StockOrderController } from '../controller/stockOrder.controller';
const router = express.Router();
const stockOrderController = new StockOrderController(stockOrderRepository, transactionRepository,stockRepository, holdingRepository, matchingService, orderBookService, orderValidationService,accountService);

router.post("/create", verifyTokenAccess, (req,res) => stockOrderController.placeOrder(req,res));
router.get("/", verifyTokenAccess, (req,res) => stockOrderController.getUserOrders(req,res));
router.post("/match/:symbol", verifyTokenAccess,authorizeRoles([RoleEnum.BANK_ADVISOR]), (req,res) => stockOrderController.matchOrders(req,res));

export default router;