/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('analyseTaskController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "KnowDocService","SearchService","TemplateService","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              KnowDocService,SearchService,TemplateService,TipService) {
        var self = this;
        $scope.processMethod = true;

        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            console.log() ;
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6,//分页框数量

            };
        }

        $scope.TemSearchPOJO = {
            pageSize:5,
            currentPage:1
        };

        $scope.temPaginationConf = {
            currentPage: $scope.TemSearchPOJO.currentPage,//当前页
            totalItems: 0, //总条数
            pageSize: $scope.TemSearchPOJO.pageSize,//第页条目数
            pagesLength: 6,//分页框数量
            target:$scope.TemSearchPOJO
        };


        $scope.queryTemplate = function(){
            TemplateService.queryTemplate.save({
                "index": ($scope.TemSearchPOJO.currentPage-1)*$scope.TemSearchPOJO.pageSize,
                "pageSize": $scope.TemSearchPOJO.pageSize,
                "requestId": "string",
            },function(resource){
                if(resource.status == 200){
                    $scope.templates = resource.data.objs;
                    $scope.temPaginationConf.totalItems = resource.data.total;
                }
            })
        }


        $scope.getTaskStatus = function(taskStatus){
            if(taskStatus == 0){
                return "未开始"
            }else if(taskStatus == 1){
                return "解析中"
            }else if(taskStatus == 2){
                return "解析成功"
            }else if(taskStatus == 3){
                return "解析失败"
            }
        }

        $scope.getAnalyseType  = function(analyseType){
            if(analyseType == 0){
                return "全文解析"
            }else if(analyseType == 1){
                return "目录解析"
            }else if(analyseType == 2){
                return "模板解析"
            }else if(analyseType == 3){
                return "插件解析"
            }
        }

        $scope.resetUploadPOJO = function(){
            if($scope.libraryIds && $scope.libraryIds.length>0)
                $scope.uploadLibraryId = $scope.libraryIds[0].id;
            $scope.targetId ='';
            //$scope.processMethod = 'a';
        }

        // $scope.noFileSinUpload = function(){
        //     KnowDocService.singleImport.save({
        //         title:$scope.sinKnowItemTitle,
        //         content:$scope.sinKnowItemContent,
        //         libraryId:$scope.uploadLibraryId,
        //         ontologys:$scope.classifyId
        //     },function(resource){
        //         if(resource.status == 200){
        //             $('.popup_wrap').hide();
        //             $('.popup_span').hide();
        //             $(".import_from_txt").css('visibility','hidden');
        //             $(".add_single_popup").css('visibility','hidden');
        //             $scope.queryAnalyseTask();
        //             $('#sincontainer').html('');
        //             $scope.resetSinPOJO();
        //         }
        //     })
        // }

        $scope.queryKnowDocList = function(){
            // layer.msg($scope.SearchPOJO.currentPage)
            KnowDocService.queryKnowDocList.save({
                "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                "pageSize": $scope.SearchPOJO.pageSize,
                "documentationName": $scope.SearchPOJO.docName,
                "documentationCreateTime":$scope.SearchPOJO.startTime,
                "documentationModifyTime": $scope.SearchPOJO.endTime,
                "documentationCreater": $scope.SearchPOJO.userName,
                "requestId": "string",
            },function(resource){
                if(resource.status == 200){
                    $scope.knowDocs = resource.data.objs
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        }

        $scope.resetKnowDocSearchPOJO = function(){
            $scope.SearchPOJO.currentPage =1;
            $scope.SearchPOJO.docName = "";
            $scope.SearchPOJO.startTime="";
            $scope.SearchPOJO.endTime="";
            $scope.SearchPOJO.libraryId ="";
            $scope.SearchPOJO.isRepeated ="";
            $scope.SearchPOJO.userName="";
        }

        $scope.deleteKnowDoc = function(knowDocId){
            KnowDocService.deleteKnowDoc.save({
                    "documentationId": knowDocId,
            },function(resource){
                if(resource.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryKnowDocList();
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
                $scope.queryKnowDocList();
            }, 350)
        }, true)

        self.initSearch();

        var timeout3;
        $scope.$watch('TemSearchPOJO', function (SearchPOJO) {
            if (timeout3) {
                $timeout.cancel(timeout3)
            }
            timeout = $timeout(function () {
                $scope.queryTemplate();
            }, 350)
        }, true)

    }
])