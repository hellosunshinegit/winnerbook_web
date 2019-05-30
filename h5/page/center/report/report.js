/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var pageIndex = 0;
var title = "";
var desc = "";
$(function(){
    $(".header").load("../../common/header.html",function (result) {
        $("#center_title").html("我的学习报告");

        titleBus("我的学习报告");

        //设置分享内容
        title = "我的学习报告";
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/line_share.png";
        desc = "学习报告都图标展示了，赶紧看看自己的排名吧。";
        setWxConfig(title,link,imgUrl,desc);
    });
    $(".footer").load("../../common/footer.html",function (result) {
        selectBottom();
    });

    //页面切换
    $('#tabs').tabulous({
        effect: 'scale'
    });

    //显示第一个，其他隐藏
    $.each($("[id^='tabs-']"),function (index, item) {
        $("#tabs-"+index).css("display","none");
    });
    $("#"+$("[id^='tabs-']")[0].id).css("display","");

    myReportFun();

});

//我的报告
function myReportFun(){
    var param = {"userId":url_userId,"type":"1"};
    ajax_fetch("POST",paramMap.getMyReports,param,function (result) {
        if(result.success){
            console.log(result.data);
            /*tab0  我的报告...........*/
            $("#tabs-0").html(getTab0());
            setReportValue(result.data,"");
            /*tab0  我的报告...........*/
        }
    });
}


//企业的报告
function busReportFun() {
    var param = {"busId":url_busId,"type":"2"};
    ajax_fetch("POST",paramMap.getMyReports,param,function (result) {
        if(result.success){
            $("#tabs-1").html(getTab1());
            setReportValue(result.data,"_bus");
        }
    });
}

//点击个人排名
function clickRankFun() {
    window.location.href = webUrl+"page/center/report/rank/rankList.html?busId="+url_busId+"&userId="+url_userId;
}

//全局报告
function allReportFun() {
    allBusData(pageIndex);
}


//显示图
function showChars(idDom,name,type,xData,yData) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById(idDom));

    var option = {
        tooltip: { //点击上去之后显示的数据
            show: true
        },
        /*legend: {
            data:['销量']
        },*/
        grid:{x:40,y:25,x2:20,y2:40},//设置图表距离样式
        xAxis : [
            {
                type : 'category',
                data : xData,
                splitLine:{//去掉垂直竖线
                    show:false
                },
                //设置轴线的属性
                axisLine:{
                    lineStyle:{
                        color:'#33acee',
                        width:1.5,
                    }
                }/*, x轴字体颜色修改
                axisLabel:{
                    textStyle:{
                        color:'#33acee'
                    }
                }*/
            }
        ],
        yAxis : [
            {
                type : 'value',
                //设置轴线的属性
                axisLine:{
                    lineStyle:{
                        color:'#33acee',
                        width:1.5,
                    }
                }/*,
                axisLabel:{
                    textStyle:{
                        color:'#33acee'
                    }
                }*/
            }
        ],
        series : [
            {
                "name":name,
                "type":type,
                "data":yData
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
}

//拼接tab-0的div
function getTab0() {
    var str = "<div class='divHeight_top'></div><div class='report_content'>" +
        "<div>" +
        "  <div class='current_score'>当前学习力：<span class='studentScore' id='studentScore'>120</span> 卡</div>"+
        /*" <div class='divHeight'></div>" +*/
        "  <div class='total_record'>" +
        "   <div class='total' id='studentSecond'>120分钟</div>" +
        "   <div class='total_name'>学习总时间</div>" +
        "  </div>" +
        "  <div class='total_record'>" +
        "   <div class='total' id='readThougthCount'>20篇</div>" +
        "   <div class='total_name'>读后感总量</div>" +
        "  </div>" +
        "  <div class='total_record'>" +
        "   <div class='total' id='commentCount'>10条</div>" +
        "   <div class='total_name'>评论总量</div>" +
        "  </div>" +
        " </div>" +
        " <div class='divHeight'></div>" +
        " <div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/student_min.png'>近7天学习时长</span>" +
        "   <div class='e_chars' id='student_chars'></div>" +
        "  </div>" +
        "  <div class='divHeight'></div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/pen_write.png'>近7天读后感情况</span>" +
        "   <div class='e_chars' id='readThought_chars'></div>" +
        "  </div>" +
        "  <div class='divHeight'></div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/pen_write.png'>近7天发表评论情况</span>" +
        "   <div class='e_chars' id='comment_chars'></div>" +
        "  </div>" +
        " </div>" +
        "</div>"

    return str;
}


function getTab1() {
    var str = "<div class='divHeight_top'></div><div class='report_content'>" +
        "<div>" +
        "  <div class='current_score' style='text-align: -webkit-auto;'><span>当前企业学习力：<span class='studentScore' id='studentScore_bus'>120</span> 卡</span> <span class='bus_rank' onclick='clickRankFun()'><img src='../../../images/rank.png'>个人排名</span></div>"+
        "  <div class='total_record'>" +
        "   <div class='total' id='studentSecond_bus'>120分钟</div>" +
        "   <div class='total_name'>平均学习时间</div>" +
        "  </div>" +
        "  <div class='total_record'>" +
        "   <div class='total' id='readThougthCount_bus'>20篇</div>" +
        "   <div class='total_name'>读后感总量</div>" +
        "  </div>" +
        "  <div class='total_record'>" +
        "   <div class='total' id='commentCount_bus'>10条</div>" +
        "   <div class='total_name'>评论总量</div>" +
        "  </div>" +
        " </div>" +
        " <div class='divHeight'></div>" +
        " <div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/student_min.png'>近7天学习时长</span>" +
        "   <div class='e_chars' id='student_chars_bus'></div>" +
        "  </div>" +
        "  <div class='divHeight'></div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/pen_write.png'>近7天读后感情况</span>" +
        "   <div class='e_chars' id='readThought_chars_bus'></div>" +
        "  </div>" +
        "  <div class='divHeight'></div>" +
        "  <div>" +
        "   <span class='report_title'><img src='../../../images/pen_write.png'>近7天发表评论情况</span>" +
        "   <div class='e_chars' id='comment_chars_bus'></div>" +
        "  </div>" +
        " </div>" +
        "</div>"

    return str;
}


//tab2的dom
function getTab2() {
    var str = "<div class='divHeight_top'></div> " +
        "<ul class='rank_all_ul'> " +
        " <li><div class='myRank_title' id='currentBus'></div></li> " +
        "</ul> " +
        "<div class='divHeight'></div> " +
        "<div class='rank_list'> " +
        " <ul id='busRankList' class='rank_all_ul'> " +
        "   " +
        " </ul> " +
        "</div>"
    return str;
}



function setReportValue(dataResult,suffix) {
    console.log("dataResult",dataResult);
    //设置值
    $("#studentScore"+suffix).html(dataResult.totalMap.studentScore);
    $("#studentSecond"+suffix).html(dataResult.totalMap.studentSecond+"分钟");
    $("#readThougthCount"+suffix).html(dataResult.totalMap.readThougthCount+"篇");
    $("#commentCount"+suffix).html(dataResult.totalMap.commentCount+"条");

    //学习时长
    var studentXdata = [];
    var studentYdata = [];
    $.each(dataResult.studentMap,function (index, item) {
        studentXdata.push(item.date);
        studentYdata.push(item.studentSecond);
    });
    showChars("student_chars"+suffix,"学习时长","line",studentXdata,studentYdata);//line

    //读后感
    var readThougthXdata = [];
    var readThougthYdata = [];
    $.each(dataResult.readThougthMap,function (index, item) {
        readThougthXdata.push(item.date);
        readThougthYdata.push(item.readThoughtCount);
    });
    showChars("readThought_chars"+suffix,"读后感篇数","bar",readThougthXdata,readThougthYdata);//line

    //评论
    var courseCommentXdata = [];
    var courseCommentYdata = [];
    $.each(dataResult.courseCommentMap,function (index, item) {
        courseCommentXdata.push(item.date);
        courseCommentYdata.push(item.commentCount);
    });
    showChars("comment_chars"+suffix,"评论条数","bar",courseCommentXdata,courseCommentYdata);//line

}

//第三个tab的数据
function allBusData(pageIndex) {
    var param = {"pageIndex":pageIndex,"busId":url_busId};
    ajax_fetch("POST",paramMap.getAllReports,param,function (result) {
        if(result.success){
            console.log(result.data);

            $("#tabs-2").html(getTab2());

            var currentBus = result.data.currentBus;
            //获取当前企业的排名  currentUser currentBus.busName
            $("#currentBus").html("当前企业排名：<span class='rank_title'>"+(currentBus.rank!=undefined?currentBus.rank:"")+"</span>，分值：<span class='rank_order'>"+(currentBus.busScore!=undefined?currentBus.busScore:"")+"</span>");

            /*var busRankList = result.data.busRanks.allBusRankList;

            var resultStr = "";
            $.each(busRankList,function (index, item) {
                var colorStr = "rank_score";
                if(index>2){
                    colorStr = "rank_score icolor";
                }

                var rankStr = "<span class='nomedal'>"+item.rank+"</span><span class='nomedal_name'>"+item.busName+"</span>";
                if(item.rank==1 ||item.rank==2 ||item.rank==3){
                    rankStr = "<span class='rank_number'>"+getMedal(item.rank,item.rank)+"</span><span class='rank_name'>"+item.busName+"</span>";
                }

                resultStr+="<li><div class='one_li bus'>"+rankStr+"<span class='"+colorStr+"'>"+item.busScore+"</span></div></li>";
            });

            if (result.data.busRanks.allBusRanksCount > (pageIndex + 1) * 10) {
                resultStr += "<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            } else if (resultStr.length > 0) {
                resultStr += "<span class='more_end'>我是有底线的...</span>";
            } else {
                resultStr += "<span class='more_end'>暂无数据...</span>";
            }
            $("#busRankList").html(resultStr);*/
            $("#busRankList").html("<img src='"+webUrl+"images/login.jpg' width='100%'>");
        }
    });
}

function clickMore() {
    $("#more").remove();
    pageIndex = pageIndex+1;
    allBusData(pageIndex);
}

function getMedal(rankStr,rank) {
    if(rank==1){
        rankStr = "<img src='../../../images/gold_medal.png'>";
    }else if(rank==2){
        rankStr = "<img src='../../../images/silver_medal.png'>";
    }else if(rank==3){
        rankStr = "<img src='../../../images/bronze_medal.png'>";
    }
    return rankStr;
}


//点击分享
function shareWbPage() {
    shareWb(title,desc);
}