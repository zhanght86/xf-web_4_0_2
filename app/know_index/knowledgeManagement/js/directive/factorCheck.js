///**
// * Created by 41212 on 2017/4/11.
// */
//
//knowledge_static_web.directive("factorBox", function($parse) {
//    return {
//        restrict:'EA',
//        scope:{
//            defaults:'=',   // 1  true   0  false
//            //item  : '@'
//        },
//        // item  arr
//        template:
//        '<div class="my-checkbox" ng-click="toggle()">'+
//        '<label ng-class="defaults?\'\':\'my-checkbox-on\'"></label>'+
//        '</div>',
//        link:function(scope,element,attrs){
//            //scope.flag=true;
//            //attrs.arr = $parse(attrs.arr);
//            //scope.arr = $parse(attrs.arr);
//
//            scope.toggle=function toggle(){
//                //if(scope.flag){
//                //    console.log(typeof attrs.arr);
//                //    attrs.arr.push(attrs.item)
//                //}else{
//                //    attrs.arr.remove(attrs.item)
//                //};
//                scope.defaults = scope.defaults?0:1;;
//
//
//            }
//        }
//    }
//});
