import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ModalComponent } from '@/app/components/modal/modal.component'
import { InputComponent } from '@/app/components/input/input.component'
import { ApiService } from '@/app/services/api.service'
import { NotificationsService } from '@/app/services/notifications.service'
import { DynamicObject, TStaffItem } from '@/types'

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, ModalComponent, InputComponent],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent {
  isNewItem = false
  formData: DynamicObject = {}
  items: TStaffItem[] = []

  constructor(
    private apiService: ApiService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.apiService.getUsers().then((response) => {
      this.items = response
    })
  }

  deleteItem(id: string) {
    this.apiService.deleteUser(id).then(() => {
      this.items = this.items.filter((item) => item.id !== id)
      this.notificationsService.addNotification({
        type: 'success',
        title: 'User deleted'
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
    this.apiService.addUser(this.formData as TStaffItem).then((response) => {
      this.items.push(response)
      this.isNewItem = false
      this.formData = {}
      this.notificationsService.addNotification({
        type: 'success',
        title: 'User added'
      })
    })
  }
}
