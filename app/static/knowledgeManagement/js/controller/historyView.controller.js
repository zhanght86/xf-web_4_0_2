/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('historyViewController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader",
    "knowledgeAddServer","$window","$stateParams","$interval","$filter","$animate",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,
              knowledgeAddServer,$window,$stateParams,$interval,$filter,$animate) {
        $scope.vm = {
            findUploadRecord: '/api/ms/uploadRecord/findUploadRecordList',
            downRecord: '/api/ms/uploadRecord/downFile',
            deleteRecord: '/api/ms/uploadRecord/deleteRecord',
            uploadRecordList: null,
            uploadName: null,
            uploadType: null,
            uploadTimeMin: null,
            uploadTimeMax: null,
            finishTimeMin: null,
            finishTimeMax: null

        };
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
                pagesLength: 5 //分页框数量

            };
        }
        self.initSearch();
        //分页定时器
        var timeout ;
        $scope.$watch('SearchPOJO', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    $scope.findUploadRecord();
                }, 350);
            }
        },true);

        //查询上传历史记录
        $scope.findUploadRecord = function() {
            httpRequestPost($scope.vm.findUploadRecord,{
                "requestId": "string",
                "applicationId" : APPLICATION_ID,
                "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                "pageSize": $scope.SearchPOJO.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.vm.uploadRecordList = data.data;
                    $scope.$apply();
                }else{
                }
                console.log(data);
            },function(err){

            });
        }

        /**
         * 下载记录文件
         * @param uploadId 历史ID
         */
        $scope.downRecordFile = function(uploadName){
            var urlParams = "?applicationId="+APPLICATION_ID+"&uploadName="+uploadName;
            var url = $scope.vm.downRecord+urlParams  ;//请求的url
            $window.open(url,"_blank") ;
        }

        $scope.deleteRecord = function (uploadId) {
            httpRequestPostParam($scope.vm.deleteRecord,{
                "requestId": "string",
                "uploadId" : uploadId
            },function(data){
                if(data.status == 200){
                    $scope.findUploadRecord();
                }else{
                }
                console.log(data);
            },function(err){

            });
        }

    }
]);