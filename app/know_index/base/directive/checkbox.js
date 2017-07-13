/**
 * Created by 41212 on 2017/4/11.
 */
knowledge_static_web.directive("checkbox", function($parse) {
    return {
        restrict:'EA',
        //scope:{
        //    arr:'=',
        //    item  : '@'
        //},
        // item  arr
        template:
                '<div class="my-checkbox" ng-click="toggle()">'+
                    '<label ng-class="flag?\'\':\'my-checkbox-on\'"></label>'+
                '</div>',
        link:function(scope,element,attrs){
            scope.flag=true;
            //attrs.arr = $parse(attrs.arr);
            //scope.arr = $parse(attrs.arr);

            scope.toggle=function toggle(){

                //if(scope.flag){
                //    console.log(typeof attrs.arr);
                //    attrs.arr.push(attrs.item)
                //}else{
                //    attrs.arr.remove(attrs.item)
                //};
                scope.flag = !scope.flag;


            }
        }
    }
}).directive("checkboxOverview", [
    function() {
        return {
            restrict:'EA',
            scope:{
                arr:'=',
                item  : '@',
                result : "="
            },
            template:
            '<div class="my-checkbox" ng-click="toggle()">'+
            '<label ng-class="flag?\'\':\'my-checkbox-on\'"></label>'+
            '</div>',
            link:function(scope,element,attrs){
                scope.$watch("result",function(val){
                    if(!val){
                        scope.flag=true;
                    }else{
                        scope.flag=false;
                    }
                }) ;
                scope.toggle=function toggle(){
                    scope.flag = !scope.flag;
                }
            }
        }
    }]);
