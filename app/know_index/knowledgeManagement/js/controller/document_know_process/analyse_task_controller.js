/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('analyseTaskController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "KnowDocService","TemplateService","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              KnowDocService,TemplateService,TipService) {
        $scope.vm = {
            searchName  : "" , //搜索条件 templateName
            templates : "" ,  //模板列表
            knowDocs : "", //文档列表
            queryKnowDocList : queryKnowDocList , //獲取列表
            queryTemplate  : queryTemplate , // 获取所有模板
            deleteKnowDoc : deleteKnowDoc , //删除文档
            templateId : "" ,  //模板id
        } ;
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        //任务模板
        $scope.paginationConf = {
            currentPage: 1,//当前页
            totalItems: 0, //总条数
            pageSize: 10,//第页条目数
            pagesLength: 6 ,//分页框数量
            searchName : "" ,   //搜索文档名称
            startTime : "",   //开始时间
            endTime : "" , //结束时间
            userName : ""  //创建人
        };
        //模板分页
        $scope.temPaginationConf = {
            currentPage: 1,//当前页
            totalItems: 0, //总条数
            pageSize: 5,//第页条目数
            pagesLength: 6,//分页框数量
        };
        //获取模板
       function queryTemplate(){
            TemplateService.queryTemplate.save({
                "index": ($scope.temPaginationConf.currentPage-1)*$scope.temPaginationConf.pageSize,
                "pageSize": $scope.temPaginationConf.pageSize,
                "requestId": "string",
            },function(resource){
                if(resource.status == 200){
                    $scope.vm.templates = resource.data.objs;
                    $scope.temPaginationConf.totalItems = resource.data.total;
                }
            })
        }
         //获取文档列表
         function queryKnowDocList(){
            KnowDocService.queryKnowDocList.save({
                "index": ($scope.paginationConf.currentPage-1)*$scope.paginationConf.pageSize,
                "pageSize": $scope.paginationConf.pageSize,
                "documentationName": $scope.paginationConf.searchName,
                "documentationCreateTime":$scope.paginationConf.startTime,
                "documentationModifyTime": $scope.paginationConf.endTime,
                "documentationCreater": $scope.paginationConf.userName,
                "requestId": "string"
            },function(resource){
                if(resource.status == 200){
                    $scope.vm.knowDocs = resource.data.objs ;
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        } ;
        //刪除
        function deleteKnowDoc(knowDocId){
            KnowDocService.deleteKnowDoc.save({
                    "documentationId": knowDocId,
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    queryKnowDocList();
                }
            })
        } ;

        var timeout;
        $scope.$watch('paginationConf', function () {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                //$scope.storeParams(paginationConf);
                queryKnowDocList();
            }, 350)
        }, true) ;

        var timeout3;
        $scope.$watch('TemSearchPOJO', function (SearchPOJO) {
            if (timeout3) {
                $timeout.cancel(timeout3)
            }
            timeout = $timeout(function () {
                queryTemplate();
            }, 350)
        }, true) ;
    }
])