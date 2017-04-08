/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('dimensionManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval) {
        setCookie("applicationId","360619411498860544");
        setCookie("userId","368191545326702592");
        $scope.vm = {
            addDimension : addDimension,
            listData : "",   // table 数据
            listDataTotal : "",
            deleteDimension:deleteDimension,
            getData : getData,
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "" //分页条件
        };

        getData();
        function getData(){
            httpRequestPost("/api/application/dimension/listDimension",{
                index:0,
                pageSize:10,
                userId:$scope.vm.userId,
                applicationId:$scope.vm.applicationId
            },function(data){
              console.log(data);
                $scope.vm.listData = data.data.dimensionList;
                $scope.vm.paginationConf = {
                    currentPage: 0,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }

        //删除维度
        function deleteDimension(dimensionId){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/dimension/deleteById",{
                            applicationId:$scope.vm.applicationId,
                            dimensionId:dimensionId
                        },function(data){
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }

        function addDimension(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/dimensionManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){

                    }
                }
            });
        }

      

    }
]);