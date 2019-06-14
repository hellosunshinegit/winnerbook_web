//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("课程超市");

        titleBus("课程超市");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData();

});

//获取课程类型标签
function initData() {
    ajax_fetch("POST",paramMap.getCourseTypeLabels,null,function (result) {
        if(result.success){
            var labelStr = "";
            var coursePackage = "";
            $.each(result.data,function (index,item){
                if(index==0){
                    labelStr+="<li class='active' onclick='getCourseType(\""+item.id+"\")'>"+item.name+"</li>";
                    coursePackage+="<section class='menu-right padding-all j-content'>" +
                        "<h5>"+item.name+"</h5>" +
                        "<ul id='courseTypeList_"+item.id+"'></ul>" +
                        "</section>"
                }else{
                    labelStr+="<li onclick='getCourseType(\""+item.id+"\")'>"+item.name+"</li>";
                    coursePackage+="<section class='menu-right padding-all j-content' style='display:none'>" +
                        "<h5>"+item.name+"</h5>" +
                        "<ul id='courseTypeList_"+item.id+"'></ul>" +
                        "</section>"
                }
            });
            $("#typeLabels").html(labelStr);
            $("#coursePackage").html(coursePackage);

            //点击切换
            $('#sidebar ul li').click(function(){
                $(this).addClass('active').siblings('li').removeClass('active');
                var index = $(this).index();
                $('.j-content').eq(index).show().siblings('.j-content').hide();
            });

            //默认请求显示第一个
            if(result.data.length>0){
                getCourseType(result.data[0].id);
            }
        }
    });
}


//获取课程类型
function getCourseType(typeLabelId){
    var param = {"busId":url_busId,"typeLabelId":typeLabelId};
    ajax_fetch("POST",paramMap.getAdminCourseTypes,param,function (result) {
        if(result.success){
            console.log(result.data);
            if(result.data.length>0){
                var courseTypeListStr = "";
                $.each(result.data,function (index,item) {
                    if(item.typeImg!=""){
                        item.typeImg = baseUrl+getMinImg(item.typeImg);
                    }else{
                        item.typeImg = webUrl+"images/def_img4.png";
                    }
                    var buyStr = "";
                    if(item.isBuy=="0"){
                        buyStr = "<span class='already_buy_identify'></span>";
                    }

                    courseTypeListStr+="<li class='w-3'><a href='javascript:getCourses("+item.typeId+")'></a> <img src='"+item.typeImg+"' /><span>"+item.typeName+"</span>"+buyStr+"</li>";
                });

                $("#courseTypeList_"+typeLabelId).html(courseTypeListStr);
            }
        }
    });
}

function getCourses(typeId) {
    window.location.href=webUrl+'page/list/courseSupermarketList.html?busId='+url_busId+"&userId="+url_userId+"&typeId="+typeId;
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}

function buyCourse() {
    layerMsg("请联系您的管理员进行统一购买");
}

//跳转到app课程
function courseBuy() {
    
}