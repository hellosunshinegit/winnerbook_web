/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("申请成为企业管理员");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    titleBus("申请成为企业管理员");

    initData();

    //设置分享内容
    title = "申请成为企业管理员";
    var link = location.href.split('#')[0];
    var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
    desc = "快来尝尝鲜";
    setWxConfig(title,link,imgUrl,desc);

});

//根据id查询name
function initData() {
    var param = {"userId":url_userId};
    ajax_fetch("POST",paramMap.isApplyBusAdmin,param,function (result) {
        if(result.success){
            var info = result.data;
            console.log(info);
            if(info!=null){
                //展示信息
                $("#applyBusName").val(info.applyBusName);
                $("#applyBusDes").val(info.applyBusDes);
                $("#status").html(info.status=="0"?"已申请":info.status==1?"申请通过":"申请拒绝");
                $("#applyCreate").html(info.createDate);
                if(info.statusReason!=undefined){
                    $("#statusReason_tr").css("display","");
                    $("#statusReason").html(info.statusReason);
                }

                if(info.status=="1"){
                    $("#notice_tr").css("display","");
                }

                $("#applyBusName").attr("disabled","true");
                $("#applyBusDes").attr("disabled","true");
                $("#applyInfo").css("display","");
                $("#submitBtn").css("display","none");
                $("#title").css("display","none");
                $("#title_success").css("display","");
            }
        }
    });
}

//点击提交
function applySubmitFun() {
    var applyBusName = $("#applyBusName").val().trim();
    var applyBusDes = $("#applyBusDes").val().trim();

    if(applyBusName==""){
        layerMsg("请输入企业名称");
        return false;
    }
    var layerLoading = layer.open({type: 2,shadeClose: false,content: '提交中...'});
    var param = {"userId":url_userId,"busId":url_busId,"applyBusName":applyBusName,"applyBusDes":applyBusDes};
    ajax_fetch("POST",paramMap.applyBusAdmin,param,function (result) {
        layer.close(layerLoading);
        if(result.success){
            layer.open({
                content: '申请提交成功，我们会在1-3个工作日内给你答复，谢谢！',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
            initData();
        }else{
            layerMsg(result.msg);
        }
    });

}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}