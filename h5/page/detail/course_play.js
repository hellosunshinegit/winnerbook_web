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

		//判断是否登陆，如果未登录，则需要先登陆
		if(getSessionUserId()==""){
			main_play.pause();

			var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
			if (ua.match(/MicroMessenger/i) == "micromessenger") {//alert的浮层高于视频的浮层 ，不然微信端是全屏的没法提示
				//在微信中打开
				var isLogin = confirm("登录才可以观看视频，确定要登录吗？");
				if(isLogin){
					footerClick("me");
					window.location.href = webUrl+"page/center/login.html?busId="+url_busId+"&userId="+url_userId;
				}else{
					main_play.webkitExitFullScreen();//退出全屏
				}
			}else{//普通浏览器提示,可以用dom元素
				$("#"+main_play_id).addClass("videoHeight");
				//询问框
				layer.open({
					content: '登录才可以观看视频，确定要登录吗？'
					,btn: ['登录', '不要']
					,yes: function(index){
						layer.close(index);
						footerClick("me");
						window.location.href = webUrl+"page/center/login.html?busId="+url_busId+"&userId="+url_userId;
					},no:function (index) {
						$("#"+main_play_id).removeClass("videoHeight");
					}
				});
			}
		}else{
			// 定时1分钟一次发送后台
			interval_main_play = setInterval(function() {
				timeInterval();
			}, 1000 * 10);

			studentLook(courseId, main_play.currentTime,type,0,fileId,totalTime,1);
		}
	};

	// 暂停 每暂停一次发送一次记录
	main_play.onpause = function() {
		console.log("视频暂停");
		window.clearInterval(interval_main_play);
		// 发送数据向后台
		studentLook(courseId, main_play.currentTime,type,0,fileId,totalTime);
	};

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
	var param = {"courseId":courseId,"time":time,"type":type,"recordId":recordIdInsert,"isEnd":isEnd,"userId":url_userId,"fileId":fileId,"totalTime":totalTime,"clickStart":clickStart};
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