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
        var list_type = RequestUrl(location.search,"list_type");
        if(list_type=="1"){
            title = "读后感列表";
            if(getSessionBusId()!="" && getSession().busName!=undefined){
                $("#typeTitle").html(getSession().busName+"-"+"读后感");
            }else{
                $("#typeTitle").html("企业读书云平台-读后感");
            }
        }else if(list_type=="2"){
            title = "企业风采列表";
            if(getSessionBusId()!="" && getSession().busName!=undefined){
                $("#typeTitle").html(getSession().busName+"-"+"企业风采");
            }else{
                $("#typeTitle").html("企业读书云平台-企业风采");
            }
        }else if(list_type=="3"){
            title = "读书会活动列表";
            if(getSessionBusId()!="" && getSession().busName!=undefined){
                $("#typeTitle").html(getSession().busName+"-"+"读书会活动");
            }else{
                $("#typeTitle").html("企业读书云平台-读书会活动");
            }
        }
        $("#center_title").html(title);

    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    initData(pageIndex);

});
function initData(index){
    //获取首页数据
    var busId;
    var find = RequestUrl(location.search,"find");
    if(find==1){//点击发现，直接读取的是demo的数据
        busId = "";
    }else{
        busId = url_busId;
    }
    var list_type = RequestUrl(location.search,"list_type");
    var param = {"pageIndex":index,"list_type":list_type,"busId":busId};
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
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+titleStr+"</span>" +
                    /*"<span class='aui_date'>"+item.createDate+"</span>" +*/
                    "</div>" +
                    "<div class='aui-course-img'>" +
                    "<img src='"+item.img+"' alt=''>" +
                    "</div>" +
                    "</a>";


                //分享时使用
                if(index!=0){
                    titleStrShare += " | ";
                }
                titleStrShare += titleStr;

            });
            if(result.data.count>(pageIndex+1)*10){
                readBookCludStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(readBookCludStr.length>0){
                readBookCludStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                readBookCludStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#readBookClubList").append(readBookCludStr);

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
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}

function getDetail(id,list_type){
    window.location.href = webUrl+"page/detail/detail.html?busId="+url_busId+"&userId="+url_userId+"&id="+id+"&list_type="+list_type;
}


//点击分享
function shareWbPage() {
    shareWb(titleShare,desc);
}