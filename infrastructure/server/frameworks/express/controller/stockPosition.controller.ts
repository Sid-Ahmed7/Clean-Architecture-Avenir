import { Request, Response } from 'express';
import { StockHoldingRepositoryInterface } from '../../../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface';
import {GetUserPositionsUseCase} from "../../../../../application/usecases/position/GetUserPositionsUseCase";
import {GetPositionDetailsUseCase} from "../../../../../application/usecases/position/GetPositionDetailsUseCase";
import { PositionNotFoundError } from '../../../../../application/errors/PositionNotFoundError';
import { StockNotFoundError } from '../../../../../application/errors/StockNotFoundError';
import { StockRepositoryInterface } from '../../../../../application/ports/repositories/stocks/StockRepositoryInterface';

export class StockPositionController {

    public constructor(
        private readonly stockRepository: StockRepositoryInterface,
        private readonly holdingRepository: StockHoldingRepositoryInterface,
    ){}

    public async getUserPositions(req: Request, res: Response) {
       const userId = req.user?.userId;
       const getUserPositionsUseCase = new GetUserPositionsUseCase(this.holdingRepository, this.stockRepository);
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getUserPositionsUseCase.execute(userId);
        if (result instanceof Error) {
                return res.status(500).json({ error: result.message });
            }

        return res.status(200).json(result);
    }

    
    public async getPositionBySymbol(req: Request, res: Response) {
        const userId = req.user?.userId;
        const stockSymbol = req.params.symbol;
        const getPositionDetailsUseCase = new GetPositionDetailsUseCase(this.holdingRepository, this.stockRepository);

        if (!userId) {
            res.status(401).json({ error: "Unauthorized access" });
            return;
        }

        if (!stockSymbol) {
            res.status(400).json({ error: "Missing stock symbol" });
            return;
        }

        const result = await getPositionDetailsUseCase.execute(userId, stockSymbol);

        if (result instanceof Error) {
            if(result instanceof PositionNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            if(result instanceof StockNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

}