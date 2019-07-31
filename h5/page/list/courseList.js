//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("精选课程");

        titleBus("精选课程");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData();

});


//获取课程类型
function initData(){
    var param = {"busId":url_busId};
    ajax_fetch("POST",paramMap.getCourseTypes,param,function (result) {
        if(result.success){
            if(result.data.length>0){
                var tabTitle = "";
                var tabDiv = "";
                $.each(result.data,function (index, item) {
                   tabTitle+="<li><a href='#tabs-"+index+"' onclick='getCourses(0,"+item.typeId+",\""+index+"\")'>"+item.typeName+"</a></li>";
                   tabDiv+="<div id='tabs-"+index+"' class='aui-course-list'></div>";
                });
                $("#tabTitle").html(tabTitle);
                //创建div
                $("#tabs_container").html(tabDiv);

                //数据加载完成之后运行js  tab的样式
                $('#tabs').tabulous({
                    effect: 'scale'
                });
                $.each($("[id^='tabs-']"),function (index, item) {
                    $("#tabs-"+index).css("display","none");
                });
                $("#"+$("[id^='tabs-']")[0].id).css("display","");

                //获得第一条类型的数据
                getCourses(0,result.data[0].typeId,"0");
            }
        }
    });
}


function getCourses(pageIndex,courseTypeId,tabDiv,typeMore){
    pageIndex = parseInt(pageIndex);
    //获取首页数据
    var param = {"pageIndex":pageIndex,"busId":url_busId,"courseTypeId":courseTypeId};
    ajax_fetch("POST",paramMap.getCourses,param,function (result) {
            if(result.success){
            //拼接精品课程  auiCourseList
            var courseStr = "";
            var courseTitleStr = "";
            $.each(result.data.courseList,function (index, item) {
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
                    "</span>" +
                    "</div></a>";

                //分享时使用
                if(index!=0){
                    courseTitleStr += " | ";
                }
                courseTitleStr += item.title;
            });

            if(result.data.courseCount>(pageIndex+1)*10){
                courseStr+="<span class='more' id='more' onclick='getCourses(\""+(pageIndex+1)+"\",\""+courseTypeId+"\",\""+tabDiv+"\",\"more\")'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }
            if(typeMore=="more"){
                $("#tabs-"+tabDiv).append(courseStr);
                $("#more").remove();
            }else{
                $("#tabs-"+tabDiv).html(courseStr);
            }


            //设置分享内容
            title = "精选课程";
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

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}