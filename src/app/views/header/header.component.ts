import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	
	navList = [{
		index: 1,
		name: '首页',
		path: '/main/home'
	},{
		index: 2,
		name: '在线监测',
		path: '/main/monitor'
	},{
		index: 3,
		name: '新闻管理',
		path: '/main/news'
	},{
		index: 4,
		name: '系统管理',
		path: '/main/user'
	}];
	
  constructor(private router: Router) {
  	
  }

  ngOnInit() {
  	this.changeNav(null)
  }
	
	changeNav(navItem) {
		var navPath = sessionStorage.getItem('navPath');
		if(!navPath){
			this.router.navigate([this.navList[0].path]);			
			sessionStorage.setItem('navPath', this.navList[0].path);
		}else if(!navItem){
			this.router.navigate([navPath]);	
		}else {
			this.router.navigate([navItem.path]);			
			sessionStorage.setItem('navPath', navItem.path);
		}
	}
}
