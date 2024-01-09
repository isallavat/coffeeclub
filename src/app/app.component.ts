import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet, Router } from '@angular/router'
import { SidebarComponent } from '@/app/components/sidebar/sidebar.component'
import { HeaderComponent } from '@/app/components/header/header.component'
import { LoginComponent } from '@/app/components/login/login.component'
import { OrderComponent } from '@/app/components/order/order.component'
import { NotificationsComponent } from '@/app/components/notifications/notifications.component'
import { SvgComponent } from '@/app/components/svg/svg.component'
import { UserService } from '@/app/services/user.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    OrderComponent,
    NotificationsComponent,
    SvgComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'coffeeclub'
  isLoading = false
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  get user() {
    return this.userService.data
  }

  ngOnInit() {
    const token = localStorage.getItem('authToken')

    if (token) {
      this.isLoading = true
      this.userService
        .init(token)
        .then(() => {
          this.router.navigate(['/dashboard'])
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
