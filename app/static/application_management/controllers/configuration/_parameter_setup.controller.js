/**
 * @Author : MILES .
 * @Create : 2017/9/6.
 * @Module :  参数设置 控制器
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller("ParameterSetupController",[
    '$scope', 'localStorageService' ,"ApplicationServer","$state" ,"ngDialog",'$http', "$cookieStore",
    ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore)=>{
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
            ApplicationServer.queryParameter.save({
            },function(response){
                if(response.status == 200){
                    $scope.vm.settingCommentOn = response.data.commentOn;   //评价开关
                    $scope.vm.settingGreetingOn = response.data.greetingOn;//寒暄开关

                    $scope.vm.settingRelateNumber = response.data.relateNumber;//关联问题数量

                    $scope.vm.settingRecommendNumber = response.data.recommendNumber;//推荐问题数量
                    $scope.vm.settingUpperLimit = response.data.tagUpperLimit ;//上限阈值
                    $scope.vm.settingLowerLimit = response.data.tagLowerLimit;//下限阈值
                    $scope.vm.settingGreetingThreshold = response.data.greetingUpperLimit;//寒暄阈值

                    $scope.vm.settingDataTimeoutLimit = response.data.settingDataTimeoutLimit;//获取数据时间
                    $scope.vm.settingId = response.data.id;//应用参数id
                    $scope.vm.settingTurnRoundOn = response.data.settingTurnRoundOn;//话轮识别开关

                }else{
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
                }
            },function(error){console.log(error)})
        }

        //编辑应用参数
        function updateParameter(){
            ApplicationServer.updateParameter.save({
                "id": $scope.vm.settingId,
                "commentOn": $scope.vm.settingCommentOn,
                "greetingOn": $scope.vm.settingGreetingOn,
                "relateNumber": $scope.vm.settingRelateNumber,
                "recommendNumber": $scope.vm.settingRecommendNumber,
                "tagUpperLimit": $scope.vm.settingUpperLimit,
                "tagLowerLimit": $scope.vm.settingLowerLimit,
                "greetingUpperLimit": $scope.vm.settingGreetingThreshold,

                "settingDataTimeoutLimit": $scope.vm.settingDataTimeoutLimit,
                "settingTurnRoundOn": $scope.vm.settingTurnRoundOn,
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
}])} ;