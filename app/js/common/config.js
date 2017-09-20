/**
 * AUTHOR mileS
 * Time 2017/6/15
 * INFO 统一用户信息 cookieֵ
 *  用户ID  用户名  登录名 应用ID  场景ID
 */

;var
    USER_ID = document.cookie.indexOf("userId=")!=-1?getCookie("userId").replace(/\"/g,""):"" ,
    USER_NAME = document.cookie.indexOf("userName=")!=-1?getCookie("userName").replace(/\"/g,""):"",
    USER_LOGIN_NAME = document.cookie.indexOf("userLoginName=")!=-1?getCookie("userLoginName").replace(/\"/g,""):"",
    APPLICATION_ID = document.cookie.indexOf("applicationId=")!=-1?getCookie("applicationId").replace(/\"/g,""):"",
    APPLICATION_NAME = document.cookie.indexOf("applicationName=")!=-1?getCookie("applicationName").replace(/\"/g,""):"" ,
    SCENE_ID = document.cookie.indexOf("sceneId=")!=-1?getCookie("sceneId").replace(/\"/g,""):"";
console.log(USER_NAME) ;

