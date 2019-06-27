//index首页数据
var pageIndex_0 = 0;
var pageIndex_1 = 0;
var pageIndex_2 = 0;
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");
var title = "";
var desc = "";
/*导入尾部*/
$(function(){
    $(".header").load("../common/header.html",function (result) {
        $("#center_title").html("老板荐书");

        titleBus("老板荐书");
    });
    $(".footer").load("../common/footer.html",function (result) {
        selectBottom();
    });

    initData(pageIndex_0);
});

var labelNameMap = [];

//企业书单
function initData(index){
    var busId;
    var find = RequestUrl(location.search,"find");
    if(find==1){//点击发现，直接读取的是demo的数据
        busId = "";
    }else{
        busId = url_busId;
    }
    var param = {"pageIndex":index,"busId":busId,"userId":url_userId};
    console.log(param);
    ajax_fetch("POST",paramMap.getBooks,param,function (result) {
        if(result.success){

            //显示标签
            var labelStr = "";

            if(url_busId!=""){
                labelStr += "<li id='li_"+parseInt(result.data.labelList.length)+"'><a href='#tabs-0' title=''>企业书单</a></li>";
            }

            $.each(result.data.labelList,function (index, item) {
                labelNameMap[item.labelId] = item.labelName;
                labelStr +="<li id='li_"+index+"'><a href='#tabs-"+(index+1)+"' title='' onclick='bookTypeList(\""+item.labelId+"\",0,\""+(index+1)+"\")'>"+item.labelName+"</a></li>";
            });

            $("#labelDiv").html(labelStr);

            //li的宽度自定义
            $.each($("[id=labelDiv] li"),function (index, item) {
                $("#li_"+index).css("width",Math.floor(100/($("[id=labelDiv] li").length)-1)+"%");
            });

            //数据加载完成之后运行js  tab的样式
            $('#tabs').tabulous({
                effect: 'scale'
            });

            //如果标签存在，则默认读取第一个显示
            if(result.data.labelList.length>0){
                bookTypeList(result.data.labelList[0].labelId,pageIndex_1,1);
                $.each($("[id^='tabs-']"),function (index, item) {
                    $("#tabs-"+index).css("display","none");
                });
                if(url_busId!="") {
                    $("#"+$("[id^='tabs-']")[0].id).css("display","");
                }else{
                    $("#"+$("[id^='tabs-']")[1].id).css("display","");

                }
            }
            //企业自己的书单
            if(url_busId!="") {
                busBookList(pageIndex_0);
            }
        }

    });
}

//点击更多
function clickMore_bus(){
    $("#more_01").remove();
    pageIndex_0 = pageIndex_0+1;
    busBookList(pageIndex_0);
}

//点击更多  还得修改
function clickMore_01(labelId){
    $("#more_1").remove();
    pageIndex_1 = pageIndex_1+1
    bookTypeList(labelId,pageIndex_1,1,"more");
}

function clickMore_02(labelId){
    $("#more_2").remove();
    pageIndex_2 = pageIndex_2+1;
    bookTypeList(labelId,pageIndex_2,2,"more");
}

function bookDetail(bookId,bluId) {
    window.location.href = webUrl+"page/detail/bookDetail.html?busId="+url_busId+"&userId="+url_userId+"&bookId="+bookId+"&bluId="+bluId;
}

//企业书单分页
function busBookList(index) {
    var busId;
    var find = RequestUrl(location.search,"find");
    if(find==1){//点击发现，直接读取的是demo的数据
        busId = "";
    }else{
        busId = url_busId;
    }
    var param = {"pageIndex":index,"busId":busId,"userId":url_userId};//查询企业书单
    ajax_fetch("POST",paramMap.getBusBookTypeLists,param,function (result) {
        console.log(result.data);
        if (result.success) {
            var bookTypeStr = "";
            var bookTypeName = "";//分享时使用
            $.each(result.data.bookBusListType,function (index, item) {
                if(item.typeImg!="" && item.typeImg!=undefined){
                    item.typeImg = baseUrl+getMinImg(item.typeImg);
                }else{
                    var imgUrl = "1";
                    if(index%2==0){
                        imgUrl="0";
                    }
                    item.typeImg = webUrl+"images/def_img"+imgUrl+".png";
                }
                var typeNameStr = item.typeName != undefined ? item.typeName : "";
                if (typeNameStr.length > 30) {
                    typeNameStr = item.typeName.substring(0, 30) + "...";
                }
                bookTypeStr+="<a href='javascript:bookListFun("+item.typeId+");' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>"+typeNameStr+"</span>" +
                    "</div>" +
                    "<div class='aui-course-img'>" +
                    "<img src='"+item.typeImg+"' alt=''>" +
                    "</div>" +
                    "</a>";

                //分享时使用
                if(index!=0){
                    bookTypeName += " | ";
                }
                bookTypeName += item.typeName;

            });

            if(result.data.isDefaultBookList>0){
                var imgUrl =  webUrl+"images/def_img0.png";
                bookTypeStr+="<a href='javascript:bookListFun(0);' class='aui-flex b-line' about=''>" +
                    "<div class='aui-flex-box'>" +
                    "<span class='aui_title'>企业全员书单</span>" +
                    "</div>" +
                    "<div class='aui-course-img'>" +
                    "<img src='"+imgUrl+"' alt=''>" +
                    "</div>" +
                    "</a>";
            }

            if(result.data.bookBusListCount>(pageIndex_0 + 1)*10){
                bookTypeStr+="<span class='more' id='more_"+index+"' onclick='clickMore_bus()'>点击更多...</span>";
            }else if(bookTypeStr.length>0){
                bookTypeStr+="<span class='more_end'>我是有底线的...</span>";
            }else{
                bookTypeStr+="<span class='more_end'>暂无数据...</span>";
            }
            $("#tabs-0").append(bookTypeStr);


            //设置分享内容
            title = "企业书单";
            var link = location.href.split('#')[0];
            var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
            if(result.data.bookBusListType.length>0){
                imgUrl = result.data.bookBusListType[0].typeImg;
            }
            desc = bookTypeName;
            setWxConfig(title,link,imgUrl,desc);
        }
    });

}



//点击切换
function bookTypeList(labelId,pageIndex,index,type) {

    //根据labelId查询书单列表
    var param = {"pageIndex":pageIndex,"busId":url_busId,"labelId":labelId};
    ajax_fetch("POST",paramMap.getBookTypeLists,param,function (result) {
        var bookTypeStr = "";
        var bookTypeName = "";//分享时使用
        $.each(result.data.bookListType,function (index, item) {
            if(item.typeImg!=""){
                item.typeImg = baseUrl+getMinImg(item.typeImg);
            }else{
                var imgUrl = "1";
                if(index%2==0){
                    imgUrl="0";
                }
                item.typeImg = webUrl+"images/def_img"+imgUrl+".png";
            }
            var typeNameStr = item.typeName != undefined ? item.typeName : "";
            if (typeNameStr.length > 30) {
                typeNameStr = item.typeName.substring(0, 30) + "...";
            }
            bookTypeStr+="<a href='javascript:bookListFun("+item.typeId+");' class='aui-flex b-line' about=''>" +
                "<div class='aui-flex-box'>" +
                "<span class='aui_title'>"+typeNameStr+"</span>" +
                "</div>" +
                "<div class='aui-course-img'>" +
                "<img src='"+item.typeImg+"' alt=''>" +
                "</div>" +
                "</a>";

            //分享时使用
            if(index!=0){
                bookTypeName += " | ";
            }
            bookTypeName += item.typeName;

        });

        var funName = "";
        var page = 0;
        if(index==1){
            funName = "clickMore_01("+labelId+")";
            page = pageIndex_1+1;
        }else if(index==2){
            funName = "clickMore_02("+labelId+")";
            page = pageIndex_2+1;
        }

        if(result.data.bookListCount>page*10){
            bookTypeStr+="<span class='more' id='more_"+index+"' onclick='"+funName+"'>点击更多...</span>";
        }else if(bookTypeStr.length>0){
            bookTypeStr+="<span class='more_end'>我是有底线的...</span>";
        }else{
            bookTypeStr+="<span class='more_end'>暂无数据...</span>";
        }
        if(type=="more"){
            $("#tabs-"+index).append(bookTypeStr);
        }else{
            $("#tabs-"+index).html(bookTypeStr);
        }


        //设置分享内容
        title = labelNameMap[labelId];
        var link = location.href.split('#')[0];
        var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
        if(result.data.bookListType.length>0){
            imgUrl = result.data.bookListType[0].typeImg;
        }
        desc = bookTypeName;
        setWxConfig(title,link,imgUrl,desc);

    });

}


function bookListFun(typeId) {
    window.location.href = webUrl+"page/list/bookList.html?busId="+url_busId+"&userId="+url_userId+"&typeId="+typeId;
}

//点击分享
function shareWbPage() {
    shareWb(title+"-"+desc);
}