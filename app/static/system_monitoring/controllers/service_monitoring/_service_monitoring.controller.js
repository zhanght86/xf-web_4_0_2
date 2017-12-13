/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

angular.module('systemMonitoring').controller('serviceMonitoringController', [
    '$scope',"$state","SystemServer","$log", "$cookieStore","$interval","$window","$location",
    function ($scope,$state,SystemServer,$log,$cookieStore,$interval,$window,$location) {
        //$state.go("systemMonitoring.resource");
        $scope.vm = {
            getServiceDate : getServiceDate,
            name : '',
            ip: '',
            responseStatus:'',
            result:[],
            refresh : refresh

        };
        getServiceDate();
        /**
        *** 获取
        **/
        function getServiceDate(){
            //var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            SystemServer.getServiceDate.save({

            },function(data){
                //layer.close(i);
                console.log(data);
                if(data.status==10014){
                    $scope.vm.result=data.data;
                    console.log(data.data.length);

                }
            },function(err){
                //layer.close(i);
                console.log(err);
            });
        }

        function refresh(){
            //window.location.reload();
            getServiceDate();
        }
        var timer = $interval($scope.vm.refresh,3000);



       


    }
]);