/**
 * @Author : MILES .
 * @Create : 2017/9/20.
 * @Module : cookie
 */
function $(el){
    return document.getElementById(el.replace("#",""))
}
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
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    //var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}