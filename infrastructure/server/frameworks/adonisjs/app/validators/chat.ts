import vine from '@vinejs/vine'

export const sendMessageValidator = vine.object({
  conversationId: vine.string(),
  content: vine.string()
})

export const transferConversationValidator = vine.object({
  conversationId: vine.string(),
  newAdvisorId: vine.string()
})
