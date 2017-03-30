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
            listData : ""
        };
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        $scope.vm.paginationConf = {
            currentPage: 2,//当前页
            totalItems: 15, //总条数
            pageSize: 2,//第页条目数
            pagesLength: 10,//分页框数量
        };
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            httpRequestPost("",{},function(){

            },function(){

            })
        });
        getAggre(0);
        //
        function getAggre(index,size){
                size=size?size:5;   //设置pageSize默认是5
                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                    "businessConceptApplicationId": "360619411498860544",
                    "index" :index,
                    "pageSize": size
                },function(data){
                    $scope.vm.listData = data.data
                    console.log(data)
                },function(){

                })
        }

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