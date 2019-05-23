/*导入尾部*/
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("详情页");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    //index首页数据
    initData();

});
function initData(){
    var articleId = RequestUrl(location.search,"articleId");//articleId
    //获取首页数据
    var param = {"articleId":articleId};
    ajax_fetch("POST",paramMap.getArticleDetail,param,function (result) {
        console.log(result);
        if(result.success){
            var article = result.data;
            $("#title").html(article.articleTitle);
            $("#author").html(article.articleAuthor);
            $("#date").html(article.createDate);
            $("#content").html(article.articleContent);

            //标签
            var articleTags = article.articleTags;
            var articleTagStr = "";
            if(articleTags!="" && articleTags.length>0){
                var articleTagsArray = articleTags.split(",");
                $.each(articleTagsArray,function (index, item) {
                    articleTagStr+= "<span>"+item+"</span>\t";
                });
                $("#article_tags").html(articleTagStr);
                $("#article_tags").css("display","");
            }

            //微信分享
            title = $("#title_bus").html();
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            desc = article.articleTitle;
            setWxConfig(title,link,imgUrl,desc);

        }

    });
}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}