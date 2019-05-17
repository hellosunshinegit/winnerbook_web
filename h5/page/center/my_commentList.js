var pageIndex = 0;

/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("我的评论");
    });
    if(getSessionBusId()!=""){
        titleBus("我的评论");
    }
    initData(pageIndex);

});

function initData(index){
    var param = {"pageIndex":index,"busId":RequestUrl(location.search,"busId"),"userId":RequestUrl(location.search,"userId")};
    ajax_fetch("POST",paramMap.getCourseComments,param,function (result) {
            console.log(result);
            if(result.success){

            //拼接视频列表
            var newsStr = "";
            var commentStr = "";
            $.each(result.data.courseCommentList,function (index, item) {


                newsStr+="<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+item.createUserName+"</span></span>" +
                    "<span class='date_css'>"+item.createDate+"</span>" +
                    "<span class='aui_source'>" +
                    "<span class='desc_css'>"+item.comment+"</span>" +
                    "</span>"+
                    "</div></div>";

                if(index!=0){
                    commentStr+=" | ";
                }
                commentStr += item.comment;
            });
            if(result.data.courseCommentCount>(pageIndex+1)*10){
                newsStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#newsList").append(newsStr);


            //设置分享内容
            var title = "我的评论";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            var desc = "我的评论";
            if(commentStr!=""){
                desc = commentStr;
            }
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
