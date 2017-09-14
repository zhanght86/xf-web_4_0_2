/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('teletextMessageController', [
    '$scope',"$state","ngDialog", "$log","MaterialServer","$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout) {
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
            MaterialServer.showImg.save({
                applicationId:$scope.vm.applicationId,
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize,
                graphicMessageTitle:$scope.vm.titAuthor
                // graphicMessageAuthor:$scope.vm.titAuthor
            },function(data){
                if(data.status == 500){
                    layer.msg("请求失败",{time:1000});
                    $scope.vm.imageList=[];
                    $scope.vm.paginationConf.totalItems=0;
                }else if(data.status == 200){
                    console.log(data);
                    $scope.vm.imageList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }
            },function(err){
                $log.log(err);
            });
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
            layer.confirm('确认删除该图文消息？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                MaterialServer.removeImg.save({
                    graphicMessageIds : new Array(item.graphicMessageId)
                },function(data){
                    if(data.status == 200){
                        layer.msg("图文消息删除成功") ;
                        showImg(1)
                    }else if(data.status == 500){
                        layer.msg("图文消息删除失败") ;
                    }
                },function(err){
                    $log.log(err);
                })
            }, function(){
            });
        }

    }
]);

