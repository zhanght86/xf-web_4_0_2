/**
 * Created by Administrator on 2016/12/12.
 */

knowledge_static_web.directive("versionCompareRow", function() {
    return {
        restrict: "A",
        scope:{},
        link: function($scope, elem, attrs) {
            elem.on("click",function(e){
                if($(this).parents("tr").hasClass("on")){
                    $(this).parents("tr").removeClass("on");
                }else{
                    $(this).parents("tr").addClass("on");
                }
            });
        }
    }
});

knowledge_static_web.directive("versionCompareCombo", function() {
    return {
        restrict: "A",
        scope:{},
        link: function($scope, elem, attrs) {
            var evTimeStamp = 0;
            elem.click(function(e){
                var now = +new Date();
                if (now - evTimeStamp < 100) {
                    return;
                }
                evTimeStamp = now;
                console.log(2);
                if($(this).hasClass('my-checkbox-on')==true){
                    $(this).removeClass('my-checkbox-on');
                }
                else {
                    $(this).addClass('my-checkbox-on');
                }
            });
        }
    }
});

knowledge_static_web.directive("versionCompareRow", function() {
    return {
        restrict: "E",
        scope:{},
        link: function($scope, elem, attrs) {
            elem.on("click",function(e){
                if($(this).parents("tr").hasClass("on")){
                    $(this).parents("tr").removeClass("on");
                }else{
                    $(this).parents("tr").addClass("on");
                }
            });
        }
    }
});


