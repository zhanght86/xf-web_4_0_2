webpackHotUpdate(0,{

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/10/31.
	 * @Module : 全局指令
	 */
	var $ = __webpack_require__(4);
	module.exports = function (ngModule) {
	    ngModule
	    /**
	     * @Author : MILES .
	     * @Create : 2017/11/6.
	     * @Module : placeholder 兼容ie
	     * */

	    .directive('placeholder', function () {
	        return {
	            restrict: 'A',
	            require: '?^ngModel',
	            link: function link(scope, element, attr) {
	                var scope = scope && scope.$new();
	                var validateClass = attr['validateClass'];
	                if ('placeholder' in document.createElement('input')) {
	                    return;
	                }
	                var _class = element.attr('class');
	                var _id = element.attr('id');
	                var _style = element.attr('style');
	                var elName = element[0].tagName;
	                var tip;
	                var copyElement, classFlag;
	                element.attr('placeholder', '');
	                function load() {
	                    if (elName === 'INPUT') {
	                        classFlag = 'copy' + Math.floor(Math.random() * 1000000);
	                        element.after("<input class='copy " + classFlag + " " + validateClass + " " + _class + "' id='" + _id + "' style='color:#999;" + _style + "' value='" + tip + "' />");
	                        copyElement = $("." + classFlag);
	                        scope.init();
	                    } else if (elName === 'TEXTAREA') {
	                        classFlag = 'copy' + Math.floor(Math.random() * 1000000);
	                        element.after("<textarea rows=" + attr.rows + " class='copy " + classFlag + " " + _class + "' id='" + _id + "' style='color:#999;" + _style + "' /></textarea>");
	                        copyElement = $("." + classFlag);
	                        copyElement.val(tip);
	                        //指令兼容活动页面,此处select无法监听
	                        if (CommonFun.getUrlPara() === 'create') {
	                            if (scope.ngModel && (scope.ngModel.type === '单行文本' || scope.ngModel.type === '多行文本')) {
	                                element.hide();
	                                copyElement.hide();
	                            }
	                            $('select').change(function () {
	                                if ($(this).val() === 0 || $(this).val() === 1) {
	                                    // element.hide();
	                                    copyElement.hide();
	                                } else {
	                                    copyElement.show();
	                                    element.hide();
	                                    copyElement.focus(function () {
	                                        copyElement.hide();
	                                        element.show();
	                                        element.trigger('focus');
	                                    });
	                                    element.blur(function () {
	                                        if (element.val() === "") {
	                                            copyElement.show();
	                                            element.hide();
	                                        }
	                                    });
	                                }
	                            });
	                        } else {
	                            scope.init();
	                        }
	                    }
	                }
	                //指令兼容活动页面
	                if (scope.ngModel && scope.ngModel.tip !== undefined && scope.ngModel.tip !== null && scope.ngModel.tip !== '' && CommonFun.getUrlPara() !== 'create') {
	                    tip = scope.ngModel.tip;
	                } else if (scope.ngModel && scope.ngModel.tip === '') {
	                    tip = '';
	                } else {
	                    attr.$observe('placeholder', function (newV) {
	                        tip = newV;
	                        load();
	                    });
	                }
	                scope.init = function () {
	                    copyElement.show();
	                    element.hide();
	                    //监听input值状态
	                    scope.$watch(function () {
	                        return element.val();
	                    }, function (newV) {
	                        if (newV !== null && newV !== undefined && newV.trim() !== "") {
	                            copyElement.hide();
	                            element.show();
	                        } else {
	                            copyElement.show();
	                            element.hide();
	                        }
	                    });
	                    copyElement && copyElement.focus(function () {
	                        copyElement.hide();
	                        element.show();
	                        element.trigger('focus');
	                    });
	                    element.blur(function () {
	                        if (element.val() === "") {
	                            copyElement.show();
	                            element.hide();
	                        }
	                    });
	                };
	            }
	        };
	    })
	    /**
	     * @Author : MILES .
	     * @Create : 2017/11/6.
	     * @Module : 圆角兼容
	     * @use    : radius 默认值为 50 %
	     * */
	    .directive("radius", function () {
	        return {
	            restrict: "E",
	            link: function link($scope, $el, $attr, $ctr) {
	                var radius = $attr.redius ? $attr.redius : "50%";
	            }
	        };
	    });
	};

/***/ })

})