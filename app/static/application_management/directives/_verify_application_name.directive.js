/**
 * @Author : MILES .
 * @Create : 2017/9/11.
 * @Module :  验证应用名称
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .directive('checkName', function(ApplicationServer,$timeout){
        return {
            require: 'ngModel',
            link: function(scope, $ele, $attrs, $ctrl){
                let timer ;
                scope.$watch($attrs.ngModel, function(current,old){
                    if(timer){
                        $timeout.cancel(timer) ;
                        timer = "" ;
                    }
                    timer = $timeout(function () {
                        if(!scope.vm.applicationInfo.newName) {
                            return;
                        }
                        ApplicationServer.verifyApplicationName.save({
                            "name": scope.vm.applicationInfo.newName
                        },function(response){
                            if(response.status==200){
                                $ctrl.$setValidity('unique', true);
                            }else{
                                $ctrl.$setValidity('unique', false);
                            }
                        },function(error){
                            $ctrl.$setValidity('unique', false);
                        }) ;
                        timer = "" ;
                    },300) ;

                });
            }
        }
    });
}
