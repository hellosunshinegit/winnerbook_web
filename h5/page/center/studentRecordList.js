var busId = RequestUrl(location.search,"busId");
var userId = RequestUrl(location.search,"userId");
var busId_session = RequestUrl(location.search,"busId_session");
var userId_session = RequestUrl(location.search,"userId_session");
var pageIndex = 0;
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("我的学习记录");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    titleBus("我的学习记录");

    initData(pageIndex);

});
function initData(index){
    //获取首页数据
    var param = {"pageIndex":index,"busId":busId_session,"userId":userId_session};
    ajax_fetch("POST",paramMap.getStudentRecords,param,function (result) {
            if(result.success){

            //拼接视频列表
            var newsStr = "";
            $.each(result.data.studentRecordList,function (index, item) {

                var courseNameStr = item.courseName;
                if(courseNameStr.length>12){
                    courseNameStr = item.courseName.substring(0,12)+"...";
                }

                var isStr = "正在观看";
                if(item.isEnd=="1"){
                    isStr = "完成观看";
                }

                var recordDes = item.recordDes;
                console.log(item);
                if(item.recordType=="3" && item.courseFileName!="" && item.courseFileName!=undefined){
                    recordDes = item.courseFileName+"："+recordDes;
                }

                var timeStr = "";
                console.log(item.totalTime);
                if(item.totalTime!=""){
                    timeStr = "视频时长："+item.totalTime+"；";
                }

                newsStr+="<a href='javascript:courseDetail("+item.courseId+");' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+courseNameStr+"<span class='status_css'>"+isStr+"</span></span>" +
                    "<span class='aui_source'>" +
                    "<span class='desc_css'>"+timeStr+recordDes+"</span>" +
                    "<span class='date_css'>"+item.createDate+"</span>" +
                    "</span>"+
                    "</div></a>";
            });
            if(result.data.studentRecordCount>(pageIndex+1)*10){
                newsStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(newsStr.length>0){
                newsStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                newsStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#newsList").append(newsStr);


            //设置分享内容
            title = "我的学习记录";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            desc = "快来看看自己今天又涨了哪些知识吧。";
            if(result.data.studentRecordList.length>0){
                desc = result.data.studentRecordList[0].recordDes;
            }
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


//点击分享
function shareWbPage() {
    shareWb(title+"-"+desc);
}