/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('teletextMessageController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.teletextMessage");
        $scope.vm = {
            applicationId:APPLICATION_ID,
            paginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            titAuthor:'',
            imageList : [] ,        //所有图片列表
            showImg : showImg,
            removeImg : removeImg,
        };
        showImg(1);
        //查询
        function showImg(index) {
            httpRequestPost("/api/ms/graphicMessage/queryGraphicMessage",{
                applicationId:$scope.vm.applicationId,
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                graphicMessageTitle:$scope.vm.titAuthor,
                // graphicMessageAuthor:$scope.vm.titAuthor

            },function(data){
                if(data.status == 500){
                    layer.msg("请求失败",{time:1000});
                }else if(data.status == 200){                    
                    console.log(data);
                    $scope.$apply(function(){
                        $scope.vm.imageList = data.data ;
                        $scope.vm.paginationConf.currentPage =index ;
                        $scope.vm.paginationConf.totalItems =data.data.total ;
                        $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                        console.log($scope.vm.paginationConf)
                    })
                }

            },function(error){
                console.log(error);
            })  ;
        }

        //分页定时器
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    showImg(current);
                }, 0);
            }
        },true);
        //删除图片
        function removeImg(item,index){
            layer.confirm('确认删除该图片？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                httpRequestPost("/api/ms/graphicMessage/deleteGraphicMessage",{
                    graphicMessageIds : new Array(item.graphicMessageId)
                },function(data){
                    if(data.status == 200){
                        layer.msg("图片删除成功") ;
                        showImg(1)
                    }else if(data.status == 500){
                        layer.msg("图片删除失败") ;
                    }
                },function(err){
                    console.log(err)
                }) ;
            }, function(){
            });
        }

    }
]);

