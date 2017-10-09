/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('pictureLibraryController', [
    '$scope',"$state","ngDialog","MaterialServer", "$cookieStore","$stateParams","$timeout","$window",
    function ($scope,$state,ngDialog,MaterialServer,$cookieStore,$stateParams,$timeout, $window) {
        $state.go("materialManagement.pictureLibrary");
        $scope.vm = {
            getPicList : getPicList , //获取图片列表
            imageList : "" ,        //所有图片列表
            paginationConf : {
                                pageSize: 4,//第页条目数
                                pagesLength: 10,//分页框数量
                             },
            changeName:changeName,
            pictureIds : [],
            pictureName:null,
            napSearch:napSearch,
            exportExcel:exportExcel,
            batchDeletePicture:batchDeletePicture,
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll  ,//选择全部
            singleAdd : singleAdd , //单个添加
            uploadParemeter : {
                queueNumber : 0 ,
                uploadNumber : 0 ,
                process : "0%"
            }
        };
        getPicList(1) ;
        function getPicList(index){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar:false,time:3000}) ;
            MaterialServer.getList.save({
                "applicationId" : APPLICATION_ID,
                "pictureName" : $scope.vm.pictureName,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(data){
                layer.close(i);
                if(data.status == 200){
                    initBatchTest() ;
                    $scope.vm.imageList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf)
                }else{
                    $scope.vm.imageList= [];
                    $scope.vm.paginationConf.totalItems=0;
                }
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }

        function  napSearch(){
            getPicList(1) ;
        }
        /**
         * 全选
         */
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false ;
                $scope.vm.pictureIds = [] ;
            }else{
                $scope.vm.isSelectAll = true ;
                $scope.vm.pictureIds = [] ;
                angular.forEach($scope.vm.imageList.objs,function(val){
                    $scope.vm.pictureIds.push(val.pictureId)
                });
            }
        }
        /**
         * 单选
         */
        function singleAdd(id,allId,isAll,len){
            console.log(allId) ;
            if(allId.inArray(id)){
                allId.remove(id) ;
                $scope.vm.isSelectAll = false ;
            }else{
                allId.push(id) ;
                if(allId.length == len){
                    $scope.vm.isSelectAll = true ;
                }
            }
        }
        /**
         * 全选清空选择按钮；
         */
        function initBatchTest(){
            $scope.vm.pictureIds = [] ;
            $scope.vm.isSelectAll = false;
        }
        /**
         * 删除图片
         */
        function batchDeletePicture(pictureIds){
            if(!pictureIds.length){
                layer.msg("请选择要删除的图片")
            }else{
                layer.confirm('确认删除图片？', {
                    btn: ['确定','取消'] //按钮
                }, function(){                                       
                    MaterialServer.deleteImg.save({
                        "pictureIds": pictureIds
                    },function(data){
                        if(data.status == 200){
                            layer.msg("图片删除成功") ;
                            //getPicList(1) ;
                            $state.reload();
                        }else if(data.status == 500){
                            layer.msg("图片删除失败") ;
                        }
                    },function(err){
                        console.log(err);
                    });
                    
                }, function(error){ console.log(error)});
            }
        }
        /**
         * 图片导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID;
            //var url = "/api/ms/picture/exportExcel"+urlParams  ;//请求的url
            //$window.open(url,"_blank") ;
            
            var url= MaterialServer.exportImg+urlParams;
            downLoadFiles($(".picLib")[0],url);
            
        }

        /**
         * 图片分页
         */
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getPicList(current);
                }, 0)

            }
        },true);
        //
        function updateImg(){
            MaterialServer.updateImg.save({
                "pictureName":$scope.vm.pictureName,
                "pictureId":  $scope.vm.pictureId
            },function(data){
                if(data.status == 200){
                    layer.msg('图片名称修改成功');
                    //getPicList(1)
                    $state.reload();
                }else if(data.status == 500){
                    layer.msg("名称根寻失败") ;
                }
            },function(err){
                console.log(err);
            });
        }
        /**
         * 修改名称
         */
        function changeName(item){
            $scope.vm.pictureName=item.pictureName;
            $scope.vm.pictureId=item.pictureId;

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/picture_library/change_name.html','400px',function(){
                updateImg();
            },function(){

            });
        }
    }
]);
