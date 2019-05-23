/*导入尾部*/
var pageIndex = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
$(function(){
    $(".header").load("../../../common/header.html",function (result) {
        $("#center_title").html("企业排名");

        //设置分享内容
        title = "企业排名";
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/rank_share.png";
        desc = "快来看看你的排名在哪里？";
        setWxConfig(title,link,imgUrl,desc);
    });
    $(".footer").load("../../../common/footer.html",function (result) {
        selectBottom();
    });
    if(getSessionBusId()!=""){
        titleBus("企业排名");
    }

    initData(pageIndex);
});

function initData(pageIndex) {
    var param = {"pageIndex":pageIndex,"busId":url_busId,"userId":url_userId};
    ajax_fetch("POST",paramMap.getBusRanks,param,function (result) {
        if(result.success){
            console.log(result.data);
            //当前登录人的排名和分值
            var userRank = result.data.userRank;

            $("#currentUser").html("我的排名：<span class='rank_title'>"+userRank.rank+"</span>，分值<span class='rank_order'>"+userRank.sumScore+"</span>");

            var busRankList = result.data.busRank.busRankList;

            var resultStr = "";
            $.each(busRankList,function (index, item) {
                var colorStr = "rank_score";
                if(index>2){
                    colorStr = "rank_score icolor";
                }

                var rankStr = "<span class='nomedal'>"+item.rank+"</span><span class='nomedal_name'>"+item.userName+"</span>";
                if(item.rank==1 ||item.rank==2 ||item.rank==3){
                    rankStr = "<span class='rank_number'>"+getMedal(item.rank,item.rank)+"</span><span class='rank_name'>"+item.userName+"</span>";
                }

                resultStr+="<li><div class='one_li bus'>"+rankStr+"<span class='"+colorStr+"'>"+item.sumScore+"</span></div></li>";
            });

            if (result.data.busRank.busRanksCount > (pageIndex + 1) * 10) {
                resultStr += "<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            } else if (resultStr.length > 0) {
                resultStr += "<span class='more_end'>我是有底线的...</span>";
            } else {
                resultStr += "<span class='more_end'>暂无数据...</span>";
            }
            $("#busRankList").append(resultStr);
        }
    });
}


function pageDate(pageIndex) {
    var param = {"pageIndex":pageIndex,"busId":url_busId,"userId":url_userId};
    ajax_fetch("POST",paramMap.getBusRanks,param,function (result) {
        if(result.success){
            console.log(result.data);
            var busRankList = result.data.busRank.busRankList;

            var resultStr = "";
            $.each(busRankList,function (index, item) {
                var colorStr = "rank_score";
                var rankStr = "<span class='nomedal'>"+(parseInt(item.rank)+parseInt(pageIndex*10))+"</span><span class='nomedal_name'>"+item.userName+"</span>";
                resultStr+="<li><div class='one_li bus'>"+rankStr+"<span class='"+colorStr+"'>"+item.sumScore+"</span></div></li>";
            });

            if (result.data.busRank.busRanksCount > (pageIndex + 1) * 10) {
                resultStr += "<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            } else if (resultStr.length > 0) {
                resultStr += "<span class='more_end'>我是有底线的...</span>";
            } else {
                resultStr += "<span class='more_end'>暂无数据...</span>";
            }
            $("#busRankList").append(resultStr);
        }
    });
}




function clickMore() {
    $("#more").remove();
    pageIndex = pageIndex+1;
    pageDate(pageIndex);
}

function getMedal(rankStr,rank) {
    if(rank==1){
        rankStr = "<img src='../../../../images/gold_medal.png'>";
    }else if(rank==2){
        rankStr = "<img src='../../../../images/silver_medal.png'>";
    }else if(rank==3){
        rankStr = "<img src='../../../../images/bronze_medal.png'>";
    }
    return rankStr;
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}