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
        $scope.parameter = {
            id                 : "",                //应用参数id
            commentOn          : 1,                 //评价开关
            greetingOn         : 1,                 //寒暄开关
            recommendNumber    : "",                //推荐问题数量
            greetingUpperLimit : "",                //寒暄阈值
            tagUpperLimit      : "",	            //上限阈值
            tagLowerLimit      : "",	            //下限阈值
            upperLimit         : ""	,               //深度学习上限阈值
            lowerLimit         : "",	            //深度学习下限阈值
        } ;
        // 寒暄
        $('.slider-input-greeting').jRange({
            from: 0,
            to: 1,
            step: 0.01,
            scale: [0,0.2,0.4,0.6,0.8,1],
            format: '%s',
            width: 348,
            showLabels: true,
            theme : "theme-blue-deep",
            isRange : true,
            onstatechange : function(val){
                val = val.split(",") ;
                $scope.parameter.lowerLimit = val[0] ;
                $scope.parameter.upperLimit = val[1] ;
            }
        });
        // 标签
        $('.slider-input-tag').jRange({
            from: 0,
            to: 1,
            step: 0.01,
            scale: [0,0.2,0.4,0.6,0.8,1],
            format: '%s',
            width: 348,
            showLabels: true,
            theme : "theme-blue-deep",
            isRange : true,
            onstatechange : function(val){
                val = val.split(",") ;
                $scope.parameter.tagLowerLimit = val[0] ;
                $scope.parameter.tagUpperLimit = val[1] ;
            }
        });
        $scope.vm = {
            updateParameter    : updateParameter,   //更新应用参数
            queryParameter     : queryParameter,    //查询应用参数
            turnOn             : turnOn,            //开关函数
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
                    valuation(response.data) ;
                }else{
                }
            },function(error){console.log(error)})
        }
        //编辑应用参数
        function updateParameter(){
            ApplicationServer.updateParameter.save($scope.parameter,function(data){
                if(data.status===200){
                    layer.msg("保存成功");
                }else{
                    layer.msg("保存失敗");
                }
            },function(error){console.log(error)}) ;
        }
        // 参数赋值
        function valuation(data){
            for(let key in $scope.parameter){
                if(data){
                    $scope.parameter[key] = data[key]
                }else{
                    $scope.parameter[key] = "" ;
                }
            }
            let greeting = [];
            let tag  = [] ;
            greeting.push(data.lowerLimit,data.upperLimit) ;
            tag.push(data.tagLowerLimit,data.tagUpperLimit);
            console.log(greeting,tag) ;
            $('.slider-input-greeting').jRange('setValue',greeting.join(","));
            $('.slider-input-tag').jRange('setValue',tag.join(",") )

        }
        //开关
        function turnOn(targetValue,targetName){
            $scope.parameter[targetName] = targetValue ? 0 : 1 ;
        }
}])} ;