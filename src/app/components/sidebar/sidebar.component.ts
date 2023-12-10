import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { IconComponent } from '@/app/components/icon/icon.component'
import { UserService } from '@/app/services/user.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private userService: UserService) {}

  menu =
    this.userService.data?.type === 'admin'
      ? [
          {
            url: '/dashboard',
            icon: 'home'
          },
          {
            url: '/menu',
            icon: 'menu'
          },
          {
            url: '/staff',
            icon: 'users'
          }
        ]
      : [
          {
            url: '/dashboard',
            icon: 'home'
          }
        ]
}
