/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
$(function(){
    $(".header").load("../../../common/header.html",function (result) {
        $("#center_title").html("全局排名");
    });
    $(".footer").load("../../../common/footer.html",function (result) {
        selectBottom();
    });
    if(getSessionBusId()!=""){
        titleBus("全局排名");
    }

    initData(pageIndex);
});

