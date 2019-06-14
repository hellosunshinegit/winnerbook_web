var baseUrl="http://192.168.1.153:8080/";
var webUrl="http://192.168.1.153:8081/winnerbook_web/h5/";

var paramMap = {
    "getLogin":"getLogin.jhtml",//登录
    "index":"index_h5.jhtml",//首页信息
    "getCourses":"getCourses.jhtml",//课程列表
    "getMainGuests":"getMainGuests.jhtml",//导师列表
    "getBooks":"getBooks.jhtml",//书单列表
    "getVideos":"getVideos.jhtml",//视频清单
    /*"getThoughts":"getThoughts.jhtml",//读后感
    "getNews":"getNews.jhtml",//企业风采*/
    "getList":"getList.jhtml",//读书会活动
    "getBlocks":"getBlocks.jhtml",//读取模块
    "getArticles":"getArticles.jhtml",//根据模块id读取文章
    "getArticleDetail":"getArticleDetail.jhtml",//文章详情
    "getCourseDetail":"getCourseDetail.jhtml",//课程详情
    "getBookDetail":"getBookDetail.jhtml",//书单详情
    "getDetail":"getDetail.jhtml",//详情
    /*"getLabelBookLists":"getLabelBookLists.jhtml",//获取书单标签列表*/
    "getBookTypeLists":"getBookTypeLists.jhtml",//获取标签下书单
    "getBookLists":"getBookLists.jhtml",//获取书单下的书籍
    "getReadThoughtUsers":"getReadThoughtUsers.jhtml",//我的读后感
    "getStudentRecords":"getStudentRecords.jhtml",//我的学习计划
    "addStudentRecord":"addStudentRecord.jhtml",//记录学习时长
    "getCourseComments":"getCourseComments.jhtml",//获取评论列表
    "addCourseComments":"addCourseComments.jhtml",//添加评论
    /*"getBusBooks":"getBusBooks.jhtml",//获取企业自己的书籍*/
    "getFeedbacks":"getFeedbacks.jhtml",//反馈列表
    "addFeedback":"addFeedback.jhtml",//添加反馈信息
    "getMyReports":"getMyReports.jhtml",//获取我的报告
    "getBusRanks":"getBusRanks.jhtml",//获取我的报告
    "getAllReports":"getAllReports.jhtml",//获取全局排名
    "getWxInfo":"getWxInfo.jhtml",//获取微信分享的信息
    "getActivitys":"getActivitys.jhtml",//获取活动信息
    "getActivityDetail":"getActivityDetail.jhtml",//获取活动信息
    "activitySignUpSubmit":"activitySignUpSubmit.jhtml",//报名提交
    "activitySignUps":"activitySignUps.jhtml",//报名列表
    "getBusInfo":"getBusInfo.jhtml",//根据企业id获取企业信息
    "isApplyBusAdmin":"isApplyBusAdmin.jhtml",//查询是否已经申请企业管理员
    "applyBusAdmin":"applyBusAdmin.jhtml",//申请提交
    "getBusBookTypeLists":"getBusBookTypeLists.jhtml",//获取企业书单
    "getCourseTypes":"getCourseTypes.jhtml",//获取课程类型
    "getTopArticles":"getTopArticles.jhtml",//获取发现中的最新文章
    "getAdminCourseTypes":"getAdminCourseTypes.jhtml",//获取admin课程类型 课程超市
    "getAdminCourses":"getAdminCourses.jhtml",//获取课程 课程超市
    "getCourseTypeLabels":"getCourseTypeLabels.jhtml",//获取课程类型的标签 课程超市
    "addReadThought":"addReadThought.jhtml"//获取课程类型的标签 课程超市
};
var layerLoading = null;
function ajax_fetch(type,url,param,callback) {
    $.getScript(webUrl+"js/layer.js",function (result) {
        param = param!=null?param:{};
        var result = {};
        var timeout = setTimeout(showLoading, 2000);
        $.ajax({  //jsonp  只支持get请求，不支持post请求，坑。。。。
            type:'GET',
            async: true,//异步
            dataType:"jsonp",//主要用于解决Ajax的跨域请求问题  对应的后台也要有callback返回才可以，不然就走error了
            contentType : "application/json;charset=utf-8",//必须要设置contentType，不然后台接收不到json数据格式，并且是乱码
            data:param,
            //crossDomain: true,
            jsonp:"callback",
            url:baseUrl+url,
            success:function(data){
                clearTimeout(timeout);
                layer.close(layerLoading);//关闭指定层
                result = data;
                return callback(result);
            },
            error:function (data) {
                console.log("error",data);
                //提示
                layer.close(layerLoading);//关闭指定层
                layer.open({
                    content: '信息获取失败，请刷新页面重新获取'
                    ,skin: 'msg'
                    ,time: 2 //2秒后自动关闭
                });
                clearTimeout(timeout);
            }
        });
    });
}

cnzzWrite();

//向所有的网站写入统计代码
//<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1277707952'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s23.cnzz.com/z_stat.php%3Fid%3D1277707952%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));</script>
function cnzzWrite() {
    document.write("<script type=\"text/javascript\">var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \"https://\" : \"http://\");document.write(unescape(\"%3Cspan style='display:none' id='cnzz_stat_icon_1277707952'%3E%3C/span%3E%3Cscript src='\" + cnzz_protocol + \"s23.cnzz.com/z_stat.php%3Fid%3D1277707952%26show%3Dpic' type='text/javascript'%3E%3C/script%3E\"));</script>")
}

function showLoading() {
    console.log("loading.....");
    layerLoading = layer.open({type: 2,shadeClose: false,content: '加载中...'});
}

//点击更多
function clickMore(){
    $("#more").remove();
    pageIndex = pageIndex+1;
    initData(pageIndex+1);
}
var url_busId = RequestUrl(location.search,"busId");
var url_userId = RequestUrl(location.search,"userId");

//点击课程列表
function getCoursesList(){
    window.location.href=webUrl+'page/list/courseList.html?busId='+url_busId+"&userId="+url_userId;
}

//点击导师
function getGuestList(){
    window.location.href=webUrl+'page/list/mainGuestList.html?busId='+url_busId+"&userId="+url_userId;
}

//点击书单列表
function getBookList() {
    window.location.href=webUrl+'page/list/bookTypeList.html?busId='+url_busId+"&userId="+url_userId;
}
//点击视频列表
function getVideoList() {
    window.location.href=webUrl+'page/list/videoList.html?busId='+url_busId+"&userId="+url_userId;
}
//点击看读后感
function getReadThoughtList() {
    window.location.href=webUrl+'page/list/list.html?list_type=1&busId='+url_busId+"&userId="+url_userId;
}
//点击企业风采
function getNewsList() {
    window.location.href=webUrl+'page/list/list.html?list_type=2&busId='+url_busId+"&userId="+url_userId;
}
//点击读书会
function getReadClubList() {
    window.location.href=webUrl+'page/list/list.html?list_type=3&busId='+url_busId+"&userId="+url_userId;
}

//课程详情
function courseDetail(courseId,type){
    window.location.href=webUrl+"page/detail/courseDetail.html?busId="+url_busId+"&userId="+url_userId+"&courseId="+courseId+"&type="+type;
}

function login_bus(){
    //查询localStorage中是否已经登录，没有登录，则登录
    sessionStorage.setItem("selectClass","me");
    var sessionUser = localStorage.getItem("sessionUser");
    var jsonUser = JSON.parse(sessionUser);
    console.log(jsonUser);
    if(sessionUser!=null){
        window.location.href = webUrl+"page/center/userCenter.html?busId="+url_busId+"&userId="+url_userId+"&busId_session="+jsonUser.belongBusUserId+"&userId_session="+jsonUser.userId;
    }else{
        window.location.href = webUrl+"page/center/login.html?busId="+url_busId+"&userId="+url_userId;
    }
}

function getSession() {
    var sessionUser = localStorage.getItem("sessionUser");
    if(sessionUser!=null){
        return JSON.parse(sessionUser);
    }else{
        return "";
    }
}



//获取localStorage中登录的个人id
function getSessionUserId() {
    var sessionUser = localStorage.getItem("sessionUser");
    if(sessionUser!=null){
        return JSON.parse(sessionUser).userId;
    }else{
        return "";
    }
}

//获取企业id
function getSessionBusId() {
    var sessionUser = localStorage.getItem("sessionUser");
    if(sessionUser!=null){
        return JSON.parse(sessionUser).belongBusUserId;
    }else{
        return "";
    }
}

function bookDetail(bookId) {
    window.location.href = webUrl+"page/detail/bookDetail.html?busId="+url_busId+"&userId="+url_userId+"&bookId="+bookId;
}

//获取小图片
function getMinImg(imgurl){
    var minImgUrl = "";
    if(imgurl!=undefined && imgurl!="" && imgurl.lastIndexOf(".")>=0){
        minImgUrl = imgurl.substring(0,imgurl.indexOf("."))+"_min"+imgurl.substring(imgurl.lastIndexOf("."), imgurl.length);
    }
    return minImgUrl;
}

//获取传递的值
function RequestUrl(url,strName) {
    var strHref = url;
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var arrTmp = strRight.split("&");
    for(var i = 0; i < arrTmp.length; i++)
    {
        var arrTemp = arrTmp[i ].split("=");
        if(decodeURIComponent(arrTemp[0]).toUpperCase() == strName.toUpperCase())
            return decodeURIComponent(arrTemp[1]);
    }
    return "";
}



//点击底部
function footerClick(value) {
    sessionStorage.setItem("selectClass",value);
}


function selectBottom() {
    if(sessionStorage.getItem("selectClass")==null){
        $("[class=nav_bottom] a")[0].classList.add("now");
    }else{
        $.each($("[class=nav_bottom] a"), function (index, item) {//底部选中效果
            if (item.className.indexOf(sessionStorage.getItem("selectClass")) >= 0) {
                item.classList.add("now");
            } else {
                item.classList = item.classList[0];
            }
        });
    }
}

function titleBus() {
    $("#title_bus").html("总裁读书会企业读书云平台");
}

//通过config接口注入权限验证配置
function setWxConfig(title,link,imgUrl,desc) {
    ajax_fetch("POST",paramMap.getWxInfo,{"localUrl":link},function (result) {
        if(result.success){
            var wxInfo = result.data;
            //signature   通过获取公众号的id及secret获取access_token,然后通过access_token获取jsapi_ticket，然后通过时间戳，随机串，当前页面url，通过sha1加密生成；
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxInfo.appId, // 必填，公众号的唯一标识
                timestamp:wxInfo.timestamp , // 必填，生成签名的时间戳
                nonceStr: wxInfo.nonceStr, // 必填，生成签名的随机串
                signature: wxInfo.signature,// 必填，签名
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表
            });

            wx.ready(function() {
                //alert("微信准备成功");

                var shareData = {
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        /*console.log("分享朋友圈成功");
                        alert("分享朋友圈成功");*/
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        //console.log("分享朋友圈取消");
                    }
                };

                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareQQ(shareData);
                wx.onMenuShareWeibo(shareData);
                wx.onMenuShareQZone(shareData);
            });

            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                console.log(res);
            });
        }
    });
}

//简单弹框
function layerMsg(str) {
    layer.open({
        content: str
        ,skin: 'msg'
        ,time: 3 //3秒后自动关闭
    });
}

//点击分享微博
function shareWb(title,desc) {//&pic="+pic+"
    var url = location.href.split('#')[0];
    var shareTitle = title;
    if(desc!=""){
        shareTitle+="%0A"+desc;
    }
    window.open("https://service.weibo.com/share/share.php?url="+webUrl+"&title="+shareTitle+"&type=button&language=zh_cn&appkey=3416615626&searchPic=false&style=simple")
}

//根据企业id查询企业信息
function getBusInfo(busId,callback) {
    if(busId!="" && busId!=null){
        ajax_fetch("POST",paramMap.getBusInfo,{"busId":busId},function (result) {
            var busInfo = result.data;
            return callback(busInfo);
        });
    }else{
        callback("");
    }
}