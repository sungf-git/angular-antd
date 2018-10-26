import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent } from './views/header/header.component';
import { LoginComponent } from './views/login/login.component';
import { MainComponent } from './views/main/main.component';
import { HomeComponent } from './views/home/home.component';
import { NewsComponent } from './views/news/news.component';
import { NewseditComponent } from './views/newsedit/newsedit.component';
import { UserlistComponent } from './views/userlist/userlist.component';
import { MonitorComponent } from './views/monitor/monitor.component';

const routes: Routes = [
	{
    path: 'main',
    component: MainComponent,
    children: [{
    	path: 'home',
    	component:HomeComponent
    },{
    	path: 'monitor',
    	component:MonitorComponent
    },{
    	path: 'news',
    	component:NewsComponent
    },{
    	path: 'newsedit',
    	component:NewseditComponent
    },{
    	path: 'user',
    	component:UserlistComponent
    }]
 	},{
    path: 'header',
    component:HeaderComponent
  },{
    path: 'login',
    component:LoginComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
