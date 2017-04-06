/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", function ($scope,$state) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            searchList : "",   //查询数据结果
            paginationConf : "",
        };
        //$scope.vm.paginationConf = {
        //    currentPage: index,//当前页
        //    totalItems: Math.ceil(data.total/5), //总条数
        //    pageSize: 1,//第页条目数
        //    pagesLength: 8,//分页框数量
        //};

        //$scope.$watch('vm.paginationConf.currentPage', function(current){
        //    if(current){
        //        //console.log(current,$scope.vm.pageSize);
        //        httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
        //            "collectiveConceptApplicationId": $scope.vm.applicationId,
        //            "index" :current*$scope.vm.pageSize,
        //            "pageSize": $scope.vm.pageSize
        //        },function(){
        //            getAggre(current);
        //        },function(){
        //        })
        //    }
        //});

        //$scope.$apply();
        function search(){
            httpRequestPost("",{

            },function(data){

            },function(err){})
        }

    }
]);