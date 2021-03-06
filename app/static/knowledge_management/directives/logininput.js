
// knowledge_static_web.directive("loginInput", function() {
//     return {
//         restrict: "AE",
//         link: function(scope, elem, attrs) {
//             elem.on("focus",function(e){
//                 $(this).parents(".login-fItem").addClass("focus");
//             }).on("blur",function(){
//                 $(this).parents(".login-fItem").removeClass("focus");
//             });
//         }
//     }
// })
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
.directive('switch',function(){
    return{
        restrict:'EA',
        scope:{
            title:'=expanderTitle',
            value : '='      // 1  true   0  false
        },

        template: '<div class="b_box" ng-click="toggle()" ng-class="value?\'open1\':\'close1\'" style="float:left;margin-right:10px;">'+
                            '<div class="s_box"  ng-class="value?\'open2\':\'close2\'"></div>'+
                   '</div>',
        link:function(scope,element,attrs){
            //scope.$apply(function () {
                scope.toggle=function toggle(){
                    scope.value = scope.value?0:1;
                };
            //});

        }
    }
})
.directive('switchTurn',function(){
        return{
            restrict:'EA',
            scope:{
                title:'=expanderTitle',
                value : '='      // 1  true   0  false
            },

            template: '<div class="b_box" ng-click="toggle()" ng-class="value==10001?\'open1\':\'close1\'" style="float:left;margin-right:10px;">'+
            '<div class="s_box"  ng-class="value==10001?\'open2\':\'close2\'"></div>'+
            '</div>',
            link:function(scope,element,attrs){
                //scope.$apply(function () {
                scope.toggle=function toggle(){
                    scope.value = (scope.value==10001?10002:10001)
                };
                //});

            }
        }
})}
