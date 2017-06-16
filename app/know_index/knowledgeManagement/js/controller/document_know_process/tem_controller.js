/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('temController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "TemplateService","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              TemplateService,TipService) {
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
        $scope.queryTemplate = function(){
            TemplateService.queryTemplate.save(
                {
                    "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                    "pageSize": $scope.SearchPOJO.pageSize,
                    "requestId": "string",
                    "templateName": $scope.SearchPOJO.name
                }
               ,function(resource){
                if(resource.status == 200){
                    $scope.templates = resource.data.objs
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        }
        
        $scope.deleteTemplate = function(temId){
            TemplateService.deleteTemplate.save({
                "templateId":temId
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryTemplate();
                }
            })
        }
        
        $scope.temType = function(typeNum){
            if(typeNum == 1){
                return "WORD"
            }
        }

        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                $scope.queryTemplate();
            }, 350)
        }, true)
        self.initSearch();
    }
])