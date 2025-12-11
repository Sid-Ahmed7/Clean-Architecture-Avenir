import { Request, Response } from "express";
import {InMemoryStockRepository} from "../../../../adapters/repositories/InMemoryStockRepository";
import { StockEntity } from "../../../../../domain/entities/StockEntity";
import { ChangeStockAvailabilityUseCase } from "../../../../../application/usecases/stocks/ChangeStockAvailabilityUseCase";
import { GetStockByIdUseCase } from "../../../../../application/usecases/stocks/GetStockByIdUseCase";
import { GetStockBySymbolUseCase } from "../../../../../application/usecases/stocks/GetStockBySymbolUseCase";
import { GetAllStockUseCase } from "../../../../../application/usecases/stocks/GetAllStockUseCase";
import { CreateStockUseCase } from "../../../../../application/usecases/stocks/CreateStockUseCase";
import { UpdateStockUseCase  } from "../../../../../application/usecases/stocks/UpdateStockUseCase";
import { UpdateStockPriceUseCase   } from "../../../../../application/usecases/stocks/UpdateStockPriceUseCase";
import { DeleteStockUseCase } from "../../../../../application/usecases/stocks/DeleteStockUseCase";
import { ListAvailableStocksUseCase} from "../../../../../application/usecases/stocks/ListAvailableStocksUseCase";
import { StockAlreadyExistsError } from "../../../../../application/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../../../application/errors/StockNotFoundError";
import {OrderBookEngineService} from "../../../../adapters/services/order/OrderBookEngineService";
import { InMemoryStockOrderRepository } from "../../../../adapters/repositories/InMemoryStockOrderRepository";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { createStockSchema } from "../schemas/stocks/createStockSchema";
import { changeStockSchema } from "../schemas/stocks/changeStockSchema";
import { updateStockSchema } from "../schemas/stocks/updateStockSchema";
export class StockController {

    
    constructor(
        private readonly stockRepository: InMemoryStockRepository,
        private readonly stockOrderRepository: InMemoryStockOrderRepository,
        private readonly orderBookService: OrderBookEngineService,
        private readonly uuidGenerator: CryptoUuidGenerator
    ) {}

    async createStock(req: Request, res: Response) {
        const createStockUseCase = new CreateStockUseCase(this.stockRepository, this.uuidGenerator); 
        const parseResult = createStockSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const result = await createStockUseCase.execute({
            ...parseResult.data,
            previousPrice: typeof parseResult.data.previousPrice === "number" ? parseResult.data.previousPrice : 0
        });
        
        if(result instanceof Error) {
            if(result instanceof StockAlreadyExistsError) {
                return res.status(409).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }

    return res.status(201).json(result);
    }

    async updateStock(req: Request, res: Response) {
        const parseResult = updateStockSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const { id, companyName, name, currency, isActionAvailable } = parseResult.data;

        const existingStock = await this.stockRepository.findStockById(id);
        if (existingStock instanceof StockNotFoundError) {
            return res.status(404).json({ error: existingStock.message });
        }
        if (existingStock instanceof Error) {
            return res.status(500).json({ error: existingStock.message });
        }

        const currentPrice = existingStock.currentPrice;
        const previousPrice = existingStock.previousPrice ?? existingStock.currentPrice;
        const rateOfChange = existingStock.rateOfChange ?? 0;

        const stockEntityOrError = StockEntity.from(
            existingStock.id,
            existingStock.symbol,
            companyName,
            name,
            currentPrice,
            rateOfChange,
            currency,
            existingStock.createdAt,
            isActionAvailable,
            new Date(),
            previousPrice
        );

        if (stockEntityOrError instanceof Error) {
            return res.status(400).json({ error: stockEntityOrError.message });
        }

        const updateStockUseCase = new UpdateStockUseCase(this.stockRepository);
        const result = await updateStockUseCase.execute(stockEntityOrError);

        if(result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getStockById(req: Request, res: Response) {
        const getStockByIdUseCase = new GetStockByIdUseCase(this.stockRepository); 

        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Stock ID is required" });
        }
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
        const getStockBySymbolUseCase = new GetStockBySymbolUseCase(this.stockRepository);
        const symbol = req.params.symbol;
        if (!symbol) {
            res.status(400).json({ error: "Missing stock symbol" });
            return;
        }
        const result =  await getStockBySymbolUseCase.execute(symbol);

        if(result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async getAllStocks(req: Request, res: Response) {
        const getAllStockUseCase = new GetAllStockUseCase(this.stockRepository)
        const result = await getAllStockUseCase.execute();

        if(result instanceof Error) {
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }


    async deleteStock(req: Request, res: Response) {
        const deleteStockUseCase = new DeleteStockUseCase(this.stockRepository);
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Stock ID is required" });
        }
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
        const changeStockAvailabilityUseCase = new ChangeStockAvailabilityUseCase(this.stockRepository);
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Stock ID is required" });
        }
        const parseResult = changeStockSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await changeStockAvailabilityUseCase.execute(id, parseResult.data.isActionAvailable);

        if(result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
           return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }


    async listAvailableStocks(req: Request, res: Response) {
        const listAvailableStocksUseCase = new ListAvailableStocksUseCase(this.stockRepository);

        const result = await listAvailableStocksUseCase.execute();

        if (result instanceof Error) {
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }
        async updateStockPrice(req: Request, res: Response) {
        const symbol = req.params.symbol;
        const updateStockPriceUseCase = new UpdateStockPriceUseCase(this.stockRepository, this.stockOrderRepository, this.orderBookService);
        if (!symbol){
            return res.status(400).json({ error: "Any symbol provided" });
        } 

        const result = await updateStockPriceUseCase.execute(symbol);

        if (result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }
}