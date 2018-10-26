import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { DialogService } from './scripts/services/dialog/dialog.service';

import { HeaderComponent } from './views/header/header.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { MainComponent } from './views/main/main.component';
import { NewsComponent } from './views/news/news.component';
import { NewseditComponent } from './views/newsedit/newsedit.component';
import { UserlistComponent } from './views/userlist/userlist.component';
import { MonitorComponent } from './views/monitor/monitor.component';

registerLocaleData(zh);



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    MainComponent,
    NewsComponent,
    NewseditComponent,
    UserlistComponent,
    MonitorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
