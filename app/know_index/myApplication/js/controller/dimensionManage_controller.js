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
        setCookie("applicationId","1");
        setCookie("userId","1");
        $scope.vm = {
            addDimension : addDimension,
            editDimension : editDimension,
            listData : "",   // table 数据
            listDataTotal : "",
            getData : getData,
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "" //分页条件
        };

        getData();
        function getData(){
            httpRequestPost("/api/application/api/dimension/listDimension",{
                index:0,
                pageSize:10,
                dimensionParentId:0, //页面只展示父级维度，给定父级id
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
        function editDimension(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/dimensionManageDialog2.html",
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