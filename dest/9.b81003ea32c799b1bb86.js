webpackJsonp([9],{

/***/ 38:
/***/ (function(module, exports) {

	module.exports = "<div ui-view=\"header\"></div>\r\n<div class=\"main warp\">\r\n    <div class=\"page-lrcont210 clearfix bgwhite mt10\">\r\n        <div class=\"l-aside fl\">\r\n            <div class=\"aside-hd tac\">\r\n                <div style=\"width:110px;height:110px;overflow: hidden;border-radius:50%;margin:0 auto;border:3px solid #fff;\">\r\n                    <img class=\"hd-img\" ng-src=\"{{MASTER.headImage}}\"/>\r\n                </div>\r\n                <span class=\"hd-name ellipsis\">{{applicationName}}</span>\r\n            </div>\r\n            <div class=\"aside-nav aside-nav2\">\r\n                <ul>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ng-click=\"vm.isSlide($event)\" ui-sref=\"setting.Infor\">\r\n                            <i class=\"icon-l icon-nav1\"></i>\r\n                            <span>应用信息</span>\r\n                            <!--<i class=\"icon-r icon-jt\"></i>-->\r\n                        </a>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ng-click=\"vm.isSlide($event)\">\r\n                            <i class=\"icon-l icon-nav2\"></i>\r\n                            <span ng-click=\"vm.isSlide2($event)\">应用开发</span>\r\n                            <i class=\"icon-r icon-jt\"></i>\r\n                        </a>\r\n                        <ul class=\"menu_1\">\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\"relationalCatalog.manage\"><span>业务建模</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\"KM.overview\"><span>知识管理</span></a>\r\n                            </li>\r\n                        </ul>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\" ng-click=\"vm.isSlide($event)\">\r\n                            <i class=\"icon-l icon-nav3\"></i>\r\n                            <span ng-click=\"vm.isSlide2($event)\">应用配置</span>\r\n                            <i class=\"icon-r icon-jt\"></i>\r\n                        </a>\r\n                        <ul class=\"menu_1\">\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".robot\"><span>机器人设置</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".parameter\"><span>参数设置</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".manual\"><span>转人工设置</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".authorization\"><span>授权管理</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".hot\"><span>热点知识设置</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".scene\"><span>场景管理</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\".channel\"><span>渠道管理</span></a>\r\n                            </li>\r\n                        </ul>\r\n                    </li>\r\n                    <li>\r\n                        <a class=\"slide-a ellipsis\"  ng-click=\"vm.isSlide($event)\">\r\n                            <i class=\"icon-l icon-nav4\"></i>\r\n                            <span ng-click=\"vm.isSlide2($event)\">应用发布 </span>\r\n                            <i class=\"icon-r icon-jt\"></i>\r\n                        </a>\r\n                        <ul class=\"menu_1\" >\r\n\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\"setting.releaseMan\"><span>发布管理</span></a>\r\n                            </li>\r\n                            <li>\r\n                                <a class=\"ellipsis\" ui-sref=\"setting.nodeMan\"><span>节点管理</span></a>\r\n                            </li>\r\n                        </ul>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div ui-view=\"content\"></div>\r\n    </div>\r\n\r\n</div>\r\n<style>\r\n    .menu_1{\r\n        display: block;\r\n    }\r\n</style>\r\n<script>\r\n    $('.menu_1 li').click(function(){\r\n        $(this).css('background','#d0caca').siblings().css('background','#e6e6e6');\r\n    });\r\n</script>\r\n\r\n\r\n\r\n\r\n\r\n"

/***/ })

});