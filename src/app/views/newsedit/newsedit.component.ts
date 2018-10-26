import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'
import * as $ from 'jquery'

import { DialogService } from '../../scripts/services/dialog/dialog.service';

declare var CKEDITOR: any;
declare var saveAs: any;

@Component({
	selector: 'app-newsedit',
	templateUrl: './newsedit.component.html',
	styleUrls: ['./newsedit.component.css']
})
export class NewseditComponent implements OnInit {
	
	pageTitle = "";
	newsTitle = '';
	saveText = "保存";

	isLoadingOne = false;

	pageStatusObj = {
		'0': 'add',
		'1': 'edit'
	};
	pageStatus = '';

	watch$ = new BehaviorSubject('');
	
	resizeHandler = () => {
		this.resizeEditor();
	};

	constructor(private router: Router, private dialog: DialogService) {}

	ngOnInit() {
		CKEDITOR.replace('editor1');
		
		let editNews = JSON.parse(sessionStorage.getItem('editnews'));
		this.pageStatus = editNews ? this.pageStatusObj['1'] : this.pageStatusObj['0'];
		this.watchObservable(editNews ? editNews.title : '');
		
		this.getContent();
		
		window.addEventListener('resize', this.resizeHandler);
	}
	
	ngOnDestroy() {
		window.removeEventListener('resize', this.resizeHandler);
	}
	
	/*当监测变量发生变化(手动触发监听)后,执行订阅*/
	watchObservable(newsName) {
		this.watch$.subscribe({
			next: () => {
				//页面状态pageStatus
				if(this.pageStatus === this.pageStatusObj['0']){
					this.pageTitle = '添加新闻';
					this.newsTitle = "无标题新闻";
				}else{
					this.pageTitle = '编辑新闻';
					this.newsTitle = newsName ? newsName : "无标题新闻";
				}
			}
		});
	}

	loadOne(): void {
		this.isLoadingOne = true;
		this.saveText = "保存中...";
		setTimeout(_ => {
			this.isLoadingOne = false;
			this.saveText = "保存";
			
			this.dialog.showDialog({
				hasClose: false,
		      	content: this.pageStatus === this.pageStatusObj['0'] ? '保存成功' : '修改成功',
		      	confirm: () => {
		      		this.router.navigate(['main/news']);
		      	}
		      });
		}, 1000);
	}
	
	showContent() {
		var editor = CKEDITOR.instances['editor1'];

		var selection = editor.getSelection();//获取选中对象
		
		var content_with_tag = editor.getData();//获取标签+文本
		
		var content = editor.document.getBody().getText();//获取纯文本
		
		var content_selected = selection.getNative();//获取选中的文本
		
		console.log('-------------获取选中对象----------------')
		console.log(selection);
		console.log('-------------获取标签+文本----------------')
		console.log(content_with_tag);
		console.log('-------------获取纯文本----------------')
		console.log(content);
		console.log('-------------获取选中的文本----------------')
		console.log(content_selected);
	}
	
	saveContent() {
		var editor = CKEDITOR.instances['editor1'];
		
		var file = new File([editor.getData()], "../editorData.txt", { type: "text/plain;charset=utf-8" });
    	saveAs(file);
	}
	
	getContent() {
		$.ajax({
			url: "../../../assets/data/_editorData.txt", //json文件位置
			type: "GET", //请求方式为get
			dataType: "text", 
			success: data => {
				$("#editor1").val(data);
			}
		})
	}
	
	resizeEditor() {
		let editor = CKEDITOR.instances['editor1'];
		let wapperPanel = document.getElementsByClassName('content-panel')[0];
		if(!wapperPanel){
			return false;
		}
		if(editor && wapperPanel && wapperPanel.clientHeight){
			let cke_1_top = document.getElementById('cke_1_top');
			let cke_1_bottom = document.getElementById('cke_1_top');
			editor.resize( '100%', wapperPanel.clientHeight);
			editor.config.height = wapperPanel.clientHeight - cke_1_top.clientHeight - cke_1_bottom.clientHeight;
			editor.config.autoGrow_minHeight = wapperPanel.clientHeight - cke_1_top.clientHeight - cke_1_bottom.clientHeight;
			editor.config.autoGrow_maxHeight = wapperPanel.clientHeight - cke_1_top.clientHeight - cke_1_bottom.clientHeight;
		}
	}
	
	

}