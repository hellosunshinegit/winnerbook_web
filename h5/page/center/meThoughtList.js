//index首页数据
var pageIndex = 0;
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("我的读后感");

    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    if(getSessionBusId()!=""){
        titleBus("我的读后感");
    }
    initData(pageIndex);

});
function initData(index){
    //获取首页数据
    var param = {"pageIndex":index,"userId":RequestUrl(location.search,"userId")};
    ajax_fetch("POST",paramMap.getReadThoughtUsers,param,function (result) {
        console.log(result);
        if(result.success){

            //拼接书单列表
            var readBookCludStr = "";
            var readStr = ""
            $.each(result.data.readThoughtList,function (index, item) {
                item.img = baseUrl+item.img;

                var titleStr = item.title;
                if(titleStr==""){
                    titleStr="'"+item.courseName+"'的读后感";
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
            $("#readThoughtList").append(readBookCludStr);

            //设置分享内容
            var title = "我的读后感";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            var desc = "我的读后感";
            if(readStr.length>0){
                desc = readStr;
                imgUrl = result.data.readThoughtList[0].img;
            }
            console.log(desc);
            setWxConfig(title,link,imgUrl,desc);
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
    window.location.href = webUrl+"page/detail/detail.html?id="+id+"&list_type="+list_type;
}