/**
 * Created by 41212 on 2017/3/23.
 */

module.exports=functionalTestModule => {
    functionalTestModule
    .controller('SessionTestController', [
    '$scope',"localStorageService","$log","FunctionServer","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    ($scope,localStorageService,$log,FunctionServer,$state, $timeout,$stateParams,ngDialog,$cookieStore)=>{
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            title:"",
            testAsking : "" ,
            listService:[],
            channel:"",
            channelList : [] ,
           // listDimension:[],
            listDimensionUpBack : "",
           // dimensionArray : [] ,
            //==============================================方法
           // getService:getService,
            serviceId : "" ,
            test : test,
            reset : reset,
            result:'',
            question : '',
            txtFocus : txtFocus
        };

        /*****************
         * //页面初始化加载已发布服务
         * *****************/
        //getService();
        // function getService(){
        //     FunctionServer.getService.save({
        //         applicationId:APPLICATION_ID,
        //     },function(data){
        //         if(data.status == 10000){
        //             $scope.vm.listService = data.data;
        //             $scope.vm.serviceId = data.data[0].serviceId ;
        //
        //         }else if(data.status == 10005) {
        //             //layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
        //         }
        //     },function(err){
        //         $log.log('请求请求失败');
        //     });
        // }

        /*****************
         *  //开始测试
         * *****************/
       function test(){
          // if($scope.vm.serviceId){
               if($scope.vm.testAsking==''){
                   layer.msg('请输入测试问题!',{time:1000});
                   return ;
               }
               if($scope.vm.channel==''){
                   layer.msg('请选择渠道!',{time:1000});
                   return;
               }
               var i = layer.msg("资源加载中...",{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
               FunctionServer.sessioonTest.save({
                   applicationId:APPLICATION_ID,
                   userId:USER_ID,
                   content:$scope.vm.testAsking,
                   channel:$scope.vm.channel,
                  // dimensionArray:$scope.vm.dimensionArray,
                   serviceId:$scope.vm.serviceId
                   //serviceId:22
               },function(data){
                   layer.close(i);
                   console.log(data);
                   if(data.data.status == 500){
                       layer.msg(data.data.data,{time:1000});
                   }
                   $scope.vm.result=data.data.data;
                   $scope.vm.question= $scope.vm.testAsking;
               },function(err){
                   layer.close(i);
                   $log.log(err);
               });
         //  }else{
          //     layer.msg("当前应用下没有发布服务，请发布服务后进行测试",{time:1000});
          // }
       }

        /*****************
         *  //重置
         * *****************/
        function reset(){
            $scope.vm.testAsking='';
            $scope.vm.question='';
            $scope.vm.result='';

            $scope.vm.channel= $scope.$parent.$parent.MASTER.channelList[0].channelCode ;
            ////$scope.vm.listDimension =  angular.copy($scope.vm.listDimensionUpBack) ;
            //$scope.vm.dimensionArray =  {"id":[],"name":[]};
            //console.log($scope.vm.listDimension);
        }

        /*****************
         *  //文本域自动获取焦点；
         * *****************/
        function txtFocus(){
            $('.chat_text_txta').focus();
        }
        txtFocus();

    }
    ])};