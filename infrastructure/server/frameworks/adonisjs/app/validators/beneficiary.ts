import vine from '@vinejs/vine'

export const addressValidator = vine.object({
  street: vine.string(),
  city: vine.string(),
  postalCode: vine.string(),
  country: vine.string()
})

export const createBeneficiaryValidator = vine.object({
  iban: vine.string(),
  beneficiaryName: vine.string(),
  email: vine.string().optional(),
  country: vine.string().optional(),
  address: addressValidator.optional()
})

export const updateBeneficiaryValidator = vine.object({
  beneficiaryName: vine.string().optional(),
  email: vine.string().optional(),
  country: vine.string().optional(),
  address: addressValidator.optional()
})

export const createBeneficiaryGroupValidator = vine.object({
  groupName: vine.string(),
  beneficiaryIds: vine.array(vine.string()).optional()
})

export const updateBeneficiaryGroupValidator = vine.object({
  groupName: vine.string().optional(),
  beneficiaryIds: vine.array(vine.string()).optional()
})

export const addBeneficiaryToGroupValidator = vine.object({
  beneficiaryId: vine.string()
})
