import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import StockTransactionsController from '#controllers/stock_transactions_controller.js'
import app from '@adonisjs/core/services/app'


const getStockTransactionsController = (async () => {
  return new StockTransactionsController(
    await app.container.make('stockTransactionRepository')
  )
})()

router
  .group(() => {
    router
      .get('/', async (ctx) => (await getStockTransactionsController).getUserTransactions(ctx))
      .use(middleware.auth())

    router
      .get('/:symbol', async (ctx) => (await getStockTransactionsController).getTransactionsBySymbol(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-transactions')
