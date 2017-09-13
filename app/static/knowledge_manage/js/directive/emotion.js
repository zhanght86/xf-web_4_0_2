/**
 * Created by 41212 on 2017/7/15.
 */
knowledge_static_web.directive('emotion',function(){
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
            $('.emotion').qqFace({
                id : 'facebox',

                assign:'emotion-container',       //赋值对象

                path:'app/libs/qqFace/arclist/'	//表情存放的路径

            });

        }
    }
})