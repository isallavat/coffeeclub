import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { IconComponent } from '@/app/components/icon/icon.component'
import { NotificationsService } from '@/app/services/notifications.service'

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  constructor(private notificationsService: NotificationsService) {}

  get notifications() {
    return this.notificationsService.notifications
  }

  getIconName(type: string) {
    const icons = {
      info: 'info',
      success: 'success',
      warning: 'info',
      error: 'error'
    }

    return icons[type as keyof typeof icons]
  }

  closeNotification(id: string) {
    this.notificationsService.removeNotification(id)
  }
}
