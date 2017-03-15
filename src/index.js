require('es6-promise').polyfill();
require("../libs/js/H-ui.js");
import api from "../libs/js/common.js";

//**************************   Login  *****************************//
require("./js/Login/Login.js");

//**************************   Login  *****************************//

//**************************   HomePage  *****************************//
require("./js/HomePage/HomePage.js");
require("./js/HomePage/HomePageNav.js");
require("./js/HomePage/HomePageContent.js");
//**************************   HomePage  *****************************//
//**************************   ApplicationAnalysis  *****************************//
//**************************   ApplicationAnalysis  *****************************//
//**************************   ApplicationAnalysis  *****************************//
//**************************   BusinessModeling  *****************************//
//**************************   BusinessModeling  *****************************//
//**************************   KnowledgeManagement  *****************************//
//**************************   KnowledgeManagement  *****************************//
//**************************   MaterialManagement  *****************************//
//**************************   MaterialManagement  *****************************//
//**************************   MyApplication  *****************************//
//**************************   MyApplication  *****************************//
//**************************   TestFunction  *****************************//
//**************************   TestFunction  *****************************//

// 关闭log 日志
avalon.config({
    loader : false
});

//定义 跟 路由
var root = avalon.define({
    $id : "root",

    currPath : "",    //定义路径名称
    //
    //headerPage : "<p> header page </p>",    //定义页面 header
    //
    currPage : ""   //定义页面content
    //
    //footerPage : "<p> footer page </p>"      //定义页面footer
});
//定义路由  以及方法
//var states = {} ;
//
//function addState(path , vm , html){
//
//    states[path] = {
//        vm : vm,
//        html : html
//    };
//}
function getPage(path){
    var path = path.slice(1);
    console.log("35"+path);
//  //  var html = "<xmp is='ms-component' class='ms-view-content' ms-widget='{path:\'" + path + "}></xmp>";
    return require("./html/"+path+".html");
};
//添加所有路由
//我的应用
//let page_MyApplication = ["MyApplication","","","",""];
////业务建模
//let page_BusinessModeling = ["BusinessModeling","","","",""];
////知识管理
//let page_KnowledgeManagement = ["KnowledgeManagement","","","",""];
////测试功能
//let page_TestFunction = ["TestFunction","","","",""];
////应用分析
//let page_ApplicationAnalysis = ["ApplicationAnalysis","","","",""];
////素材管理
//let page_MaterialManagement = ["MaterialManagement","","","",""];

//登陆以及首页
var page = ["HomePage","Login"];
page.forEach(function(pathName){
    var html = require("./html/"+pathName+"/"+pathName+".html"); //获取html
    avalon.router.add("/"+pathName,function(){
        root.currPath = html;

    })
});
avalon.history.start({
    root : "/" //根路径
    //html5: false, //是否使用HTML5 history
    //hashPrefix: "!",//
    //autoScroll: false //滚动
});
//默认打开
var hash = location.hash.replace(/#!?/, '');
avalon.router.navigate(hash || '/Login', 0);

//mmRouter的方法
//avalon.router.add(rule, cb)
//
//添加 一个路由规则与对象的回调, cb为rule规则中捕捉的参数
//avalon.router.error(cb)
//
//当目标页面不匹配我们所有路由规则时, 就会执行此回调.有点像404
//avalon.router.navigate(hash, mode)
//
//mode 0或undefined, 不改变URL, 不产生历史实体, 执行回调
// 1, 改变URL, 不产生历史实体, 执行回调
// 2, 改变URL, 产生历史实体, 执行回调

//开始目录

avalon.ready(function(){
    avalon.scan(document.body)
});


