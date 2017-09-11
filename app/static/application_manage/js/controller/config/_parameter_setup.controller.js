/**
 * @Author : MILES .
 * @Create : 2017/9/6.
 * @Module :  参数设置 控制器
 */
angular.module("myApplicationSettingModule").controller("parameterSetupController",[
    '$scope', 'localStorageService' ,"configurationServer","$state" ,"ngDialog",'$http', "$cookieStore",
    function($scope,localStorageService, configurationServer ,$state,ngDialog,$http,$cookieStore){
        $scope.vm = {
            settingCommentOn : 1,   //评价开关
            settingDataTimeoutLimit : "",//获取数据时间
            settingGreetingOn : 1,//寒暄开关
            settingGreetingThreshold : "",//寒暄阈值
            settingId : "",//应用参数id
            settingLowerLimit : "",//下限阈值
            settingRecommendNumber : "",//推荐问题数量
            settingRelateNumber : "",//关联问题数量
            settingTurnRoundOn : 1,//话轮识别开关
            settingUpperLimit : "",//上限阈值
            updateParameter : updateParameter,  //更新应用参数
            queryParameter : queryParameter, //查询应用参数
            turnOn : turnOn,//开关函数
            parameterLimit : parameterLimit
        };
        function parameterLimit(type,val){
            // type 0   lt1
            //type 1    0-1
            if(type){
                if($scope.vm[val]<1){
                    $scope.vm[val] = 1 ;
                }
            }else{
                if($scope.vm[val]>1 ){
                    $scope.vm[val] = 1
                }else if($scope.vm[val]<0){
                    $scope.vm[val] = 0
                }
            }
        }
        //查看应用参数设置
        queryParameter();
        //查看机器人参数
        function queryParameter(){
            configurationServer.queryParameter.save({
                "applicationId": APPLICATION_ID
            },function(data){
                if(data.data===10005){
                    $scope.vm.settingCommentOn = 1;   //评价开关
                    $scope.vm.settingDataTimeoutLimit = "";//获取数据时间
                    $scope.vm.settingGreetingOn = 1;//寒暄开关
                    $scope.vm.settingGreetingThreshold = "";//寒暄阈值
                    $scope.vm.settingId = "";//应用参数id
                    $scope.vm.settingLowerLimit = "";//下限阈值
                    $scope.vm.settingRecommendNumber = "";//推荐问题数量
                    $scope.vm.settingRelateNumber = "";//关联问题数量
                    $scope.vm.settingTurnRoundOn = 1;//话轮识别开关
                    $scope.vm.settingUpperLimit = "";//上限阈值
                }else{
                    $scope.vm.settingCommentOn = data.data.settingCommentOn;   //评价开关
                    $scope.vm.settingDataTimeoutLimit = data.data.settingDataTimeoutLimit;//获取数据时间
                    $scope.vm.settingGreetingOn = data.data.settingGreetingOn;//寒暄开关
                    $scope.vm.settingGreetingThreshold = data.data.settingGreetingThreshold;//寒暄阈值
                    $scope.vm.settingId = data.data.settingId;//应用参数id
                    $scope.vm.settingLowerLimit = data.data.settingLowerLimit;//下限阈值
                    $scope.vm.settingRecommendNumber = data.data.settingRecommendNumber;//推荐问题数量
                    $scope.vm.settingRelateNumber = data.data.settingRelateNumber;//关联问题数量
                    $scope.vm.settingTurnRoundOn = data.data.settingTurnRoundOn;//话轮识别开关
                    $scope.vm.settingUpperLimit = data.data.settingUpperLimit ;//上限阈值
                }
            },function(error){console.log(error)})
        }

        //编辑应用参数
        function updateParameter(){
            configurationServer.updateParameter.save({
                "applicationId": APPLICATION_ID,
                "settingCommentOn": $scope.vm.settingCommentOn,
                "settingDataTimeoutLimit": $scope.vm.settingDataTimeoutLimit,
                "settingGreetingOn": $scope.vm.settingGreetingOn,
                "settingGreetingThreshold": $scope.vm.settingGreetingThreshold,
                "settingId": $scope.vm.settingId,
                "settingLowerLimit": $scope.vm.settingLowerLimit,
                "settingRecommendNumber": $scope.vm.settingRecommendNumber,
                "settingRelateNumber": $scope.vm.settingRelateNumber,
                "settingTurnRoundOn": $scope.vm.settingTurnRoundOn,
                "settingUpdateId": USER_ID,
                "settingUpperLimit": $scope.vm.settingUpperLimit
            },function(data){
                if(data.status===200){
                    layer.msg("保存成功");
                }else{
                    layer.msg("保存失敗");
                }
            },function(error){console.log(error)}) ;
        }
        //开关
        function turnOn(targetValue,targetName){
            $scope.vm[targetName] = targetValue ? 0 : 1 ;
        }
}]) ;