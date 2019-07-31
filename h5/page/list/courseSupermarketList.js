//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var courseTypeId = RequestUrl(location.search,"typeId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        titleBus("精选课程");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData(0,courseTypeId);

});


function initData(pageIndex,courseTypeId){
    var param = {"pageIndex":pageIndex,"busId":url_busId,"courseTypeId":courseTypeId};
    ajax_fetch("POST",paramMap.getAdminCourses,param,function (result) {
        if(result.success){

            $("#center_title").html(result.data.courseTypeName+"课程");

            //拼接精品课程  auiCourseList
            var courseStr = "";
            var courseTitleStr = "";
            $.each(result.data.courseAdminList,function (index, item) {
                if(item.bookImg!="" && item.bookImg!=undefined){
                    item.bookImg = baseUrl+item.bookImg;
                }else{
                    item.bookImg = webUrl+"images/logo_share.png";
                }

                var titleStr = item.title;
                if(titleStr.length>12){
                    titleStr = item.title.substring(0,12)+"...";
                }
                /*var courseDescStr = item.courseDesc;
                if(courseDescStr.length>30){
                    courseDescStr = item.courseDesc.substring(0,30)+"...";
                }*/

                var mainGuestPostStr = "";
                if(item.mainGuestPost!=""){
                    mainGuestPostStr = "（"+item.mainGuestPost+"）";
                }

                //判断是否需要购买
                var isBuyStr = ""; //1 需要购买  0 不需要
                if(item.isBuy=="1"){
                    isBuyStr="<div><span class='aui_buy' onclick='buyCourse()'></span><span class='aui_more' onclick='courseBuy()'></span></div>";
                    courseStr+="<div class='aui-flex b-line' about=''>" +
                        "<div class='aui-course-img'><img src='"+item.bookImg+"' alt=''></div>" +
                        "<div class='aui-flex-box'>" +
                        "<span class='aui_title aui-buy-course'>"+titleStr+"</span>" +
                        "<span class='aui_author aui-buy-course'>领读者："+item.mainGuest+mainGuestPostStr+"</span>" +
                        "<div><span class='aui_des aui-buy-course'>点击数<span class='click_num'>"+item.courseClickNum+"</span>次</span>"+isBuyStr+"</div>" +
                        "</span>" +
                        "</div></div>";
                }else{
                    courseStr+="<div class='aui-flex b-line' about=''>" +
                        "<a href='javascript:courseDetail("+item.courseId+",1);'><div class='aui-course-img'><img src='"+item.bookImg+"' alt=''></div></a>" +
                        "<div class='aui-flex-box'>" +
                        "<a href='javascript:courseDetail("+item.courseId+",1);'><span class='aui_title'>"+titleStr+"</span></a>" +
                        "<a href='javascript:courseDetail("+item.courseId+",1);'><span class='aui_author'>领读者："+item.mainGuest+mainGuestPostStr+"</span></a>" +
                        "<div><span class='aui_des'>点击数<span class='click_num'>"+item.courseClickNum+"</span>次</span>"+isBuyStr+"</div>" +
                        "</span>" +
                        "</div></div>";

                }

                //分享时使用
                if(index!=0){
                    courseTitleStr += " | ";
                }
                courseTitleStr += item.title;
            });

            if(result.data.courseAdminCount>(pageIndex+1)*10){
                courseStr+="<span class='more' id='more' onclick='clickMore(\""+(pageIndex+1)+"\",\""+courseTypeId+"\")'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }

            $("#courseList").append(courseStr);

            //设置分享内容
            title = $("#center_title").html();
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(result.data.courseAdminCount.length>0){
                imgUrl = result.data.courseAdminCount[0].bookImg;
            }
            desc = courseTitleStr;
            setWxConfig(title,link,imgUrl,desc);

        }

    });
}

function clickMore(pageIndex, courseTypeId) {
    $("#more").remove();
    initData(parseInt(pageIndex),courseTypeId);
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}