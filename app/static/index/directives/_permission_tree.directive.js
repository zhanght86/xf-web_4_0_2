/**
 * @Author : MILES .
 * @Create : 2017/12/18.
 * @Module : 权限管理 树形菜单
 */
module.exports = module =>{
    module
        .directive('zTree',["HomePageServer","$interval",function(HomePageServer,$interval){
            return {
                restrict: 'A',
                link: function ($scope, element, attrs, ngModel) {
                    var setting = {
                        check: {
                            enable: true,
                            nocheckInherit: false,
                            chkStyle: "checkbox" ,
                            chkboxType: { "Y": "p", "N": "s" }
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback:{
                            onCheck:onCheck
                        }
                    };
                    $scope.permissionList = [] ;
                    // 新增角色 查询所有权限
                    HomePageServer.queryPermissionList.save({},function(allPermission){
                        if(allPermission.status == 200){
                            console.log($scope.permissionList,$scope.vm.roleId);
                            // 查询角色对应的权限
                            if($scope.vm.roleId){
                                HomePageServer.queryRoleInfo.get({roleId:$scope.vm.roleId},function (rolePermission) {
                                    angular.forEach(allPermission.data,function(permission,index){
                                        if(parseInt(permission.id)<10){
                                            permission.open = false ;
                                        }
                                        permission.checked = rolePermission.data.roleMenuList.some((item)=>{
                                            return item.groupId == permission.id
                                        }) ;
                                        $scope.permissionList.push(permission)
                                    }) ;
                                }).$promise.then(function(){
                                    $.fn.zTree.init(element, setting, $scope.permissionList).expandAll(true);
                                })
                            }else{
                                angular.forEach(allPermission.data,function(permission,index){
                                    if(parseInt(permission.id)<10){
                                        permission.open = false ;
                                    }
                                    permission.checked = false ;
                                    $scope.permissionList.push(permission)
                                }) ;
                                $.fn.zTree.init(element, setting, $scope.permissionList).expandAll(true);
                            }
                        }
                    });
                    //过滤节点的机制 直接return node表示不做任何过滤
                    function filter(node) {
                        return node;
                    }
                    function onCheck(data,data2,data3,data4) {
                    //   点击回调
                    }
                    ///动态设置zTree的所有节点有checkbox
                    function DynamicUpdateNodeCheck() {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        //根据过滤机制获得zTree的所有节点
                        var nodes = zTree.getNodesByFilter(filter);
                        //遍历每一个节点然后动态更新nocheck属性值
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            node.nocheck = false; //表示显示checkbox
                            zTree.updateNode(node);
                        }
                    }
                    // $.fn.zTree.init(element, setting, zNodes).expandAll(true);
                }
            };
}])};