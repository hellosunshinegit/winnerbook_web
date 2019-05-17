//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData(pageIndex);

});

function initData(index){
    busBookList(index);
}

//书籍列表
function busBookList(index){
    var typeId = RequestUrl(location.search,"typeId");
    var param = {"pageIndex":index,"busId":url_busId,"typeId":typeId,"userId":url_userId};
    ajax_fetch("POST",paramMap.getBookLists,param,function (result) {
        console.log(result);
        if(result.success){

            var bookListType = result.data.bookListType;

            //设置title
            $("#center_title").html(bookListType.typeName);

            $("#title_bus").html(bookListType.typeName);

            //拼接书单列表
            var bookStr = "";
            var bookNameStr = "";//拼接书单列表在转发的时候显示
            $.each(result.data.bookList, function (index, item) {
                item.bookImg = baseUrl + item.bookImg;

                if(index!=0){
                    bookNameStr+=" | ";
                }
                bookNameStr+=item.bookName;

                var bookContentDesStr = item.bookContentDes != undefined ? item.bookContentDes : "";
                if (bookContentDesStr.length > 30) {
                    bookContentDesStr = item.bookContentDes.substring(0, 30) + "...";
                }

                var bookClassStr = item.bookClass != undefined ? item.bookClass : "";
                if (bookClassStr.length > 15) {
                    bookClassStr = item.bookClass.substring(0, 15) + "...";
                }

                var courseStr = "<span class='aui_title_course'></span>";
                if(item.courseId!=undefined && item.courseId!=null){
                    var mainGuest = item.mainGuest;
                    if(item.mainGuest.length>3){
                        mainGuest = item.mainGuest.substring(0,3)+"..";
                    }
                   courseStr = "<span class='aui_title_course' onclick='courseDetail(\""+item.courseId+"\")'>"+mainGuest+"<span style='font-size:0.7rem;'>领读</span></span>";
                }

                bookStr += "<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-course-img' onclick='bookDetail(" + item.bookId + ")'><img src='" + item.bookImg + "' alt=''></div>" +
                    "<div class='aui-flex-box' >" +
                    "<span class='aui_title' onclick='bookDetail(" + item.bookId + ")'>" + item.bookName + "</span>" +courseStr+
                    "<span class='aui_author' onclick='bookDetail(" + item.bookId + ")'>" + bookClassStr + "</span>" +
                    "<span class='aui_des' onclick='bookDetail(" + item.bookId + ")'>" + bookContentDesStr +
                    "</span>" +
                    "</div></div>";
            });
            if (result.data.bookListCount > (pageIndex + 1) * 10) {
                bookStr += "<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            } else if (bookStr.length > 0) {
                bookStr += "<span class='more_end'>我是有底线的...</span>";
            } else {
                bookStr += "<span class='more_end'>暂无数据...</span>";
            }
            $("#bookList").append(bookStr);


            //设置分享内容
            var title = $("#title_bus").html();
            var link = location.href.split('#')[0];

            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(bookListType.typeImg!=""){
                imgUrl = baseUrl + bookListType.typeImg;
            }
            if(bookListType.typeDes!=""){
                bookNameStr = bookListType.typeDes;
            }
            var desc = bookNameStr;
            console.log(imgUrl,desc);
            setWxConfig(title,link,imgUrl,desc);



        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    busBookList(pageIndex);
}