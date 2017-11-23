/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */ 
angular.module('materialManagement').controller('speechLibraryController', [
    '$scope',"$state","ngDialog","$log", "MaterialServer","$cookieStore","$stateParams","$timeout","$window",
    function ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout,$window) {
        $state.go("materialManagement.speechLibrary");
        $scope.vm = {
           // getVoiceList : getVoiceList , //获取图片列表
            voiceList : [] ,        //所有声音列表
            //removeVoice : removeVoice , //刪除
            paginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
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
            editVoiceName : '',
            voiceId : '',
            searchVoice : searchVoice,
            selectSingle : selectSingle,
            uploadParemeter : {           //进度条；
                queueNumber : 0,            //添加语音的数量，
                uploadNumber : 0,           //上传的数量;
                process :"0%"               //上传进度
            }

        };
        /**
         * 获取语音列表  查询
         */
        searchVoice(1) ;

        function searchVoice(index){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            MaterialServer.searchVoice.save({
                "index":(index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize":$scope.vm.paginationConf.pageSize,
                "name":$scope.vm.voiceName
            },function(data){
                layer.close(i);
                if(data.status==200){
                    console.log(data.data);
                    $scope.vm.voiceList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }else if(data.status==500){
                    layer.msg('查询失败');
                    $scope.vm.voiceList=[];
                    $scope.vm.paginationConf.totalItems = 0;
                }
            },function(err){
                layer.close(i);
                console.log(error);
            });
        }

        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    initBatchTest();
                    searchVoice(current);
                }, 0)

            }
        },true);
        function uploadSpeech(callback){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/speech_library/speech_library_dialog.html','900px',function(){

            },function(){

            },function(){
                $scope.vm.isUploadStart = false ;
            });
        }
        /**
         * 语音导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID;
            // var url = "/api/ms/voiceManage/exportExcel"+urlParams  ;//请求的url
           // $window.open(url,"_blank") ;

            var url= MaterialServer.exportVoice + urlParams;
            downLoadFiles( $(".speechLib")[0],url);

        }

        /**
         * 修改名称
         */
        function changeName(item){
            // $scope.vm.voiceName = item.name;
            $scope.vm.editVoiceName = item.name;
            $scope.vm.voiceId = item.id;
            
            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/speech_library/change_name.html','400px',function(){
                updateVoice();
            },function(){

            });
        }
        function updateVoice(){
            MaterialServer.updateVoice.save({
                id : $scope.vm.voiceId,
                // name: $scope.vm.voiceName
                 name : $scope.vm.editVoiceName
            },function(data){
                if(data.status==200){
                    layer.msg('语音名称修改成功');
                    //getVoiceList(1);
                    $state.reload();
                }else if(data.status==500){
                    layer.msg('名称根寻失败');
                }
            },function(err){
                $log.log(err);
            });

        }

        /**
         * 全选
         */
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.voiceIds = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.voiceIds=[];
                angular.forEach($scope.vm.voiceList.objs,function (val) {
                    $scope.vm.voiceIds.push(val.id);
                })
            }
            console.log($scope.vm.voiceIds);
        }
        /**
         * 单选
         */
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
        /**
         * 全选清空
         */
        function initBatchTest(){
            $scope.vm.isSelectAll=false;
            $scope.vm.voiceIds=[];
        }
        /**
         * 批量删除
         */
        function batchDeleteVoice(voiceIds){
            //console.log($scope.vm.voiceIds);
            if(!voiceIds.length){
                layer.msg("请选择要删除的语音")
            }else{
                layer.confirm('确认删除语音？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    MaterialServer.batchDeleteVoice.save({
                        //"voiceIds": voiceIds
                        "ids": voiceIds
                    },function(data){
                        if(data.status == 200){
                            layer.msg("语音删除成功") ;
                            initBatchTest();
                            //searchVoice(1)
                            $state.reload();
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

