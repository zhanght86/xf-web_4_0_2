
knowledge_static_web.directive("autoComplete", function($compile,$timeout,$interval) {
    //fanhui   {id : [],name : []}
    return {
        //restrict: 'AE', //attribute or element
        //
        scope: {
            //source: '=',
            result : '=',
            //width : '='
        },
        template:'<div class="miles-autoBar">' +
        '<div class="miles-container" style="height: auto;">' +
        '<div class="miles-resultItem L" ng-if="result" ng-repeat="val in result track by $index">' +
            '<i class="miles-remove" ng-click="removeItem($index,val)">x</i>' +
            '<span>{{val | dimension:dimensionList}}</span>' +
        '</div>' +
        '<input class="miles-autoInput L"  id="input" name="input" style="width:100%;" ng-focus="flag=true" type="text"/>' +
        '</div>' +
        '<label for="input"><ul ng-if="source.length" class="miles-dropDown" ng-show="flag">' +
        '<li class="miles-item" ng-repeat="item in source track by $index" ng-click="addItem($index,source[$index])">{{item | dimension:dimensionList}}</li>'+
        '</ul></label>' +
        '</div>',
        replace: true,
        //require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.search = " ";
            scope.flag = false;
            scope.source = [];
            scope.dimensionList =  scope.$parent.$parent.$parent.MASTER.dimensionList ? scope.$parent.$parent.$parent.MASTER.dimensionList : void function(){
                 scope.$parent.$parent.$parent.MASTER.queryDimensionList(APPLICATION_ID).$promise.then(function(response){
                     return response.data ;
                 })
             }();
            if(scope.result){
                angular.forEach(scope.dimensionList,function(item){
                    if(!scope.result.inArray(item.dimensionId)){
                        scope.source.push(item.dimensionId);
                    }
                });
            }else{
                scope.result = [] ;
                scope.source = angular.copy(scope.$parent.$parent.$parent.MASTER.dimensionListIds) ;
            }
            scope.addItem = function(index,item){
                scope.result.push(item);
                scope.source.splice(index,1);
                $("#input").val("")
            };
            scope.removeItem = function(index,item){
                scope.source.push(scope.result[index]);
                scope.result.splice(index,1);
                $("#input").val("")
            };

            $(document).on("click",function(event){
                var event = event || window.event;
                if($(event.target).attr('class')!= "miles-autoInput L"){
                    scope.$apply(function(){
                        scope.flag = false;
                    })
                }else{
                    scope.flag = true;
                    angular.element(elem).find(".miles-autoInput").focus();
                }
                $("#input").val("")
            });
        }
    };
})

