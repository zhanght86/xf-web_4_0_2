/**
 * @Author : MILES .
 * @Create : 2017/9/20.
 * @Module : Ajax
 */
var ajax = {
    xmlHttp : '',
    url:'',
    data:'',
    xmlHttpCreate : function() {
        var xmlHttp;
        try {
            xmlHttp = new XMLHttpRequest;// ff opera
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");// ie
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {

                }
            }
        }
        return xmlHttp;
    },
    post:function(jsonObj){
        ajax.data = JSON.stringify(jsonObj.data);
        ajax.url = jsonObj.url;
        //创建XMLHttp对象，打开链接、请求、响应
        ajax.xmlHttp = ajax.xmlHttpCreate();
        ajax.xmlHttp.open("post",ajax.url,true);
        ajax.xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        ajax.xmlHttp.onreadystatechange = function(){
            if(ajax.xmlHttp.readyState == 4){
                if(ajax.xmlHttp.status == 200){
                    jsonObj.success(JSON.parse(ajax.xmlHttp.responseText));
                }else{
                    jsonObj.error(ajax.xmlHttp.responseText);
                }
            }
        } ;
        ajax.xmlHttp.send(ajax.data);
    }
};
/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
//function ajax(opt) {
//    opt = opt || {};
//    opt.method = opt.method.toUpperCase() || 'POST';
//    opt.url = opt.url || '';
//    opt.async = opt.async || true;
//    opt.data = opt.data || null;
//    opt.success = opt.success || function () {};
//    var xmlHttp = null;
//    if (XMLHttpRequest) {
//        xmlHttp = new XMLHttpRequest();
//    }
//    else {
//        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
//    }var params = [];
//    for (var key in opt.data){
//        params.push(key + '=' + opt.data[key]);
//    }
//    var postData = params.join('&');
//    if (opt.method.toUpperCase() === 'POST') {
//        xmlHttp.open(opt.method, opt.url, opt.async);
//        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;application/json;charset=utf-8');
//        xmlHttp.send(postData);
//    }
//    else if (opt.method.toUpperCase() === 'GET') {
//        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
//        xmlHttp.send(null);
//    }
//    xmlHttp.onreadystatechange = function () {
//        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//            opt.success(xmlHttp.responseText);
//        }
//    };
//}