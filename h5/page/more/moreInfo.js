var pageIndex = 0;
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("关于我们");
        titleBus("更多");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    /*导入尾部*/
    initData(pageIndex);
    newArticles();
});

var find = RequestUrl(location.search,"find");
console.log("find_type",find);

function initData(index){
    //获取首页数据
    var param = {"pageIndex":index};
    ajax_fetch("POST",paramMap.getBlocks,param,function (result) {
            console.log(result);
            if(result.success) {
                var titleStr = "";
                //拼接视频列表
                var moreStr = "";
                if (result.data.blockList.length > 0) {
                    $.each(result.data.blockList, function (index, item) {
                        item.blockImgUrl = baseUrl + item.blockImgUrl;

                        moreStr += "<a href='javascript:articleList(" + item.blockId + ");' class='aui-palace-grid' about=''>" +
                            "<div class='aui-palace-grid-icon'>" +
                            "<img src='" + item.blockImgUrl + "' alt=''>" +
                            "</div>" +
                            "<div class='aui-palace-grid-text'>" +
                            "<h2>" + item.blockName + "</h2>" +
                            "</div>" +
                            "</a>";

                        if(index!=0){
                            titleStr+=" | ";
                        }
                        titleStr+=item.blockName;
                    });
                } else {
                    moreStr = "<span class='more_end'>暂无数据...</span>";
                }
                $("#blockDiv").append(moreStr);


                title = $("#title_bus").html();
                var link = location.href.split('#')[0];
                var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
                desc = titleStr;
                setWxConfig(title,link,imgUrl,desc);

            }

    });
}


//获取最新文章
function newArticles() {
    var param = {"pageIndex":0};
    ajax_fetch("POST",paramMap.getTopArticles,param,function (result) {
        console.log(result);
        if(result.success){
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


                var blockType = "";
                if(item.blockId!=undefined && item.blockId.split(",").length>1){
                     $.each(item.blockId.split(","),function (index1, item1) {
                         blockType+="<span class='aui_tag_list' onclick='articleList(\""+item1+"\")'>"+item.blockName.split(",")[index1]+"</span>"
                     });
                }else if(item.blockId!=undefined){
                    blockType="<span class='aui_tag_list' onclick='articleList(\""+item.blockId+"\")'>"+item.blockName+"</span>"
                }
                articleStr+="<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'><a href='javascript:articleDetail("+item.articleId+");'>"+articleTitleStr+"</a></span>" +
                    blockType+
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
            $("#newArticleList").append(articleStr);
        }

    });

}


function articleList(blockId) {//根据模板查询对应的list
    window.location.href=webUrl+"page/more/articleList.html?blockId="+blockId;
}

//点击跳转详情页
function articleDetail(articleId) {//根据模板查询对应的list
    window.location.href = webUrl+"page/more/articleDetail.html?articleId="+articleId;
}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}

//点击跳转调查问卷
function lookIntoFun() {
    window.location.href = webUrl+"page/more/lookInfo.html";
}