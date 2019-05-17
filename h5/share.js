$(function(){
    ajax_fetch("POST","getWxInfo.jhtml",{"localUrl":location.href.split('#')[0]},function (result) {
        if(result.success){
            var wxInfo = result.data;
            //signature   通过获取公众号的id及secret获取access_token,然后通过access_token获取jsapi_ticket，然后通过时间戳，随机串，当前页面url，通过sha1加密生成；
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxInfo.appId, // 必填，公众号的唯一标识
                timestamp:wxInfo.timestamp , // 必填，生成签名的时间戳
                nonceStr: wxInfo.nonceStr, // 必填，生成签名的随机串
                signature: wxInfo.signature,// 必填，签名
                /*jsApiList: [
                    'checkJsApi',
                    'updateAppMessageShareData',//分享给朋友/qq空间  1.4.0
                    'updateTimelineShareData',//分享朋友圈
                    'onMenuShareWeibo',//分享到腾讯微博
                ]*/
                jsApiList: [ // 1.2.0的 即将废弃
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone'
                ] // 必填，需要使用的JS接口列表
            });

            wx.ready(function () {
                alert("配置准备完成");

                //分享页面自定义标题，描述，链接，图片
                var shareTitle = "我来测试下转发---";
                var lineLink = "http://ent.winnerbook.cn/mobile/";
                var imgUrl = "http://ent.winnerbook.cn/mobile/images/logo_share.png";
                var descContent = "总裁读书会，中国首创CEO实战商学院";

                var shareData = {title: shareTitle, // 分享标题
                    desc: descContent, // 分享描述
                    link: lineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                alert("error："+res);
                console.log('error',res);
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        }
    });
});


