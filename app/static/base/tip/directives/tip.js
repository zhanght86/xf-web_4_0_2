
knowledge_static_web
    .directive('alertBar', [function () {

        return {
            restrict: 'EA',
            templateUrl: 'static/base/tip/directives/tip.html',
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
    }]);

