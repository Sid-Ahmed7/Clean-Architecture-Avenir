import { InsufficientFundsError } from "../../../../domain/errors/InsufficientFundsError";
import { InsufficientSharesError } from "../../../../domain/errors/InsufficientSharesError ";
import { OrderValidation } from "../../../interfaces/OrderValidation";

export interface OrderValidationService {
    validateOrder(orderValidation: OrderValidation) : Promise<void | InsufficientFundsError | InsufficientSharesError>;
}