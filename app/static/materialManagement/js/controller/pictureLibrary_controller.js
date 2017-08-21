/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('pictureLibraryController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout","$window",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout,$window) {
        $state.go("materialManagement.pictureLibrary");
        $scope.vm = {
            getPicList : getPicList , //获取图片列表
            imageList : [] ,        //所有图片列表
            removeImg : removeImg ,//刪除
            paginationConf : {
                                pageSize: 8,//第页条目数
                                pagesLength: 10,//分页框数量
                             },
            changeName:changeName,
            pictureIds : [],
            pictureName:null,
            napSearch:napSearch,
            exportExcel:exportExcel,
            batchDeletePicture:batchDeletePicture,
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll  ,//選擇全部

        };
        getPicList(1) ;
        function getPicList(index){
            httpRequestPost("/api/ms/picture/queryPicture",{
                "applicationId" : APPLICATION_ID,
                "pictureName" : $scope.vm.pictureName,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.imageList = data.data ;
                        $scope.vm.paginationConf.currentPage =index ;
                        $scope.vm.paginationConf.totalItems =data.data.total ;
                        $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                        console.log($scope.vm.paginationConf)
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }

        function  napSearch(){
            getPicList(1) ;
        }
            function selectAll(items){
            alert(1111)
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false ;
                $scope.vm.pictureIds = [] ;
            }else{
                $scope.vm.isSelectAll = true ;
                $scope.vm.pictureIds = [] ;
                angular.forEach(items,function(val){
                    $scope.vm.pictureIds.push(val.pictureId)
                });
            }
        }


        function removeImg(item,index){
            layer.confirm('确认删除该图片？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                httpRequestPost("/api/ms/picture/deletePicture",{
                    "fileurl": item.pictureUrl,
                    "pictureId": item.pictureId
                },function(data){
                    if(data.status == 200){ 
                        layer.msg("图片删除成功") ;
                        getPicList(1)
                    }else if(data.status == 500){
                        layer.msg("图片删除失败") ;
                    }
                },function(err){
                    console.log(err)
                }) ;
            }, function(){
            });
        }

        /**
         * 图片导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID;
            var url = "/api/ms/picture/exportExcel"+urlParams  ;//请求的url
            $window.open(url,"_blank") ;
        }

        function batchDeletePicture(){

        }



        function updateImg(){
            httpRequestPost("/api/ms/picture/updatePicture",{
                "pictureName":$scope.vm.pictureName,
                "pictureId":  $scope.vm.pictureId
            },function(data){
                if(data.status == 200){
                    getPicList(1)
                }else if(data.status == 500){
                    layer.msg("名称根寻失败") ;
                }
            },function(err){
                console.log(err)
            }) ;
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getPicList(current);
                }, 100)

            }
        },true);

        //修改名称
        function changeName(item){
            $scope.vm.pictureName=item.pictureName;
            $scope.vm.pictureId=item.pictureId;
            var dialog = ngDialog.openConfirm({
                template: "/static/materialManagement/pictureLibrary/changeName.html",
                scope: $scope,
                width:'400px',
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        updateImg();
                    } else {

                    }
                }
            });
        }
    }
]);

