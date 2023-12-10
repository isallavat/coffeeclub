import { Routes } from '@angular/router'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { StaffComponent } from './components/staff/staff.component'
import { MenuComponent } from './components/menu/menu.component'

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'staff', component: StaffComponent }
]
