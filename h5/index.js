/*导入尾部*/
var sessionUser = localStorage.getItem("sessionUser");
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");

if(sessionUser!=null && url_busId==""){
    //判断如果已经登录，则登录的数据
    var sessionUserJson = JSON.parse(sessionUser);
    url_busId = sessionUserJson.belongBusUserId;
    url_userId = sessionUserJson.userId;
}
var title = "";
var desc = "";
$(function(){
    $(".footer").load("page/common/footer.html");

    if(getSessionBusId()!=""){
        $("#title_bus").html(getSession().busName!=undefined?getSession().busName+"-"+$("#title_bus").html():$("#title_bus").html());
    }
    //index首页数据
    initData(function (result) {
        //加载js
        $.getScript(webUrl+'js/slider.js',function (result) {//加载轮播图js
            $('[data-ydui-slider]').each(function() {
                var $this = $(this);
                $this.slider(window.YDUI.util.parseOptions($this.data('ydui-slider')));
            });
        });
    });

    //如果登陆信息的企业id不是2，则不现实更多，显示我的
    console.log(getSession());
    if(getSessionUserId()=="" || getSessionBusId()==2){
        $("#more_a").css("display","");
    }else if(getSessionUserId()!=null){
        $("#me_a").css("display","");
    }

    //保存
    if(localStorage.getItem("isFirst")==null){
        var videoHtml = "<div class='welcome'>" +
            "<div class='welcome_title'>欢迎来到企业读书云平台</div>" +
            "<div class='introduce_info'>企业读书云平台是总裁读书会推出的企业版读书学习云平台，旨在通过专业的企业读书服务，为企业提供读书指导和帮助，从<span class='introduce_info_import'>学习计划</span>、<span class='introduce_info_import'>读书书单</span>、<span class='introduce_info_import'>读书展示</span>、<span class='introduce_info_import'>读书互动</span>、<span class='introduce_info_import'>读书感想</span>等多方面促进企业全员阅读，持续提升员工和企业的核心竞争力和科技创新能力！</div>" +
           /* "<div class='content_des'>1.跟大咖一起读 <br/>2.精品课程<br/> 3.读书交流<br/>...<br/>好看的内容等待您去发掘！</div>" +*/
            "</div>";
        layer_comment = layer.open({
            type: 1
            ,content: videoHtml
            ,anim: 'up'
            ,style: 'position:fixed; bottom:10%; top:25%;left:5%; width: 90%; height: 22em; padding:10px 0; border:none;border-radius: 2rem;'
            ,time: 10 //3秒后自动关闭
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

});
var linkMap = [];
function initData(callback){
    //获取首页数据
    var param = {"pageIndex":0,"busId":url_busId};
    ajax_fetch("POST",paramMap.index,param,function (result) {
        if(result.success){
            var bannerList = result.data.bannerList;//banner图
            var courseList = result.data.course.courseList;//最新课程

            if(bannerList.length>0){
                //拼接banner图
                var bannerStr = "";
                $.each(bannerList,function (index, item) {
                    item.bannerUrl = baseUrl+item.bannerUrl;
                    var clickUrl = item.bannerClickUrl;
                    if(clickUrl==""){
                        clickUrl = "javascipt:;";
                    }
                    console.log(clickUrl);
                    linkMap[item.bannerId] = clickUrl;
                    bannerStr+="<div class='slider-item' onclick='openUrl("+item.bannerId+")'><a href='javascript:;'><img alt='' src='"+item.bannerUrl+"'></a></div>";
                });
                $("#bannerDiv").html(bannerStr);
            }

            //拼接精品课程  auiCourseList
            var courseStr = "";
            $.each(courseList,function (index, item) {
                item.bookImg = baseUrl+item.bookImg;
                var titleStr = item.title;
                if(titleStr.length>13){
                    titleStr = item.title.substring(0,13)+"...";
                }
                var courseDescStr = item.courseDesc;
                if(courseDescStr.length>30){
                    courseDescStr = item.courseDesc.substring(0,30)+"...";
                }

                var mainGuestPostStr = "";
                if(item.mainGuestPost!=""){
                    mainGuestPostStr = "（"+item.mainGuestPost+"）";
                }

                courseStr+="<a href='javascript:courseDetail("+item.courseId+",1);' class='aui-flex b-line' about=''>" +
                    "<div class='aui-course-img'><img src='"+item.bookImg+"' alt=''></div>" +
                    "<div class='aui-flex-box'>" +
                        "<span class='aui_title'>"+titleStr+"</span>" +
                        "<span class='aui_author'>讲师："+item.mainGuest+mainGuestPostStr+"</span>" +
                        "<span class='aui_des'>点击数<span class='click_num'>"+item.courseClickNum+"</span>次</span>" +
                    "</div></a>";
            });
            if(result.data.course.courseCount>10){
                courseStr+="<span class='more'onclick='getCoursesList(url_busId,url_userId)'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }

            $("#auiCourseList").append(courseStr);

            return callback($("#bannerDiv").html());
        }
    });

}

//点击更多
function getMoreInfo() {
    window.location.href=webUrl+'page/more/moreInfo.html?busId='+url_busId+"&userId="+url_userId;
}


//点击我的
function getMeInfo() {
    sessionStorage.setItem("selectClass","me");
    window.location.href=webUrl+'page/center/userCenter.html?busId='+url_busId+"&userId="+url_userId;
}

function openUrl(bannerId) {
    window.location.href = linkMap[bannerId];
}

//活动列表
function getActivityList() {
    window.location.href=webUrl+'page/activity/activityList.html?busId='+url_busId+"&userId="+url_userId;
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}
