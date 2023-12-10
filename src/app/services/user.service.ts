import { Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { TUser } from '@/types'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  data: TUser | undefined
  constructor(private apiService: ApiService) {}

  init(token: string) {
    this.apiService.setAuthToken(token)
    return this.apiService.getProfile().then((response) => {
      this.data = response
    })
  }

  logout() {
    this.data = undefined
    localStorage.removeItem('authToken')
    this.apiService.setAuthToken('')
  }
}
