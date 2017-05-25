/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('functionalTestModule').controller('sessionTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore","knowledgeAddServer",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore,knowledgeAddServer) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            applicationId: $cookieStore.get("applicationId"),
            userId: $cookieStore.get("userId"),
            title:"",
            testAsking : "" ,
            listService:[],
            channel:"",
            channelList : [] ,
            listDimension:[],
            dimensionArray : [] ,
            //==============================================方法
            getService:getService,
            serviceId : "" ,
            test : test
        };
        //獲取渠道
        knowledgeAddServer.getDimensions({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                console.log( $scope.vm.applicationId) ;
                if(data.data){
                    $scope.vm.listDimension = data.data;
                }
            }, function(error) {
                layer.msg("获取维度失败，请刷新页面")
            });
        //获取维度
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channelList = data.data
                }
            }, function(error) {
                layer.msg("获取渠道失败，请刷新页面")
            });
        //页面初始化加载已发布服务
        getService();
        function getService(){
            httpRequestPost("/api/application/service/listServiceByApplicationId",{
                applicationId:$scope.vm.applicationId,
            },function(data){
                if(data.status == 10000){
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].serviceId ;
                    $scope.$apply()
                }else if(data.status == 10005) {
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
                }
            },function(){
                layer.msg("请求失败")
            })
        }

       function test(){
           if($scope.vm.serviceId){
               httpRequestPost("/api/application/service/listServiceByApplicationId",{
                   applicationId:$scope.vm.applicationId,
               },function(data){

               },function(){

               })
           }else{
               layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
           }
       }

    }
]);