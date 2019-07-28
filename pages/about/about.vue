<template>
	<scroll-view class="all" scroll-y="true">
		<view class="about">
			<view class="img">
				<image src="../../static/img/smart.jpg"></image>
				<text>JOYEA敏捷小工具</text>
			</view>
			<view class="introduce">
				<text>
					介绍:JOYEA敏捷小程序由江苏省丹阳市仅一联合智造公司一手搭建并为本公司的项目管理以及人员管理上提供敏捷管理与便捷管理.
				</text>
			</view>
			<view class="version">
				<text>当前版本号:1.0.0</text>
			</view>
			<view class="repair">
				<text>各版本号及介绍:</text>
				<text>1.0.0 初步完成整体的构造以及测试</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.all{
  height: auto;
  overflow-y: true;
  width: 100%;
}
::-webkit-scrollbar{
	width: 2upx;
	height: 6upx;
}
.about{
	display: flex;
	flex-direction: column;
	width: 100%;
}
.about view{
	margin-top:10upx
}
.about view text {
	color: #F1F1F1;
	font-size: 30upx;
}
.img{
	height: 250upx;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.img image{
	width: 200upx;
	height: 200upx;
	border-radius: 50%;
}
.img text{ 
	height: 50upx;
	line-height: 50upx;
	width: 100%;
	text-align: center;
	color: #F8F1F3;
	font-weight: 500;
}
.introduce{
	margin-top: 30upx!important;
	width: 100%;
	text-indent: 1em;
}

.version{
	width: 100%;
}
.version text{
	width: 100%;
	line-height: 100upx;
	height: 100upx;
}

.repair{
	display: flex;
	flex-direction: column;
}
.repair text{
	margin-top: 10upx;
}





</style>
