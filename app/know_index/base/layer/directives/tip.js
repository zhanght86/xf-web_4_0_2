/*
'use strict';
knowledge_static_web
    .directive('alertBar', [function () {

        return {
            restrict: 'EA',
            templateUrl: 'know_index/base/tip/directives/tip.html',
            scope : {
                message : "=",
                type : "="
            },
            link: function(scope, element, attrs){

                scope.hideAlert = function() {
                    scope.message = null;
                    scope.type = null;
                };

            }
        };
*/







        //
        // return {
        //     restrict: 'EA',
        //     templateUrl: 'know_index/base/tip/directives/tip.html',
        //     //template: "<h3 ng-transclude>Hello, Directive,</h3>",
        //     scope: {
        //         message: "=",
        //         type: "="
        //     },
        //     // replace:false,
        //     // transclude: true,
        //     link: function (scope, element, attrs) {
        //         element.click(function(){
        //             $('.popup_info_tip').show();
        //         })
        //         scope.confirm = function () {
        //             scope.flag = true;
        //             scope.$parent.flag = true;
        //             scope.$parent.$parent.flag = true;
        //
        //         };
        //
        //         scope.hideAlert = function () {
        //             scope.message = null;
        //             scope.type = null;
        //         };
        //
        //     }
        // };
    }]);

