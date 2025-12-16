

import { OrderStatusEnum } from "../../../domain/enums/OrderStatusEnum";
import { OrderCannotBeCancelledError } from "../../errors/OrderCannotBeCancelledError";
import { UnauthorizedOrderError } from "../../errors/UnauthorizedOrderError";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { AccountService } from "../../ports/services/AccountService";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { OrderTypeEnum } from "../../../domain/enums/OrderTypeEnum";



export class CancelOrderUseCase {
  public constructor(
    private readonly orderRepository: StockOrderRepositoryInterface,
    private readonly accountService: AccountService,
    private readonly holdingRepository: StockHoldingRepositoryInterface
  ) {}

  async execute(orderId: string, userId: string): Promise<void | Error> {
    const order = await this.orderRepository.findOrderById(orderId);

    if(order instanceof Error) {
      return order;
    }

    if (order.userId !== userId) {
      return new UnauthorizedOrderError('Unauthorized: This order does not belong to you');
    }

    if (order.orderStatus !== OrderStatusEnum.PENDING && order.orderStatus !== OrderStatusEnum.PARTIALLY_EXECUTED) {
      return new OrderCannotBeCancelledError(`Cannot cancel order with status: ${order.orderStatus}`);
    }

    if (order.orderType === OrderTypeEnum.BUY) {
      const remainingQuantity = order.remainingQuantity;
      const totalAmount = (remainingQuantity * order.orderPrice) + order.fee;

      const unblockResult = await this.accountService.unblockAccountFunds(userId, totalAmount);
      if (unblockResult instanceof Error) {
        return unblockResult;
      }
    } else if (order.orderType === OrderTypeEnum.SELL) {
      const remainingQuantity = order.remainingQuantity;

      const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId,order.stockSymbol);

      if (position instanceof Error) {
        return position;
      }

      position.unblockShares(remainingQuantity);

      const updatePosition = await this.holdingRepository.updatePosition(position);
      if (updatePosition instanceof Error) {
        return updatePosition;
      }
    }

    order.cancel();

    const updateOrder = await this.orderRepository.updateOrder(order);
    if (updateOrder instanceof Error) {
      return updateOrder;
    }
  }
}