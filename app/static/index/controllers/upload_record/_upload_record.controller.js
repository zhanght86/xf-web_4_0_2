/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=homePageModule => {homePageModule
    .controller('uploadRecordController', 
        ['$scope',"localStorageService","$state","$log","HomePageServer","$timeout","$stateParams","ngDialog","$cookieStore","$location",
       ($scope,localStorageService,$state,$log,HomePageServer, $timeout,$stateParams,ngDialog,$cookieStore,$location) => {
        $scope.vm = {
	    	   paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : getList,
                location : true
            },
              modifierName:"",      //操作名称
              startTime:"",         //开始时间
              endTime:"",           //结束时间
              uploadList:"",        //数据列表
              getList:getList,       //表格列表    
             // recordDownload:recordDownload  //文档下载
        };

        /**
         * 表格列表
         */
         getList(1);
          function getList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
           if($scope.vm.startTime==""&&$scope.vm.endTime!=""){
              layer.msg("请输入开始时间")
           }else{
              let i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
              HomePageServer.uploadRecord.save({
                  "modifierName":$scope.vm.modifierName,
                  "startTime": $scope.vm.startTime,
                  "endTime": $scope.vm.endTime,
                  "index": (index-1)*$scope.vm.paginationConf.pageSize,
                  "pageSize": $scope.vm.paginationConf.pageSize,
              },(data) => {
                  console.log(data)
                  layer.close(i);
                   if(data.status==200){
                    if(data.data.data!=null){ 
                     $scope.vm.uploadList = data.data.data;
                     $scope.vm.paginationConf.totalItems = data.data.total;
                     $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
                    }else{
                        $scope.vm.uploadList=[];
                         $scope.vm.paginationConf.totalItems = 0;
                        $scope.vm.paginationConf.numberOfPages = 0;
                        layer.msg(data.info)
                    }
               }else{
                   layer.close(i);
               }
              },(err) => {
                  layer.close(i);
                  $log.log(err);
              });
           }
            
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