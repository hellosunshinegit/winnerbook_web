var pageIndex_activity = 0;
var pageIndex_busNew = 0;
var pageIndex_readClub = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var titleShare = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("告知栏");
        titleBus("学习课程");
    });
    $(".footer").load("../common/footer.html");

    //数据加载完成之后运行js  tab的样式
    $('#tabs').tabulous({
        effect: 'scale'
    });
    $.each($("[id^='tabs-']"),function (index, item) {
        $("#tabs-"+index).css("display","none");
    });
    $("#"+$("[id^='tabs-']")[0].id).css("display","");

    initData(pageIndex_activity);
});

function initData(index){
    activityData(index);
}

//获取活动的列表
function activityData(index,type){
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

                activityStr+="<div "+isClick+" onclick='getActivityDetail("+item.id+")'> " +
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
            if(result.data.count>(pageIndex_activity+1)*10){
                activityStr+="<span class='more' id='more_activity' onclick='clickMore_activity()'>点击更多...</span>";
            }else if(activityStr.length>0){
                activityStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                activityStr+="<span class='more_end'>暂无数据...</span>";
            }

            if(type=="more"){
                $("#tabs-0").append(activityStr);
            }else{
                $("#tabs-0").html(activityStr);
            }

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

//企业风采和读书会活动
function clubBusList(list_type,type) {
    var index = 0;
    var title = "";
    if(list_type==2){
        index = pageIndex_busNew;
        title = "企业风采列表";
    }else{
        index = pageIndex_readClub;
        title = "读书会活动列表";
    }
    var param = {"pageIndex":index,"list_type":list_type,"busId":url_busId};
    ajax_fetch("POST",paramMap.getList,param,function (result) {
        console.log(result);
        if(result.success){

            //拼接书单列表
            var readBookCludStr = "";
            var titleStrShare = "";
            $.each(result.data.list,function (index, item) {
                if(item.img!=""){
                    if((list_type=="2" ||list_type=="3")){
                        item.img = baseUrl+getMinImg(item.img);
                    }else{
                        item.img = baseUrl+item.img;
                    }
                }else{
                    item.img = webUrl+"images/def_img.png";
                }

                var titleStr = item.title;

                if(titleStr=="" && list_type==1){
                    titleStr = "《"+item.bookName+"》的读后感";
                }else{
                    if(titleStr.length>26){
                        titleStr = item.title.substring(0,26)+"...";
                    }
                }

                readBookCludStr+="<a href='javascript:getDetail("+item.id+","+list_type+");' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box_new'>" +
                    "<span class='aui_title_new'>"+titleStr+"</span>" +
                    /*"<span class='aui_date'>"+item.createDate+"</span>" +*/
                    "</div>" +
                    "<div class='aui-course-img_new'>" +
                    "<img src='"+item.img+"' alt=''>" +
                    "</div>" +
                    "</a>";


                //分享时使用
                if(index!=0){
                    titleStrShare += " | ";
                }
                titleStrShare += titleStr;

            });

            var pageIndex = 0;
            var onclickFun = "";
            if(list_type==2){
                pageIndex = pageIndex_busNew;
                onclickFun = "clickMore_busNew()";
            }else{
                pageIndex = pageIndex_readClub;
                onclickFun = "clickMore_readClub()";
            }

            if(result.data.count>(pageIndex+1)*10){
                readBookCludStr+="<span class='more' id='more' onclick='"+onclickFun+"'>点击更多...</span>";
            }else if(readBookCludStr.length>0){
                readBookCludStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                readBookCludStr+="<span class='more_end'>暂无数据...</span>";
            }

            if(list_type==2){
                if(type=="more"){
                    $("#tabs-1").append(readBookCludStr);
                }else{
                    $("#tabs-1").html(readBookCludStr);
                }
            }else{
                if(type=="more"){
                    $("#tabs-2").append(readBookCludStr);
                }else{
                    $("#tabs-2").html(readBookCludStr);
                }
            }

            //设置分享内容
            titleShare = title;
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
function clickMore_activity(){
    $("#more_activity").remove();
    pageIndex = pageIndex_activity+1;
    activityData(pageIndex,"more");
}

function clickMore_busNew(){
    $("#more").remove();
    pageIndex = pageIndex_busNew+1;
    activityData(pageIndex,"more");
}

function clickMore_readClub(){
    $("#more").remove();
    pageIndex = pageIndex_readClub+1;
    activityData(pageIndex,"more");
}

function getActivityDetail(id){
    window.location.href = webUrl+"page/activity/activityDetail.html?busId="+url_busId+"&userId="+url_userId+"&id="+id;
}


//点击分享
function shareWbPage() {
    shareWb(titleShare,desc);
}

function getDetail(id,list_type){
    window.location.href = webUrl+"page/detail/detail.html?busId="+url_busId+"&userId="+url_userId+"&id="+id+"&list_type="+list_type;
}