//
////url
//knowledge_static_web.directive("autoComplete", function() {
//    return {
//        restrict: "AE",
//        templete: ,
//        link: function(scope, elem, attrs) {
//            elem.on("focus",function(e){
//                $(this).parents(".login-fItem").addClass("focus");
//            }).on("blur",function(){
//                $(this).parents(".login-fItem").removeClass("focus");
//            });
//        }
//    }
//});//
//
//knowledge_static_web.directive("autoComplete", function() {
//    return {
//        restrict: "AE",
//        template: '<input type="text">',
//        scope : true ,
//        link: function(scope, elem, attrs) {
//            console.log(scope);
//            //elem.on("focus",function(e){
//            //    $(this).parents(".login-fItem").addClass("focus");
//            //}).on("blur",function(){
//            //    $(this).parents(".login-fItem").removeClass("focus");
//            //});
//        }
//    }
//});

knowledge_static_web.directive("autoComplete", function($compile) {
return {
    restrict: 'AE', //attribute or element
    //
    scope: {
        source: '=',
        result : '=',
        width : '='
        //bindAttr: '='
    },
    template:'<div class="miles-autoBar">' +
                 '<div class="miles-container" style="height: auto;">' +
                     '<div class="miles-resultItem L" ng-if="result" ng-repeat="val in result">' +
                            //'<i class="remove glyphicon glyphicon-trash"></i>' +
                            '<i class="miles-remove">x</i>' +
                            '<span>{{val}}</span>' +
                     '</div>' +
                     '<input class="miles-autoInput L" type="text"/>' +
                '</div>' +
                '<ul ng-if="source&&source.length" class="miles-dropDown" ng-show="flag">' +
                        '<li class="miles-item" ng-repeat="item in source">{{item.dimensionName}}</li>'+
                '</ul>' +
            '</div>',
    replace: true,
    //require: 'ngModel',
    link: function ($scope, elem, attr, ctrl) {
        $scope.flag = false;
        angular.element(elem).find("input").bind('focus', function () {
            //Ìí¼Ó „h³ý²Ù×÷
            $scope.flag = true;
            $scope.$apply(function () {
            });
        });
        //angular.element("document").on("click",function(){
        //    if($(this.))
        //    $scope.flag = false;
        //    $scope.$apply()
        //})
        angular.element(elem).bind('click', function () {
            $scope.flag = true;
            angular.element(this).find(".miles-autoInput").focus()
        });
        angular.element(elem).on('click', 'li',function () {
            var item = angular.copy(angular.element(this).html());
            $scope.flag = true;
            $scope.$apply(function () {
                if( !$scope.result.inArray(item)){
                    $scope.result.push(item);
                    $scope.source.remove(item)
                }
            });
        });
        angular.element(elem).on('click', '.miles-remove',function () {
            var item = angular.copy(angular.element(this).next().html());
            $scope.flag = true;
            $scope.$apply(function () {
                $scope.source.push(item);
                $scope.result.remove(item)
            });
        });
        console.debug($scope);
    }
};
});