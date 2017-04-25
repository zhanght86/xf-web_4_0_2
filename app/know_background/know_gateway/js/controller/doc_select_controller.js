/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('docSelectController', [
    '$scope', '$location', "$stateParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","localStorageService","$state","$sce",
    function ($scope, $location, $stateParams, $interval, $timeout, ngDialog,
              TemplateService,localStorageService,$state,$sce) {
        var self = this;

        $scope.checkedRule = {};
        $scope.temId = $stateParams.temId;
        $scope.level = $stateParams.level;
        $scope.roleId = $stateParams.roleId;
        $scope.showExtract = false;
        $scope.checkModel = 1;
        
        $scope.queryRole = function(){
            TemplateService.queryRuleById.save({
                ruleId: $scope.roleId
            },function(re){
                if(re.status == 200){
                    var data = re.data;
                    $scope.titleText = data.inputText
                    $scope.extractRegTxt = data.extractReg
                    $scope.checkModel = data.model
                    $scope.returnRole = data;
                    $scope.generateRule();
                }
            })
        }

        $scope.queryTemplateContent = function () {
            TemplateService.queryTemplateContent.save({
                "index": 0,
                "pageSize": 1,
               "templateId": $scope.temId
            },function(re){
                if(re.status == 200){
                    if($scope.notEmpty(re.data) && re.data.length > 0){
                       var  queryTemContent =  $sce.trustAsHtml(re.data);
                        $scope.queryTemContent = queryTemContent;
                    }
                }
            })
        }

        $scope.generateRule = function(){
            if(!$scope.titleText || $scope.titleText == ''){
                alert("请填写匹配标题");
                return;
            }
            TemplateService.generateRule.save({
                "templateId":$scope.temId,
                "level":$scope.level,
                "text":$scope.titleText
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.rules = re.data.objs;
                        for(var i=0;i<$scope.rules.length;i++){
                            var rule = $scope.rules[i]
                            if($scope.returnRole && $scope.returnRole.firstLineIndent==rule.firstLineIndent && $scope.returnRole.fontAlignment == rule.fontAlignment && $scope.returnRole.selectText == rule.lineWord){
                                $scope.checkedRuleIndex = i;
                            }
                        }
                        $scope.getSimilarText();
                    }
                }
            })
        }

        $scope.getSimilarText = function(){
            if($scope.rules != undefined && $scope.checkedRuleIndex != undefined && $scope.rules[$scope.checkedRuleIndex] != undefined){
                $scope.checkedRule = $scope.rules[$scope.checkedRuleIndex];
            }else{
                $scope.checkedRule = undefined;
            }

            if(!$scope.checkedRule || $scope.checkedRule == ''){
                alert("请选择匹配标题");
                return;
            }
            //console.log($scope.checkedRule)
            TemplateService.getSimilarText.save({
                "lineWord":$scope.checkedRule.lineWord,
                "firstLineIndent":$scope.checkedRule.firstLineIndent,
                "fontAlignment":$scope.checkedRule.fontAlignment,
                "level":$scope.checkedRule.level,
                "model":$scope.checkedRule.model,
                "numFmt":$scope.checkedRule.numFmt,
                "numLevelText":$scope.checkedRule.numLevelText,
                "style":$scope.checkedRule.style,
                "templateId":$scope.checkedRule.templateId
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.strs = re.data.objs;
                        if($scope.extractRegTxt != null && $scope.extractRegTxt != '')
                            $scope.optimizeText();
                    }else{
                        alert("未能抽取到匹配内容");
                    }
                }
            })
        }
        $scope.optimizeText = function(){
            if(!$scope.strs || $scope.strs.length <= 0){
                alert("没有匹配的标题");
                return;
            }
            if(!$scope.extractRegTxt || $scope.extractRegTxt == ''){
                alert("请输入正则表达式");
                return;
            }
            TemplateService.optimizeText.save({
                "regexRule":$scope.extractRegTxt,
                "texts":$scope.strs
            },function(re){
                if(re.status == 200){
                    if(re.data.objs.length > 0){
                        $scope.extractStrs = re.data;
                    }else{
                        alert("未能匹配到相应正则结果");
                    }
                }
            })
        }

        $scope.saveWordRule = function(){
            if($scope.rules != undefined && $scope.checkedRuleIndex != undefined && $scope.rules[$scope.checkedRuleIndex] != undefined){
                $scope.checkedRule = $scope.rules[$scope.checkedRuleIndex];
            }else{
                $scope.checkedRule = undefined;
            }

            if(!$scope.checkedRule){
                alert("请选择要保存的规则");
                return;
            }
            var params = {
                "lineWord":$scope.checkedRule.lineWord,
                "firstLineIndent":$scope.checkedRule.firstLineIndent,
                "fontAlignment":$scope.checkedRule.fontAlignment,
                "level":$scope.checkedRule.level,
                "model":$scope.checkModel,
                "numFmt":$scope.checkedRule.numFmt,
                "numLevelText":$scope.checkedRule.numLevelText,
                "style":$scope.checkedRule.style,
                "templateId":$scope.checkedRule.templateId,
                "extractReg":$scope.extractRegTxt,
                "inputText":$scope.titleText,
                "selectText":$scope.checkedRule.lineWord,
                "ruleId":$scope.roleId,
                "requestId":"String"
            };
            if($scope.roleId != null)
                TemplateService.updateWordRule.save(params, function(re){
                    if(re.status == 200){
                        history.back();
                    }
                });
            else
            {
                TemplateService.addWordRule.save(params, function(re){
                    if(re.status == 200){
                        history.back();
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

        $scope.checkRule = function(rule){
            if($scope.returnRole && $scope.returnRole.firstLineIndent==rule.firstLineIndent && $scope.returnRole.fontAlignment == rule.fontAlignment && $scope.returnRole.selectText == rule.lineWord){
                return true;
            }else{
                return false;
            }
        }

        $scope.queryTemplateContent();
        if($scope.roleId != null && $scope.roleId != ""){
            $scope.queryRole();
        }
        
    }
])