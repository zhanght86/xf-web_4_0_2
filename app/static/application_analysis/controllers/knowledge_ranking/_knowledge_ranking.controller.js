/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=applAnalysisModule => {
    applAnalysisModule
    .controller('knowledgeRankingController', 
        ['$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore","$filter","$window","$location",
         ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore,$filter,$window,$location)=>{
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
           // applicationId :APPLICATION_ID,
            getList : getList ,
            getKnowledgeList:getKnowledgeList,
            listData : null ,
            listDataK:null,// table 数据 
            dimensions : [] ,
            channels : [] ,
            channelId  : 130 ,
           // dimensionId : null ,
            timeType : 1,
            timeStart : null,
            timeEnd : null,
            timeList : [],
            total : null,
            talkDetail : null,
            talkDetailTotal : 0,
            userId : null,
            exportKnowledgeExcel : exportKnowledgeExcel,  //导出知识点排名统计
            exportNoMatchExcel : exportNoMatchExcel, //未匹配问题导出
            contentType:0,
            paginationConf: {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : getKnowledgeList,
                location : true
            },
             paginationConf1:{     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : getList,
                location : true
            },
            
        };

        /**
         * 未匹配問題
         */
        function getList(index,pageSize,reset){            
            getKnowledgeList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize); 
             if(reset){
                $scope.vm.paginationConf1.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.getList.save({
                 "channelId": $scope.vm.channelId==130?null:$scope.vm.channelId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf1.pageSize,
                "pageSize": $scope.vm.paginationConf1.pageSize,
                "sort":1,
            },function(data){
                 layer.close(i);
                  if(data.status==200){
                    $scope.vm.listData = data.data.objs;
                    $scope.vm.paginationConf1.totalItems = data.data.total;
                    $scope.vm.paginationConf1.numberOfPages = data.data.total/$scope.vm.paginationConf1.pageSize;
                    if(data.data.objs==null){
                      layer.msg(data.info)
                    }
               }else{
                   layer.close(i);
               }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 知識點排名
         */
       
        function getKnowledgeList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.getKnowledgeList.save({
                "channelId": $scope.vm.channelId==130?null:$scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
                "sort":1,
            },function(data){
                layer.close(i);
                 if(data.status==200){
                    $scope.vm.listDataK = data.data.objs;
                    $scope.vm.paginationConf.totalItems = data.data.total;
                   // $scope.vm.order=data.data.objs[0].order;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
                    if(data.data.objs==null){
                      layer.msg(data.info)
                    }
               }else{
                   layer.close(i);
               }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }

        /**
         * 初始化
         */
        init();
        function init(){
            //getDimensions();
            getKnowledgeList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize)
            getList($scope.vm.paginationConf1.currentPage,$scope.vm.paginationConf1.pageSize);
        }

        /**
         **知识点排名导出表格；
         */
        function exportKnowledgeExcel(){            
            AppAnalysisServer.exportKnowledgeExcel.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
              //  "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                console.log(data);
                if(data.status==500){                    
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                   // window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                     var url = AppAnalysisServer.exportKnowledgeExcelUrl + data.data;
                     downLoadFiles($('.knowledgeRanking')[0],url);

                }
                console.log();
            },function(err){
                $log.log(err);
            });
        }
        /**
        *未匹配问题统计导出表格；
        **/
        function exportNoMatchExcel(){
            AppAnalysisServer.exportNoMatchExcel.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
               // "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": 0,
                "pageSize": 10
            },function(data){
                console.log(data);
                if(data.status==500){
                    //layer.msg("导出失败")
                    console.log("导出失败");
                }else{
                    //alert(data.data);
                    //window.open("/api/analysis/download/downloadExcel?fileName="+ data.data);
                    var url = AppAnalysisServer.exportNoMatchExcelUrl+data.data;
                    downLoadFiles($('.noMatch')[0],url);

                }
                console.log();

            },function(err){
                $log.log(err);
            });

        }
    }
])};