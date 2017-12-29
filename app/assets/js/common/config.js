/**
 * AUTHOR mileS
 * Time 2017/10/28
 * INFO 统一用户信息 cookieֵ
 *  用户IdD  用户名  登录名 应用ID  场景ID
 */
;var
    USER_ID          = getCookie("userId")?getCookie("userId").replace(/\"/g,""):"" ,
    USER_NAME        = getCookie("userName")?getCookie("userName").replace(/\"/g,""):"",
    USER_LOGIN_NAME  = getCookie("userLoginName")?getCookie("userLoginName").replace(/\"/g,""):"",
    APPLICATION_ID   = getCookie("applicationId")?getCookie("applicationId").replace(/\"/g,""):"",
    APPLICATION_NAME = getCookie("applicationName")?getCookie("applicationName").replace(/\"/g,""):"" ;



