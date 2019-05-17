var pageIndex = 0;
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("更多...");

        if(getSessionBusId()!=""){
            $("#title_bus").html(getSession().busName+"-"+$("#title_bus").html());
        }

        var title = $("#title_bus").html();
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
        var desc = "总裁读书会-企业读书云平台-更多信息在这里哦。";
        setWxConfig(title,link,imgUrl,desc);

    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    /*导入尾部*/
    initData(pageIndex);

});

var find = RequestUrl(location.search,"find");
console.log("find_type",find);

function initData(index){
    //获取首页数据
    var param = {"pageIndex":index};
    ajax_fetch("POST",paramMap.getBlocks,param,function (result) {
            console.log(result);
            if(result.success) {

                var bannerList = result.data.bannerList;//banner图
                //拼接banner图
                var bannerStr = "";
                if(bannerList.length>0){
                    $.each(bannerList,function (index, item) {
                        item.bannerUrl = baseUrl+item.bannerUrl;
                        bannerStr+="<div class='slider-item'><a href='javascript:;'><img alt='' src='"+item.bannerUrl+"'></a></div>";
                    });
                }else{//设置缺省图片
                    bannerStr+="<div class='slider-item'><a href='javascript:;'><img src='"+webUrl+"images/banner_def.png'></a></div>";
                    bannerStr+="<div class='slider-item'><a href='javascript:;'><img src='"+webUrl+"images/banner_def.png'></a></div>";
                    bannerStr+="<div class='slider-item'><a href='javascript:;'><img src='"+webUrl+"images/banner_def.png'></a></div>";
                }
                $("#bannerDiv").html(bannerStr);


                //拼接视频列表
                var moreStr = "";
                if (result.data.blockList.length > 0) {
                    $.each(result.data.blockList, function (index, item) {
                        item.blockImgUrl = baseUrl + item.blockImgUrl;

                        moreStr += "<a href='javascript:articleList(" + item.blockId + ");' class='aui-palace-grid' about=''>" +
                            "<div class='aui-palace-grid-icon'>" +
                            "<img src='" + item.blockImgUrl + "' alt=''>" +
                            "</div>" +
                            "<div class='aui-palace-grid-text'>" +
                            "<h2>" + item.blockName + "</h2>" +
                            "</div>" +
                            "</a>";
                    });
                } else {
                    moreStr = "<span class='more_end'>暂无数据...</span>";
                }
                $("#blockDiv").append(moreStr);
            }

    });
}

function articleList(blockId) {//根据模板查询对应的list
    window.location.href=webUrl+"page/more/articleList.html?blockId="+blockId;
}


//点击课程列表
function getCoursesList_find(){
    window.location.href=webUrl+'page/list/courseList.html?find=1'
}

//点击导师
function getGuestList_find(){
    window.location.href=webUrl+'page/list/mainGuestList.html?find=1'
}

//点击书单列表
function getBookList_find() {
    window.location.href=webUrl+'page/list/bookTypeList.html?find=1'
}
//点击视频列表
function getVideoList_find() {
    window.location.href=webUrl+'page/list/videoList.html?find=1'
}
//点击看读后感
function getReadThoughtList_find() {
    window.location.href=webUrl+'page/list/list.html?list_type=1&find=1';
}
//点击企业风采
function getNewsList_find() {
    window.location.href=webUrl+'page/list/list.html?list_type=2&find=1'
}
//点击读书会
function getReadClubList_find() {
    window.location.href=webUrl+'page/list/list.html?list_type=3&find=1';
}