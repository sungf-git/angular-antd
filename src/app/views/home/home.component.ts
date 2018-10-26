import { Component, OnInit } from '@angular/core';
import * as $q from 'jquery'

declare var AMap: any;
declare var AMapUI: any;

declare var MarkerList: any;
declare var SimpleMarker: any;
declare var SimpleInfoWindow: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	map: any = null;
	infoWindow: any = null;

	constructor() {

	}

	ngOnInit() {
		this.initMap();
		this.drawMapBoundary();
		
		this.requestJsonData((data) => {
			console.log(data.siteList)
			
			var arr = [];
			data.forEach((item, index) => {
				item.location = new AMap.LngLat(item.lng,item.lat)
			})
			
			this.drawMarker(this.map, data)
		})
	}
	
	
	consoleConfig() {
		console.log('地图当前配置如下:')
		console.log('旋转角度:'+this.map.getRotation())
		console.log("俯视仰角:"+this.map.getPitch())
		console.log("缩放级别:"+this.map.getZoom())
		console.log("中心点:"+this.map.getCenter())
	}

	//初始化地图
	initMap() {
		this.map = new AMap.Map('home_gdmap_id', {
			resizeEnable: true,
			rotateEnable: true,
			pitchEnable: true,
			zoom: 14,
			pitch: 70,
			rotation: 22,
			viewMode: '3D', //开启3D视图,默认为关闭
			buildingAnimation: false, //楼块出现是否带动画
			expandZoomRange: true,
			zooms: [3, 20],
			center: [119.324476,26.056032]
		});
		
		this.map.addControl(new AMap.ControlBar({
			showZoomBar: false,
			showControlButton: true,
			position: {
				right: '10px',
				top: '50px'
			}
		}))
	}

	//绘制区块
	drawMapBoundary() {
		var me = this;
		var district = null;
		var adcodes = ["350102", "350103"]; //鼓楼和台江的adcode
		var areaPoints1, areaPoints2;
		
		var draw = (areaPoints1, areaPoints2) => {
			if(!areaPoints1 || !areaPoints2){
				return false;
			}
			//交界点
			let start1,end1,start2,end2;
			for(var i = 0, len1 = areaPoints1.length; i < len1; i++){
				for(var j = 0, len2 = areaPoints2.length; j < len2; j++){
					if(areaPoints1[i].lng == areaPoints2[j].lng && areaPoints1[i].lat == areaPoints2[j].lat){
						if(start1){
							end1 = i;
						}else{
							start1 = i;
						}
						if(start2){
							end2 = j;
						}else{
							start2 = j;
						}
					}
				}
			}
			console.log('台江区的最后一个点与区域相交的最后一个点重合:'+(areaPoints2[0].lng == areaPoints2[end2].lng && areaPoints2[0].lat == areaPoints2[end2].lat))
			//封装数据
			var areaArr1 = [];
			for(let k = 0; k <= start1; k++){
				areaArr1.push(areaPoints1[k]);
			}
			var areaArr2 = [];
			for(let k = start2 - 1, ls = areaPoints2.length; k < ls; k++){
				areaArr2.push(areaPoints2[k]);
			}
			var areaArr4 = [];
			for(let k = end1 + 1; k < areaPoints1.length; k++){
				areaArr4.push(areaPoints1[k]);
			}
			
			var arrs = areaArr1.concat(areaArr2).concat(areaArr4)
			var polygon = new AMap.Polygon({
	            map: me.map,
	            strokeWeight: 3,
	            path: arrs,
	            fillOpacity: 0,
	            fillColor: '#CCF3FF',
	            strokeColor: 'red'
	        });
	        
	        /*
	        var arr = [];
	        var count = 0;
			polygon.on('click', (e) => {
				arr.push({
					lng: e.lnglat.lng,
					lat: e.lnglat.lat
				})
				this.drawMarker(this.map, new AMap.LngLat(e.lnglat.lng, e.lnglat.lat))
				console.log(count)
				if(count == 40){
					console.log(JSON.stringify(arr));
				}
				count++;
			})*/
			
		}
		
		//加载行政区划插件
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1, 
                extensions: 'all',
                level: 'city',
                showbiz: false
            };
            district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            district.search(adcodes[0], function(status, result) {
            	 if(status !== 'complete'){
            	 	return false;
            	 }
                var bounds = result.districtList[0].boundaries;
                if (bounds) {
                	areaPoints1 = bounds[0];
                	draw(areaPoints1, areaPoints2);
                }
            });
            district.search(adcodes[1], function(status, result) {
            	if(status !== 'complete'){
            	 	return false;
            	 }
                var bounds = result.districtList[0].boundaries;
                if (bounds) {
                	areaPoints2 = bounds[0];
                	draw(areaPoints1, areaPoints2);
                }
            });
        });
	}

	drawMarker(map, list) {
		AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
				function(MarkerList, SimpleMarker, SimpleInfoWindow) {

					//即jQuery/Zepto
					var $ = MarkerList.utils.$;

					var defaultIconStyle = function(index) {
							return 'red-' + (index + 1) % 20;
						}, //默认的图标样式
						hoverIconStyle = function(index) {
							return 'blue-' + (index + 1) % 20;
						}, //鼠标hover时的样式
						selectedIconStyle = function(index) {
							return 'blue-' + (index + 1) % 20;
						} //选中时的图标样式
					;

					var markerList = new MarkerList({
						map: map,
						//ListElement对应的父节点或者ID
						listContainer: "my-box-list-id", //document.getElementById("myList"),
						//选中后显示

						//从数据中读取位置, 返回lngLat
						getPosition: function(item) {
							return item.location;
						},
						//数据ID，如果不提供，默认使用数组索引，即index
						getDataId: function(item, index) {

							return item.id;
						},
						getInfoWindow: function(data, context, recycledInfoWindow) {
							
							return new SimpleInfoWindow({
					            infoTitle: '<strong style="font-size: 15px;">' + data.name + '</strong>',
					            infoBody: '<p class="my-desc" style="margin-bottom: 3px;"><p style="margin-bottom: 3px;"><span style="display: inline-block; padding-right: 10px;">地址:</span><span>'+ data.adress +'</span></p></p>',
					            //基点指向marker的头部位置
					            offset: new AMap.Pixel(0, -31)
					       });
						},
						//构造marker用的options对象, content和title支持模板，也可以是函数，返回marker实例，或者返回options对象
						getMarker: function(data, context, recycledMarker) {

							if(recycledMarker) {
								recycledMarker.setIconStyle(defaultIconStyle(context.index));
								return;
							}
							
							return new AMap.Marker({
					            map: map,
					            zIndex: 9999999
					        });

						},
						//构造列表元素，与getMarker类似，可以是函数，返回一个dom元素，或者模板 html string
						getListElement: function(data, context, recycledListElement) {

							var label = '' + (context.index + 1);

							//使用模板创建
							var innerHTML = MarkerList.utils.template(
								'<li style="margin: 18px 5px; padding: 3px 20px; display: flex; justify-content: space-between; cursor: pointer; font-size: 13px; border-radius: 14px;"><%- data.name %></li>', {
									data: data,
									label: label
								});

							if(recycledListElement) {
								recycledListElement.innerHTML = innerHTML;
								return recycledListElement;
							}

							return innerHTML;
						},
						//列表节点上监听的事件
						listElementEvents: ['click', 'mouseenter', 'mouseleave'],
						//marker上监听的事件
						markerEvents: ['click', 'mouseover', 'mouseout'],
						//makeSelectedEvents:false,
						selectedClassNames: 'selectedLi',
						autoSetFitView: true
					});
					
					markerList.render(list);
					
//					window.markerList = markerList;

					markerList.on('selectedChanged', function(event, info) {
						if(17 != map.getZoom()){
							map.setZoom(17)
						}
					});

					markerList.on('listElementMouseenter markerMouseover', function(event, record) {

					});

					markerList.on('listElementMouseleave markerMouseout', function(event, record) {

					});

				});
		
		
		
		
		
//		var marker = new AMap.Marker({
//          map: map,
//          position: point,
//          zIndex: 9999999,
//          animation: 'AMAP_ANIMATION_DROP'
//      });
//		marker.on('mouseover', () => {
//			this.markOver(marker);
//		})
//		marker.on('mouseout', () => {
//			if(this.infoWindow){
//				this.infoWindow.close();
//				this.infoWindow = null;
//			}
//		})
//		marker.on('click', () => {
//		})
	}
	
	markOver(marker) {
		AMapUI.loadUI(['overlay/SimpleInfoWindow'], (SimpleInfoWindow) => {
			this.infoWindow = new SimpleInfoWindow({

	            infoTitle: '<strong>这里是标题</strong>',
	            infoBody: '<p class="my-desc"><strong>这里是内容。</strong> <br/> 高德地图 JavaScript API，是由 JavaScript 语言编写的应用程序接口，' +
	                '它能够帮助您在网站或移动端中构建功能丰富、交互性强的地图应用程序</p>',
	
	            //基点指向marker的头部位置
	            offset: new AMap.Pixel(0, -31)
	       });
	       this.infoWindow.open(this.map, marker.getPosition());
		});
	}
	
	requestJsonData(callback) {
		$q.ajax({
//			url: "http://localhost:9000/getSites", //json文件位置
			url: "../../../assets/data/sitesData.json",
			type: "GET", //请求方式为get
			dataType: "json", //返回数据格式为json
			success: data => {
				callback && callback(data.siteList);
			},error: err => {
				console.log(err)
			}
		})
	}
}