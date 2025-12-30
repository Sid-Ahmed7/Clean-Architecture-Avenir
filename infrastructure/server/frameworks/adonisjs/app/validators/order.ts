import { OrderTypeEnum } from '#domain/enums/OrderTypeEnum.js'
import vine from '@vinejs/vine'

export const placeOrderValidator = vine.object({
  orderType: vine.enum(OrderTypeEnum),
  quantity: vine.number(),
  orderPrice: vine.number(),
  stockSymbol: vine.string()
})

export const cancelOrderValidator = vine.object({
  stockSymbol: vine.string(),
  quantity: vine.number(),
  orderPrice: vine.number(),
  orderType: vine.enum(OrderTypeEnum),
  fee: vine.number()
})
