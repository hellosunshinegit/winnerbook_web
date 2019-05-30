//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("学习课程");

        titleBus("学习课程");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData(pageIndex);

});
function initData(index){
    //获取首页数据
    var find = RequestUrl(location.search,"find");
    var busId;
    if(find==1){//点击发现，直接读取的是demo的数据
        busId = "";
    }else{
        busId = url_busId;
    }
    var param = {"pageIndex":index,"busId":busId};
    ajax_fetch("POST",paramMap.getCourses,param,function (result) {
            if(result.success){

            //拼接精品课程  auiCourseList
            var courseStr = "";
            var courseTitleStr = "";
            $.each(result.data.courseList,function (index, item) {
                item.bookImg = baseUrl+item.bookImg;

                var titleStr = item.title;
                if(titleStr.length>13){
                    titleStr = item.title.substring(0,13)+"...";
                }
                /*var courseDescStr = item.courseDesc;
                if(courseDescStr.length>30){
                    courseDescStr = item.courseDesc.substring(0,30)+"...";
                }*/

                var mainGuestPostStr = "";
                if(item.mainGuestPost!=""){
                    mainGuestPostStr = "（"+item.mainGuestPost+"）";
                }

                courseStr+="<a href='javascript:courseDetail("+item.courseId+",1);' class='aui-flex b-line' about=''>" +
                    "<div class='aui-course-img'><img src='"+item.bookImg+"' alt=''></div>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+titleStr+"</span>" +
                    "<span class='aui_author'>领读者："+item.mainGuest+mainGuestPostStr+"</span>" +
                    "<span class='aui_des'>点击数<span class='click_num'>"+item.courseClickNum+"</span>次</span>" +
                    "</span>" +
                    "</div></a>";

                //分享时使用
                if(index!=0){
                    courseTitleStr += " | ";
                }
                courseTitleStr += item.title;
            });

            if(result.data.courseCount>(pageIndex+1)*10){
                courseStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#courseList").append(courseStr);


            //设置分享内容
            title = "课程列表";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(result.data.courseList.length>0){
                imgUrl = result.data.courseList[0].bookImg;
            }
            desc = courseTitleStr;
            setWxConfig(title,link,imgUrl,desc);

        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}