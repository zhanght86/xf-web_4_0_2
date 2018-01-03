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
            //title:"",
            testAsking : "" ,
            listService:[],
            channel:'',
            selectChannel : selectChannel,
            //channel:"",
            //channelList : [] ,

           // listDimension:[],
           // listDimensionUpBack : "",
           // dimensionArray : [] ,
            //==============================================方法
            getService:getService,
            serviceId : "" ,
            test : test,
            reset : reset,
            result:'',
            question : '',
            txtFocus : txtFocus,
            time : new Date().getTime(),      //用户编号(每次页面刷新生成一个id传到后台)

        };
        /**
         * 选择渠道
         */
        function selectChannel(channelCode){
            $scope.vm.channel=channelCode;
        }


        /*****************
         * //页面初始化加载已发布服务
         * *****************/
        getService();
        function getService(){
            FunctionServer.getService.save({
                //applicationId:APPLICATION_ID,
            },function(data){
                if(data.status == 200){
                    console.log(data);
                    $scope.vm.listService = data.data;
                    $scope.vm.serviceId = data.data[0].id;
                }else if(data.status==500){
                    //layer.msg("当前应用下没有发布服务，请发布服务后进行测试")
                }
            },function(err){
                $log.log('请求请求失败');
            });
        }

        /*****************
         *  //开始测试
         * *****************/
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
               var i = layer.msg("资源加载中...",{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
               FunctionServer.sessioonTest.save({
                 //applicationId:APPLICATION_ID,
                   userId:$scope.vm.time,
                   content:$scope.vm.testAsking,
                   channel:$scope.vm.channel,
                   serviceId:$scope.vm.serviceId,
                   // dimensionArray:$scope.vm.dimensionArray,
                   //serviceId:22
               },function(data){
                   layer.close(i);
                   if(data.status==200){
                       console.log(data);
                       $scope.vm.result=data.data.data;
                       //$scope.vm.question= $scope.vm.testAsking;
                   }
                   if(data.status == 500){
                       layer.msg(data.info,{time:1000});
                   }

               },function(err){
                   layer.close(i);
                   $log.log(err);
               });
          }else{
              layer.msg("当前应用下没有发布服务，请发布服务后进行测试",{time:1000});
          }
       }

        /*****************
         *  //重置
         * *****************/
        function reset(){
            $scope.vm.testAsking='';
            $scope.vm.question='';
            $scope.vm.result='';

            //$scope.vm.channel= $scope.$parent.$parent.MASTER.channelList[0].channelCode ;
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