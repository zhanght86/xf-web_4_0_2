
knowledge_static_web.directive("loginInput", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {

            elem.on("focus",function(e){
                $(this).parents(".login-fItem").addClass("focus");
            }).on("blur",function(){
                $(this).parents(".login-fItem").removeClass("focus");
            });
        }
    }
})
.directive('switch',function(){
    return{
        restrict:'EA',
        scope:{
            title:'=expanderTitle'
        },

        template: '<div class="b_box" ng-click="toggle()" ng-class="flag?\'open1\':\'close1\'" style="float:left;margin-right:10px;">'+
                            '<div class="s_box"  ng-class="flag?\'open2\':\'close2\'"></div>'+
                   '</div>',
        link:function(scope,element,attrs){
            scope.flag=true;
            scope.toggle=function toggle(){
                scope.flag = !scope.flag;
            }
        }
    }
});
