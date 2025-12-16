import express from 'express'
import { stockRepository, stockOrderRepository, orderBookService, stockTransactionRepository, holdingRepository, orderService, matchingService, orderValidationService, accountService, uuidService} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
import { StockOrderController } from '../controller/stockOrder.controller';
const router = express.Router();
const stockOrderController = new StockOrderController(stockOrderRepository, stockTransactionRepository,stockRepository, holdingRepository, matchingService, orderBookService, orderValidationService,accountService, uuidService);

router.post("/create", verifyTokenAccess, (req,res) => stockOrderController.placeOrder(req,res));
router.get("/", verifyTokenAccess, (req,res) => stockOrderController.getUserOrders(req,res));
router.get("/all", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req,res) => stockOrderController.getAllOrders(req,res));
router.get("/book/:symbol", verifyTokenAccess, (req,res) => stockOrderController.getOrderBookBySymbol(req,res));
router.post("/match/:symbol", verifyTokenAccess,  (req,res) => stockOrderController.matchOrders(req,res));
router.patch('/:id/cancel', verifyTokenAccess, (req, res) => stockOrderController.cancelOrder(req, res));

export default router;