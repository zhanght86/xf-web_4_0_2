/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('accessStatisticsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","$filter",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,$filter) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            dataByTimeTotalUser:"",
            pageSize : 5  ,//默认每页数量
            getChannel:getChannel,
            getDimensions:getDimensions

        };

        //左上表格数据
        function getTopLeft(){
            httpRequestPost("/api/analysis/access/queryAccessDataTopLeft",{
                "applicationId":$cookieStore.get("applicationId"),
            },function(data){
                $scope.dataTopRightToday = data.data["今天"];
                $scope.dataTopRightTom = data.data["昨天"];
                $scope.dataTopRightHis = data.data["历史最高"];
                console.log(data.data);
            },function(){


            })
        };

        //右上表格数据
        function getTopRight(){
            httpRequestPost("/api/analysis/access/queryAccessDataTopright",{
                "applicationId":$cookieStore.get("applicationId"),
            },function(data){
                $scope.dataTopLeftToday = data.data["今日"];
                $scope.dataTopLeftHis = data.data["历史"];
            },function(){

            })
        };

        getTopLeft();
        getTopRight();

        //右上表格数据
        $scope.setDate = function(date){
            $scope.startTime = "";
            $scope.endTime = "";
            //今天的时间
            var day = new Date();
            day.setTime(day.getTime());
            var s2 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
            if(date = 0){
                $scope.startTime =s2+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            if(date =1 ){
                //昨天的时间
                day.setTime(day.getTime()-24*60*60*1000);
                var s1 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s1+" 00:00:00";
                $scope.endTime = s1+" 23:59:59";
            }
            if(date = 7 ){
                //过去7天/
                day.setTime(day.getTime()-7*24*60*60*1000);
                var s3 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s3+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            if(date =30){
                //过去7天
                day.setTime(day.getTime()-30*24*60*60*1000);
                var s4 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
                $scope.startTime =s4+" 00:00:00";
                $scope.endTime = s2+" 23:59:59";
            }
            queryAccessDataByTime();

        };

        $scope.setChannel = function (channel) {
            $scope.channelId = channel;
            queryAccessDataByTime();
        }
        //访问数据时间统计
        function queryAccessDataByTime(){
            httpRequestPost("/api/analysis/access/queryAccessDataByTime",{
                "applicationId":$cookieStore.get("applicationId"),
                "startTime":$scope.startTime ,
                "endTime":$scope.endTime
            },function(data){
                console.log(data)
                console.log(data.data["有效会话数"])
                $scope.dataByTimeUser = data.data["总用户人数"];
                $scope.dataByTimeSession = data.data["总会话数"];
                $scope.dataByTimeVuser = data.data["有效会话数"];
                $scope.dataByTimeVsessiion = data.data["有效用户人数"];
            },function(){

            })
        };
        queryAccessDataByTime();


        //访问数据渠道统计
        function queryAccessDataByChannel(){
            httpRequestPost("/api/analysis/access/queryAccessDataByType",{
                "applicationId":$cookieStore.get("applicationId"),
                "startTime":$scope.startTime ,
                "endTime":$scope.endTime
            },function(data){
                $scope.dataTopRight = data.data.objs;
            },function(){

            })
        };
        queryAccessDataByChannel();

        //維度
        function getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        }

        //渠道
        function getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        };

        // //访问数据渠道统计
        // function test(){
        //     httpRequestPost("/api/analysis/access/test",{
        //         "applicationId":$cookieStore.get("applicationId"),
        //         "startTime":$scope.startTime ,
        //         "endTime":$scope.endTime
        //     },function(data){
        //         $scope.dataTopRight = data.data.objs;
        //     },function(){
        //
        //     })
        // };
        // test();

    }
]);