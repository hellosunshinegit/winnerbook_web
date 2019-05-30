/*导入尾部*/
var busId = RequestUrl(location.search,"busId");
var userId = RequestUrl(location.search,"userId");
$(function(){
    $(".footer").load(webUrl +"page/common/footer.html",function (result) {
        selectBottom();
    });

    console.log(getSession());

    titleBus("个人中心");
    var sessionUser = localStorage.getItem("sessionUser");
    if(sessionUser==null){
        window.location.href = webUrl+"page/center/login.html?busId="+busId+"&userId="+userId;
    }
    $("#sessionUser").html(JSON.parse(sessionUser).userUnitName);

    //如果不是企业管理员，则显示申请企业管理员图标
    if(getSession().isBusinessAdmin!="1"){
        $("#applyBusAdmin").css("display","");
    }

});

//我的读后感
function myReadThoughtFun() {
    window.location.href = webUrl+"page/center/meThoughtList.html?busId="+busId+"&userId="+userId;
}

//我的学习计划
function myStudentRecord() {
    window.location.href = webUrl+"page/center/studentRecordList.html?busId="+busId+"&userId="+userId;
}

//我的评论
function myComment() {
    window.location.href = webUrl+"page/center/my_commentList.html?busId="+busId+"&userId="+userId;
}


var layer_argee = "";
//点击查看注册协议
function myAgree() {
    $("#agree_html").load("argee.html",function (result) {
        layer_argee = layer.open({
            type: 1
            ,content: result
            ,anim: 'up'
            ,style: 'position:fixed; bottom:10%; top:10%;left:2%; width: 92%; height: auto; padding:0.5rem; border:none;overflow-y: auto;'
        });
    });
}


//点击我知道了
function my_knowFun() {
    layer.close(layer_argee);
}


//意见反馈
function feedback() {
    window.location.href = webUrl+"page/feedback/feedbackList.html?busId="+busId+"&userId="+userId;
}

//点击学习报告
function myReport() {
    window.location.href = webUrl+"page/center/report/report.html?busId="+busId+"&userId="+userId;
}

//我的活动报名
function myActivitySignup() {
    window.location.href = webUrl+"page/center/signupList.html?busId="+busId+"&userId="+userId;

}

//申请成为企业管理员
function applyBusAdmin() {
    window.location.href = webUrl+"page/center/applyBusAdmin.html?busId="+busId+"&userId="+userId;
}

//退出登录
function quitLogin() {
    localStorage.removeItem("sessionUser");
    window.location.href = webUrl+"page/center/login.html"
}