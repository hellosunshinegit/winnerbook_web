//index首页数据
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var titleShare = "";
var desc = "";
/*导入尾部*/
var title = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("活动列表");

        titleBus("活动列表");

    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    initData(pageIndex);

});
function initData(index){
    var param = {"pageIndex":index,"busId":url_busId};
    ajax_fetch("POST",paramMap.getActivitys,param,function (result) {
        if(result.success){
            console.log(result.data);
            //拼接书单列表
            var activityStr = "";
            var titleStrShare = "";
            $.each(result.data.list,function (index, item) {
                if(item.img!=""){
                    item.img = baseUrl+getMinImg(item.img);
                }else{
                    item.img = webUrl+"images/def_img0.png";
                }

                var titleStr = item.title;
                if(titleStr.length>26){
                    titleStr = item.title.substring(0,26)+"...";
                }

                var addressStr = item.address+"-"+item.detailAddress;
                if(addressStr.length>14){
                    addressStr = item.address.substring(0,14)+"...";
                }

                if(item.startDate==item.endDate){
                    var time = item.startDate+"<span class='week'>"+item.week+"</span>"+item.startDateTime+"-"+item.endDateTime;
                }else{
                    var time = item.startDate+" "+item.startDateTime+" - "+item.endDate+" "+item.endDateTime;
                }

                var isClick = "class='aui-flex b-line'";
                var titleInvalid = "";
                if(item.isInvalid=="1"){//1已失效   0为正常
                    isClick = "class='aui-flex b-line invalid'";
                    titleInvalid = "invalid-title";
                }

                activityStr+="<div "+isClick+" onclick='getDetail("+item.id+")'> " +
                    " <div class='aui-course-img'> " +
                    "  <img src='"+item.img+"' alt=''> " +
                    " </div> " +
                    " <div class='aui-flex-box'> " +
                    "  <span class='aui_title "+titleInvalid+"'>"+titleStr+"</span> " +
                    "  <span class='aui_address'>"+addressStr+"</span> " +
                    "  <span class='aui_time'>"+time+"</span> " +
                    " </div> " +
                    "</div>";

                //分享时使用
                if(index!=0){
                    titleStrShare += " | ";
                }
                titleStrShare += titleStr;

            });
            if(result.data.count>(pageIndex+1)*10){
                activityStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(activityStr.length>0){
                activityStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                activityStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#activityList").append(activityStr);

            //设置分享内容
            titleShare = "活动列表";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(result.data.count>0){
                imgUrl = result.data.list[0].img;
            }
            desc = titleStrShare;
            setWxConfig(titleShare,link,imgUrl,desc);

        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}

function getDetail(id){
    window.location.href = webUrl+"page/activity/activityDetail.html?busId="+url_busId+"&userId="+url_userId+"&id="+id;
}


//点击分享
function shareWbPage() {
    shareWb(titleShare,desc);
}