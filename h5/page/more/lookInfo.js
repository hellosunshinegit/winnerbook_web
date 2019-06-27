/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("企业全员阅读调查表");
        $("#indexPage").css("display","");
        $("#historyGo").css("display","none");
    });

    titleBus("申请成为企业管理员");

    initData();

    //设置分享内容
    title = "企业全员阅读调查问卷";
    var link = location.href.split('#')[0];
    var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
    desc = "如何成功打造学习型组织，持续提升企业员工知识和业务水平，从而在大变局中保持企业的核心竞争力，对于每家企业都至关重要。总裁读书会特发起此次调研。";
    setWxConfig(title,link,imgUrl,desc);

});

//根据id查询name
function initData() {
    var param = {};
    ajax_fetch("POST",paramMap.getCourseType,param,function (result) {
        if(result.success){
            var info = result.data;
            console.log(info);
            if(info!=null){
                var courseList = "";//课程包
                $.each(info.listMap,function (index, item) {
                    courseList+="<input type='checkbox' class='checkbox' name='courseList' value='"+item.typeId+"'/>&nbsp;"+item.typeName+"<br/>";
                });
                $("#courseListDiv").html(courseList);

                //学习计划
                var planStr = "";
                $.each(info.readBookPlanDicList,function (index, item) {
                    planStr+="<input type='radio' class='radio' name='readBookPlan' value='"+item.dicItemvalue+"' onclick='planFun(\""+item.dicItemvalue+"\")'/>&nbsp;&nbsp;"+item.dicItemname+"<br/>"
                });
                $("#readBookPlanDiv").html(planStr);
            }
        }
    });
}

//点击填写读书计划其他
function planFun(value) {
    if(value=="3"){
        $("#readBookPlanOtherDiv").css("display","");
    }else{
        $("#readBookPlanOtherDiv").css("display","none");
    }
}

//点击召开企业读书会
function readCludFun(type) {
    if(type==1){
        $("#isReadClud").css("display","");
    }else{
        $("#isReadClud").css("display","none");
    }
}

//点击提交
function applySubmitFun() {
    var busName = $("#busName").val().trim();//企业名称
    var bookListName = $("#bookListName").val().trim();//企业书单
    var courseTypes = "";//课程包
    $("input[name='courseList']:checkbox").each(function (index,item) {
        if (item.checked) {
            if(index!=0){
                courseTypes+=",";
            }
            courseTypes += item.value;
        }
    });
    var readBookPlan = $('input[name="readBookPlan"]:checked').val();//读书计划
    var readBookPlanOther = $("#readBookPlanOther").val().trim();
    var mustReadNum = $("#mustReadNum").val().trim();//1年必读几本
    var selectReadNum = $("#selectReadNum").val().trim();//1年选读几本
    var isReadThought = $('input[name="isReadThought"]:checked').val();//是否写读后感
    var isReadClud = $('input[name="isReadClud"]:checked').val();//是否召开读书会
    var longReadClud = $("#longReadClud").val().trim();//多久召开读书会
    var isShareWb = $('input[name="isShareWb"]:checked').val();//是否分享微博
    var isReadBook = $('input[name="isReadBook"]:checked').val();//企业家是否读书
    var isWriteBook = $('input[name="isWriteBook"]:checked').val();//企业家是否写书
    var isShareBook = $('input[name="isShareBook"]:checked').val();//企业家是否分享书
    var publicNum = $("#publicNum").val().trim();//公众号
    var homepageUrl = $("#homepageUrl").val();//公司主页
    var empNum = $("#empNum").val().trim();//公司员工数量
    var companyAddress = $("#companyAddress").val().trim();//公司地址
    var companyIndustry = $("#companyIndustry").val().trim();//公司所属行业
    var telphone = $("#telphone").val().trim();//联系电话
    var isUseBookYun = $('input[name="isUseBookYun"]:checked').val();//是否使用企业读书云


    if(busName==""){
        layerMsg("请输入企业名称");
        return false;
    }
    if(telphone==""){
        layerMsg("请输入联系电话");
        return false;
    }

    //验证联系电话是否正确
    var myreg=/^[1][0-9]{10}$/;
    console.log(myreg.test(telphone));
    if (!myreg.test(telphone)) {
        layerMsg("联系电话格式不正确");
        return false;
    }


    var layerLoading = layer.open({type: 2,shadeClose: false,content: '提交中...'});
    var param = {"busName":busName,"bookListName":bookListName,"courseTypes":courseTypes,"readBookPlan":readBookPlan,"readBookPlanOther":readBookPlanOther,"mustReadNum":mustReadNum,
    "selectReadNum":selectReadNum,"isReadThought":isReadThought,"isReadClud":isReadClud,"longReadClud":longReadClud,"isShareWb":isShareWb,
    "isReadBook":isReadBook,"isWriteBook":isWriteBook,"isShareBook":isShareBook,"publicNum":publicNum,"homepageUrl":homepageUrl,"empNum":empNum,
    "companyAddress":companyAddress,"companyIndustry":companyIndustry,"telphone":telphone,"isUseBookYun":isUseBookYun};
    console.log(param);
    ajax_fetch("POST",paramMap.addLookInfo,param,function (result) {
        layer.close(layerLoading);
        if(result.success){
            $("#busName").val("");
            $("#bookListName").val("");
            $("#telphone").val("");
            $("#publicNum").val("");
            $("#homepageUrl").val("");
            $("#empNum").val("");
            $("#companyAddress").val("");
            $("#companyIndustry").val("");
            layer.open({
                content: '提交成功，简单了解下企业读书云吗？'
                ,btn: ['可以', '不需要']
                ,yes: function(index){
                    window.location.href = webUrl;
                    layer.close(index);
                }
            });
        }else{
            layerMsg(result.msg);
        }
    });

}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}