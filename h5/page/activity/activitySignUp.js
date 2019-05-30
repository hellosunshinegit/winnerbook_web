/*导入尾部*/
var activityId = RequestUrl(location.search,"activityId");
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("活动报名");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    titleBus("活动报名");

    //如果已经登录，则默认是自己的名字和手机号
    if(getSessionUserId()!=""){
        $("#userName").val(getSession().userUnitName);
        $("#phone").val(getSession().userName);
    }
    
    initData();

});

//根据id查询name
function initData() {
    var param = {"id":activityId};
    ajax_fetch("POST",paramMap.getActivityDetail,param,function (result) {
        if(result.success){
            var info = result.data;

            $("#title").html(info.title);
            //设置分享内容
            title = info.title+"-活动报名";
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

//点击提交
function signUpSubmitFun() {
    var userName = $("#userName").val().trim();
    var phone = $("#phone").val().trim();

    if(userName==""){
        layerMsg("请输入您的姓名");
        return false;
    }

    if(phone==""){
        layerMsg("请输入您的手机号");
        return false;
    }


    var param = {"userName":userName,"phone":phone,"activityId":activityId,"userId":url_userId,"busId":url_busId};
    ajax_fetch("POST",paramMap.activitySignUpSubmit,param,function (result) {
        if(result.success){
            $("#userName").val("");
            $("#phone").val("");
            layer.open({
                content: '报名成功，查看些其他活动吧！'
                ,btn: ['可以', '不需要']
                ,yes: function(index){
                    if(getSessionUserId()==""){
                        localStorage.setItem("sessionUser",JSON.stringify(result.data));
                        //传值  belongBusUserId  userId都要传递
                        window.location.href = webUrl+"page/activity/activityList.html?busId="+result.data.belongBusUserId+"&userId="+result.data.userId;
                    }else{
                        window.location.href = webUrl+"page/activity/activityList.html?busId="+url_busId+"&userId="+url_userId;
                    }
                    layer.close(index);
                }
            });
        }else{
            layerMsg(result.msg);
        }
    });

}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}