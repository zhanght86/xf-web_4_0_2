/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('aggregateConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        $scope.vm = {
            addAggregate : addAggregate,
            editAggregate : editAggregate,
            paginationConf : ""  ,//分页条件
            listData : "",
            pageSize : 5
        };
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */

var applicationId = "360619411498860544";
        getAggre(1);
        //請求列表
        function getAggre(index){
                //size=size?size:5;   //设置pageSize默认是5
                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                    "businessConceptApplicationId": applicationId,
                    "index" :index==1?0:index,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.vm.listData = data.data;

                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: Math.ceil(data.total/5), //总条数
                        pageSize: 1,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                    $scope.$apply()
                },function(){
                    layer.msg("请求失败")
                })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                console.log(current,$scope.vm.pageSize);
                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                    "businessConceptApplicationId": applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(){
                    getAggre(current);
                },function(){
                })
            }

        });

        function addAggregate(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
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
        function editAggregate(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog2.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
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