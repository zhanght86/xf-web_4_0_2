
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
});