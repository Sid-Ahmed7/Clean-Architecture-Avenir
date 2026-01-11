import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import BeneficiariesController from '#controllers/beneficiaries_controller.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import app from '@adonisjs/core/services/app'


const getBeneficiariesController = (async () => {
  return new BeneficiariesController(
    await app.container.make('beneficiaryRepository'),
    await app.container.make('accountRepository'),
    await app.container.make('uuidService'),
    await app.container.make('transactionRepository'),
    await app.container.make('userRepository'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService')
  )
})()

router
  .group(() => {
    router
      .post('/', async (ctx) => (await getBeneficiariesController).createBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/', async (ctx) => (await getBeneficiariesController).getBeneficiariesByUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:beneficiaryId', async (ctx) => (await getBeneficiariesController).updateBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .delete('/:beneficiaryId', async (ctx) => (await getBeneficiariesController).deleteBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/transfer', async (ctx) => (await getBeneficiariesController).transferToBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/beneficiaries')
