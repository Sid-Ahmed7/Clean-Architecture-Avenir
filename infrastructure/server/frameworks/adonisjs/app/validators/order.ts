import { OrderTypeEnum } from '#config/enums.js'
import vine from '@vinejs/vine'

export const placeOrderValidator = vine.object({
  orderType: vine.enum(Object.values(OrderTypeEnum)),
  quantity: vine.number(),
  orderPrice: vine.number(),
  stockSymbol: vine.string()
})

export const cancelOrderValidator = vine.object({
  stockSymbol: vine.string(),
  quantity: vine.number(),
  orderPrice: vine.number(),
  orderType: vine.enum(Object.values(OrderTypeEnum)),
  fee: vine.number()
})
