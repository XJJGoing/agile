<template>
	<view>

		<scroll-view scroll-x="true" class="bookshelf-content" bindscroll="scroll">
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA" disable-scroll="false" />
		</scroll-view>

		<!-- <view class="mybutton-group">
			<button @click="changeDepartment" class='my-button'>专业切换</button>
			<button @click="changeSprint" class='my-button'>冲刺切换</button>
		</view> -->
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db">
					<picker @change="sprintPickerChange" :value="sprintIndex" :range="sprintArray">
						<view class="uni-input">{{sprintArray[sprintIndex]}}</view>
					</picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaLineA = null;

	const query = require('../../static/utils/utils').Query;
	const login = require('../../static/utils/utils').Login;
	const Login = new login();
	const Query = new query();
	//引入api
	import {
		getLineData,
		sprintQuery,
		departmentQueryAll
	} from '../../static/utils/api.js';

	var _this;
	export default {
		data() {
			return {
				departmentArray: [],
				departmentIndex: 0,
				sprintArray: [],
				sprintIndex: 0,
				windowWidth: 320,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				userInfo: "",     //用户的信息
				projectId: "",    //项目的id
				sprintId: "",     //冲刺的id
				roleId: "",       //权限的id
				departmentId: ""  //专业id 当用户的权限为2的时候默认进入自己的专业
			}
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(400);
			this.cHeight = uni.upx2px(500);
		},
		onShow() {
			_this = this;
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					let id = {
						id: res.data.id
					}
					Query.findUser(id)
						.then(data => {
							_this.userInfo = data.data.records[0];
							uni.getStorage({
								key: "nowInProject",
								success: (res) => {
									_this.roleId = res.data.roleId;
									_this.projectId = res.data.projectId;
									uni.getStorage({
										key: 'sprintId',
										success: (res) => {
											_this.sprintId = res.data;
											//获取所有专业
											_this.getDepartmentArray(res.data);
											_this.getSprintArray(res.data);
										}
									})
								},
							})
						})
						.catch(Error => {
							uni.showToast({
								title: "网络错误",
								icon: "none",
								duration: 1000
							})
						})
				},
				fail: () => {
					uni.redirectTo({
						url: "../login/login"
					})
				}
			})
		},

		methods: {
			//获取系统的信息
			getSystem:function(){
				_this = this;
				uni.getSystemInfo({
					success: function(res) {
						_this.windowWidth = res.windowWidth;
					}
				});
			},
			
			//获取图表信息
			getChartData:function(){
				    _this = this;
				    uni.request({
					url: `${getLineData}?sprintId={$_this.sprint}&projectId=${_this.projectId}&userId=${_this.userInfo.id}`,
					method: "POST",
					header: {
						'ContentType': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success: (res) => {
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
									color: "#05B2CA",
									data: planDataList,
									textColor:"#F70082",
									name: "计划数据",
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}, {
									color: "#42C87B",
									data: trueDataList,
									name: "实际数据",
									textColor:"#E2E6D8",
									type: "line",
									format: (val) => {
										return val.toFixed(2)
									}
								}, ]
							};
							console.log(LineA)
				
							_this.showLineA("canvasLineA", LineA);
						}
					}
				});
			},
			
			getDepartmentArray(projectId) {
				let _this = this
				uni.request({
					url: `${departmentQueryAll}?projectId=${projectId}`,
					method: "POST",
					data: {},
					header: {
						'ContentType': 'application/json'
					},
					success: (res) => {
						if (res.data.code === 200) {
							let departmentArray = []
							for (var i = 0; i < res.data.data.length; i++) {
								departmentArray[i] = res.data.data[i].name
							}
							_this.departmentArray = departmentArray
							console.log(departmentArray)
						}
					}
				});
			},
			
			getSprintArray(projectId) {
				let _this = this
				uni.request({
					url: `${sprintQuery}`,
					method: "POST",
					data: {
						"pageNum": 0,
						"pageSize": 1000,
						"projectId": projectId
					},
					header: {
						'ContentType': 'application/json'
					},
					success: (res) => {
						if (res.data.code === 200) {
							let sprintArray = []
							for (var i = 0; i < res.data.data.length; i++) {
								sprintArray[i] = res.data.data[i].sprintName
							}
							_this.sprintArray = sprintArray
						}
					}
				});
			},
			departmentPickerChange: function(e) {
				this.departmentIndex = e.target.value
				console.log('获取值', this.departmentArray[this.departmentIndex])

			},
			sprintPickerChange: function(e) {
				this.sprintIndex = e.target.value
				console.log('获取值', this.sprintArray[this.sprintIndex])

			},
			scroll: function(e) {
				var scrollLeft = e.detail.scrollLeft;
				this.setData({
					scrollLeft: scrollLeft
				})
				console.log(scrollLeft)
			},
			showLineA(canvasId, chartData) {
				let _this = this
				canvaLineA = new uCharts({
					$this: _this,
					canvasId: canvasId,
					type: 'line',
					enableScroll: false, //可拖动
					fontSize: 11,
					legend: true,
					dataLabel: false,
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
						fontColor: '#058',
					},
					yAxis: {
						title: '预估剩余时间（小时）',
						titleFontColor: 'white',
						gridType: 'solid',
						gridColor: '#CCCCCC',
						splitNumber: 8, //y轴网格的数量
						fontColor: '#058',
						format: (val) => {
							return val.toFixed(0)
						}
					},
					width: _this.windowWidth,
					height: _this.cHeight * _this.pixelRatio,
					extra: {
						line: {
							type: 'straight'
						}
					}
				});

			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			}
		}
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	.charts {
		width: 730upx;
		height: 500upx;
		background-color: transparent;
	}

	.bookshelf-content {
		white-space: nowrap;
		width: 100%;
	}

	.my-button {
		margin-left: 1rem;
		font-size: 12px;
		color: white;
		background-color: rgb(71, 84, 103);
		border-radius: 5px;
		width: 90%;
	}
</style>
