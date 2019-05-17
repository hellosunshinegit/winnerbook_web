/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("个人中心-登录");
    });
    $(".footer").load(webUrl +"page/common/footer.html",function (result) {
        selectBottom();
    });
    if(getSessionBusId()!=""){
        $("#title_bus").html(getSession().busName!=undefined?getSession().busName+"-"+$("#title_bus").html():$("#title_bus").html());
    }

});

var layer_bus = "";

/*登录*/
function webLogin() {

    console.log("登录。。。");
    var username = $("#username").val();
    var password = $("#password").val();

    //选中的checkbox
    var selectUser = $('input[name="selectUserInput"]:checked').val();
    console.log(selectUser);


    if(username==""){
        $("#error_info").html("手机号不能为空");
        return false;
    }

    //手机号校验
    var myreg=/^[1]\d{10}$/;
    if (!myreg.test(username)) {
        $("#error_info").html("手机号格式不正确");
        return false;
    }

    if(password==""){
        $("#error_info").html("密码不可以为空");
        return false;
    }



    //提示同意某些协议后的登录 is_agree
    var agree = $('input[name="is_agree"]:checked').val();
    if(agree!=1){
        layer.open({
            content: '同意此协议后才可以登录'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
        });
    }else{
        var param = {"username":username,"password":password,"selectUser":selectUser};
        ajax_fetch("POST",paramMap.getLogin,param,function (result) {
            console.log(result);
            if(result.success){
                console.log("验证成功");
                footerClick("me");
                //sessionStorage.setItem("sessionUser",JSON.stringify(result.data));
                localStorage.setItem("sessionUser",JSON.stringify(result.data));
                //传值  belongBusUserId  userId都要传递
                window.location.href = webUrl+"index.html?busId="+result.data.belongBusUserId+"&userId="+result.data.userId;
            }else{
                $("#error_info").html(result.msg);
                layer.close(layer_bus);

                $.each($("[id^=bus_]"),function (index, item) {
                    item.checked = false;
                });

                if(result.data!=undefined && result.data!=null){

                    var str = "";
                    $.each(result.data,function(index,item){
                        str+="<li style='line-height: 2.5rem;width: 100%;'><a href='javascript:checkRadio(\""+item.busId+"\")'><input type='checkbox' name='selectUserInput' style='width: 16px;height: 16px;' id='bus_"+item.busId+"' value='"+item.userId+"-"+item.busId+"'/>&nbsp;&nbsp;<span>"+item.busName+"</span></a></li>";
                    });

                    var selBusHtml = "<div id='log_window' style='margin: 0;padding: 8px 7px;'>" +
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
                            var selectUser = $('input[name="selectUserInput"]:checked').val();
                            console.log(selectUser);
                            if(selectUser!=undefined){
                                webLogin();
                            }else{
                                layer.open({
                                    content: '请选择企业'
                                    ,skin: 'msg'
                                    ,time: 2 //2秒后自动关闭
                                });
                            }
                        },
                        style: 'bottom:10%; top:30%;left:0; width: 97%;border:none;border-radius: 1.5rem;'
                    });

                }
            }
        });
    }
}

//点击选中按钮
function checkRadio(value) {
    $.each($("[id^=bus_]"),function (index, item) {
        if("bus_"+value==item.id){
            item.checked = true;
        }else{
            item.checked = false;
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