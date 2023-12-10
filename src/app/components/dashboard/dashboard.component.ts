import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '@/app/services/api.service'
import { OrderService } from '@/app/services/order.service'
import { DynamicObject, TMenuItem } from '@/types'
import { categories } from '@/app/categories'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  menu: TMenuItem[] = []
  categoriesMap = categories.reduce((accumulator: DynamicObject, item) => {
    accumulator[item.name] = item
    return accumulator
  }, {})

  constructor(
    private apiService: ApiService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.apiService.getMenu().then((response) => {
      this.menu = response
    })
  }

  addProductToOrder(id: string) {
    const product = this.menu.find((item) => item.id === id)
    if (product) {
      this.orderService.addItem({ ...product, count: 1 })
    }
  }
}
