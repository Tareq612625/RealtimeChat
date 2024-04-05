import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },    
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'',
        component:LayoutComponent,
        children: [
          {
            path:'dashboard',
            component:DashboardComponent
          }
        ]
    },
    {
        path:'',
        component:ChatComponent,
        children: [
          {
            path:'chat',
            component:ChatComponent
          }
        ]
    },
    {
        path:'**',
        component:LoginComponent
    }
];
