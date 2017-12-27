/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('VoiceLibraryController', [
    '$scope',"$state","ngDialog","$log", "MaterialServer","$cookieStore","$stateParams","$location","$timeout","$window",
    ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$location,$timeout,$window)=> {
        $state.go("MM.voice");
        $scope.vm = {
            voiceList : [] ,        //所有声音列表
            paginationConf : {
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchVoice ,
                location:true
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
            },
            checkVoiceName : checkVoiceName,
            checkVoiceName2 : checkVoiceName2

        };
        /**
         * 获取语音列表  查询
         */
        searchVoice($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;

        function searchVoice(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:5000}) ;
            MaterialServer.searchVoice.get({
                "index":(index-1)*pageSize,
                "pageSize":pageSize,
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


        //上传语音
        function uploadSpeech(callback){
            let upload_html = require("../../views/voice_library/voice_library_dialog.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,upload_html,"600px",function(){
                checkVoiceName();
            },function(){
                $scope.vm.isUploadStart = false ;
            })


        }
        /**
         * 语音导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID+"&name="+$scope.vm.voiceName;
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

            let change_html = require("../../views/voice_library/change_name.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,change_html,"400px",function(){

            },"",function(){

            })
            
            // $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/views/voice_library/change_name.html','400px',function(){
            //     //updateVoice();
            //     //checkVoiceName2();
            // },function(){
            //
            // });
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
                        "ids": voiceIds
                    },
                    {
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

        //校验名称重复 上传
        function checkVoiceName(){
            if(!$scope.vm.voiceTitle){
                layer.msg("请输入语音名称");
            }else{
                MaterialServer.checkVoice.get({
                    "name": $scope.vm.voiceTitle
                },
                function(data){
                    if(data.code == 10006){
                        $scope.vm.isUploadStart=false;
                        layer.msg("语音名称重复,请重新输入") ;
                    }else{
                        $scope.vm.isUploadStart = true;
                    }
                },function(err){
                    //$log.log(err);
                });
            }
        }
        //校验名称重复 修改
        function checkVoiceName2(){
            //alert(1);
            if(!$scope.vm.editVoiceName){
                layer.msg("请输入语音名称");
            }else{
                MaterialServer.checkVoice.get({
                        "name": $scope.vm.editVoiceName
                    },
                    function(data){
                        if(data.code == 10006){
                            layer.msg("语音名称重复,请重新输入") ;
                        }else{
                            ngDialog.close();
                            updateVoice();
                        }
                    },function(err){
                        //$log.log(err);
                    });
            }
        }

    }
    ])};

