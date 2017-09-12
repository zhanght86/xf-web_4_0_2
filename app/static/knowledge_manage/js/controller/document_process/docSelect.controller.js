/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('docSelectController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","localStorageService","$state","$sce","$cookieStore",
    function ($scope, $location, $stateParams, $interval, $timeout, ngDialog,
              TemplateService,localStorageService,$state,$sce,$cookieStore) {
        $scope.vm = {
            "roleId" :  $stateParams.roleId ,    //规则ID
            "temId" : $stateParams.temId  , //模板ID
            "level" : $stateParams.level , //目录等级

            "checkModel" : 1 ,  //

            "checkedRule" : {} ,        //

            "queryRole" : queryRole , //获取规则
            "queryTemplateContent" : queryTemplateContent , //获取模板样例
            "queryTemContent" : "",  // 模板样例

            "titleText" : "" ,
            "returnRole" : "" ,
            "extractRegTxt" : "",   //*remove*正则描述
            "checkedRuleIndex" : 0 ,

            "getSimilarText" : getSimilarText  ,// 根据标题获取相关规则
            "strs" : "" , //获取的相关内容
            "saveWordRule" : saveWordRule , // 保存规则
            "rules" : "" ,
            "generateRule" : generateRule //标题测试
        } ;
        //获取规则
        function queryRole(){
            TemplateService.queryRuleById.save({
                ruleId: $scope.vm.roleId
            },function(re){
                if(re.status == 200){
                    var data = re.data;
                    $scope.vm.titleText = data.inputText ;
                    $scope.vm.extractRegTxt = data.extractReg ;
                    $scope.vm.checkModel = data.model ;
                    $scope.vm.returnRole = data;
                    generateRule();
                }
            })
        }
        //获取模板样例
         function queryTemplateContent() {
            TemplateService.queryTemplateContent.save({
                "index": 0,
                "pageSize": 1,
                "templateId": $scope.vm.temId
            },function(re){
                if(re.status == 200){
                    if($scope.notEmpty(re.data) && re.data.length > 0){
                        $scope.vm.queryTemContent = $sce.trustAsHtml(re.data);
                    }
                }
            })
        }

       function generateRule(){
           console.log($scope.vm.titleText)
            if(!$scope.vm.titleText || $scope.vm.titleText == ''){
                 layer.msg("请填写匹配标题");
                return;
            }
            TemplateService.generateRule.save({
                "templateId":$scope.vm.temId,
                "level":$scope.vm.level,
                "text":$scope.vm.titleText
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.vm.rules = re.data.objs;
                        for(var i=0;i<$scope.vm.rules.length;i++){
                            var rule = $scope.vm.rules[i] ;
                            if($scope.vm.returnRole && $scope.vm.returnRole.firstLineIndent==rule.firstLineIndent && $scope.vm.returnRole.fontAlignment == rule.fontAlignment && $scope.vm.returnRole.selectText == rule.lineWord){
                                $scope.vm.checkedRuleIndex = i;
                            }
                        }
                        getSimilarText();
                    }
                }
            })
        }
        //根据标题获取相关规则
       function getSimilarText(){
           console.log()
            if($scope.vm.rules != undefined && $scope.vm.checkedRuleIndex != undefined && $scope.vm.rules[$scope.vm.checkedRuleIndex] != undefined){
                $scope.vm.checkedRule = $scope.vm.rules[$scope.vm.checkedRuleIndex];
            }else{
                $scope.vm.checkedRule = undefined;
            }

            if(!$scope.vm.checkedRule || $scope.vm.checkedRule == ''){
                 layer.msg("请选择匹配标题");
                return;
            }
            TemplateService.getSimilarText.save({
                "lineWord":$scope.vm.checkedRule.lineWord,
                "firstLineIndent":$scope.vm.checkedRule.firstLineIndent,
                "fontAlignment":$scope.vm.checkedRule.fontAlignment,
                "level":$scope.vm.checkedRule.level,
                "model":$scope.vm.checkedRule.model,
                "numFmt":$scope.vm.checkedRule.numFmt,
                "numLevelText":$scope.vm.checkedRule.numLevelText,
                "style":$scope.vm.checkedRule.style,
                "templateId":$scope.vm.checkedRule.templateId
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.vm.strs = re.data.objs;
                        //if($scope.vm.extractRegTxt != null && $scope.vm.extractRegTxt != '')
                        //    $scope.optimizeText();
                    }else{
                         layer.msg("未能抽取到匹配内容");
                    }
                }
            })
        } ;
       function saveWordRule(){
            if($scope.vm.rules != undefined && $scope.vm.checkedRuleIndex != undefined && $scope.vm.rules[$scope.vm.checkedRuleIndex] != undefined){
                $scope.vm.checkedRule = $scope.vm.rules[$scope.vm.checkedRuleIndex];
            }else{
                $scope.vm.checkedRule = undefined;
            }

            if(!$scope.vm.checkedRule){
                 layer.msg("请选择要保存的规则");
                return;
            }
            var params = {
                "lineWord":$scope.vm.checkedRule.lineWord,
                "firstLineIndent":$scope.vm.checkedRule.firstLineIndent,
                "fontAlignment":$scope.vm.checkedRule.fontAlignment,
                "level":$scope.vm.checkedRule.level,
                "model":$scope.vm.checkModel,
                "numFmt":$scope.vm.checkedRule.numFmt,
                "numLevelText":$scope.vm.checkedRule.numLevelText,
                "style":$scope.vm.checkedRule.style,
                "templateId":$scope.vm.checkedRule.templateId,
                "extractReg":$scope.vm.extractRegTxt,
                "inputText":$scope.vm.titleText,
                "selectText":$scope.vm.checkedRule.lineWord,
                "ruleId":$scope.vm.roleId,
                "templateCreater": USER_NAME,
                "templateUpdater": USER_NAME,
                "requestId":"String"
            };
            if($scope.vm.roleId && $scope.vm.roleId != null && $scope.vm.roleId != "")
                TemplateService.updateWordRule.save(params, function(re){
                    if(re.status == 200){
                        $state.go("back.createTemplate",{"isGo":true ,"temId":$scope.vm.temId});
                    }
                });
            else
            {
                TemplateService.addWordRule.save(params, function(re){
                    if(re.status == 200){
                        $state.go("back.createTemplate",{"isGo":true ,"temId":$scope.vm.temId});
                        //history.back();
                    }
                });
            }

        }

        // var timeout;
        // $scope.$watch('checkedRule', function (rule) {
        //     if(rule != {}){
        //         if (timeout) {
        //             $timeout.cancel(timeout)
        //         }
        //         timeout = $timeout(function () {
        //             $scope.extractRegTxt = '';
        //         }, 350)
        //     }
        // }, true)

        // $scope.showExtractReg = function(){
        //     $scope.showExtract = !$scope.showExtract;
        //     if(!$scope.showExtract){
        //         $scope.extractReg = '';
        //     }
        // }
        queryTemplateContent();
        if($scope.vm.roleId != null && $scope.vm.roleId != ""){
            queryRole();
        }


        /*
        *  文档加工正则相关
        *
        *  功能删除
        * */
        //$scope.optimizeText = function(){
        //    if(!$scope.vm.strs || $scope.vm.strs.length <= 0){
        //        layer.msg("没有匹配的标题");
        //        return;
        //    }
        //    if(!$scope.vm.extractRegTxt || $scope.vm.extractRegTxt == ''){
        //        layer.msg("请输入正则表达式");
        //        return;
        //    }
        //    TemplateService.optimizeText.save({
        //        "regexRule":$scope.vm.extractRegTxt,
        //        "texts":$scope.vm.strs
        //    },function(re){
        //        if(re.status == 200){
        //            if(re.data.objs.length > 0){
        //                $scope.extractStrs = re.data;
        //            }else{
        //                layer.msg("未能匹配到相应正则结果");
        //            }
        //        }
        //    })
        //} ;
        
    }
])