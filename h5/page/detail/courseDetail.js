/*导入尾部*/
var busId = RequestUrl(location.search,"busId");
var userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("课程详情");
        $("#indexPage").css("display","");
        $("#historyGo").css("display","none");
    });

    titleBus("课程详情");

    //$(".footer").load("../common/footer.html");
    $('#tabs').tabulous({
        effect: 'scale'
    });

    //页面刚初始化完成之后，默认其他的是隐藏的
    $.each($("[id^='tabs-']"),function (index, item) {
        $(this).css("display","none");
    });
    $("#tabs-1").css("display","");

    //index首页数据
    initData();

});

var courseId = "";

//根据课程id查询数据
function initData(){
    courseId = RequestUrl(location.search,"courseId");
    var type = RequestUrl(location.search,"type");
    //获取首页数据
    var param = {"courseId":courseId,"userId":getSession().userId,"busId":getSession().belongBusUserId,"type":type};
    ajax_fetch("POST",paramMap.getCourseDetail,param,function (result) {
        if(result.success){

            var course = result.data.courseInfo;
            console.log(course);

            //设置分享内容
            title = course.title;
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(course.bookImg!=""){
                imgUrl = baseUrl+course.bookImg;
            }
            desc = course.recommendReason;
            setWxConfig(title,link,imgUrl,desc);


            //存本地查看的视频是哪个，用于下次登录的时候提示
            //localStorage.setItem("courseInfo",JSON.stringify(course));

            $("#title").html(course.title);
            var mainGuestStr = course.mainGuest;

            //判断是否有百度知道链接，如果有，则跳转到百度
            if(course.baiduKnowLink!=""){
                mainGuestStr = "<a href='"+course.baiduKnowLink+"' style='text-decoration: underline;'>"+course.mainGuest+"</a>";
            }

            if(course.mainGuestPost!=""){
                mainGuestStr+="（"+course.mainGuestPost+"）";
            }

            $("#mainGuest").html(mainGuestStr);
            if(course.recommendBook!=undefined && course.recommendBook!=""){
                $("#recommendBook").html("<a href='javascript:bookDetail(\""+course.bookListId+"\")'>"+course.recommendBook+"</a>");
            }else{
                $("#recommendBook").html("暂无推荐");
            }
            if(course.courseDesc==""){
                $("#courseDesc").remove();
            }else{
                $("#courseDesc").html("课程简介："+course.courseDesc);
            }
            $("#mainGuestIntroduce").html(course.mainGuestIntroduce);
            $("#presenter").html(course.presenter);
            $("#recommendBookIntroduce").html(course.recommendBookIntroduce);
            $("#recommendReason").html(course.recommendReason);
            $("#recordingDate").html(course.recordingDate);
            $("#content").html(course.content);
            $("#dialogGuest").html(course.dialogGuest);


            //首先判断是否登录，是否有权限观看此视频，直接不显示视频就可以，不需要在点击的时候判断
            //主视频需要设置观看权限
            //在是领教的课程时，主音频也要设置收听权限
            if(getSessionUserId()==""){
                $("#tabs-1").html("您当前未登录，无法观看视频。<br/>点击<a href='"+webUrl+"page/center/login.html?busId="+busId+"&userId="+userId+"'><span class='tabs1-login'>登录</span></a>");
                if(course.courseType=="2"){//领教的课程
                    $("#tabs-3").html("您当前未登录，无法观看音频。<br/>点击<a href='"+webUrl+"page/center/login.html?busId="+busId+"&userId="+userId+"'><span class='tabs1-login'>登录</span></a>");
                }
            }else{
                console.log(course.isBuy);
                if(course.isBuy=="1"){//需要购买
                    var imgQrcode = "<img src="+webUrl+"images/zcdsh_app.png height='200'>";
                    var str = '<span class="tabs1_text">对不起，您没有观看权限。<br/>您可以下载‘<span class="tabs1_app_name">总裁读书会APP</span>’查看相关内容<br/>请识别以下二维码<br/>'+imgQrcode+"</span>";
                    $("#tabs-1").html(str);
                    if(course.courseType=="2"){
                        $("#tabs-3").html(str);
                    }
                }else{
                    if(course.mainVideoUrl!=undefined && course.mainVideoUrl!=""){
                        $("#tabs-1").html("<video controls controlslist='nofullscreen' id='main_video' poster="+webUrl+"images/video_default.png ><source src='"+baseUrl+course.mainVideoUrl+"'</video>");
                        //定时获取观看时间
                        playInterval("main_video",courseId,1);//type=1 主视频  type=2 主音频  3附件小视频
                    }else if(course.mainVideoLink!=""){ //判断主视频链接是否有值
                        $("#tabs-1").html("<video controls id='main_video' controlslist='nofullscreen' poster="+webUrl+"images/video_default.png ><source src='"+course.mainVideoLink+"'</video>");
                        //定时获取观看时间
                        playInterval("main_video",courseId,1);//type=1 主视频  type=2 主音频  3附件小视频
                    }else{
                        $("#tabs-1").html("暂无数据...");
                    }

                    if(course.mainAudioUrl!=undefined && course.mainAudioUrl!=""){
                        $("#tabs-3").html("<audio controls controlslist='nodownload' id='main_audio'><source src='"+baseUrl+course.mainAudioUrl+"'</audio>");
                        playInterval("main_audio",courseId,2);//type=1 主视频  type=2 主音频  3附件小视频
                    }else if(course.mainAudioLink!=""){
                        $("#tabs-3").html("<audio controls controlslist='nodownload' id='main_audio'><source src='"+course.mainAudioLink+"'</audio>");
                        playInterval("main_audio",courseId,2);//type=1 主视频  type=2 主音频  3附件小视频
                    }else{
                        $("#tabs-3").html("暂无数据...");
                    }
                }
            }

            if(course.courseType=="1"){//如果是大咖一起读的课程，直接可以收听，商学院的需要授权
                if(course.mainAudioUrl!=undefined && course.mainAudioUrl!=""){
                    $("#tabs-3").html("<audio controls controlslist='nodownload' id='main_audio'><source src='"+baseUrl+course.mainAudioUrl+"'</audio>");
                    playInterval("main_audio",courseId,2);//type=1 主视频  type=2 主音频  3附件小视频
                }else if(course.mainAudioLink!=""){
                    $("#tabs-3").html("<audio controls controlslist='nodownload' id='main_audio'><source src='"+course.mainAudioLink+"'</audio>");
                    playInterval("main_audio",courseId,2);//type=1 主视频  type=2 主音频  3附件小视频
                }else{
                    $("#tabs-3").html("暂无数据...");
                }
            }

            var courseFiles = result.data.courseFile;
            var file_str="";
            if(courseFiles.length>0){
                $.each(courseFiles,function (index, item) {
                    item.fileUrl = baseUrl+item.fileUrl;
                    file_str+="<span>"+item.fileTitle+"</span>";
                    if(item.fileType=='1'){
                        file_str+="<video controls controlslist='nodownload' id='course_video_"+item.fileId+"' poster="+webUrl+"images/video_default.png><source src='"+item.fileUrl+"'></video>";
                    }else if(item.fileType=='2'){
                        file_str+="<audio controls controlslist='nodownload' id='course_audio_"+item.fileId+"'><source src='"+item.fileUrl+"'></audio>";
                    }else{
                        file_str+="<a href='"+item.fileUrl+"' >"+item.fileTitle+"</a>";
                    }
                });
                $("#tabs-4").html(file_str);
            }else{
                $("#tabs-4").html("暂无数据...");
            }

            if(courseFiles.length>0){
                $.each(courseFiles,function (index, item) {
                    if(item.fileType=='1'){
                        playInterval("course_video_"+item.fileId,courseId,3,item.fileId);

                    }else if(item.fileType=='2'){
                        playInterval("course_audio_"+item.fileId,courseId,3,item.fileId);
                    }
                });
            }
        }

    });
}

//点击评论
function commentFun() {
    window.location.href = webUrl+"page/comment/commentList.html?busId="+busId+"&userId="+userId+"&courseId="+courseId;//评论列表
   /* if(getSessionUserId()==""){
        sessionStorage.setItem("selectClass","me");
        window.location.href = webUrl+"page/center/userCenter.html";//登录后才可以评论
    }else{
        window.location.href = webUrl+"page/center/commentList.html?courseId="+courseId;//评论列表
    }*/
}

//点击收藏
function collectFun() {
    layer.open({content: '小媛正在努力开发中,敬请期待!',skin: 'msg',time: 2});
}
//点击点赞
function supportFun() {
    layer.open({content: '小媛正在努力开发中,敬请期待!',skin: 'msg',time: 2});

}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}