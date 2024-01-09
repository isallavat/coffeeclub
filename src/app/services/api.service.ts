import { Injectable } from '@angular/core'
import { TMenuItem, TOrder, TStaffItem, TUser } from '@/types'
import { NotificationsService } from './notifications.service'
import env from '@/env.json'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiHost =
    !env.apiHost || env.apiHost[0] === '/' ? window.location.origin + env.apiHost : env.apiHost
  private token = ''

  constructor(private notificationsService: NotificationsService) {}

  makeRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      let apiHost = this.apiHost
      if (apiHost[0] === '/') {
        apiHost = window.location.origin + apiHost
      }
      init.headers = {
        'Content-Type': 'application/json'
      }

      if (this.token) {
        init.headers['Authorization'] = `Bearer ${this.token}`
      }

      if (init.body) {
        init.body = JSON.stringify(init.body)
      }

      fetch(`${apiHost}${url}`, init)
        .then((response) => {
          if (response.ok) {
            resolve(response.json())
          } else {
            throw new Error(response.statusText)
          }
        })
        .catch((err) => {
          this.notificationsService.addNotification({
            type: 'error',
            title: err.message
          })
          reject(err)
          return err
        })
    })
  }

  setAuthToken(token: string) {
    this.token = token
  }

  login(data: any) {
    return this.makeRequest<TUser>('/api/login', {
      method: 'post',
      body: data
    })
  }

  getProfile() {
    return this.makeRequest<TUser>('/api/me')
  }

  getMenu() {
    return this.makeRequest<TMenuItem[]>('/api/menu')
  }

  addMenuItem(data: any) {
    return this.makeRequest<TMenuItem>('/api/menu', {
      method: 'post',
      body: data
    })
  }

  deleteMenuItem(id: string) {
    return this.makeRequest(`/api/menu/${id}`, {
      method: 'delete'
    })
  }

  getUsers() {
    return this.makeRequest<TStaffItem[]>('/api/users')
  }

  addUser(data: any) {
    return this.makeRequest<TStaffItem>('/api/users', {
      method: 'post',
      body: data
    })
  }

  deleteUser(id: string) {
    return this.makeRequest(`/api/users/${id}`, {
      method: 'delete'
    })
  }

  createOrder(data: any) {
    return this.makeRequest<TOrder>('/api/orders', {
      method: 'post',
      body: data
    })
  }
}
