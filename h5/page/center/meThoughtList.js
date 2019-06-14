var busId = RequestUrl(location.search,"busId");
var userId = RequestUrl(location.search,"userId");
var busId_session = RequestUrl(location.search,"busId_session");
var userId_session = RequestUrl(location.search,"userId_session");
//index首页数据
var pageIndex = 0;
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("我的读后感");
    });

    titleBus("我的读后感");
    initData(pageIndex);

});
function initData(index,moreType){
    //获取首页数据
    var param = {"pageIndex":index,"userId":userId_session};
    ajax_fetch("POST",paramMap.getReadThoughtUsers,param,function (result) {
        console.log(result);
        if(result.success){

            //拼接书单列表
            var readBookCludStr = "";
            var readStr = ""
            $.each(result.data.readThoughtList,function (index, item) {
                item.img = baseUrl+item.img;

                var titleStr = item.title;
                if(titleStr=="" || titleStr==undefined){
                    titleStr="《"+item.bookName+"》的读后感";
                }else if(titleStr.length>26){
                    titleStr = item.title.substring(0,26)+"...";
                }

                readBookCludStr+="<a href='javascript:getDetail("+item.id+",1);' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+titleStr+"</span>" +
                    "</div>" +
                    "<div class='aui-course-img'>" +
                    "<img src='"+item.img+"' alt=''>" +
                    "</div>" +
                    "</a>";

                if(index!=0){
                    readStr +=" | ";
                }
                readStr += titleStr;

            });
            if(result.data.readThoughtCount>(pageIndex+1)*10){
                readBookCludStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(readBookCludStr.length>0){
                readBookCludStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                readBookCludStr+="<span class='more_end'>暂无数据...</span>";
            }

            if(moreType=="more"){
                $("#readThoughtList").append(readBookCludStr);
            }else{
                $("#readThoughtList").html(readBookCludStr);
            }

            //设置分享内容
            title = "我的读后感";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            desc = "我的读后感";
            if(readStr.length>0){
                desc = readStr;
                imgUrl = result.data.readThoughtList[0].img;
            }
            setWxConfig(title,link,imgUrl,desc);
        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex,"more");
}

function getDetail(id,list_type){
    window.location.href = webUrl+"page/detail/detail.html?id="+id+"&list_type="+list_type+"&busId="+busId+"&userId="+userId+"&busId_session="+busId_session+"&userId_session="+userId_session;
}

//点击分享
function shareWbPage() {
    if(desc!=""){
        shareWb(title+"-"+desc);
    }else{
        shareWb(title);
    }
}




var addThought = "<div>" +
    "    <div class='close_div'>" +
    "        <a href='javascript:close()'>关闭</a>" +
    "    </div>" +
    "    <div style='margin-top: 1rem;float: left;'>" +
    "        <span class='bookListName'>书籍名称：<input type='text' class='inputBookName' id='bookListNameH5'/></span>"+
    "        <span class='isOpen'><input type='checkbox' value='1' name='isOpen' id='isOpen' class='openH5'/>&nbsp;&nbsp;是否公开</span>"+
    "        <textarea placeholder='我的想法...' class='textarea_css' id='thought'></textarea>" +
    "        <div class='button_div'><input type='button' value='发送' class='button_css' onclick='addThoughtSubmit()'/></div>" +
    "    </div>" +
    "</div>";

var layer_thought;
//点击添加读后感
function addThoughtFun() {
    if(getSessionUserId()!=""){
        layer_thought = layer.open({
            type: 1
            ,content: addThought
            ,anim: 'up'
            ,style: 'position:fixed; bottom:0; left:0; width: 100%; height: 300px; padding:10px 0; border:none;'
        });
        //获取焦点
        $("#bookListNameH5").focus();

    }else{
        sessionStorage.setItem("selectClass","me");
        window.location.href = webUrl+"page/center/userCenter.html?busId="+busId+"&userId="+userId+"&busId_session="+busId_session+"&userId_session="+userId_session;//登录后才可以发多后感
    }
}

function close() {
    layer.close(layer_thought);
}

//点击发送
function addThoughtSubmit() {
    var bookName = $("#bookListNameH5").val();
    var thought = $("#thought").val();
    var isOpen = $('input[name="isOpen"]:checked').val()==undefined?"0":"1";

    if(bookName==""){
        layerMsg("请输入书籍名称");
        return false;
    }
    if(thought==""){
        layerMsg("请输入您的想法");
        return false;
    }

    //提交
    var param = {"busId":url_busId,"userId":url_userId,"bookName":bookName,"thought":thought,"isOpen":isOpen};
    ajax_fetch("POST",paramMap.addReadThought,param,function (result) {
        console.log(result);
        if(result.success){
            close();
            //评论成功
            layer.open({content: '添加成功',skin: 'msg',time: 2});
            initData(0);
        }else{
            //评论失败
            layer.open({content: '添加失败，请联系管理员',skin: 'msg',time: 2});
        }
    });


}