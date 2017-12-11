/**
 * @Author : MILES .
 * @Create : 2017/12/11.
 * @Module :  服务监控
 */
module.exports = systemMonitoringModule =>{
    systemMonitoringModule
    .controller("SystemMonitoringController",
    ["$location","$scope","SystemMonitoringServer",
    ($location,$scope,SystemMonitoringServer)=>{
        let currentPath = $location.path() ;
        SystemMonitoringServer.userLogin.save({
            "name" : "root",
            "password" : "root"
        },function(response){
        }).$promise.then(function(){
            if(currentPath == "/SM/service"){
                $scope.sourceSrc = "http://192.168.181.166:8081/screen/18" ;
            }else if("/SM/resource"){
                $scope.sourceSrc = "http://192.168.181.166:8081/screen/20" ;
            }
        },function(){
            console.log("失敗")
        }) ;
        console.log(currentPath) ;
        if(currentPath == "/SM/service"){
            $scope.sourceSrc = "http://192.168.181.166:8081/screen/18" ;
        }else if("/SM/resource"){
            $scope.sourceSrc = "http://192.168.181.166:8081/screen/20" ;
        }
    }])
} ;