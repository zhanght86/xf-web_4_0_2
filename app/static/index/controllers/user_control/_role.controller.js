/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  角色管理
 */
module.exports = homePageModule =>{
    homePageModule.controller('RoleController',
    ['$scope',"localStorageService","$state","$timeout","$stateParams","HomePageServer",
    function ($scope,localStorageService, $state,$timeout,$stateParams,HomePageServer) {
        $scope.vm = {
            roleListDate : [] , //所有角色
            paginationConf : {     //分页条件
                pageSize : 5 ,
                pagesLength : 8,
            }  ,
            roleName : "" ,
            roleDescription : "" ,
            addRole : addRole ,
            deleteRole : deleteRole
        }  ;
        let roleHtml = require("../../views/permission_management/dialog_role.html");
        function queryRoleList(index){
            HomePageServer.queryRoleList.save({
                "index":(index -1)*$scope.vm.paginationConf.pageSize,
                "pageSize":$scope.vm.paginationConf.pageSize
            },function (response) {
                if(response.status == 200) {
                    $scope.vm.roleListData = response.data ;
                    $scope.vm.paginationConf.totalItems = response.total ;
                    $scope.vm.paginationConf.numberOfPages = response.total/$scope.vm.paginationConf.pageSize;
                }
            })
        }
        addRole();
        function addRole(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,roleHtml,"900px",function(){
            })
        }
        // 删除
        function deleteRole(id){
            HomePageServer.deleteRole.save({id:121212121},function(response){
                if(response.status == 200){
                    layer.msg("角色删除成功")
                }
            },function (error) {
                console.log(error)
            })
        }
    }
])
};