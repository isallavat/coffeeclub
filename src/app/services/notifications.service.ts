import { Injectable } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { TNotification } from '@/types'

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor() {}

  notifications: TNotification[] = []

  addNotification(notification: TNotification) {
    notification.id = notification.id || uuidv4()

    this.notifications.push(notification)

    setTimeout(() => {
      this.removeNotification(notification.id as string)
    }, 5000)
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(
      (notification: TNotification) => notification.id !== id
    )
  }
}
