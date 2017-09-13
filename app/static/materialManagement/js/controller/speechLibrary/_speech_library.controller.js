/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */ 
angular.module('materialManagement').controller('speechLibraryController', [
    '$scope',"$state","ngDialog","$log", "MaterialServer","$cookieStore","$stateParams","$timeout","$window",
    function ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout,$window) {
        $state.go("materialManagement.speechLibrary");
        $scope.vm = {
            getVoiceList : getVoiceList , //获取图片列表
            voiceList : [] ,        //所有声音列表
            //removeVoice : removeVoice , //刪除
            paginationConf : {
                pageSize: 4,//第页条目数
                pagesLength: 10,//分页框数量
            } ,
            uploadSpeech :uploadSpeech,
            voiceTitle :"",
            isUploadStart : false,
            exportExcel:exportExcel,
            changeName:changeName,
            isSelectAll : false,
            selectAll : selectAll,
            voiceIds : [],
            batchDeleteVoice : batchDeleteVoice,   //批量删除
            voiceName :'',
            voiceId : '',
            searchVoice : searchVoice,
            selectSingle : selectSingle,
            uploadParemeter : {           //进度条；
                queueNumber : 0,            //添加语音的数量，
                uploadNumber : 0,           //上传的数量;
                process :"0%"               //上传进度
            }

        };

        getVoiceList(1) ;
        function getVoiceList(index){            
            MaterialServer.getVoiceList.save({
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize ,
                "applicationId":APPLICATION_ID
            },function(data){
                if(data.status == 200){
                    console.log(data.data);                    
                    $scope.vm.voiceList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }
            },function(err){
                console.log(err);
            });
        }
        //查询
        function searchVoice(index){
            MaterialServer.search.save({
                "index":(index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize":$scope.vm.paginationConf.pageSize,
                "voiceName":$scope.vm.voiceName
            },function(data){
                if(data.status==200){
                    console.log(data.data);
                    $scope.vm.voiceList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }else if(data.status==500){
                    layer.msg('查询失败');
                }
            },function(err){
                console.log(error);
            });
        }

        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    initBatchTest();
                    getVoiceList(current);
                }, 100)

            }
        },true);
        function uploadSpeech(callback){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/materialManagement/speechLibrary/speechLibraryDialog.html','900px',function(){

            },function(){

            },function(){
                $scope.vm.isUploadStart = false ;
            });
        }
        /**
         * 图片导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID;
            var url = "/api/ms/voiceManage/exportExcel"+urlParams  ;//请求的url
            $window.open(url,"_blank") ;
        }

        //修改名称
        function changeName(callback){
            $scope.vm.voiceName = callback.voiceName;
            $scope.vm.voiceId = callback.voiceId;
            
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/materialManagement/speechLibrary/changeName.html','400px',function(){
                updateVoice();
            },function(){

            });
        }
        function updateVoice(){
                     
            MaterialServer.updateVoice.save({
                voiceId : $scope.vm.voiceId,
                voiceName : $scope.vm.voiceName
            },function(data){
                if(data.status==200){
                    getVoiceList(1);
                }else if(data.status==500){
                    layer.msg('名称根寻失败');
                }
            },function(err){
                $log.log(err);
            });

        }

        //全选
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.voiceIds = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.voiceIds=[];
                angular.forEach($scope.vm.voiceList.objs,function (val) {
                    $scope.vm.voiceIds.push(val.voiceId);
                })
            }
            console.log($scope.vm.voiceIds);
        }
        //单选
        function selectSingle(id){
            if($scope.vm.voiceIds.inArray(id)){
                $scope.vm.voiceIds.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.voiceIds.push(id);

            }
            if($scope.vm.voiceIds.length==$scope.vm.voiceList.objs.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.voiceIds);
        }
        //全选清空
        function initBatchTest(){
            $scope.vm.isSelectAll=false;
            $scope.vm.voiceIds=[];
        }
        //批量删除
        function batchDeleteVoice(voiceIds){
            //console.log($scope.vm.voiceIds);
            if(!voiceIds.length){
                layer.msg("请选择要删除的语音")
            }else{
                layer.confirm('确认删除语音？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    MaterialServer.batchDeleteVoice.save({
                        "voiceIds": voiceIds
                    },function(data){
                        if(data.status == 200){
                            layer.msg("语音删除成功") ;
                            initBatchTest();
                            getVoiceList(1)
                        }else if(data.status == 500){
                            layer.msg("语音删除失败") ;
                        }
                    },function(err){
                        $log.log(err);
                    });
                }, function(){
                });
            }

        }

    }
]);

