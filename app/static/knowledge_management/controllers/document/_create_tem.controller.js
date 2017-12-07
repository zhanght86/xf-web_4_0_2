/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  文档加工 -- 模板配置
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('CreateTemController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog", "TemplateService","localStorageService","$state","TipService",
    ($scope, $location, $stateParams, $interval, $timeout, ngDialog, TemplateService,localStorageService,$state,TipService) =>{
        $scope.vm = {
            "temName" :  "" ,    //模板名称
            "temType" : "WORD"  , //模板类型
            "temNameChecked" : false , //模板名称校验
            "fileName" : "未选择文件" ,  //上传文件名称
            "isTempUpToolsShow" : $stateParams.temId ? false : true  , //上传 按钮显示
            "progress" : 0 ,        // 上传进度
            "templateId" : $stateParams.temId ?$stateParams.temId : "" , //模板id
            "rules" : "" , //所有规则
            "addRule" : addRule , //添加规则
            "deleteRule" : deleteRule , //删除已添加规则
            "resetRule" : resetRule ,//取消添加的规则

        } ;
        //通过id 获取模板
        function queryTemplateById(){
            TemplateService.queryTemplateById.save({
                "index":0,
                "pageSize":1,
                "templateId":$scope.vm.templateId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    $scope.vm.temName = resource.data.objs[0].templateName;
                    //$scope.rules = resource.data.rules;
                    var filePath = resource.data.objs[0].templateUrl;
                    var filename=filePath.substring(filePath.lastIndexOf("//")+2,filePath.length);
                    $scope.vm.fileName = filename;
                }
            })
        }
        //获取规则
        function queryRules(){
            TemplateService.queryRules.save({
                "templateId":$scope.vm.templateId
            },function(resource){
                if(resource.status == 200 && resource.data){
                    $scope.vm.rules = resource.data.objs;
                }
            })
        } ;
        //添加规则
        function addRule(){
            if($scope.vm.rules){
                if($scope.vm.rules.length == 0)//判断是否存在模板规则
                {
                    $scope.vm.rules.push({
                        level:0
                    });
                }
                else{
                    $scope.vm.rules.push({
                        level:$scope.vm.rules[$scope.vm.rules.length-1].level+1
                    });
                }
                $('.proce_result ').trigger('click');
            }else{
                 layer.msg("请先上传模板或选定模板");
            }
        } ;
        //删除已添加规则
        function deleteRule(ruleId){
            if(!ruleId){
                return;
            }
            TemplateService.deleteRule.save({
                "ruleId":ruleId
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    queryRules();//重新查询规则
                }else{
                    TipService.setMessage('删除失败!',"err");
                }
            })
        };
        // 取消添加的规则
        function resetRule(index){
            var rule = $scope.vm.rules[index];
            if(rule && !rule.id){
                $scope.vm.rules.splice(index,1)
            }
        }
        // 监听templateId
        //For  创建模板 OR  模板添加规则
        var timeout;
        $scope.$watch('vm.templateId', function (temId) {
            if(temId){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    $scope.vm.isTempUpToolsShow = false;//隐藏保持相关按钮
                    queryTemplateById();
                    queryRules();
                }, 350)
            }
        }, true) ;
        // templateName
        //For  监测模板名字 是否 符合
        var timeout2;
        $scope.$watch('vm.temName', function (temName) {
            if(temName && temName != ""){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    TemplateService.checkTemName.save({
                        templateName: $scope.vm.temName
                    },function(resource){
                        if(resource.status == 200 && resource.data.objs.length == 0){
                            $scope.vm.temNameChecked = true;
                        }else{
                            $scope.vm.temNameChecked = false;
                        }
                    })
                }, 350)
            }
        }, true) ;
        //修改保存
        $scope.backT = function(){
            history.back();
        };
    }
])};