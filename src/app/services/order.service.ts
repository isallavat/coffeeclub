import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { TOrder, TOrderItem } from '@/types'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  items: TOrderItem[] = []

  constructor(private apiService: ApiService) {}

  get totalSum() {
    return this.items.reduce((accumulator, item) => {
      accumulator += item.price * item.count
      return accumulator
    }, 0)
  }

  addItem(newItem: TOrderItem) {
    const existingItem = this.items.find((item) => item.id === newItem.id)

    if (!existingItem) {
      this.items.push(newItem)
    } else {
      this.items.forEach((item) => {
        if (item.id === newItem.id) {
          item.count += 1
        }
      })
    }
  }

  deleteItem(deletingItem: TOrderItem) {
    const existingItem = this.items.find((item) => item.id === deletingItem.id)

    if (existingItem?.count === 1) {
      this.items = this.items.filter((item) => item.id !== deletingItem.id)
    } else {
      this.items.forEach((item) => {
        if (item.id === deletingItem.id) {
          item.count -= 1
        }
      })
    }
  }

  reset() {
    this.items = []
  }

  submit() {
    const data = {
      client_name: '',
      client_phone: '',
      items: this.items
    }

    return this.apiService.createOrder(data as TOrder)
  }
}
