import { Request, Response } from "express";
import {InMemoryStockRepository} from "../../../adapters/repositories/InMemoryStockRepository";
import { ChangeStockAvailability } from "../../../../../application/usecases/stocks/ChangeStockAvailabilityUseCase";
import { GetStockByIdUseCase } from "../../../../../application/usecases/stocks/GetStockByIdUseCase";
import { GetStockBySymbolUseCase } from "../../../../../application/usecases/stocks/GetStockBySymbolUseCase";
import { GetAllStockUseCase } from "../../../../../application/usecases/stocks/GetAllStockUseCase";
import { CreateStockUseCase } from "../../../../../application/usecases/stocks/CreateStockUseCase";
import { DeleteStockUseCase } from "../../../../../application/usecases/stocks/DeleteStockUseCase";
import { StockAlreadyExistsError } from "../../../../../domain/errors/StockAlreadyExistsError";
import { error } from "console";
import { StockNotFoundError } from "../../../../../domain/errors/StockNotFoundError";

const stockRepository = new InMemoryStockRepository();
const getStockByIdUseCase = new GetStockByIdUseCase(stockRepository);
const getStockBySymbolUseCase = new GetStockBySymbolUseCase(stockRepository);
const getAllStockUseCase = new GetAllStockUseCase(stockRepository);
const createStockUseCase = new CreateStockUseCase(stockRepository);
const deleteStockUseCase = new DeleteStockUseCase(stockRepository);
const changeStockAvailabilityUseCase = new ChangeStockAvailability(stockRepository);



export class StockController {

    async createStock(req: Request, res: Response) {

        const result = await createStockUseCase.execute(req.body);
        
        if(result instanceof Error) {
            if(result instanceof StockAlreadyExistsError) {
                return res.status(409).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }

    return res.status(201).json(result);
    }

    async getStockByIdUseCase(req: Request, res: Response) {
        const id = Number(req.params.id);
        const result = await getStockByIdUseCase.execute(id);
        
        if(result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getStockBySymbol(req: Request, res: Response) {
        const symbol = req.params.symbol;
        const result =  await getStockBySymbolUseCase.execute(symbol ?? "");

        if(result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getAllStocks(req: Request, res: Response) {
        const result = await getAllStockUseCase.execute();

        if(result instanceof Error) {
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }


    async deleteStock(req: Request, res: Response) {
        const id = Number(req.params.id);
        const result = await deleteStockUseCase.execute(id);

        if(result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json({ message: "Stock deleted successfully" });
    }

    async changeStockAvailability(req: Request, res: Response) {
        const id = Number(req.params.id);
        const isAvailable = req.body.isActionAvailable;

        const result = await changeStockAvailabilityUseCase.execute(id, isAvailable);

        if(result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
           return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }
}