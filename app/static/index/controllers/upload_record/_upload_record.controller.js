/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=homePageModule => {homePageModule
    .controller('uploadRecordController', 
        ['$scope',"localStorageService","$state","$log","HomePageServer","$timeout","$stateParams","ngDialog","$cookieStore",
       ($scope,localStorageService,$state,$log,HomePageServer, $timeout,$stateParams,ngDialog,$cookieStore) => {
        $scope.vm = {
	    	  paginationConf : {           //分页条件
	                pageSize: 5,        //每页条目数量
	                pagesLength: 10,    //分页块数量
	          } ,//分页条件
              total:"",             //分页总条数   
              modifierName:"",      //操作名称
              startTime:"",         //开始时间
              endTime:"",           //结束时间
              uploadList:"",        //数据列表
              getList:getList       //表格列表    
        };

        /**
         * 表格列表
         */
         getList(1);
        function getList(index){
            let i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            HomePageServer.uploadRecord.save({
                "applicationId" : "3453535",
                "modifierName":$scope.vm.modifierName,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.endTime,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
            },(data) => {
			         	console.log(data)
                layer.close(i);
                if(data.status==200){
                  if(data.data==null){
                     $scope.vm.uploadList="";
                    $scope.vm.total="";
                  }else{
                    $scope.vm.uploadList=data.data.objs;
                    $scope.vm.total=data.data.total;
                  }
                    
                }
            },(err) => {
                layer.close(i);
                $log.log(err);
            });
        }

         /**
         * 分页变化加载数据
         **/
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage',(current,old)=>{
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(()=>{
                    getList(current);
                }, 100)

            }
        },true);

 }])};