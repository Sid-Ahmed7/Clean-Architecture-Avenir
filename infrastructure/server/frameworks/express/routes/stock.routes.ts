import express from 'express'
import { StockController } from '../controller/stock.controller';

const router = express.Router();
const stockController = new StockController();

router.post("/create", (req, res) => stockController.createStock(req,res));
router.get("/", (req,res) => stockController.getAllStocks(req,res));
router.get("/by-symbol", (req,res) => stockController.getStockBySymbol(req,res));
router.get("/:id", (req,res) => stockController.getStockByIdUseCase(req,res));
router.delete("/:id", (req,res) => stockController.deleteStock(req,res));
router.put("/:id/availability", (req,res) => stockController.changeStockAvailability(req,res));


export default router;