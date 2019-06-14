/*导入尾部*/
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var busId_session = RequestUrl(location.search,"busId_session");
var userId_session = RequestUrl(location.search,"userId_session");
var userId_param = RequestUrl(location.search,"userId_param");
var pageIndex = 0;
var title = "";
var desc = "";
$(function(){
    $(".header").load("../../common/header.html",function (result) {

        titleBus("学习报告");

        //设置分享内容
        title = "学习报告";
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/line_share.png";
        desc = "学赶紧看看我的的排名吧。";
        setWxConfig(title,link,imgUrl,desc);
    });
    $(".footer").load("../../common/footer.html",function (result) {
        selectBottom();
    });

    myReportFun();

});

//我的报告
function myReportFun(){
    var param = {"userId":userId_param,"type":"1"};
    ajax_fetch("POST",paramMap.getMyReports,param,function (result) {
        if(result.success){
            console.log(result.data);

            $("#center_title").html(((result.data.userName!="" && result.data.userName!=undefined)?result.data.userName:"")+"学习报告");
            $("#rankInfo").html(getTab0());
            setReportValue(result.data,"");
        }
    });
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

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}