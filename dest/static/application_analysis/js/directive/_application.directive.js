/**
 * Created by 41212 on 2017/4/11.
 */

knowledge_static_web.directive("sort", function() {
    return {
        restrict:'EA',
        scope:{
            //title:'=expanderTitle'
        },
    template: '<a href="javascript:;"  ng-click="toggle()" ng-class="flag?\'sorting_asc\':\'sorting_asc2\'"></a>',
        link:function(scope,element,attrs){
            scope.flag=false;
            scope.toggle=function toggle(){
                scope.flag = !scope.flag;
            }
        }
    }
});
