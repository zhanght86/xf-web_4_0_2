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