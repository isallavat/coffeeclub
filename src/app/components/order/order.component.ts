import { OrderService } from '@/app/services/order.service'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ModalComponent } from '@/app/components/modal/modal.component'
import { PaymentComponent } from '@/app/components/payment/payment.component'
import { categories } from '@/app/categories'
import { DynamicObject, TOrderItem } from '@/types'
import { NotificationsService } from '@/app/services/notifications.service'

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ModalComponent, PaymentComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  isPayment = false
  categoriesMap = categories.reduce((accumulator: DynamicObject, item) => {
    accumulator[item.name] = item
    return accumulator
  }, {})

  constructor(
    private orderService: OrderService,
    private notificationsService: NotificationsService
  ) {}

  get items() {
    return this.orderService.items
  }

  get totalSum() {
    return this.orderService.totalSum
  }

  increaseOrderItem(item: TOrderItem) {
    this.orderService.addItem(item)
  }

  decreaseOrderItem(item: TOrderItem) {
    this.orderService.deleteItem(item)
  }

  reset() {
    this.orderService.reset()
  }

  handlePayment() {
    this.orderService.reset()
    this.notificationsService.addNotification({
      type: 'success',
      title: 'Order success'
    })
  }
}
