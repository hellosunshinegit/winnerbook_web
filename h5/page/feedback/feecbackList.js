var pageIndex = 0;
var url_userId = RequestUrl(location.search,"userId");
var url_busId = RequestUrl(location.search,"busId");
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("我的反馈");
        $("#shareBtn").css("display","none");
    });

    titleBus("我的反馈");

    initData(pageIndex);

});

var courseId = "";
var addFlash = false;
function initData(index){
    //获取首页数据
    var param = {"userId":url_userId,"pageIndex":index};
    ajax_fetch("POST",paramMap.getFeedbacks,param,function (result) {
            console.log(result);
            if(result.success){

            var title = $("#title_bus").html();
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            var desc = result.data.feedbackList[0].remarks;
            setWxConfig(title,link,imgUrl,desc);

            //拼接视频列表
            var newsStr = "";
            $.each(result.data.feedbackList,function (index, item) {

                newsStr+="<div class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+item.createUserName+"</span></span>" +
                    "<span class='date_css'>"+item.createDate+"</span>" +
                    "<span class='aui_source'>" +
                    "<span class='desc_css'>"+item.remarks+"</span>" +
                    "</span>"+
                    "</div></div>";
            });
            if(result.data.feedbackCount>(pageIndex+1)*10){
                newsStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more_end'>暂无数据...</span>";
            }
            if(addFlash){
                $("#feedbackList").html(newsStr);
            }else{
                $("#feedbackList").append(newsStr);
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

var addFeedback = "<div>" +
    "    <div class='close_div'>" +
    "        <a href='javascript:close()'>关闭</a>" +
    "    </div>" +
    "    <div>" +
    "        <textarea placeholder='留下您宝贵的意见，我们会继续改进的。' class='textarea_css' id='comment'></textarea>" +
    "        <div class='button_div'><input type='button' value='发送' class='button_css' onclick='addFeedbackSubmit()'/></div>" +
    "    </div>" +
    "</div>";

var layer_comment;
//点击添加评论
function addFeedbackFun() {
    console.log(courseId);
    if(getSessionUserId()!=""){
        layer_comment = layer.open({
            type: 1
            ,content: addFeedback
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
function addFeedbackSubmit() {
    addFlash=true;
    var remarks = $("#comment").val().trim();
    if(remarks==""){
        layer.open({content: '反馈意见不可以为空',skin: 'msg',time: 2}); //time:2秒后自动关闭
        return false;
    }

    //提交
    var param = {"userId":url_userId,"remarks":remarks};
    ajax_fetch("POST",paramMap.addFeedback,param,function (result) {
        console.log(result);
        if(result.success){
            close();
            //评论成功
            layer.open({content: '反馈成功',skin: 'msg',time: 2});
            initData(0);
        }else{
            //评论失败
            layer.open({content: '反馈失败，请联系管理员',skin: 'msg',time: 2});
        }
    });
}