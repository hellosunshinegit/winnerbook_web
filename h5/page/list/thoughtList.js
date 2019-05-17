var pageIndex = 0;
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        console.log(result);
        $("#center_title").html("读后感");
    });
    $(".footer").load("../common/footer.html");
    initData(pageIndex);
});
function initData(index){
    //获取首页数据
    var param = {"pageIndex":index,"busId":getSessionBusId()};
    ajax_fetch("POST",paramMap.getThoughts,param,function (result) {
            if(result.success){

            //拼接视频列表
            var thouoghtStr = "";
            $.each(result.data.readThoughtList,function (index, item) {

                var thoughtDesStr = item.thoughtDes;
                if(thoughtDesStr.length>15){
                    thoughtDesStr = item.thoughtDes.substring(0,15)+"...";
                }

                var courseNameStr = item.courseName;
                if(courseNameStr.length>19){
                    courseNameStr = item.courseName.substring(0,19)+"...";
                }

                thouoghtStr+="<a href='javascript:;' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+thoughtDesStr+"</span>" +
                    "<span class='aui_source'>来源："+courseNameStr+"</span>" +
                    "<span class='point'></span>"+
                    "</div></a>";
            });
            if(result.data.readThoughtCount>(pageIndex+1)*10){
                thouoghtStr+="<span class='more' id='more' onclick='clickMore()'>点击更多...</span>";
            }else if(thouoghtStr.length>0){
                thouoghtStr+="<span class='more'>我是有底线的...</span>";
            }else{
                thouoghtStr+="<span class='more'>暂无数据...</span>";
            }
            $("#thoughtList").append(thouoghtStr);
        }

    });
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex);
}
