var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("评论列表");
    });

    titleBus("评论列表");

    initData(pageIndex);

});

var courseId = "";
var addFlash = false;
function initData(index){
    //获取首页数据
    courseId = RequestUrl(location.search,"courseId");
    var param = {"courseId":courseId,"pageIndex":index,"busId":url_busId};
    ajax_fetch("POST",paramMap.getCourseComments,param,function (result) {
            console.log(result);
            if(result.success){

            //设置分享内容
            title = $("#title_bus").html();
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            desc = result.data.courseCommentList[0].comment;
            setWxConfig(title,link,imgUrl,desc);

            //拼接视频列表
            var newsStr = "";
            $.each(result.data.courseCommentList,function (index, item) {

                newsStr+="<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+item.createUserName+"</span></span>" +
                    "<span class='date_css'>"+item.createDate+"</span>" +
                    "<span class='aui_source'>" +
                    "<span class='desc_css'>"+item.comment+"</span>" +
                    "</span>"+
                    "</div></div>";
            });
            if(result.data.courseCommentCount>(pageIndex+1)*10){
                newsStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more_end'>暂无数据...</span>";
            }
            if(addFlash){
                $("#newsList").html(newsStr);
            }else{
                $("#newsList").append(newsStr);
            }
        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}

var addComment = "<div>" +
    "    <div class='close_div'>" +
    "        <a href='javascript:close()'>关闭</a>" +
    "    </div>" +
    "    <div>" +
    "        <textarea placeholder='留下自己的观点' class='textarea_css' id='comment'></textarea>" +
    "        <div class='button_div'><input type='button' value='发送' class='button_css' onclick='addCommentSubmit()'/></div>" +
    "    </div>" +
    "</div>";

var layer_comment;
//点击添加评论
function addCommentFun() {
    console.log(courseId);
    if(getSessionUserId()!=""){
        layer_comment = layer.open({
            type: 1
            ,content: addComment
            ,anim: 'up'
            ,style: 'position:fixed; bottom:0; left:0; width: 100%; height: 300px; padding:10px 0; border:none;'
        });
        //获取焦点
        $("#comment").focus();

    }else{
        sessionStorage.setItem("selectClass","me");
        window.location.href = webUrl+"page/center/userCenter.html?busId="+url_busId+"&userId="+url_userId;//登录后才可以评论
    }
}

function close() {
    layer.close(layer_comment);
}

//点击提交
function addCommentSubmit() {
    addFlash=true;
    var comment = $("#comment").val().trim();
    if(comment==""){
        layer.open({content: '评论不可以为空',skin: 'msg',time: 2}); //time:2秒后自动关闭
        return false;
    }

    //提交
    var param = {"courseId":courseId,"busId":url_busId,"userId":url_userId,"comment":comment};
    ajax_fetch("POST",paramMap.addCourseComments,param,function (result) {
        console.log(result);
        if(result.success){
            close();
            //评论成功
            layer.open({content: '评论成功',skin: 'msg',time: 2});
            initData(0);
        }else{
            //评论失败
            layer.open({content: '评论失败，请联系管理员',skin: 'msg',time: 2});
        }
    });
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}