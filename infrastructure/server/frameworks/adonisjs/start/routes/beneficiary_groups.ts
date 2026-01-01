import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import BeneficiaryGroupsController from '#controllers/beneficiary_groups_controller.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import * as repositories from '#config/repositories.js'

const beneficiaryGroupsController = new BeneficiaryGroupsController(
  repositories.beneficiaryGroupRepository,
  repositories.beneficiaryRepository,
  repositories.uuidService,
  repositories.accountRepository,
  repositories.transactionRepository,
  repositories.notificationRepository,
  repositories.notificationService,
  repositories.userRepository
)

router
  .group(() => {
    router
      .post('/', (ctx) => beneficiaryGroupsController.createBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .get('/', (ctx) => beneficiaryGroupsController.getGroupsByUser(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .put('/:groupId', (ctx) => beneficiaryGroupsController.updateBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .post('/:groupId/beneficiaries', (ctx) => beneficiaryGroupsController.addBeneficiaryToGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .delete('/:groupId/beneficiaries/:beneficiaryId', (ctx) => beneficiaryGroupsController.removeBeneficiaryFromGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .delete('/:groupId', (ctx) => beneficiaryGroupsController.deleteBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .post('/:groupId/transfer', (ctx) => beneficiaryGroupsController.transferToGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

  })
  .prefix('/api/beneficiary-groups')
