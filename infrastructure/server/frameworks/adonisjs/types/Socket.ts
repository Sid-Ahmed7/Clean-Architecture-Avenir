export interface OnlineUser {
  isOnline: boolean
  role?: string
}

export interface Message {
  userId: string
  role: string
  conversationId: string
  content: string
}

export interface Identification {
  userId: string
  role: string
}

export interface Data {
  conversationId: string
  userId: string
}
