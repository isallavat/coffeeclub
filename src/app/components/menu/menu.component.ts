import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ModalComponent } from '@/app/components/modal/modal.component'
import { InputComponent } from '@/app/components/input/input.component'
import { ApiService } from '@/app/services/api.service'
import { NotificationsService } from '@/app/services/notifications.service'
import { DynamicObject, TMenuItem } from '@/types'
import { categories } from '@/app/categories'

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ModalComponent, InputComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isNewItem = false
  formData: any = {}
  items: TMenuItem[] = []
  categoryOptions = categories.map((item) => ({ value: item.name, label: item.name }))
  categoriesMap = categories.reduce((accumulator: DynamicObject, item) => {
    accumulator[item.name] = item
    return accumulator
  }, {})

  constructor(
    private apiService: ApiService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.apiService.getMenu().then((response) => {
      this.items = response
    })
  }

  deleteItem(id: string) {
    this.apiService.deleteMenuItem(id).then(() => {
      this.items = this.items.filter((item) => item.id !== id)
      this.notificationsService.addNotification({
        type: 'success',
        title: 'Menu item deleted'
      })
    })
  }

  handleInputChange($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement
    this.formData[target.name] = target.value
  }

  handleCloseForm() {
    this.isNewItem = false
    this.formData = {}
  }

  handleSubmitForm($event: SubmitEvent) {
    $event.preventDefault()
    this.apiService.addMenuItem(this.formData as TMenuItem).then((response) => {
      this.items.push(response)
      this.isNewItem = false
      this.formData = {}
      this.notificationsService.addNotification({
        type: 'success',
        title: 'Menu item added'
      })
    })
  }
}
