/**
 * @Author : MILES .
 * @Create : 2017/3/13.
 * @Module : 常用公共方法
 */

//提供keySearch 使用方法
//$scope.down =onput() ;
//$scope.updata = function(){
//     $scope.$apply(function(){
//        $scope.vm = angular.element(self).val();
//    })
//} ;
//    function(e){
//    var  self = e.srcElement ? e.srcElement : e.target;
//    var keycode = window.event?e.keyCode:e.which;
//    angular.element(self).on({
//        compositionend:function(val){
//            console.log( angular.element(self).val())
//        }
//    }) ;
//} ;
function onput(e,updateCall,specialKeyCall,inputCall){
    /* 必写
    *   e
    *   updataCall  $scope.$apply(function(){
                         model = angular.element(self).val();
                    })
    * */
    //     {{ this  keycode  val }}    //
    //enter
    //输入更新
    //
    var  self = e.srcElement ? e.srcElement : e.target;
    var keycode = window.event?e.keyCode:e.which;
    var val  ;
    //chrome  兼容 输入汉字更新model问题
    angular.element(self).on({
        compositionend:function(value) {
            val = angular.element(self).val() ; //得到数值
            updateCall();                       //更新数值
            console.log(val) ;
            if (inputCall) {
                inputCall()
            }
            if (specialKeyCall) {
                specialKeyCall();
                //if(keycode==13){
                //    srcObj.blur();
                //    callback();
                //    //srcObj.focus()
                //}
            }
        }
    })
   };
function enterEvent(e,callback) {
    var  srcObj = e.srcElement ? e.srcElement : e.target;
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
        srcObj.blur();
        callback();
        //srcObj.focus()
    }
}
// 判断浏览器
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
//请求方式
function httpRequestPost(url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall,async) {
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
        async:async=="false"?false:true,
        timeout: timeout?timeout:100000, //超时时间设置为10秒；
        headers: header,
        data: data,
        success: function(data) {
            sucCallBack(data);
        },
        error: function(xhr, type, errorThrown) {
            if(falCallback){
                falCallback(xhr, type, errorThrown);
            }
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

//获取过去的时间
function getBeforeDate(n,type,revert){
    //*params  n 時間
    //*params type  是否返回每一天日期
    //*params revert  是否返回日期排序
    //var s ;
    //var n = n;
    //var d = new Date();
    //var year = d.getFullYear();
    //var mon=d.getMonth()+1;
    //var day=d.getDate();
    //if(day <= n){
    //    if(mon>1) {
    //        mon=mon-1;
    //    }
    //    else {
    //        year = year-1;
    //        mon = 12;
    //    }
    //}
    //if(type){
    //    s = [] ;
    //    for(var i = 1 ;i<n+1; i++){
    //        d.setDate(d.getDate()-1);
    //        day=d.getDate();
    //        var y  = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    //        s.push(y)
    //    }
    //}else{
    //    d.setDate(d.getDate()-n);
    //    day=d.getDate();
    //    s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    //}
    //if(revert){
    //    s= s.reverse() ;
    //}
    //return s;
        var days = [] ;
        var current = new Date() ;
        for(var i = 1; i<n+1; i++){
            var today  = new Date(current.getTime()-i*1000*24*3600);
            var year = today.getFullYear() ;
            var month = (today.getMonth()+1)>=10?(today.getMonth()+1):("0"+(today.getMonth()+1)) ;
            var day =  (today.getDate()>=10)?(today.getDate()):("0"+(today.getDate()))  ;
            var date = year + "-" + month + "-" + day ;
            days.push(date) ;
        }
        return days.reverse()

}
//具体时间转换为时间戳
function dateToString(str){
    //var str = '2013-08-30'; // 日期字符串
    //str = str.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
    //var date = new Date(str); // 构造一个日期型数据，值为传入的字符串
    if(typeof str == "string"){
        str = str.replace(/-/g,'/') ;
        return new Date(str).get
    }else if(typeof str == "object"){
        for(var i=0;i<str.length;i++){

        }
    }
}
//获取时间间隔
function getTimeJump(sDate1,  sDate2){
    var  aDate,  oDate1,  oDate2,  iDays ;
    aDate  =  sDate1.split("-") ;
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式
    aDate  =  sDate2.split("-") ;
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
    return  iDays
}
//获取两个时间短的所有日期
Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
};
//获取两个时间短的所有日期
function getAllDateFromDateJump(begin, end) {
    var date = [] ;
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb; k <= unixDe;) {
        date.push((new Date(parseInt(k))).format())  ;
        //console.log((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
    };
    return date ;
}
function getDayTime(step){
    angular.forEach(data.data, function(data1){
        for(var i = 0 ; i<data1.length;i ++){
            var res = data1[i].date;
            if(res.toString.length<3) {
                if(datelist.indexOf(res+":00-"+(res+1)+":00") == -1){
                    datelist.push(res+":00-"+(res+1)+":00");
                }
            }
        }
    });
    var len = step/2 ;
    var time = new Array(len)[0] = "00:00" ;
    for(var i = 0; i<len ; i++){
        //time[i] =
    }
}
                                        /**
                                         *  2017/9/29  MILES cookie 方法
                                         *   cookie 增删查
                                         * */
//写cookies
function setCookie(name,value,time)
{
    //if(time){
    //    var strsec = getsec(time);
    //    var exp = new Date();
    //    exp.setTime(exp.getTime() + strsec*1);
    //}
    document.cookie = name + "="+ escape (value)
}
//获取cookie
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function getsec(str) {
    //alert(str);
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
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    //var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

                                        /**
                                         * 为空判断 包括空字符串及回车换行符
                                         * @param value
                                         */
function nullCheck(value){
    if(value!=null && value!=undefined && $.trim(value)!=''){
        return false;
    }
    //if(value==null){
    //    return false;
    //}
    //if(value==""){
    //    return false;
    //}
    //if(value==undefined){
    //    return false;
    //}
    //var result = value.replace(/[ \r\n]/g,"");
    //if(result==""){
    //    return false;
    //}
    return true;
}
                                        /**
                                         * 替换所有空格回车
                                         * @param str
                                         * @returns {*}
                                         */
function trimStr(str){
    if(nullCheck(str)==false){
        return "";
    }
    return str.replace(/[ \r\n]/g,"");
}
                                        /**
                                         *  2017/9/13  孟飞 文件下载  BEGIN
                                         * @param : container  容器
                                         * @param : url  下载地址
                                         * */
function downLoadFiles(container,url){
     try{
         container = container?container:document.body
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.href = url;
        elemIF.setAttribute('class', 'downLoad');
        elemIF.style.display = "none";
        container.appendChild(elemIF);
    }catch(e){
    }
}
