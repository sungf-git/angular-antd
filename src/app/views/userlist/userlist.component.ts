import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../scripts/services/dialog/dialog.service';
import * as $ from 'jquery'

@Component({
	selector: 'app-userlist',
	templateUrl: './userlist.component.html',
	styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
	/*分页*/
	pageIndex = 1;
	pageSize = 20;
	total = 1;
	dataSet: any = [];
	loading = true;
	fixHeader = false;
	tabScrollSet = {
		y: '1200px'
	};
	
	/*复选联动*/
	allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  displayData = [];
  removing = false;
  indeterminate = false;

	requestSetTimeout = null;

	//缓存回调方法的指针,方便事件销毁
	resizeHandler = () => {
		this.renderTableScroll();
	};

	constructor(private dialog: DialogService) {}

	ngOnInit() {
		this.requestJsonData(this.pageIndex, this.pageSize, result => {
			this.dataSet = result.list;
			this.total = result.total;
			this.renderTableScroll();
		})
		window.addEventListener('resize', this.resizeHandler);

	}
	ngOnDestroy() {
		clearTimeout(this.requestSetTimeout);
		this.requestSetTimeout = null;
		window.removeEventListener('resize', this.resizeHandler);
	}
	requestJsonData(index, size, callback) {
		this.loading = true;
		$.ajax({
			url: "../../../assets/data/userList.json", //json文件位置
			type: "GET", //请求方式为get
			dataType: "json", //返回数据格式为json
			success: data => {
				if(this.requestSetTimeout) {
					clearTimeout(this.requestSetTimeout);
					this.requestSetTimeout = null;
				}
				this.requestSetTimeout = setTimeout(() => {
					console.log(new Date().toString())
					this.loading = false;
					let list = data.list,
						tempList = [];
					for(let start = (index - 1) * size, maxLen = data.list.length, end = Math.min(index * size, maxLen); start < end; start++) {
						tempList.push(list[start]);
					}
					if(callback && typeof callback === 'function') {
						callback({
							list: tempList,
							total: list.length
						})
					}
				}, 500)
			}
		})
	}

	changePageIndex() {
		this.requestJsonData(this.pageIndex, this.pageSize, result => {
			this.dataSet = result.list;
			this.total = result.total;
			this.checkAll(false);
		})
	}

	changePageSize() {
		this.requestJsonData(this.pageIndex, this.pageSize, result => {
			this.dataSet = result.list;
			this.total = result.total;
			this.renderTableScroll();
			this.checkAll(false);
		})
	}
	
	
	/*
	 *复选联动
	 */
	currentPageDataChange($event): void {
    this.displayData = $event;
  }

  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.checkedNumber = this.dataSet.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }
	
	/*批量删除*/
  deleteList(): void {
  	let selItems = this.dataSet.filter(value => value.checked);
  	console.log(selItems)
  	
    this.removing = true;
    setTimeout(_ => {
      this.dataSet.forEach(value => value.checked = false);
      this.refreshStatus();
      this.removing = false;
      this.dialog.showDialog({
      	content: '模拟对话框'
      });
    }, 1000);
  }

	/*
	 * 动态设置表格内容的高度,溢出时出现滚动条
	 */
	renderTableScroll() {
		let warpperPanel = document.getElementsByClassName('content-panel')[0];
		if(!warpperPanel) {
			return false;
		}
		let pagination = warpperPanel.getElementsByClassName('anchor-pagination')[0];
		if(!pagination) {
			return false;
		}
		let innerThead = warpperPanel.getElementsByTagName('thead');
		if(!innerThead) {
			return false;
		}

		let warpperHeight = warpperPanel.clientHeight;
		let paginationHeight = pagination.clientHeight;
		let rowHeight = 0,
			tableHeight = 0;
		if(!innerThead || !innerThead.length) {
			return false;
		}
		for(let i = 0, len = innerThead.length; i < len; i++) {
			if(innerThead[i].clientHeight > 0) {
				rowHeight = innerThead[i].clientHeight;
				break;
			}
		}
		tableHeight = this.pageSize * rowHeight;

		if(tableHeight + paginationHeight > warpperHeight) {
			this.fixHeader = true;
			this.tabScrollSet = {
				y: (warpperHeight - paginationHeight - rowHeight) + 'px'
			}
		} else {
			this.fixHeader = false;
		}
	}

}