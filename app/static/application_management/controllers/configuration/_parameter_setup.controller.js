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
            id                 : "", //应用参数id
            commentOn          : 1,   //评价开关
            greetingOn         : 1,//寒暄开关
            recommendNumber    : "",//推荐问题数量
            greetingUpperLimit : "",//寒暄阈值
            tagUpperLimit      : "",	//	上限阈值
            tagLowerLimit      : "",	//下限阈值
            upperLimit         : ""	,//深度学习上限阈值
            lowerLimit         : "",	//深度学习下限阈值
            updateParameter    : updateParameter,  //更新应用参数
            queryParameter     : queryParameter, //查询应用参数
            turnOn             : turnOn,//开关函数
            parameterLimit     : parameterLimit
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
            ApplicationServer.queryParameter.get({
                id : APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    $scope.vm.id = response.data.id;//应用参数id
                    $scope.vm.commentOn = response.data.commentOn;   //评价开关
                    $scope.vm.greetingOn = response.data.greetingOn;//寒暄开关
                    $scope.vm.recommendNumber = response.data.recommendNumber;//推荐问题数量
                    $scope.vm.greetingUpperLimit = response.data.greetingUpperLimit;//寒暄阈值
                    $scope.vm.tagUpperLimit = response.data.tagUpperLimit ;//上限阈值
                    $scope.vm.tagLowerLimit = response.data.tagLowerLimit;//下限阈值
                    $scope.vm.upperLimit = response.data.upperLimit ;//上限阈值
                    $scope.vm.lowerLimit = response.data.lowerLimit;//下限阈值
                }else{
                }
            },function(error){console.log(error)})
        }

        //编辑应用参数
        function updateParameter(){
            ApplicationServer.updateParameter.save({
                "id": $scope.vm.id,
                "commentOn": $scope.vm.commentOn,
                "greetingOn": $scope.vm.greetingOn,
                "recommendNumber": $scope.vm.recommendNumber,
                "greetingUpperLimit" :  $scope.vm.greetingUpperLimit,//寒暄阈值
                "tagUpperLimit": $scope.vm.tagUpperLimit,
                "tagLowerLimit": $scope.vm.tagLowerLimit,
                "upperLimit": $scope.vm.upperLimit,
                "lowerLimit": $scope.vm.lowerLimit
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