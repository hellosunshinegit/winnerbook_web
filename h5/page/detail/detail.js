/*导入尾部*/
var title = "";
var desc = "";
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("详情页");
    });
    if(getSessionBusId()!=""){
        titleBus("详情");
    }

    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });
    //index首页数据
    initData();

});
function initData(){
    var id = RequestUrl(location.search,"id");//articleId
    var list_type = RequestUrl(location.search,"list_type");//articleId
    //获取首页数据
    var param = {"id":id,"list_type":list_type};
    ajax_fetch("POST",paramMap.getDetail,param,function (result) {
        if(result.success){
            var info = result.data;
            console.log(info);
            if(list_type=="1"){
                if(info.title==""){
                    $("#title").html("《"+info.bookListName+"》的读后感");
                }else{
                    $("#title").html(info.title);
                }
                $("#course_name").html("<a style='text-decoration: underline;' href='javascript:bookDetail(" + info.bookListId + ")''>"+info.bookListName+"</a>");
            }else{
                $("#title").html(info.title);
            }
            $("#date").html(info.createDate);
            $("#content").html(info.detail);

            //设置分享内容
            title = $("#title").html();
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";

            if(info.img!=""){
                if(list_type=="2" || list_type=="3"){
                    imgUrl = baseUrl+getMinImg(info.img);
                }else{
                    imgUrl = baseUrl+info.img;
                }
            }
            desc = info.detail.replace(/<[^>]+>/g,"");
            setWxConfig(title,link,imgUrl,desc);
        }

    });
}

//点击分享
function shareWbPage() {
    shareWb(title,desc);
}