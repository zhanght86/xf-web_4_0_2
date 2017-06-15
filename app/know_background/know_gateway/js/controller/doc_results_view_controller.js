/**
 * @author shaomingjin
 *  知识文档分析结果控制器
 */
angular.module('knowGatewayModule').controller('doc_results_viewController', [
    '$scope', 'DetailService','localStorageService','$state','$stateParams',"$timeout",'ngDialog','$cookieStore',
    function ($scope,DetailService,localStorageService,$state,$stateParams,$timeout,ngDialog,$cookieStore) {
        var self = this;
        if($stateParams.knowDocId != null)
            $state.go("back.doc_results_view");
        $scope.knowDocId = $stateParams.knowDocId;
        $scope.knowDocCreateTime = $stateParams.knowDocCreateTime;
        $scope.knowDocUserName = $stateParams.knowDocUserName;

        $scope.vm={
            knowIgnoreAllConfirm : knowIgnoreAllConfirm, //忽略全部
            knowIgnoreConfirm :knowIgnoreConfirm, //忽略单条知识
            addKnowClass : addKnowClass, //添加知识点分类
            refreshFn : refreshFn,
            stateUrlVal: "knowledgeManagement.faqAdd",
            stateUrl : [
                        {value:"knowledgeManagement.faqAdd", name:"FAQ知识"},
                        {value:"knowledgeManagement.singleAddConcept", name:"概念型知识"}
                       ]

        }

        /**
         * 刷新列表
         */
        function refreshFn(){
            $scope.queryDocKnowItems();
        }
        function knowIgnoreAllConfirm(){
            var dialog = ngDialog.openConfirm({
                template:"/know_background/know_gateway/doc_results_viewDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        $scope.ignoreDocKnowAll();
                    }
                }
            });
        }
        function knowIgnoreConfirm(knowledgeId){
            var dialog = ngDialog.openConfirm({
                template:"/know_background/know_gateway/doc_results_viewDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.info(knowledgeId);
                        $scope.ignoreDocKnow(knowledgeId);
                    }
                }
            });
        }
        function addKnowClass(knowledgeId, knowledgeTitle, knowledgeContent){
            if($cookieStore.get("sceneId") == 2){ //营销场景直接跳转到营销知识新增
                $state.go("knowledgeManagement.conceptAdd",{
                    data:{
                        'docmentation': {
                            'documentationId': $scope.knowDocId,
                            'knowDocCreateTime': $scope.knowDocCreateTime,
                            'knowDocUserName': $scope.knowDocUserName,
                            'knowledgeId': knowledgeId,
                            'documentationTitle': knowledgeTitle,
                            'documentationContext': knowledgeContent
                        }
                    }
                });
            }else{
                var dialog = ngDialog.openConfirm({
                    template:"/know_background/know_gateway/doc_results_viewDialog_add.html",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){    //关闭回掉
                        if(e === 1){
                            $state.go($scope.vm.stateUrlVal,{
                                data:angular.toJson({
                                    'docmentation': {
                                        'documentationId': $scope.knowDocId,
                                        'knowDocCreateTime': $scope.knowDocCreateTime,
                                        'knowDocUserName': $scope.knowDocUserName,
                                        'knowledgeId': knowledgeId,
                                        'documentationTitle': knowledgeTitle,
                                        'documentationContext': knowledgeContent
                                    }
                                })
                            });
                        }
                    }
                });
            }
        }

        /**
         *  忽略知识点
         * @param knowledgeId
         */
        $scope.ignoreDocKnow = function (knowledgeId) {
            DetailService.ignoreDocKnow.save(
                {
                    "knowledgeId": knowledgeId,
                    "requestId": "string"
                },function(resource){
                    if(resource.status == 200){
                        $scope.vm.refreshFn();
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }

        /**
         *  忽略全部知识点
         * @param knowledgeId
         */
        $scope.ignoreDocKnowAll = function () {
            DetailService.ignoreDocKnowAll.save(
                {
                    "documentationId": $scope.knowDocId,
                    "requestId": "string"
                },function(resource){
                    if(resource.status == 200){
                        $scope.vm.refreshFn();
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }
        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            console.log()
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6,//分页框数量

            };
        }
        self.initSearch();

        //根据知识文档id查询相关知识条目
        $scope.queryDocKnowItems = function(){
            if(!$scope.knowDocId)
                return ;
            DetailService.queryDocKnowItems.save(
                {
                    "documentationId": $scope.knowDocId,
                    "knowledgeStatus" : 0, //未分类
                    "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                    "pageSize": $scope.SearchPOJO.pageSize,
                    "requestId": "string",
                },function(resource){
                    //分页数据没有状态
                    if(resource.status == 200){
                        $scope.paginationConf.totalItems = resource.data.total;
                        $scope.knowItems = resource.data.objs;
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }

        //监听分页菜单的变化
        var timeout3;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout3) {
                $timeout.cancel(timeout3);
            }
            timeout3 = $timeout(function () {
                $scope.queryDocKnowItems();
            }, 350)
        }, true)
    }
])