webpackHotUpdate(0,{

/***/ 55:
/***/ (function(module, exports) {

	module.exports = "<div class=\"msgR-cont pd30 L\">\r\n    <div class=\"r-cont-hd\">\r\n        <span>应用信息</span>\r\n    </div>\r\n    <p class=\"msgR-name\">{{vm.applicationInfo.applicationName}}\r\n                <span ng-click=\"vm.editName()\">\r\n                    <i></i>修改名称\r\n                </span>\r\n    </p>\r\n    <ul class=\"msgR-state\">\r\n        <li ng-if=\"vm.applicationInfo.statusId==40001\">应用状态：未使用</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40002\">应用状态：使用中</li>\r\n        <li ng-if=\"vm.applicationInfo.statusId==40003\">应用状态：已停用</li>\r\n        <li>场景类型：<span ng-bind=\"'客服型'\"></span></li>\r\n        <li>创建时间：{{vm.applicationInfo.applicationCreateTime | date : 'yyyy-MM-dd'}}</li>\r\n    </ul>\r\n    <div class=\"jqrsz-btn-box\" style=\"padding: 30px 0;margin-bottom:0; \">\r\n        <a class=\"btn btn-blue mr10\" ng-click=\"vm.stopAllServices()\" >下线所有服务</a>\r\n        <a class=\"btn btn-gray mr10\" id=\"deletePop\" ng-click=\"vm.deleteApplication()\" style=\"background: #e2e2e2; color: #666;\">删除应用</a>\r\n        <a class=\"btn btn-green\" ui-sref=\"AM.restore\">备份/还原</a>\r\n    </div>\r\n    <p class=\"msgR-title mb-10\">应用高级信息</p>\r\n    <div class=\"clearfix\" >\r\n        <ul class=\"msgR-table-1 L\">\r\n            <li class=\"msgR-table-head\">场景信息</li>\r\n            <li>业务框架 <span>{{vm.sceneInfo.businessFrameNum}}种</span></li>\r\n            <li>知识类型 <span>{{vm.sceneInfo.knowledgeTypeNum}}种</span></li>\r\n            <li>交互方式 <span>{{vm.sceneInfo.exchangeModeNum}}种</span></li>\r\n        </ul>\r\n        <ul class=\"msgR-table-1 msgR-table-2 L\">\r\n            <li class=\"msgR-table-head\">发布信息</li>\r\n            <li ng-repeat=\"item in vm.serviceData\">\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30001\">未发布</span>\r\n                <span class=\"Nrelease\" ng-if=\"item.serviceStatus==30002\">已发布</span>\r\n                <span class=\"release\" ng-if=\"item.serviceStatus==30003\">已下线</span>\r\n                &nbsp; {{item.serviceName}}\r\n                <p ng-if=\"item.serviceStatus==30001\"><a class=\"release\" ng-click=\"vm.publishService(item.serviceId)\">发布</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30002\"><a class=\"Offline\" ng-click=\"vm.stopService(item.serviceId)\">下线</a>&nbsp; | &nbsp;<a class=\"restart\" ng-click=\"vm.restartService(item.serviceId)\">重启</a>\r\n                </p>\r\n                <p ng-if=\"item.serviceStatus==30003\"><a class=\"release\" ng-click=\"vm.startService(item.serviceId)\">上线</a>\r\n                </p>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <pagination ng-if=\"vm.paginationConf.totalItems && vm.paginationConf.totalItems>0\" conf=\"vm.paginationConf\"></pagination>\r\n\r\n</div>\r\n"

/***/ })

})