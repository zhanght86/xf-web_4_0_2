webpackHotUpdate(10,{

/***/ 53:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/9/11.
	 * @Module :  验证应用名称
	 */
	module.exports = function (applicationManagementModule) {
	    applicationManagementModule.directive('checkName', function (ApplicationServer, $log) {
	        return {
	            require: 'ngModel',
	            link: function link(scope, ele, attrs, c) {
	                scope.$watch(attrs.ngModel, function (n) {
	                    if (!n) return;
	                    ApplicationServer.verifyApplicationName.save({
	                        applicationId: APPLICATION_ID,
	                        applicationName: scope.vm.applicationNewName
	                    }, function (response) {
	                        if (response.data) {
	                            c.$setValidity('unique', true);
	                            scope.vm.allowSubmit = 1;
	                        } else {
	                            c.$setValidity('unique', false);
	                            scope.vm.allowSubmit = 0;
	                        }
	                    }, function (error) {
	                        c.$setValidity('unique', false);
	                        scope.vm.allowSubmit = 0;
	                        $log.log(error);
	                    });
	                });
	            }
	        };
	    });
	};

/***/ })

})