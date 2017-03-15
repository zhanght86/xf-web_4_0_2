///**
// * Created by Administrator on 2017/3/13.
// */
//
////url 地址
////data  参数
////callback 回调
////请求方式
////needToken   true  false
//
////var Authorization = getCookie("Authorization");
//
function httpRequest(url, data, sucCallBack,falCallback, needToken, ajaxType) {
    ajaxType == "post"? "post" :ajaxType;
    //if(ajaxType === "post"){
    //阻塞线程  ie8 不支持
    //    jQuery.support.cors = true;
    //}
    //转换字符
    //if (typeof(data) == 'string') {
    //    data = JSON.parse(data);
    //}
    data = JSON.stringify(data);
    //验证是否需要加token
    var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    //设置默认需要  tooken
    if (!needToken) {
        //header.Authorization = getToken();
    }
    $.ajax(url, {
        dataType: 'json', //服务器返回json格式数据
        type: "POST", //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            falCallback(xhr, type, errorThrown);
        }
    })
};
//// tooken 获取
//function getToken() {
//    if () {
//        var user =;
//
//        return user.Token;
//    } else {
//        //这里应该是从webapp中获取token
//        return
//    }
//};
//// ****************************************   cookie   ****************************//
//
////JS操作cookies方法!
////写cookies
//function setCookie(name,value,time)
//{
//    var strsec = getsec(time);
//    var exp = new Date();
//    exp.setTime(exp.getTime() + strsec*1);
//    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
//}
//function getsec(str)
//{
//    alert(str);
//    var str1=str.substring(1,str.length)*1;
//    var str2=str.substring(0,1);
//    if (str2=="s")
//    {
//        return str1*1000;
//    }
//    else if (str2=="h")
//    {
//        return str1*60*60*1000;
//    }
//    else if (str2=="d")
//    {
//        return str1*24*60*60*1000;
//    }
//}
////这是有设定过期时间的使用示例：
////s20是代表20秒
////h是指小时，如12小时则是：h12
////d是天数，30天则：d30
////setCookie("name","hayden","s20");
//
////删除cookie
////function delCookie(name)
////{
////    var exp = new Date();
////    exp.setTime(exp.getTime() - 1);
////    //var cval=getCookie(name);
////    if(cval!=null)
////        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
////}
export default {httpRequest};