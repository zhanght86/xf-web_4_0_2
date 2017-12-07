/**
 * @Author : MILES .
 * @Create : 2017/9/8.
 * @Module : 检验节点是否合理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .directive('checkIp', function($http,ApplicationServer){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                ApplicationServer.verifyNode.save({
                    nodeAccessIp: scope.vm.nodeAccessIp,
                    nodeCode: scope.vm.nodeCode
                },function(data){
                    if(data.status==200){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                        scope.vm.errorTip=data.info;
                    }
                },function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
}).directive('checkNode', function($http,ApplicationServer){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                ApplicationServer.verifyNode.save({
                    nodeId: scope.vm.nodeId,
                    nodeAccessIp: scope.vm.nodeAccessIp,
                    nodeCode: scope.vm.nodeCode
                },function(data){
                    if(data.status==200){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                        scope.vm.errorNodeIdTip=data.info;
                    }
                },function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
})};