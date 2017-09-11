/**
 * @Author : MILES .
 * @Create : 2017/9/11.
 * @Module :  验证应用名称
 */
angular.module("myApplicationSettingModule").directive('checkName', function(configurationServer,$log){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                configurationServer.verifyApplicationName.save({
                    applicationId: APPLICATION_ID,
                    applicationName: scope.vm.applicationNewName
                },function(response){
                    if(response.data){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                    }
                },function(error){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                    $log(error)
                }) ;
            });
        }
    }
});