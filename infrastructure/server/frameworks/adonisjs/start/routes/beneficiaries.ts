import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import BeneficiariesController from '#controllers/beneficiaries_controller.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import * as repositories from '#config/repositories.js'

const beneficiariesController = new BeneficiariesController(
  repositories.beneficiaryRepository,
  repositories.accountRepository,
  repositories.uuidService,
  repositories.transactionRepository,
  repositories.userRepository,
  repositories.notificationRepository,
  repositories.notificationService
)

router
  .group(() => {
    router
      .post('/', (ctx) => beneficiariesController.createBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .get('/', (ctx) => beneficiariesController.getBeneficiariesByUser(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .put('/:beneficiaryId', (ctx) => beneficiariesController.updateBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .delete('/:beneficiaryId', (ctx) => beneficiariesController.deleteBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

    router
      .post('/transfer', (ctx) => beneficiariesController.transferToBeneficiary(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))
  })
  .prefix('/api/beneficiaries')
