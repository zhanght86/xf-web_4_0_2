/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module : 开关按钮
 */
module.exports = module =>{
    module
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
})};