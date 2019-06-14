/*导入尾部*/
var busId = RequestUrl(location.search,"busId");
var userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("书籍详情");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    titleBus("书籍详情");
    //index首页数据
    initData();

});
//根据课程id查询数据
function initData(){
    var bookId = RequestUrl(location.search,"bookId");
    var bluId = RequestUrl(location.search,"bluId");
    //获取首页数据
    var param = {"bookId":bookId,"bluId":bluId};
    ajax_fetch("POST",paramMap.getBookDetail,param,function (result) {
        if(result.success){
            var book = result.data;
            $("#bookName").html(book.bookName);
            $("#bookAuthor").html(book.bookAuthor);
            $("#bookPublishers").html(book.bookPublishers);
            $("#bookPublicationDate").html(book.bookPublicationDate);
            $("#openBook").html(book.openBook);
            $("#bookPaper").html(book.bookPaper);
            $("#bookPack").html(book.bookPack);
            $("#isSuit").html(book.isSuit);
            $("#bookIsbn").html(book.bookIsbn);
            $("#bookClass").html(book.bookClass);
            $("#createDate").html(book.createDate);
            if(book.bookContentDes!=undefined && book.bookContentDes!=""){
                $("#bookContentDes").html(book.bookContentDes);
            }else{
                $("#bookContentDes").html("暂无数据...");
            }
            $("#bookImg").attr("src",baseUrl+book.bookImg);

            //设置分享内容
            title = book.bookName;
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(book.bookImg!=""){
                imgUrl = baseUrl+book.bookImg;
            }
            desc = "《"+book.bookName+"》"+book.bookAuthor;
            if(book.bookContentDes!=undefined && book.bookContentDes!=""){
                desc = book.bookContentDes;
            }
            setWxConfig(title,link,imgUrl,desc);

        }

    });
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}