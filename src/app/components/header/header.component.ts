import { Component } from '@angular/core'
import { IconComponent } from '@/app/components/icon/icon.component'
import { UserService } from '@/app/services/user.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  date = {
    day: 0,
    month: '',
    year: 0,
    hours: '',
    minutes: ''
  }

  constructor(private userService: UserService) {}

  get user() {
    return this.userService.data
  }

  setDate() {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ]
    var date = new Date()

    this.date = {
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      hours: date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours(),
      minutes: date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
    }
    setTimeout(() => this.setDate(), 1000)
  }

  ngOnInit() {
    this.setDate()
  }

  logout() {
    this.userService.logout()
  }
}
