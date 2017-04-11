/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", function ($scope,$state) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            title : "" ,           //知识标题
            search : search,  //查询
            searchList : "",   //查询数据结果
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
        };

        init(1);
        //请求列表
        function init(index){
            httpRequestPost("/api/chatKnowledge/queryChatKnowledge",{
                "applicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                console.log(data.data.objs);
              $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败");
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/chatKnowledge/queryChatKnowledge",{
                    "applicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    console.log( data.data.objs);
                    $scope.vm.listData= data.data.objs;
                },function(){
                })
            }
        });
        function search(){
            httpRequestPost("",{

            },function(data){

            },function(err){})
        }

    }
]);