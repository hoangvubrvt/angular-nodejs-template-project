import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardComponent,
    data: {
      title: 'Trang Chính'
    }
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,
        useHash: true
      }
    )
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRouterModule { }
