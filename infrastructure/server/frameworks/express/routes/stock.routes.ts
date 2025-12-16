import express from 'express'
import { StockController } from '../controller/stock.controller';
import { stockRepository, stockOrderRepository, orderBookService, uuidService, holdingRepository, accountService} from '../../../../adapters/config/repositories';
import { verifyTokenAccess } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { RoleEnum } from '../../../../../domain/enums/RoleEnum';
const router = express.Router();
const stockController = new StockController(stockRepository, stockOrderRepository, orderBookService, uuidService, holdingRepository, accountService);

router.post("/create", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]),(req, res) => stockController.createStock(req,res));
router.get("/",verifyTokenAccess, (req,res) => stockController.getAllStocks(req,res));
router.get("/available", verifyTokenAccess, (req,res) => stockController.listAvailableStocks(req,res));
router.get("/symbol/:symbol", verifyTokenAccess, (req,res) => stockController.getStockBySymbol(req,res));
router.get("/:id", verifyTokenAccess, (req,res) => stockController.getStockById(req,res));
router.put("/update", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req,res)=> stockController.updateStock(req,res));
router.delete("/:id", verifyTokenAccess,authorizeRoles([RoleEnum.ADMIN]), (req,res) => stockController.deleteStock(req,res));
router.patch("/:id/availability",verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]),(req,res) => stockController.changeStockAvailability(req,res));
router.post("/:symbol/update-price", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req,res) => stockController.updateStockPrice(req,res));

router.post("/ipo/purchase", verifyTokenAccess, (req, res) => stockController.purchaseIPOShares(req, res));
router.post("/:symbol/ipo/close", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req, res) => stockController.closeIPO(req, res));
router.post("/:symbol/ipo/open", verifyTokenAccess, authorizeRoles([RoleEnum.ADMIN]), (req, res) => stockController.openIPO(req, res));

export default router;