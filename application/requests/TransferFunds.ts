export interface TransferFunds {
    buyerUserId: string,
    sellerUserId: string,
    quantity: number,
    executionPrice: number,
    buyerFee: number,
    sellerFee: number
}