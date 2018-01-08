/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  角色管理
 */
module.exports = homePageModule =>{
    homePageModule.controller('RoleController',
    ['$scope',"localStorageService","$state","$timeout","$stateParams","HomePageServer","$location",
    function ($scope,localStorageService, $state,$timeout,$stateParams,HomePageServer,$location) {
        $scope.vm = {
            roleListDate : [] , //所有角色
            paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : queryRoleList,
                location : true
            }  ,
            roleName : "" ,
            roleDescription : "" ,
            addRole : addRole ,
            deleteRole : deleteRole
        }  ;
        let roleHtml = require("../../views/permission_management/dialog_role.html");
        queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
        function queryRoleList(index,pageSize){
            HomePageServer.queryRoleList.save({
                "index":(index -1)*pageSize,
                "pageSize":pageSize
            },function (response) {
                if(response.status == 200) {
                    $scope.vm.roleListData = response.data.data ;
                    $scope.vm.paginationConf.totalItems = response.data.total ;
                    $scope.vm.paginationConf.numberOfPages = response.data.total/$scope.vm.paginationConf.pageSize;
                }
            })
        }
        // addRole();
        function addRole(roleId){
            if(roleId){
              $scope.vm.roleId = roleId ;
            }else{
                $scope.vm.roleId = "" ;
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,roleHtml,"900px",function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                //根据过滤机制获得zTree的所有节点
                let resultNodes = [] ;
                let nodes = zTree.getNodesByFilter(node=>node);
                angular.forEach(nodes,function(item,index){
                    if(item.checked){
                        resultNodes.push(item.id)
                    }
                }) ;
                HomePageServer.addRole.save({
                    "description": $scope.vm.roleDescription,
                    "groupList": resultNodes,
                    "name": $scope.vm.roleName
                },function (response) {
                    queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                })
                console.log(nodes);
                // var permissionList = nodes.filter(nodes)
            })
        }
        // 删除
        function deleteRole(roleId){
            HomePageServer.deleteRole.get({id:roleId},function(response){
                if(response.status == 200){
                    queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                }
                layer.msg(response.info)
            },function (error) {
                console.log(error)
            })
        }
    }
])
};