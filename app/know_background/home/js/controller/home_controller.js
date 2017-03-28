/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('backHomeModule').controller('backHomeController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "HomeService","$sce",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              HomeService,$sce) {
       var self = this;

        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO(); 
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        
        self.getMyTask = function(){
            HomeService.queryMyTask.get({page:$scope.SearchPOJO.currentPage,pageSize:$scope.SearchPOJO.pageSize},function(resource){
                if(resource.status == 200 && resource.data!=null){
                    $scope.taskKnowItems = resource.data.taskList;
                    $scope.taskKnowItems.forEach(function(task){
                        var titleHtml = $sce.trustAsHtml(task.knowItemDto.title);
                        var contentHtml = $sce.trustAsHtml(task.knowItemDto.content);
                        task.knowItemDto.titleHtml = titleHtml;
                        task.knowItemDto.contentHtml = contentHtml
                    })
                    $scope.paginationConf.totalItems = resource.data.count;
                }
            })
        }

        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                self.getMyTask();
            }, 350)
        }, true)

        self.initSearch();
    }
])