/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  知识文档分析结果控制器
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('TemController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog", "TemplateService","TipService","$state",
     ($scope, $location, $routeParams, $interval, $timeout, ngDialog, TemplateService,TipService,$state) =>{
        $scope.vm = {
            searchName  : "" , //搜索条件 templateName
            deleteTemplate : deleteTemplate , //删除模板
            queryTemplate  : queryTemplate , // 获取所有模板
        } ;
        //(function initSearch(column) {
        //    if (!$scope.SearchPOJO) {
        //        $scope.SearchPOJO = $scope.initSearchPOJO();
        //    }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: 1,//当前页
                totalItems: 0, //总条数
                pageSize: 10,//第页条目数
                pagesLength: 6 ,//分页框数量
                searchName : ""
            };
        //})() ;
        //获取模板
        function queryTemplate(){
            TemplateService.queryTemplate.save(
                {
                    "index": ($scope.paginationConf.currentPage-1)*$scope.paginationConf.pageSize,
                    "pageSize": $scope.paginationConf.pageSize,
                    "requestId": "string",
                    "templateName": $scope.paginationConf.searchName
                }
               ,function(resource){
                if(resource.status == 200){
                    $scope.templates = resource.data.objs ;
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        };
        //删除模板
     function deleteTemplate(temId){
            TemplateService.deleteTemplate.save({
                "templateId":temId
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    queryTemplate();
                }
            })
        }
        ////获取文档类型
        //$scope.temType = function(typeNum){
        //    if(typeNum == 1){
        //        return "WORD"
        //    }
        //} ;
        var timeout;
        $scope.$watch('paginationConf', function () {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                queryTemplate();
            }, 350)
        }, true) ;
    }])};