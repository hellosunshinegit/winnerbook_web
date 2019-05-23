var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var activityId = RequestUrl(location.search,"activityId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("活动报名地址");
    });
    if(getSessionBusId()!=""){
        titleBus("活动报名地址");
    }

    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    //index首页数据
    initData();

});
function initData(){
    //获取首页数据
    var param = {"id":activityId};
    ajax_fetch("POST",paramMap.getActivityDetail,param,function (result) {
        if(result.success){
            var info = result.data;
            console.log(info);

            $("#address").html(info.address+"-"+info.detailAddress);

            var map = new BMap.Map("l-map");
            var point = new BMap.Point(info.lngLat.split(",")[0],info.lngLat.split(",")[1]);
            console.log(point);
            map.centerAndZoom(point,18);
            map.addOverlay(new BMap.Marker(point));    //添加标注


            //设置分享内容
            title = info.title+"-活动报名地址";
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

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}