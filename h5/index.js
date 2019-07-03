/*导入尾部*/
var sessionUser = localStorage.getItem("sessionUser");
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");

var pageIndex_course = 0;
var pageIndex_video = 0;
var pageIndex_student = 0;
/*if(sessionUser!=null && url_busId==""){
    //判断如果已经登录，则登录的数据
    var sessionUserJson = JSON.parse(sessionUser);
    url_busId = sessionUserJson.belongBusUserId;
    url_userId = sessionUserJson.userId;
}*/
var title = "";
var desc = "";
$(function(){
    $(".footer").load("page/common/footer.html",function (result) {
    });

    titleBus("欢迎来到企业读书云");
    $("#index_title").html("欢迎来到企业读书会");

    //首页标题  根据busId查询对应企业的短名称
    getBusInfo(url_busId,function (result) {
        console.log(result);
        if(result.mobileBusName!="" && result.mobileBusName!=null){
            $("#index_title").html("欢迎来到"+result.mobileBusName+"企业读书会");
        }
        if(result.busLogo!="" && result.busLogo!=null){
            $("#bus_logo").html("<img src='"+baseUrl+result.busLogo+"'>");
        }
        if(url_busId==""){
            $("#bus_logo").html("<img src='"+webUrl+"images/def_img4.png'>");
        }
    });


    //index首页数据
    initData(function (result) {
        //加载js
        $.getScript(webUrl+'js/slider.js',function (result) {//加载轮播图js
            $('[data-ydui-slider]').each(function() {
                var $this = $(this);
                $this.slider(window.YDUI.util.parseOptions($this.data('ydui-slider')));
            });
        });

        courseList(pageIndex_course);//获取精选课程
        videoList(pageIndex_video);//获取视频
    });

    //如果登陆信息的企业id不是2，则不现实更多，显示我的   getSessionUserId()=="" || getSessionBusId()==2
    if(url_busId!=""){
        $("#me_a").css("display","");
    }else{
        $("#more_a").css("display","");
    }

    //保存
    if(localStorage.getItem("isFirst")==null){
        var videoHtml = "<div class='welcome'>" +
            "<div class='welcome_img'><img src='images/welcome1.png'/></div>" +
            "<div class='build_img'><img src='images/welcome_img2.png'/></div>" +
            "<div class='logo_img'><img src='images/welcome_img3.png'/></div>" +
            "<div class='introduce_info'></div>" +
           /* "<div class='content_des'>1.跟大咖一起读 <br/>2.精品课程<br/> 3.读书交流<br/>...<br/>好看的内容等待您去发掘！</div>" +*/
            "</div>";
        layer_comment = layer.open({
            type: 1
            ,content: videoHtml
            ,anim: 'up'
            ,style: 'position:fixed; top:0;left:0; width: 100%; height: 100%;border:none;-webkit-animation-duration:.5s;animation-duration:.5s;'
            ,time: 3 //3秒后自动关闭
        });
        localStorage.setItem("isFirst","1");
    }else{
       /* //查看上次观看的课程是哪个，并展示
        var confirm = localStorage.getItem("confirm");
        if(localStorage.getItem("confirm")!="1"){
            localStorage.setItem("confirm",'1');
            var videoHtml = "<div class='welcome'><div class='welcome_title_again'>欢迎回来</div></div>";
            //var videoHtml = "<div class='welcome'><div class='welcome_title'>欢迎回来</div><div class='introduce_info' style='text-indent:0rem;'>您上次看了视频：<a style='text-decoration: underline;' href='javascript:courseDetail("+courseInfo_json.courseId+",1);'>"+courseInfo_json.title+"</a>，点击继续</div></div>";
            layer_comment = layer.open({
                type: 1
                ,content: videoHtml
                ,anim: 'up'
                ,style: 'position:fixed; bottom:10%; top:60%;left:20%; width: 60%; height: 3em; padding:10px 0; border:none;border-radius: 2rem;'
            });
        }*/
    }

    //设置分享内容
    title = $("#title_bus").html();
    var link = location.href.split('#')[0];
    var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
    desc = "企业读书学习的云平台，旨在通过专业的企业读书服务，为企业提供读书指导和帮助，从学习计划、读书书单、读书展示、读书互动、读书感想等多方面促进企业全员阅读，进而推动社会全民阅读风尚！";
    setWxConfig(title,link,imgUrl,desc);


    //数据加载完成之后运行js  tab的样式
    $('#tabs').tabulous({
        effect: 'scale'
    });
    $.each($("[id^='tabs-']"),function (index, item) {
        $("#tabs-"+index).css("display","none");
    });
    $("#"+$("[id^='tabs-']")[0].id).css("display","");
    //如果已经登录，则显示浏览记录
    if(getSessionUserId()!=""){
        $("#li_2").css("display","");
        $("#tabs-2").css("display","");
        //li的宽度自定义
        $.each($("[id=labelDiv_index] li"),function (index, item) {
            $("#li_"+index).css("width",Math.floor(100/($("[id=labelDiv_index] li").length)-1)+"%");
            $("#li_"+index).css("padding","0 10px");
        });
    }


});
var linkMap = [];
function initData(callback){
    //获取首页数据
    var param = {"pageIndex":0,"busId":url_busId};
    ajax_fetch("POST",paramMap.index,param,function (result) {
        if(result.success){
            var bannerList = result.data.bannerList;//banner图

            if(bannerList.length>0){
                //拼接banner图
                var bannerStr = "";
                $.each(bannerList,function (index, item) {
                    item.bannerUrl = baseUrl+item.bannerUrl;
                    var clickUrl = item.bannerClickUrl;
                    if(clickUrl==""){
                        clickUrl = "javascipt:;";
                    }
                    linkMap[item.bannerId] = clickUrl;
                    bannerStr+="<div class='slider-item' onclick='openUrl("+item.bannerId+")'><a href='javascript:;'><img alt='' src='"+item.bannerUrl+"'></a></div>";
                });
                $("#bannerDiv").html(bannerStr);
            }

            return callback($("#bannerDiv").html());
        }
    });

}


//获取课程
function courseList(pageIndex,type){
    //拼接精品课程  auiCourseList
    var param = {"pageIndex":pageIndex,"busId":url_busId};
    ajax_fetch("POST",paramMap.getCourses,param,function (result) {
        if(result.success){
            var courseStr = "";
            $.each(result.data.courseList,function (index, item) {
                item.bookImg = baseUrl+item.bookImg;
                var titleStr = item.title;
                if(titleStr.length>10){
                    titleStr = item.title.substring(0,10)+"...";
                }
                var courseDescStr = item.courseDesc;
                if(courseDescStr.length>30){
                    courseDescStr = item.courseDesc.substring(0,30)+"...";
                }

                var mainGuestStr = "";
                if(item.mainGuest!=""){
                    var mainGuestPostStr = "";
                    if(item.mainGuestPost!=""){
                        mainGuestPostStr = "（"+item.mainGuestPost+"）";
                    }
                    mainGuestStr = "领读者："+item.mainGuest+mainGuestPostStr;
                }

                courseStr+="<a href='javascript:courseDetail("+item.courseId+",1);' class='aui-flex b-line' about=''>" +
                    "<div class='aui-course-img'><img src='"+item.bookImg+"' alt=''></div>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+titleStr+"</span>" +
                    "<span class='aui_author'>"+mainGuestStr+"</span>" +
                    "<span class='aui_des'>点击数<span class='click_num'>"+item.courseClickNum+"</span>次</span>" +
                    "</div></a>";
            });
            if(result.data.courseCount>(pageIndex+1)*10){
                courseStr+="<span class='more' id='more_course' onclick='getCoursesMore()'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }
            if(type=="more"){
                $("#tabs-0").append(courseStr);
            }else{
                $("#tabs-0").html(courseStr);
            }
        }
    });
}

function getCoursesMore(){
    window.location.href=webUrl+'page/list/courseList.html?busId='+url_busId+"&userId="+url_userId;
}

function videoList(pageIndex,type) {
    var param = {"pageIndex":pageIndex,"busId":url_busId};
    ajax_fetch("POST",paramMap.getVideos,param,function (result) {
        if(result.success){
            //拼接视频列表
            var videoStr = "";
            var videoTitle = "";
            if(result.data.videoList.length>0){
                var num = Math.floor(Math.random() * result.data.videoList.length);
                var firstVideo = result.data.videoList[num];
                $("#aui_title").html(firstVideo.fileTitle);// poster="+webUrl+"images/video_def_img.png style='width: 100%; height: 80%; object-fit: fill'  x5-video-player-type='h5' x5-video-player-fullscreen='true'
                $("#firstVideo").html("<video controls class='first_video' id='first_video_"+firstVideo.fileId+"' poster="+webUrl+"images/video_default.png x5-video-player-fullscreen='true'><source src='"+baseUrl+firstVideo.fileUrl+"'></video>");
                $("#video_divHeight").css("display","");

                var video_img = webUrl+"images/video_open.png";
                //result.data.videoList.splice(num,1);
                if(result.data.videoList.length>0){
                    $.each(result.data.videoList,function (index, item) {
                        if(index!=0){
                            videoTitle +=" | ";
                        }
                        videoTitle+=item.fileTitle;

                        item.bookImg = baseUrl+item.bookImg;
                        item.fileUrl = baseUrl+item.fileUrl;
                        //autoplay muted  自动播放，pc可以，但是h5手机端不行
                        videoStr+="<div class='aui-flex b-line' about=''>" +
                            "<div class='aui-flex-box-video'>" +
                            "<span class='aui_title'>"+item.fileTitle+"</span>" +
                            "<a href='javascript:courseDetail(\""+item.courseId+"\");'><span class='aui_des'>"+item.title+"</span></a>" +
                            "</div>" +
                            "<a href='javascript:openVideo(\""+item.courseId+"\",\""+item.fileId+"\",\""+item.fileTitle+"\",\""+item.fileUrl+"\");'>" +
                            "<div class='aui-course-img'>" +
                            "<img src='"+video_img+"' alt=''>" +
                            "</div></a>" +
                            "</div><div class='divHeight_video'></div>";
                    });
                    if(result.data.videoCount>(pageIndex+1)*10){
                        videoStr+="<span class='more' id='more_video' onclick='getVideoMore()'>点击更多...</span>";
                    }else if(videoStr.length>0){
                        videoStr+="<span class='more_end'>我是有底线的...</span>";
                    }
                    if(type=="more"){
                        $("#tabs-1").append(videoStr);
                    }else{
                        $("#tabs-1").html(videoStr);
                    }
                }else{
                    videoStr+="<span class='more_end'>我是有底线的...</span>";
                    if(type=="more"){
                        $("#tabs-1").append(videoStr);
                    }else{
                        $("#tabs-1").html(videoStr);
                    }
                }
            }else{
                videoStr+="<span class='more_end'>暂无数据...</span>";
                if(type=="more"){
                    $("#tabs-1").append(videoStr);
                }else{
                    $("#tabs-1").html(videoStr);
                }
            }
        }
    });
}


function getVideoMore(){
    $("#more_video").remove();
    pageIndex_video = pageIndex_video+1;
    videoList(pageIndex_video,"more");
}


//点击更多
function getMoreInfo() {
    window.location.href=webUrl+'page/more/moreInfo.html?busId='+url_busId+"&userId="+url_userId;
}

//点击获取学习记录
function studentList(pageIndex_student,type) {
    var param = {"pageIndex":pageIndex_student,"busId":getSessionBusId(),"userId":getSessionUserId()};
    ajax_fetch("POST",paramMap.getStudentRecords,param,function (result) {
        if(result.success){

            //拼接视频列表
            var newsStr = "";
            $.each(result.data.studentRecordList,function (index, item) {

                var courseNameStr = item.courseName;
                if(courseNameStr.length>12){
                    courseNameStr = item.courseName.substring(0,12)+"...";
                }

                var isStr = "正在观看";
                if(item.isEnd=="1"){
                    isStr = "完成观看";
                }

                var recordDes = item.recordDes;
                if(item.recordType=="3" && item.courseFileName!="" && item.courseFileName!=undefined){
                    recordDes = item.courseFileName+"："+recordDes;
                }

                var timeStr = "";
                if(item.totalTime!=""){
                    timeStr = "视频时长："+item.totalTime+"；";
                }

                newsStr+="<a href='javascript:courseDetail("+item.courseId+");' class='aui-flex-student b-line' about=''>" +
                    "<div class='aui-flex-box-student'>" +
                    "<span class='aui_title-student'>"+courseNameStr+"<span class='status_css-student'>"+isStr+"</span></span>" +
                    "<span class='aui_source-student'>" +
                    "<span class='desc_css-student'>"+timeStr+recordDes+"</span>" +
                    "<span class='date_css-student'>"+item.createDate+"</span>" +
                    "</span>"+
                    "</div></a>";
            });
            if(result.data.studentRecordCount>(pageIndex_student+1)*10){
                newsStr+="<span class='more' id='more_student' onclick='clickMore_student()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more_end'>暂无数据...</span>";
            }
            if(type=="more"){
                $("#tabs-2").append(newsStr);
            }else{
                $("#tabs-2").html(newsStr);
            }
        }
    });
}


function clickMore_student() {
    $("#more_student").remove();
    pageIndex_student = pageIndex_student+1;
    studentList(pageIndex_student,"more");
}

//点击我的
function getMeInfo() {
    sessionStorage.setItem("selectClass","me");
    window.location.href=webUrl+'page/center/userCenter.html?busId='+url_busId+"&userId="+url_userId;
}

function openUrl(bannerId) {
    window.location.href = linkMap[bannerId];
}

//活动列表，企业风采，读书会活动
function getNewBusActivityList() {
    window.location.href=webUrl+'page/list/newsList.html?busId='+url_busId+"&userId="+url_userId;
}

//课程超市
function getAdminCourseList() {
    window.location.href=webUrl+'page/list/courseSupermarket.html?busId='+url_busId+"&userId="+url_userId;
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}


//点击观看视频
function openVideo(courseId,fileId,fileTitle,fileUrl) {
    if(getSessionUserId()==""){
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
        var videoHtml = "<div class='open_video'><span>"+fileTitle+"</span><video controls id='video_"+fileId+"' poster="+webUrl+"images/video_default.png><source  src='"+fileUrl+"'></video></div>";
        layer_comment = layer.open({
            type: 1
            ,content: videoHtml
            ,anim: 'up'
            ,style: 'position:fixed; bottom:10%; top:40%;left:0; width: 100%; height: 18em; padding:10px 0; border:none;border-radius: 1.5rem;'
        });
        //点开后立即播放
        playInterval("video_"+fileId,courseId,3,fileId);//视频播放监控
        document.getElementById("video_"+fileId).play();//浏览器端播放设置
        document.addEventListener("WeixinJSBridgeReady", function () {//微信端播放设置
            document.getElementById("video_"+fileId).play();
        }, false);
    }
}