# angular-seed — the seed for AngularJS apps
This project is an application skeleton for a typical [AngularJS](http://angularjs.org/) web app.
information :
 开发规则
@1 命名方式 :
  文件名 (文件夹  统一驼峰式)
       app.controller.js
       app.module.js
       app.directive.js
       app.filter.js
       app.server.js
       a_b_c.html
   文件内部命名规范(controller为类 须首字母大写区分)
       Modules 	lowerCamelCase 	angularApp
       Controllers 	Functionality + 'Ctrl' 	AdminCtrl
       Directives 	lowerCamelCase 	userInfo
       Filters 	lowerCamelCase 	userFilter
       Services 	UpperCamelCase 	User 	constructor
       Services 	lowerCamelCase 	dataFactory 	others

@2 目录结构 业务级优先原则
    html 统一 规定在文件夹分类中
  web/
      app/
          bower-components/
          js/
          css/
          dest  -->>>> 合并压缩文件  项目上线后统一调用
          dir --|--server
                |--controller
                |--filter
                |--.html
          app.js
          index.html
      node_modules/
@3 运行环境 nodeJs
 安装  grunt   自动化工具
     npm install grunt -g  OR
     npm install grunt_cli -g
  npm install
  grunt 对文件合并压缩
  grunt watch 改动文件更新

@4 使用：
   $timeout替代 setTimeout
   $interval instead of setInterval
   $window替代 window
   $document 替代 document
   $http替代 $.ajax

layer api
  //layer.load(0, {shade: false});
 //layer.confirm('您是如何看待前端开发？', {
        //    btn: ['重要','奇葩'] //按钮
        //}, function(index){
        //    layer.msg('的确很重要', {icon: 3},1000);
        //}, function(){
        //    layer.msg('也可以这样', {
        //        time: 20000, //20s后自动关闭
        //        btn: ['明白了', '知道了']
        //    });
        //});

文件名称统一修改为 _first_second
css 中划线
服务改写
module 大驼峰 其他小驼峰


problem 维度---维度子集--update
$log  代替 console.log()

改写 相关问 为指令