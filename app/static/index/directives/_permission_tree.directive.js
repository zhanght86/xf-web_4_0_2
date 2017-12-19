/**
 * @Author : MILES .
 * @Create : 2017/12/18.
 * @Module : 权限管理 树形菜单
 */
module.exports = module =>{
    module
        .directive('zTree',["HomePageServer",function(HomePageServer){
            return {
                // require: '?ngModel',
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
                        }
                    };
                    $scope.permissionList = [] ;
                    // 新增角色 查询所有权限
                    HomePageServer.queryPermissionList.save({},function(response){
                        if(response.status == 200){
                            angular.forEach(response.data,function(permission,index){
                                if(parseInt(permission.id)<10){
                                    permission.open = false ;
                                }
                                permission.checked = false ;
                                $scope.permissionList.push(permission)
                            }) ;
                            console.log($scope.permissionList)
                        }
                    }).$promise.then(function(){
                        $.fn.zTree.init(element, setting, $scope.permissionList).expandAll(true);
                    }) ;
                    //ztree用于初始化的静态数据
                    // var zNodes = [
                    //     { id:1, pId:0, name:"随意勾选 1", open:true},
                    //     { id:11, pId:1, name:"随意勾选 1-1", open:true},
                    //     { id:111, pId:11, name:"随意勾选 1-1-1"},
                    //     { id:112, pId:11, name:"随意勾选 1-1-2"},
                    //     { id:12, pId:1, name:"随意勾选 1-2", open:true},
                    //     { id:121, pId:12, name:"随意勾选 1-2-1"},
                    //     { id:122, pId:12, name:"随意勾选 1-2-2"},
                    //     { id:2, pId:0, name:"随意勾选 2", checked:true, open:true},
                    //     { id:21, pId:2, name:"随意勾选 2-1"},
                    //     { id:22, pId:2, name:"随意勾选 2-2", open:true},
                    //     { id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
                    //     { id:222, pId:22, name:"随意勾选 2-2-2"},
                    //     { id:23, pId:2, name:"随意勾选 2-3"}
                    // ];
                    //过滤节点的机制 直接return node表示不做任何过滤
                    function filter(node) {
                        return node;
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