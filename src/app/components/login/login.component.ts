import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { InputComponent } from '@/app/components/input/input.component'
import { ApiService } from '@/app/services/api.service'
import { UserService } from '@/app/services/user.service'
import { DynamicObject } from '@/types'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  data: DynamicObject = {}
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
  ) {}

  adminLogin() {
    this.data = {
      login: 'admin',
      password: 'admin'
    }
    this.handleSubmitForm()
  }

  handleInputChange($event: KeyboardEvent) {
    const target = $event.target as HTMLInputElement
    this.data[target.name] = target.value
  }

  handleSubmitForm($event?: SubmitEvent) {
    $event && $event.preventDefault()
    this.apiService.login(this.data).then((response) => {
      localStorage.setItem('authToken', response.token)
      this.apiService.setAuthToken(response.token)
      this.userService.data = response
      this.router.navigate(['/dashboard'])
    })
  }
}
