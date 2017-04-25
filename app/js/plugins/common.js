// JavaScript Document


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
function httpRequestPost(url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall) {
    ajaxType == "POST"? "POST" :ajaxType;
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
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                //ajaxTimeoutTest.abort();
                //layer.msg("请求超时");
                console.log("请求超时");
            }
        }
    })
}
function httpRequestPostAsync(url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall) {
    ajaxType == "POST"? "POST" :ajaxType;
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
        async:false,
        type: "POST", //HTTP请求类型
        timeout: 10000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            falCallback(xhr, type, errorThrown);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                //ajaxTimeoutTest.abort();
                //layer.msg("请求超时");
                console.log("请求超时");
            }
        }
    })
}

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
function setCookie(name,value,time)
{
    //if(time){
    //    var strsec = getsec(time);
    //    var exp = new Date();
    //    exp.setTime(exp.getTime() + strsec*1);
    //}
    document.cookie = name + "="+ escape (value)
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function getsec(str)
{
    alert(str);
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
////这是有设定过期时间的使用示例：
////s20是代表20秒
////h是指小时，如12小时则是：h12
////d是天数，30天则：d30
////setCookie("name","hayden","s20");
//
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    //var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

    //tianjia   type
function milesAdd(item,arr,type){
    //验证  0  验证重复    1  不验证重复
    if(type){
        arr.push(item)
    }else{
        if(arr.indexOf(item)==-1){
            arr.push(item)
        }
    }
};
function milesRemove(item,arr){
    arr.remove(item)
}
/**
 * 为空判断 包括空字符串及回车换行符
 * @param value
 */
function nullCheck(value){
    if(value==null){
        return false;
    }
    if(value==""){
        return false;
    }
    if(value==undefined){
        return false;
    }
    var result = value.replace(/[ \r\n]/g,"");
    if(result==""){
        return false;
    }
    return true;
}
/**
 * 长度检测 包括边界
 * @param value
 * @param min
 * @param max
 */
function lengthCheck(value,min,max){
    if(nullCheck(value)==false){
        return false;
    }
    if(value.length<min){
        return false;
    }
    if(value.length>max){
        return false;
    }
    return true;
}
/**
 * 字符串截取
 * @param value
 * @param limit
 * @param tail
 * @returns {*}
 */
function subStringWithTail(value,limit,tail){
    if(nullCheck(value)==false){
        return "";
    }
    if(value.length<=limit){
        return value;
    }
    if(value.length>limit){
        return value.substring(0,limit)+tail;
    }
}
/**
 * 数组内容重复检测
 * @param arr
 * @returns {boolean}
 */
function arrayRepeatCheck(arr){
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]])
            return false;
        hash[arr[i]] = false;
    }
    return true;
}

	
	
	
	