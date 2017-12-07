/**
 * @Author : MILES .
 * @Create : 2017/9/8.
 * @Module : 检验服务名称是否重复
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .directive('checkServiceName', function($http,ApplicationServer){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) {
                    return ;
                }else{
                    ApplicationServer.verifyServiceName.save({
                        serviceName: scope.vm.serviceName,
                        serviceId : scope.vm.serviceId
                    },function(data){
                        if(data.data){
                            c.$setValidity('unique', true);
                            scope.vm.allowSubmit=1;
                        }else{
                            c.$setValidity('unique', false);
                            scope.vm.allowSubmit=0;
                        }
                    },function(data){
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                    })
                }
            });
        }
    }
})} ;