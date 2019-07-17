/**
 * 观看视频和音频时，定时监控，观看时间做记录
 */

var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
//获取播放时间
var interval_main_play = null;
function playInterval(main_play_id,courseId,type,fileId){
	var main_play = document.getElementById(main_play_id);// video标签对象
	var totalTime = "";
	var isStart=false;
	function timeInterval() {
		// 10s钟发送后台一个请求
		console.log('lookTime----' + main_play.currentTime);
		studentLook(courseId, main_play.currentTime,type,0,fileId,totalTime);
	}

	// 视频加载完成
	main_play.oncanplay = function() {
		var hour = parseInt((main_play.duration)/3600);
		var minute = parseInt((main_play.duration%3600)/60);
		var second = Math.floor(main_play.duration%60);
		var time = "";
		if(hour>0){
			time+=hour+"小时";
		}
		if(minute>0){
			time+=minute+"分";
		}
		if(second>0){
			if((second+"").length<2){
				second = "0"+second;
			}
			time+=second+"秒";
		}
		totalTime = time;
		console.log("视频加载完成");
	};

	// 视频播放事件
	main_play.onplay = function() {
		console.log("记录学习");
		// 定时1分钟一次发送后台
		interval_main_play = setInterval(function() {
			timeInterval();
		}, 1000 * 10);

		studentLook(courseId, main_play.currentTime,type,0,fileId,totalTime,1);
	};

	// 暂停 每暂停一次发送一次记录
	main_play.onpause = function(isBuyValue) {
		console.log("视频暂停");
		if(getSessionUserId()!="" && isBuyValue=="0"){
			window.clearInterval(interval_main_play);
			// 发送数据向后台
			studentLook(courseId, main_play.currentTime,type,0,fileId,totalTime);
		}
	};

	//点击全屏事件


	main_play.onended = function() {
		console.log("视频播放完成");
		window.clearInterval(interval_main_play);
		//main_play.pause();
		studentLook(courseId, main_play.currentTime,type,1,fileId,totalTime); // duration获取总时间长度
		// 发送数据向后台
	};
}


var recordIdInsert = '';
//记录开始学习
function studentLook(courseId,time,type,isEnd,fileId,totalTime,clickStart){
	console.log(courseId+","+time+","+type+","+fileId+","+totalTime+","+clickStart);
	time = time+"";
	console.log("后台发送请求",time);
	var param = {"courseId":courseId,"time":time,"type":type,"recordId":recordIdInsert,"isEnd":isEnd,"userId":getSessionUserId(),"fileId":fileId,"totalTime":totalTime,"clickStart":clickStart};
	ajax_fetch("get",paramMap.addStudentRecord,param,function (result) {
		console.log(result);
		if(result.success){
			console.log("记录成功");
			recordIdInsert = result.data.recordId;
		}else{
			console.log("未登陆，清除定时器");
			window.clearInterval(interval_main_play);
		}
	});
}