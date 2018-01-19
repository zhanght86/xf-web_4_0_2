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
            roleListDate   : [] ,  //所有角色
            paginationConf : {     //分页条件
                pageSize   : $location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search     : queryRoleList,
                location   : true
            }  ,
            roleName      : "" ,
            description   : "" ,
            addRole       : addRole ,
            deleteRole    : deleteRole
        }  ;
        let roleHtml = require("../../views/permission_management/dialog_role.html");
        queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
        function queryRoleList(index,pageSize){
            HomePageServer.queryRoleList.save({
                "index"   :(index -1)*pageSize,
                "pageSize":pageSize
            },function (response) {
                if(response.status == 200) {
                    $scope.vm.roleListData = response.data.data ;
                    $scope.vm.paginationConf.totalItems = response.data.total ;
                    $scope.vm.paginationConf.numberOfPages = response.data.total/$scope.vm.paginationConf.pageSize;
                }
            })
        }
        // 添加修改角色
        function addRole(roleId,name,description){
            if(roleId){
                $scope.vm.roleId = roleId
              $scope.vm.roleName = name ;
              $scope.vm.description = description ;
            }else{
                $scope.vm.roleName = "" ;
                $scope.vm.description = "" ;
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,roleHtml,"900px",function(){
                let zTree       = $.fn.zTree.getZTreeObj("treeDemo"),  //获取权限树
                    resultNodes = [] ,                                 //根据过滤机制获得zTree的所有节点
                    nodes       = zTree.getNodesByFilter(node=>node),  //权限返回节点id
                    parameter ,apiRes;                                 //参数 & 请求
                angular.forEach(nodes,function(item,index){           //获取所有选择节点
                    if(item.checked){
                        resultNodes.push(item.id)
                    }
                }) ;
                parameter = {
                        "name"       : $scope.vm.roleName,
                        "groupList"  : resultNodes,
                        "description": $scope.vm.description
                 };
                if(!roleId){
                    apiRes       = HomePageServer.addRole.save(parameter) ;    //新增角色权限
                }else{
                    apiRes       = HomePageServer.updateRole.save(parameter) ; //修改角色权限
                    parameter.id = roleId ;
                }
                apiRes.$promise.then(function (response) {
                    if(response.status == 200){
                        queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                    }
                    layer.msg(response.info)
                });
            })
        }
        // 删除
        function deleteRole(roleId){
            layer.confirm('是否删该角色？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                HomePageServer.deleteRole.get({id:roleId},function(response){
                    if(response.status == 200){
                        queryRoleList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
                    }
                    layer.msg(response.info)
                },function (error) {
                    console.log(error)
                })
            });
        }
}])};