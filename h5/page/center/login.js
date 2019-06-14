/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("个人中心-登录");
        $("#shareBtn").css("display","none");
    });
    $(".footer").load(webUrl +"page/common/footer.html",function (result) {
        selectBottom();
    });

    titleBus("登录");

    //键盘收起手动滑到顶部 针对ios的手机
    document.body.addEventListener('focusout', function () {
        window.scrollTo(0,0);
    });

    //判断如果已经登录上，则直接跳转到个人中心
    if(getSession()!="" && getSession()!=null){
        window.location.href = webUrl+"page/center/userCenter.html?busId="+url_busId+"&userId="+url_userId;
    }

});

var layer_bus = "";

/*登录*/
function webLogin() {

    console.log("登录。。。");
    var username = $("#username").val();
    var password = $("#password").val();

    //选中的checkbox
    var selectUser = $("#selectUserData").val();
    console.log(selectUser);


    if(username==""){
        layerMsg("手机号不能为空");
        return false;
    }

    //手机号校验
    var myreg=/^[1]\d{10}$/;
    if (!myreg.test(username)) {
        layerMsg("手机号格式不正确");
        return false;
    }

    if(password==""){
        layerMsg("密码不可以为空");
        return false;
    }

    //提示同意某些协议后的登录 is_agree
    var agree = $('input[name="is_agree"]:checked').val();
    if(agree!=1){
        layerMsg("同意此协议后才可以登录");
    }else{
        var param = {"busId":url_busId,"username":username,"password":password,"selectUser":selectUser};
        ajax_fetch("POST",paramMap.getLogin,param,function (result) {
            console.log(result);
            if(result.success){
                console.log("验证成功");
                layerMsg("登录成功，正在跳转...");
                footerClick("me");
                localStorage.setItem("sessionUser",JSON.stringify(result.data));
                //登陆成功后，返回上一个页面
                if(document.referrer!=""){
                    window.location.href = beforeParamValue(document.referrer,result.data.belongBusUserId,result.data.userId);
                }else{
                    window.location.href = webUrl+"index.html?busId="+result.data.belongBusUserId+"&userId="+result.data.userId;
                }
            }else{
                /*$("#error_info").html(result.msg);*/
                layerMsg(result.msg);
                layer.close(layer_bus);

                $.each($("[id^=bus_]"),function (index, item) {
                    item.checked = false;
                });

                if(result.data!=undefined && result.data!=null){

                    var str = "";
                    $.each(result.data,function(index,item){
                        str+="<li style='line-height: 2.5rem;width: 100%;text-align: left;'><span onclick='checkRadio(\""+item.busId+"\")' id='a_"+item.busId+"' class='unselect' title='"+item.userId+"-"+item.busId+"'><span>"+item.busName+"</span></span></li>";
                    });

                    var selBusHtml = "<div id='log_window' style='margin: 0;padding: 8px 7px;'><input type='hidden' id='selectUserData'/>" +
                        "    <div >" +
                        "        <div>" +
                        "            <span>请选择所属企业</span>" +
                        "            <span style='font-weight: normal;font-size: 14px;margin-left: 1rem;'>（<span id='tel'>"+username+"</span>）</span>\n" +
                        "        </div>" +
                        "        <div>" +
                        "            <ul id='selUser' style='float: left;'>" +str+
                        "            </ul>" +
                        "        </div>" +
                        "    </div>" +
                        "</div>"

                    layer_bus = layer.open({
                        content: selBusHtml
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            var selectUser = $("#selectUserData").val();
                            console.log(selectUser);
                            if(selectUser!=undefined && selectUser!=''){
                                webLogin();
                            }else{
                                layerMsg("请选择企业");
                            }
                        },
                        anim: 'up',
                        style: 'position:fixed; bottom:0; left:0; width: 100%;border:none;border-radius: 1.5rem;z-index:100;',
                        shadeClose:false
                    });

                }
            }
        });
    }
}

//点击选中按钮
function checkRadio(value) {
    $.each($("[id^=a_]"),function (index, item) {
        if("a_"+value==item.id){
            item.className = "select";
            $("#selectUserData").val(item.title);
        }else{
            item.className = "unselect";
        }
    });
}

var layer_argee = "";
function showAgree() {
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

//截取参数并重新赋值
function beforeParamValue(beforeUrl,busId,userId) {
    var paramMap = beforeUrl.substring(beforeUrl.indexOf("?")+1,beforeUrl.length);
    var arrayParam = paramMap.split("&");
    var mapParam = {};
    $.each(arrayParam,function (index, item) {
        mapParam[item.split("=")[0]]=item.split("=")[1]==undefined?"":item.split("=")[1];
    });
    mapParam["busId"] = busId;
    mapParam["userId"] = userId;
    var param = "";
    var mapIndex=0;
    for(var prop in mapParam){
        if(mapParam.hasOwnProperty(prop)){
            mapIndex++;
            if(mapIndex!=1){
                param+="&";
            }
            if(mapIndex==1 && mapParam[prop]==""){
                param+=prop+"?"+mapParam[prop];
            }else{
                param+=prop+"="+mapParam[prop];
            }
        }
    }
    var newUrl = beforeUrl.substring(0,beforeUrl.indexOf("?")+1)+param;
    return newUrl;
}