import vine from '@vinejs/vine'

export const createGroupValidator = vine.object({
  name: vine.string().minLength(1).maxLength(100)
})

export const sendGroupMessageValidator = vine.object({
  content: vine.string().minLength(1)
})
