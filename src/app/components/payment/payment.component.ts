import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Output } from '@angular/core'
import { InputComponent } from '@/app/components/input/input.component'
import { OrderService } from '@/app/services/order.service'

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, InputComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Output() onSuccess = new EventEmitter()
  tabs = [
    { name: 'cash', label: 'Cash' },
    { name: 'card', label: 'Bank card' },
    { name: 'gift', label: 'Gift Card' }
  ]
  activeTab = this.tabs[0].name

  constructor(private orderService: OrderService) {}

  handleSubmitForm($event: SubmitEvent) {
    $event.preventDefault()
    this.orderService.submit().then(() => this.onSuccess.emit())
  }
}
