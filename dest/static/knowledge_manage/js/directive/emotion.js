/**
 * Created by 41212 on 2017/7/15.
 */
knowledge_static_web.directive('emotion',["$timeout",function($timeout){
    return{
        restrict:'EA',
        link:function(scope,element,attrs){
            $timeout(function(){
                $('.emotion').qqFace({
                    id : 'facebox',
                    wrapper : "block" ,
                    assign:'emotion-container',       //赋值对象
                    path:'/libs/qqFace/arclist/'	//表情存放的路径
                });
            },100) ;
        }
    }
}]).directive('emotionFormat',["$timeout","$filter",function($timeout,$filter){
    return{
        restrict:'A',
        require : "ngModel",
        link:function(scope,$element,attrs,modelCtrl){
            console.log($element)  ;
            var reg = /\[em_([0-9]*)\]/g ;
            $element.bind("DOMNodeInserted input",function(va,va2,va3){
                var pristine = $element.html(),
                    html = pristine ;
                if(reg.test(pristine)){
                    html = $filter('emotion')(pristine) ;
                    $element.html(html) ;
                }
                scope.$apply(function(){
                    scope.vm.emotionText = html ;
                })
            }) ;
            //modelCtrl.$viewValue = "3werwarwaer"
            //modelCtrl.$parsers.push(function (inputValue) {
            //
            //    var transformedInput = inputValue.toLowerCase().replace(/ /g, '');
            //
            //    if (transformedInput != sinputValue) {
            //        modelCtrl.$setViewValue(transformedInput);
            //        modelCtrl.$render();
            //    }
            //
            //    return transformedInput;
            //});
            //function formatter(value) {
            //    return dateFilter(value, 'yyyy-MM-dd'); //format
            //}
            //
            //function parser() {
            //    return ctrl.$modelValue;
            //}

            //ctr.$formatters.push(formatter);
            //ctr.$parsers.unshift(parser);
        }
    }
}])