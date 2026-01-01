import vine from '@vinejs/vine'

export const createStockValidator = vine.object({
  symbol: vine.string(),
  companyName: vine.string(),
  name: vine.string(),
  currentPrice: vine.number(),
  currency: vine.string(),
  isActionAvailable: vine.boolean(),
  totalShares: vine.number()
})

export const updateStockValidator = vine.object({
  id: vine.string(),
  companyName: vine.string(),
  name: vine.string(),
  currency: vine.string(),
  isActionAvailable: vine.boolean()
})

export const changeStockValidator = vine.object({
  isActionAvailable: vine.boolean()
})

export const changeAvailabilityValidator = vine.object({
  isActionAvailable: vine.boolean()
})

export const purchaseIPOValidator = vine.object({
  stockSymbol: vine.string(),
  quantity: vine.number()
})

export const purchaseIPOSharesValidator = vine.object({
  stockSymbol: vine.string(),
  quantity: vine.number()
})

export const launchIPOValidator = vine.object({
  stockSymbol: vine.string(),
  totalShares: vine.number(),
  pricePerShare: vine.number()
})

export const openIPOValidator = vine.object({
  sharesToMakeAvailable: vine.number(),
  ipoType: vine.string().optional()
})

export const closeIPOValidator = vine.object({
  stockSymbol: vine.string()
})
