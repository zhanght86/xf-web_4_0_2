'use strict';
knowledge_static_web
    .directive('onRenderFinish', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                if (scope.$last === true) {    //判断是否是最后一条数据
                    scope.$emit('onRenderFinish'); //向父级scope传送ngRepeatFinished命令
                    console.log("onRenderFinish");
                }
            }
        };
    }]);


