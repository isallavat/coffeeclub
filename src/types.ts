export type TMenuItem = {
  id: string
  name: string
  size: number
  price: number
}

export type TOrderItem = {
  id: string
  name: string
  size: number
  price: number
  count: number
}

export type TStaffItem = {
  id: string
  name: string
  phone: string
  transactions?: number
  amount?: number
}

export type TUser = {
  id: string
  name: string
  phone: string
  type: string
  token: string
}

export type TOrder = {
  id: string
  client_name: string
  client_phone: string
  items: TOrderItem[]
}

export type TNotification = {
  id?: string
  title: string
  type: 'success' | 'error' | 'warning' | 'info'
  text?: string
}

export type DynamicObject = { [key: string]: any }
