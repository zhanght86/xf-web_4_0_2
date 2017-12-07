///**
// * @Author : MILES .
// * @Create : 2017/10/16.
// * @Module :
// */
////自定义ngModel的属性
//angular.module("knowledgeManagementModule").directive('contenteditable', ['$window', function() {
//    return {
//        restrict: 'A',
//        require: '?ngModel', // 此指令所代替的函数
//        link: function(scope, element, attrs, ngModel) {
//            if (!ngModel) {
//                return;
//            } // do nothing if no ng-model
//            // Specify how UI should be updated
//            ngModel.$render = function() {
//                element.html(ngModel.$viewValue || '');
//            };
//            // Listen for change events to enable binding
//            element.on('blur keyup change', function() {
//                scope.$apply(readViewText);
//            });
//            // No need to initialize, AngularJS will initialize the text based on ng-model attribute
//            // Write data to the model
//            function readViewText() {
//                var html = element.html();
//                // When we clear the content editable the browser leaves a <br> behind
//                // If strip-br attribute is provided then we strip this out
//                if (attrs.stripBr && html === '<br>') {
//                    html = '';
//                }
//                ngModel.$setViewValue(html);
//            }
//        }
//    }
//}])