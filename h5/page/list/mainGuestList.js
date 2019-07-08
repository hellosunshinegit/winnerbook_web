//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("大咖领读");

        titleBus("大咖领读");
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
    ajax_fetch("POST",paramMap.getMainGuests,param,function (result) {
            console.log(result);
            if(result.success){

            //拼接精品课程  auiCourseList
            var courseStr = "";
            var mainGuestStr = "";
            $.each(result.data.mainGuestsList,function (index, item) {
                if(item.mainGuesImg!=""){
                    item.mainGuesImg = baseUrl+getMinImg(item.mainGuesImg);
                }else{
                    item.mainGuesImg = baseUrl+item.mainGuesImg;
                }

                var mainGuestIntroduceStr = item.mainGuestIntroduce;
                if(mainGuestIntroduceStr.length>30){
                    mainGuestIntroduceStr = item.mainGuestIntroduce.substring(0,30)+"...";
                }

                //判断是否有百度知道链接，
                var recommendBookStr = "";
                if(item.recommendBook!="" && item.recommendBook!=undefined){
                    if(item.recommendBook.length>7){
                        item.recommendBook = item.recommendBook.substring(0,7)+"...";
                    }
                    recommendBookStr = "<span class='aui_tag'><a href='javascript:courseDetail("+item.courseId+",2);'>《"+item.recommendBook+"》</a></span>"
                }

                var mainGuestBaiduKnowStr = "";
                if(item.mainGuestBaiduKnow!=""){
                    mainGuestBaiduKnowStr = "<a href="+item.mainGuestBaiduKnow+" style='text-decoration: underline;color:#323232;font-size:1.2rem;'>"+item.mainGuest+"</a>"
                }else{
                    mainGuestBaiduKnowStr = item.mainGuest;
                }

                courseStr+="<div class='aui-flex b-line'>" +
                    "<a href='javascript:courseDetail("+item.courseId+",2);'><div class='aui-guest-img'><img src='"+item.mainGuesImg+"' alt=''></div></a>" +
                    "<div class='aui-flex-box'>" +
                    "<div>" +
                        "<a href='javascript:courseDetail("+item.courseId+",2);'><span class='aui_guest_name'>"+mainGuestBaiduKnowStr+"</span></a>" +
                        recommendBookStr+
                    "</div>" +
                    "<a href='javascript:courseDetail("+item.courseId+",2);'><span class='aui_guest_post'>"+item.mainGuestPost+"</span>" +
                    "<span class='aui_guest_introduce'>" + mainGuestIntroduceStr +
                    "</a></span>" +
                    "</div></div>";

                //分享时使用
                if(index!=0){
                    mainGuestStr += " | ";
                }
                mainGuestStr += item.mainGuest;
            });

            if(result.data.mainGuestsCount>(pageIndex+1)*10){
                courseStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(courseStr.length>0){
                courseStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                courseStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#mainGuestList").append(courseStr);


            //设置分享内容
            title = "导师列表";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(result.data.mainGuestsList.length>0){
                imgUrl = result.data.mainGuestsList[0].mainGuesImg;
            }
            desc = mainGuestStr;
            console.log(desc);
            setWxConfig(title,link,imgUrl,desc);
        }

    });
}

//点击导师介绍
function mainGuestFun(value) {
    window.location.href=value;
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