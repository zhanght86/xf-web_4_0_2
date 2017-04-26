/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowGatewayModule').controller('createTemController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","localStorageService","$state","TipService",
    function ($scope, $location, $stateParams, $interval, $timeout, ngDialog,
              TemplateService,localStorageService,$state,TipService) {
        var self = this;
        $scope.temName = "";
        $scope.temType = 'WORD';
        $scope.temNameChecked = false;
        $scope.fileName = "未选择文件";
        $scope.temuptools={
            show: false
        };

        if($stateParams.isGo !=true && localStorageService.get($state.current.name)){
            $scope.temId = localStorageService.get($state.current.name);
        }else if($stateParams.temId){
            $scope.storeParams($stateParams.temId);
            $scope.temId = $stateParams.temId
            $scope.temuptools.show = false;
        }else if(!$stateParams.temId) {
            $scope.temuptools.show = true;
        }

        $scope.queryTemplateById = function(){
            TemplateService.queryTemplateById.save({
                "index":0,
                "pageSize":1,
                "templateId":$stateParams.temId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    $scope.temName = resource.data.objs[0].templateName;
                    //$scope.rules = resource.data.rules;
                    var filePath = resource.data.objs[0].templateUrl;
                    var filename=filePath.substring(filePath.lastIndexOf("//")+2,filePath.length);
                    $scope.fileName = filename;
                }
                console.log();
            })
        }
        
        $scope.queryRules = function(){
            TemplateService.queryRules.save({
                //"index":0,
                //"pageSize":1,
                "templateId":$scope.temId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    //$scope.rules = resource.data.objs.rules;
                    $scope.rules = resource.data.objs;
                }
                console.log();
            })
        }

        
        $scope.addRule = function(){
            if($scope.rules){
                if($scope.rules.length == 0)//判断是否存在模板规则
                {
                    $scope.rules.push({
                        level:0
                    });
                }
                else{
                    $scope.rules.push({
                        level:$scope.rules[$scope.rules.length-1].level+1
                    });
                }
                $('.proce_result ').trigger('click');
            }else{
                alert("请先上传模板或选定模板");
            }
        }

        $scope.deleteRule = function(ruleId){
            if(!ruleId){
                return;
            }
            TemplateService.deleteRule.save({
                "ruleId":ruleId
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryRules();//重新查询规则
                }else{
                    TipService.setMessage('删除失败!',"err");
                }
            })
        }

        $scope.resetRule = function(index){
            var rule = $scope.rules[index];
            if(rule && !rule.id){
                $scope.rules.splice(index,1)
            }
        }

        $scope.backT = function(){
            history.back();
        };

        var timeout;
        $scope.$watch('temId', function (temId) {
            if(temId){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    $scope.temuptools.show = false;//隐藏保持相关按钮
                    $scope.queryTemplateById();
                    $scope.queryRules();
                }, 350)
            }
        }, true)

        var timeout2;
        $scope.$watch('temName', function (temName) {
            if(temName && temName != ""){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    TemplateService.checkTemName.save({
                        templateName: $scope.temName,
                    },function(resource){
                        if(resource.status == 200 && resource.data.objs.length == 0){
                            $scope.temNameChecked = true;
                        }else{
                            $scope.temNameChecked = false;
                        }
                    })
                }, 350)
            }
        }, true)
    }
])