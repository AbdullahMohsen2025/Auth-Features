import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntraLoginComponent } from './components/entra-login/entra-login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  // Entra ID auth POC
  { path: 'entra-login', component: EntraLoginComponent },
  { path: '**', redirectTo: '' }
];
