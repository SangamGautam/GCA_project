import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ReportsMenuComponent } from './components/reports-menu/reports-menu.component';
import { DatabaseFrequencyReportsComponent } from './components/database-frequency-reports/database-frequency-reports.component';
import { DataAnalysisReportsComponent } from './components/data-analysis-reports/data-analysis-reports.component';
import { DataExportsComponent } from './components/data-exports/data-exports.component';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'reports-menu',
    component: ReportsMenuComponent,
    title: 'Reports Menu'
  },
  {
    path: 'database-frequency-reports',
    component: DatabaseFrequencyReportsComponent,
    title: 'Database Frequency Reports',
    canActivate: [AuthGuard] // Protect this route with AuthGuard
  },
  {
    path: 'data-analysis-reports',
    component: DataAnalysisReportsComponent,
    title: 'Data Analysis Reports',
    canActivate: [AuthGuard] // Protect this route with AuthGuard
  },
  {
    path: 'data-exports',
    component: DataExportsComponent,
    title: 'Data Exports',
    canActivate: [AuthGuard] // Protect this route with AuthGuard
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route redirects to login
];
