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
            listDimensionUpBack : "",
            dimensionArray : [] ,
            //==============================================方法
            getService:getService,
            serviceId : "" ,
            test : test,
            reset : reset,
            result:'',
            question : '',
            txtFocus : txtFocus
        };

        //獲取维度
        knowledgeAddServer.getDimensions({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                console.log( $scope.vm.applicationId) ;
                if(data.data){
                    console.log(data.data);
                    $scope.vm.listDimension = data.data;
                    $scope.vm.listDimensionUpBack = {"id":[],"name":[]} ;
                    angular.forEach(data.data,function(item){
                        $scope.vm.listDimensionUpBack.id.push(item.dimensionId) ;
                        $scope.vm.listDimensionUpBack.name.push(item.dimensionName)
                    }) ;
                }
            }, function(error) {
                console.log(error);
                //layer.msg("获取维度失败，请刷新页面");
            });
        //获取渠道
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channelList = data.data;
                    $scope.vm.channel=data.data[0].channelCode ;        //初始化渠道为第一个选项；
                }
            }, function(error) {
                console.log(error);
                //layer.msg("获取渠道失败，请刷新页面");
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
                    $scope.$apply();
                }else if(data.status == 10005) {
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
                }
            },function(){
                //layer.msg("请求失败");
                console.log('请求请求失败');
            })
        }
        //
       function test(){
           if($scope.vm.serviceId){
               if($scope.vm.testAsking==''){
                   layer.msg('请输入测试问题!',{time:1000});
                   return ;
               }
               if($scope.vm.channel==''){
                   layer.msg('请选择渠道!',{time:1000});
                   return;
               }
               httpRequestPost("/api/application/chatTest/passageway",{
                   applicationId:$scope.vm.applicationId,
                   userId:$scope.vm.userId,
                   content:$scope.vm.testAsking,
                   channel:$scope.vm.channel,
                   dimensionArray:$scope.vm.dimensionArray,
                   serviceId:$scope.vm.serviceId
                   //serviceId:22
               },function(data){
                   console.log(data);
                   if(data.data.status == 500){
                       layer.msg(data.data.data,{time:1000});
                   }
                   $scope.vm.result=data.data.data;
                   $scope.vm.question= $scope.vm.testAsking;

                   $scope.$apply();

               },function(){

               })
           }else{
               layer.msg("当前应用下没有发布服务，请发布服务后进行测试",{time:1000});
           }
       }

        //重置
        function reset(){
            $scope.vm.testAsking='';
            $scope.vm.question='';
            $scope.vm.result='';

            $scope.vm.channel= $scope.vm.channelList[0].channelCode ;
            $scope.vm.listDimension =  angular.copy($scope.vm.listDimensionUpBack) ;
            $scope.vm.dimensionArray =  {"id":[],"name":[]};
            console.log($scope.vm.listDimension);
        }
        //文本域自动获取焦点；
        function txtFocus(){
            $('.chat_text_txta').focus();
        }
        txtFocus();

    }
]);