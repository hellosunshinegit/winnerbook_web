//index首页数据
var pageIndex = 0;
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        titleBus("列表页");
        title = $("#title_bus").html();
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
        desc = "总裁读书会-企业读书云平台-更多信息在这里哦。";
        setWxConfig(title,link,imgUrl,desc);

    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    initData(pageIndex);

});
function initData(index){
    var blockId = RequestUrl(location.search,"blockId");//获取blockId
    //获取首页数据
    var param = {"blockId":blockId,"pageIndex":index};
    ajax_fetch("POST",paramMap.getArticles,param,function (result) {
            console.log(result);
            if(result.success){

            $("#center_title").html(result.data.blockName!=""?result.data.blockName:"企业读书云平台");

            //拼接书单列表
            var articleStr = "";
            $.each(result.data.articleList,function (index, item) {
                if(item.articleImg!=""){
                    item.articleImg = baseUrl+getMinImg(item.articleImg);
                }else{
                    item.articleImg = webUrl+"images/def_img0.png";
                }

                var articleTitleStr = item.articleTitle;
                if(articleTitleStr.length>18){
                    articleTitleStr = item.articleTitle.substring(0,18)+"...";
                }

              /*  var blockType = "";
                if(item.blockId!=undefined && item.blockId.split(",").length>1){
                    $.each(item.blockId.split(","),function (index1, item1) {
                        blockType+="<span class='aui_tag_list' onclick='articleList(\""+item1+"\")'>"+item.blockName.split(",")[index1]+"</span>"
                    });
                }else if(item.blockId!=undefined){
                    blockType="<span class='aui_tag_list' onclick='articleList(\""+item.blockId+"\")'>"+item.blockName+"</span>"
                }
*/
                articleStr+="<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'><a href='javascript:articleDetail("+item.articleId+");'>"+articleTitleStr+"</a></span>" +
                    "<span class='aui_date'><a href='javascript:articleDetail("+item.articleId+");'>"+item.createDate+"</a></span>"+
                    "</div>" +
                    "<div class='aui-course-img'>" +
                    "<a href='javascript:articleDetail("+item.articleId+");'><img src='"+item.articleImg+"' alt=''>" +
                    "</a></div>" +
                    "</div>";
            });
            if(result.data.articleCount>(pageIndex+1)*10){
                articleStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(articleStr.length>0){
                articleStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                articleStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#articleList").append(articleStr);
        }

    });
}

function articleList(blockId) {//根据模板查询对应的list
    window.location.href=webUrl+"page/more/articleList.html?blockId="+blockId;
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}


//点击跳转详情页
function articleDetail(articleId) {//根据模板查询对应的list
    window.location.href = webUrl+"page/more/articleDetail.html?articleId="+articleId;
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}