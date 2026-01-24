import { Request, Response } from "express";
import { StockRepositoryInterface } from "../../../../../application/ports/repositories/stocks/StockRepositoryInterface";
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
import { StockOrderRepositoryInterface } from "../../../../../application/ports/repositories/stocks/StockOrderRepositoryInterface";
import { CryptoUuidGenerator } from "../../../../adapters/services/CryptoUuidGenerator";
import { createStockSchema } from "../schemas/stocks/createStockSchema";
import { changeStockSchema } from "../schemas/stocks/changeStockSchema";
import { updateStockSchema } from "../schemas/stocks/updateStockSchema";
import { PurchaseIPOSharesUseCase } from "../../../../../application/usecases/stocks/PurchaseIPOSharesUseCase";
import { CloseIPOUseCase } from "../../../../../application/usecases/stocks/CloseIPOUseCase";
import { OpenIPOUseCase } from "../../../../../application/usecases/stocks/OpenIPOUseCase";
import { StockHoldingRepositoryInterface } from "../../../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface";
import { BankAccountService } from "../../../../adapters/services/BankAccountService";
import { InsufficientFundsError } from "../../../../../domain/errors/InsufficientFundsError";
import { IPONotActiveError } from "../../../../../application/errors/IPONotActiveError";
import { InvalidIPOOperationError } from "../../../../../domain/errors/InvalidIPOOperationError";

export class StockController {


    constructor(
        private readonly stockRepository: StockRepositoryInterface,
        private readonly stockOrderRepository: StockOrderRepositoryInterface,
        private readonly orderBookService: OrderBookEngineService,
        private readonly uuidGenerator: CryptoUuidGenerator,
        private readonly holdingRepository: StockHoldingRepositoryInterface,
        private readonly accountService: BankAccountService
    ) {}

    async createStock(req: Request, res: Response) {
        const createStockUseCase = new CreateStockUseCase(this.stockRepository, this.uuidGenerator); 
        const parseResult = createStockSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
        const result = await createStockUseCase.execute(parseResult.data);
        
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
            existingStock.totalShares,
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
        const result = await getStockByIdUseCase.execute(id as string);

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
        const result =  await getStockBySymbolUseCase.execute(symbol as string);

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
        const result = await deleteStockUseCase.execute(id as string);

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

        const result = await changeStockAvailabilityUseCase.execute(id as string, parseResult.data.isActionAvailable);

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

        const result = await updateStockPriceUseCase.execute(symbol as string);

        if (result instanceof Error) {
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }

    async purchaseIPOShares(req: Request, res: Response) {
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const { stockSymbol, quantity } = req.body;

        if (!stockSymbol || !quantity) {
            return res.status(400).json({ error: "Stock symbol and quantity are required" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be positive" });
        }

        const purchaseIPOSharesUseCase = new PurchaseIPOSharesUseCase(
            this.stockRepository,
            this.holdingRepository,
            this.accountService,
            this.uuidGenerator
        );

        const result = await purchaseIPOSharesUseCase.execute({
            userId,
            stockSymbol,
            quantity
        });

        if (result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof InsufficientFundsError) {
                return res.status(400).json({ error: result.message });
            }
            if (result instanceof IPONotActiveError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json({
            message: `Successfully purchased ${quantity} shares via IPO`,
            position: result
        });
    }

    async closeIPO(req: Request, res: Response) {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({ error: "Stock symbol is required" });
        }

        const closeIPOUseCase = new CloseIPOUseCase(this.stockRepository);
        const result = await closeIPOUseCase.execute(symbol as string);

        if (result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof IPONotActiveError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json({
            message: `IPO closed for ${symbol}`,
            stock: result
        });
    }

    async openIPO(req: Request, res: Response) {
        const { symbol } = req.params;
        const { sharesToMakeAvailable, ipoType } = req.body;

        if (!symbol) {
            return res.status(400).json({ error: "Stock symbol is required" });
        }

        const openIPOUseCase = new OpenIPOUseCase(this.stockRepository);
        const result = await openIPOUseCase.execute(symbol as string, sharesToMakeAvailable, ipoType  );

        if (result instanceof Error) {
            if (result instanceof StockNotFoundError) {
                return res.status(404).json({ error: result.message });
            }
            if (result instanceof IPONotActiveError) {
                return res.status(400).json({ error: result.message });
            }
            if (result instanceof InvalidIPOOperationError) {
                return res.status(400).json({ error: result.message });
            }
            return res.status(400).json({ error: result.message });
        }

        return res.status(200).json({
            message: `IPO opened for ${symbol}`,
            stock: result
        });
    }
}