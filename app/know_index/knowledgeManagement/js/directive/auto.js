
knowledge_static_web.directive("autoComplete", function($compile,$timeout,$interval) {
    //fanhui   {id : [],name : []}
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
        '<div class="miles-resultItem L" ng-if="result.name" ng-repeat="val in result.name track by $index">' +
            '<i class="miles-remove" ng-click="removeItem($index,val)">x</i>' +
            '<span>{{val}}</span>' +
        '</div>' +
        '<input class="miles-autoInput L"  id="input" name="input" ng-focus="flag=true" type="text"/>' +
        '</div>' +
        '<label for="input"><ul ng-if="source.name&&source.name.length" class="miles-dropDown" ng-show="flag">' +
        '<li class="miles-item" ng-repeat="item in source.name track by $index" ng-click="addItem($index,item)">{{item}}</li>'+
        '</ul></label>' +
        '</div>',
        replace: true,
        //require: 'ngModel',
        link: function ($scope, elem, attr, ctrl) {
            $scope.search = " ";
            $scope.flag = false;
            //$scope.$apply(function(){
            var result = {};
            result.id = [];
            result.name = [];
            var source = {};
            source.id = [];
            source.name = [];
            var timer = $interval(function(){
                  if($scope.source){
                      $interval.cancel(timer);
                      angular.forEach($scope.source,function(item){
                          source.name.push(item.dimensionName);
                          source.id.push(item.dimensionId);
                          $scope.source = source;
                      });
                      //console.log($scope.result);
                      if($scope.result&&$scope.source.name){
                          //console.log($scope.result);
                          angular.forEach($scope.result,function(item){
                              $scope.source.name.remove(item.dimensionName);
                              $scope.source.id.remove(item.dimensionId);
                              result.name.push(item.dimensionName);
                              result.id.push(item.dimensionId)
                          });
                          $scope.result = result
                      }
                      //});
                      $scope.addItem = function(index,item){
                          $scope.result.name.push(item);
                          $scope.result.id.push($scope.source.id[index]);
                          $scope.source.name.splice(index,1);
                          $scope.source.id.splice(index,1);
                          $("#input").val("")
                      };
                      $scope.removeItem = function(index,item){
                          $scope.source.name.push(item);
                          $scope.source.id.push($scope.result.id[index]);
                          $scope.result.name.splice(index,1);
                          $scope.result.id.splice(index,1);
                          $("#input").val("")
                      };
                      $(document).on("click",function(event){
                          var event = event || window.event;
                          if($(event.target).attr('class')!= "miles-autoInput L"){
                              $scope.flag = false;
                              $scope.$apply()
                          }else{
                              $scope.flag = true;
                              angular.element(elem).find(".miles-autoInput").focus();
                          }
                          $("#input").val("")
                      });
                  }
              },100);
            console.debug($scope);
        }
    };
}).directive("tagAutoComplete", function($compile,$timeout,$interval) {
    ///输入  class 不重复   结果  返回
    return {
        restrict: 'AE', //attribute or element
        //
        scope: {
            source: '=',
            result : '=',
            width : '=' ,
            class : '@'
            //bindAttr: '='
        },
        template:'<input >' ,
        replace: true,
        //require: 'ngModel',
        link: function ($scope, elem, attr , ctrl) {
            $timeout(function(){
                $(elem).tagEditor({
                    initialTags:$scope.result,  //默认标签
                   //delimiter: ', ', /* space and comma */
                    //autocomplete: {delay: 0, position: {collision: 'flip'}},
                    forceLowercase: false ,
                    //placeholder: '输入内容点击enter添加您的标签 ...'
                    onChange: function(field, editor, tags) {
                        $scope.result = tags ;
                    },
                    beforeTagSave: function(field, editor, tags, tag, val) {
                        //保存之前的
                        //console.log(tags)
                    },
                    beforeTagDelete: function(field, editor, tags, val) {
                        //console.log(tags)
                    }
                });
            },0)
    }
    }
});

