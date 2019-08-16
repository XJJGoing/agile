<template>
	<view class="landScapePicture">
	   <canvas canvas-id="canvasLineA" 
	           id="canvasLineA" 
			   class="charts" 
			   @touchstart="touchLineA" 
			   disable-scroll="true"
			   :style="{width:windowWidth+'px',height:windowHeight+'px'}"
	  >
	   </canvas>
	</view>
</template>

<script>
    import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
	import {getLineData} from '../../static/utils/api.js';
	var _this;
	var canvasLineA = null;
	export default {
		data() {
			return {
				windowHeight:"",
				windowWidth:"",
				sprintId:"",
				projectId:"",
				userId:"",
				departmentId:"",
				pixelRatio:1
			}
		},
		onLoad(e){
			_this = this;
			_this.getSystem();
			let item = JSON.parse(e.item);
			_this.getChartData(item.sprintId,item.projectId,item.userId,item.departmentId);
		},
		
		methods: {
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success:(res)=>{
						_this.windowHeight = res.windowHeight;
						_this.windowWidth = res.windowWidth;
					}
				})
			},
			
			getChartData:function(sprintId,projectId,userId,departmentId){
				    _this = this;
				    uni.request({
					url: `${getLineData}?sprintId=${sprintId}&projectId=${projectId}&userId=${userId}&departmentId=${departmentId}`,
					method: "POST",
					header: {
						'ContentType': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
						console.log(res)
						if (res.data.code === 200) {
							let categories = res.data.data.categories;
							let plainData = res.data.data.plainData;
							let planDataList = []; 
							for (var i = 0; i < plainData.length; i++) {
								planDataList[i] = plainData[i].workTime;
							}
							let trueData = res.data.data.trueData;
							let trueDataList = []
							for (var i = 0; i < trueData.length; i++) {
								trueDataList[i] = trueData[i].workTime;
							}
							let LineA = {
								categories: categories,
								series: [{
									textColor:"#E7F0EF",
									color: "#C92121",
									data: planDataList,
									name: "计划数据",
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}, {
									color: "#42C87B", 
									data: trueDataList,
									name: "实际数据",
									textColor:"#E7F0EF",     //这个失效
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}]
							};
							 console.log(LineA);
							_this.showLineA("canvasLineA", LineA);
						}
					}
				});
			},
			
			showLineA:function(canvasId,chartData) {
				_this = this;
				canvasLineA = new uCharts({
					$this: _this,
					canvasId: canvasId,
					type: 'line',
					enableScroll: false, //可拖动
					fontSize: 11,
					legend:true,
					dataLabel: false, 
					rotate:true,
					dataPointShape: true,
					background: '#21242E',
					pixelRatio: _this.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type: 'grid',
						disableGrid: true,
						dashLength: 8,
						scrollShow: true,
						fontColor: '#05E0FC',
						rotateLabel:true,
						labelCount:15
					},
					yAxis: {
						title: '预估剩余时间（小时）',
						titleFontColor: 'white',
						gridType: 'solid',
						gridColor: '#CCCCCC',
						splitNumber: 8, //y轴网格的数量
						fontColor: '#05E0FC',
						format: (val) => {
							return val.toFixed(0)
						}
					},
					width: _this.windowWidth*_this.pixelRatio,
					height: _this.windowHeight * _this.pixelRatio,
					extra: {
						line: { 
							type: 'straight'
						},
						tooltip:{
							bgColor:'#000000',//主体背景颜色
							bgOpacity:0.7,//背景颜色透明度
							gridType:'dash',//辅助线类型（虚线）
							dashLength:5,//虚线单段长度
							gridColor:'#1890ff',//辅助线颜色
							fontColor:'#FFFFFF',//主体文字颜色
							labelBgColor:'#DFE8FF',//标签背景颜色
							labelBgOpacity:0.95,//背景颜色透明度
							labelFontColor:'#666666'//标签文字颜色
						}
					}
				});
			},
			
			touchLineA:function(e) {
				_this = this;
				canvasLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					} 
				});
			},
			
			
		}
	}
</script>

<style>
.landScapePicture{
	
}
.charts{
   background-color:transparent;
}
</style>
