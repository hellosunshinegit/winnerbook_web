var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("活动详情");
    });
    if(getSessionBusId()!=""){
        titleBus("活动");
    }

    //index首页数据
    initData();

});
var id = RequestUrl(location.search,"id");
function initData(){
    //获取首页数据
    var param = {"id":id};
    ajax_fetch("POST",paramMap.getActivityDetail,param,function (result) {
        if(result.success){
            var info = result.data;
            $("#title").html(info.title);
            $("#content").html(info.detail);


            var time = "";
            if(info.startDate==info.endDate){
                time = info.startDate+"<span class='week'>"+info.week+"</span>"+info.startDateTime+"-"+info.endDateTime;
            }else{
                time = info.startDate+" "+info.startDateTime+" - "+info.endDate+" "+info.endDateTime;
            }

            $("#time").html(time);
            $("#address").html(info.address+"-"+info.detailAddress);

            if(info.isInvalid=="0"){
                $("#activity").css("display","");
            }


            //设置分享内容
            title = info.title;
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";

            if(info.img!=""){
               imgUrl = baseUrl+getMinImg(info.img);
            }
            desc = info.detail.replace(/<[^>]+>/g,"");
            setWxConfig(title,link,imgUrl,desc);
        }

    });
}

//点击互动报名
function signUp() {
    window.location.href = webUrl+'page/activity/activitySignUp.html?activityId='+id+'&busId='+url_busId+'&userId='+url_userId;
}

//点击查看跳转百度
function lookMapFun() {
    window.location.href = webUrl+'page/activity/activityMap.html?activityId='+id+'&busId='+url_busId+'&userId='+url_userId;
}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}