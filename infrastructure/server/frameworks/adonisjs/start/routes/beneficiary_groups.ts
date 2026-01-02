import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import BeneficiaryGroupsController from '#controllers/beneficiary_groups_controller.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import app from '@adonisjs/core/services/app'


const getBeneficiaryGroupsController = (async () => {
  return new BeneficiaryGroupsController(
    await app.container.make('beneficiaryGroupRepository'),
    await app.container.make('beneficiaryRepository'),
    await app.container.make('uuidService'),
    await app.container.make('accountRepository'),
    await app.container.make('transactionRepository'),
    await app.container.make('notificationRepository'),
    await app.container.make('notificationService'),
    await app.container.make('userRepository')
  )
})()

router
  .group(() => {
    router
      .post('/', async (ctx) => (await getBeneficiaryGroupsController).createBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .get('/', async (ctx) => (await getBeneficiaryGroupsController).getGroupsByUser(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .put('/:groupId', async (ctx) => (await getBeneficiaryGroupsController).updateBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .post('/:groupId/beneficiaries', async (ctx) => (await getBeneficiaryGroupsController).addBeneficiaryToGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .delete('/:groupId/beneficiaries/:beneficiaryId', async (ctx) => (await getBeneficiaryGroupsController).removeBeneficiaryFromGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .delete('/:groupId', async (ctx) => (await getBeneficiaryGroupsController).deleteBeneficiaryGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))


    router
      .post('/:groupId/transfer', async (ctx) => (await getBeneficiaryGroupsController).transferToGroup(ctx))
      .use(middleware.auth())
     .use(authorizeRoles([RoleEnum.CLIENT, RoleEnum.BANK_MANAGER]))

  })
  .prefix('/api/beneficiary-groups')
