/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('functionalTestModule').controller('viewDetailsController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            pageSize:5,
            batchNumberId:"",
            applicationId : $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),
            listData:[],
            listDataTotal:0,


            //-----------------------------------------方法
            getData:getData,
            addKnow : addKnow,
            editKnow : editKnow,
            deleteKnow:deleteKnow,

        };

        getData(1);
        function getData(index){
            httpRequestPost("/api/application/detail/getDetailList",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                applicationId:$scope.vm.applicationId,
                batchNumberId:$stateParams.batchNumberId,
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.detailList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败");
            })  ;
        }

        function addKnow(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }
        function editKnow(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/functionalTesting/viewDetailsEditDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }

        function deleteKnow(){

        }



        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    getData(current);
                }, 0);
            }
        },true);
        
    }
]);