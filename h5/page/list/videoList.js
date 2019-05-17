//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("随便看看");

        if(getSessionBusId()!=""){
            titleBus("随便看看");
        }
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData(pageIndex);

});
function initData(index){
    //获取首页数据
    var busId;
    var find = RequestUrl(location.search,"find");
    if(find==1){//点击发现，直接读取的是demo的数据
        busId = "";
    }else{
        busId = url_busId;
    }
    var param = {"pageIndex":index,"busId":busId};
    ajax_fetch("POST",paramMap.getVideos,param,function (result) {
            if(result.success){
                //拼接视频列表
                var videoStr = "";
                var videoTitle = "";
                if(result.data.videoList.length>0){
                    var firstVideo = result.data.videoList[0];
                    $("#aui_title").html(firstVideo.fileTitle);// poster="+webUrl+"images/video_def_img.png style='width: 100%; height: 80%; object-fit: fill'  x5-video-player-type='h5' x5-video-player-fullscreen='true'
                    $("#firstVideo").html("<video controls id='first_video'><source src='"+baseUrl+firstVideo.fileUrl+"'></video>");

                    $("#first_video").css("display","");

                    var video_img = webUrl+"images/video_open.png";
                    result.data.videoList.splice(0,1);
                    if(result.data.videoList.length>0){
                        $.each(result.data.videoList,function (index, item) {
                            if(index!=0){
                                videoTitle +=" | ";
                            }
                            videoTitle+=item.fileTitle;

                            //前3个视频免费，后要登录
                            var isLook = "1";  //1是要登录才可以观看，0可以观看
                            if(index<4){
                                isLook="0";
                            }
                            item.bookImg = baseUrl+item.bookImg;
                            item.fileUrl = baseUrl+item.fileUrl;
                            //autoplay muted  自动播放，pc可以，但是h5手机端不行
                            videoStr+="<div class='aui-flex b-line' about=''>" +
                                "<div class='aui-flex-box-video'>" +
                                "<span class='aui_title'>"+item.fileTitle+"</span>" +
                                "<a href='javascript:courseDetail(\""+item.courseId+"\");'><span class='aui_des'>"+item.title+"</span></a>" +
                                "</div>" +
                                "<a href='javascript:openVideo(\""+item.fileId+"\",\""+item.fileTitle+"\",\""+item.fileUrl+"\",\""+isLook+"\");'>" +
                                "<div class='aui-course-img'>" +
                                "<img src='"+video_img+"' alt=''>" +
                                "</div></a>" +
                                "</div><div class='divHeight'></div>";
                        });
                        if(result.data.videoCount>(pageIndex+1)*10){
                            videoStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
                        }else if(videoStr.length>0){
                            videoStr+="<span class='more_end'>我是有底线的...</span>";
                        }
                        $("#list_video").append(videoStr);
                    }else{
                        videoStr+="<span class='more_end'>我是有底线的...</span>";
                        $("#list_video").append(videoStr);
                    }
                }else{
                    videoStr+="<span class='more_end'>暂无数据...</span>";
                    $("#list_video").append(videoStr);
                }


                //设置分享内容
                var title = "视频列表";
                var link = location.href.split('#')[0];
                var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
                var desc = videoTitle;
                console.log(desc);
                setWxConfig(title,link,imgUrl,desc);

        }

    });
}

//点击观看视频
function openVideo(fileId,fileTitle,fileUrl,isLook) {
    if(isLook=="1" && getSessionUserId()==""){
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {//alert的浮层高于视频的浮层 ，不然微信端是全屏的没法提示
            //在微信中打开
            var isLogin = confirm("登录才可以观看视频，确定要登录吗？");
            if(isLogin){
                footerClick("me");
                window.location.href = webUrl+"page/center/login.html";
            }else{
                main_play.webkitExitFullScreen();//退出全屏
            }
        }else{//普通浏览器提示,可以用dom元素
            //询问框
            layer.open({
                content: '登录才可以观看视频，确定要登录吗？'
                ,btn: ['登录', '不要']
                ,yes: function(index){
                    layer.close(index);
                    footerClick("me");
                    window.location.href = webUrl+"page/center/login.html";
                },no:function (index) {
                }
            });
        }
    }else{
        var videoHtml = "<div class='open_video'><span>"+fileTitle+"</span><video controls id='video_"+fileId+"'><source  src='"+fileUrl+"'></video></div>";
        layer_comment = layer.open({
            type: 1
            ,content: videoHtml
            ,anim: 'up'
            ,style: 'position:fixed; bottom:10%; top:40%;left:0; width: 100%; height: 18em; padding:10px 0; border:none;border-radius: 1.5rem;'
        });
        //点开后立即播放
        document.getElementById("video_"+fileId).play();//浏览器端播放设置
        document.addEventListener("WeixinJSBridgeReady", function () {//微信端播放设置
            document.getElementById("video_"+fileId).play();
        }, false);
    }
}


//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}
