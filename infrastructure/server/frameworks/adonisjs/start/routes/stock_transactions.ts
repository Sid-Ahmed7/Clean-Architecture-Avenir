import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import StockTransactionsController from '#controllers/stock_transactions_controller.js'
import * as repositories from '#config/repositories.js'

const stockTransactionsController = new StockTransactionsController(
  repositories.stockTransactionRepository
)

router
  .group(() => {
    router
      .get('/', (ctx) => stockTransactionsController.getUserTransactions(ctx))
      .use(middleware.auth())

    router
      .get('/:symbol', (ctx) => stockTransactionsController.getTransactionsBySymbol(ctx))
      .use(middleware.auth())
  })
  .prefix('/api/stock-transactions')
