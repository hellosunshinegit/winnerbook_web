var pageIndex = 0;

/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("企业风采");
    });
    $(".footer").load("../common/footer.html");
    initData(pageIndex);
});
function initData(index){
    //获取首页数据
    var param = {"pageIndex":index,"busId":getSessionBusId()};
    ajax_fetch("POST",paramMap.getNews,param,function (result) {
            console.log(result);
            if(result.success){

            //拼接视频列表
            var newsStr = "";
            $.each(result.data.newsList,function (index, item) {

                var newTitleStr = item.newTitle;
                if(newTitleStr.length>19){
                    newTitleStr = item.newTitle.substring(0,19)+"...";
                }

                var newDesStr = item.newDes;
                if(newDesStr.length>40){
                    newDesStr = item.newDes.substring(0,40)+"...";
                }

                newsStr+="<a href='javascript:;' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+newTitleStr+"</span>" +
                    "<span class='aui_source'>" +
                    "<span class='desc_css'>"+newDesStr+"</span>" +
                    "<span class='date_css'>"+item.createDate+"</span>" +
                    "</span>"+
                    "</div></a>";
            });
            if(result.data.newsCount>(pageIndex+1)*10){
                newsStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more'>暂无数据...</span>";
            }
            $("#newsList").append(newsStr);
        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}
