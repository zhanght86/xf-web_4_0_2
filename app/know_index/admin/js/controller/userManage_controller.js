/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('userManageController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog",

    function ($scope,localStorageService, $state,$timeout,$stateParams,ngDialog) {
        $state.go("admin.userManage");
        setCookie("userId","1");
        $scope.vm = {
            listData : "",   // table 数据
            getData : getData,
            paginationConf : "", //分页条件
            addUser : addUser,
            editUser : editUser,
            deleteUser:deleteUser,
            stop:stop,
            userId:getCookie("userId"),

            //添加用户所需要数据
            userName : "",
            userLonginName :  "",
            userPassword :  "",
            userPhoneNumber  :  "",
            userEmail :"",
            remark:"",
            //查询当前所有应用
            listApplication : "",
            //查询当前所有角色
            listRole:"",
            roleId :"",
            prop :[],
            savaProp : savaProp,
            filter : filter
        };

        getData();
        //查询列表
        function getData(){
            httpRequestPost("/api/user/listUser",{
                index:0,
                pageSize:10,
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.userManageList;
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
        //添加用户
        function addUser(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog.html",
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
                        httpRequestPost("/api/user/addUser",{
                            userId:$scope.vm.userId,
                            userName:$scope.vm.userName,
                            userLoginName:$scope.vm.userLoginName,
                            userPassword:$scope.vm.userPassword,
                            userPhoneNumber:$scope.vm.userPhoneNumber,
                            userEmail:$scope.vm.userEmail,
                            roleId:$scope.vm.roleId,
                            applicationIds:$scope.vm.prop,
                            remark:$scope.vm.remark
                        },function(data){
                            //刷新页面
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //编辑用户
        function editUser(data){

                //userName : "",
            //    userLonginName :  "",
            //    userPassword :  "",
            //    userPhoneNumber  :  "",
            //    userEmail :"",
            //    remark:"",
            $scope.vm.userId = data.userId;
            $scope.vm.userName = data.userName;
            $scope.vm.userLoginName = data.userLoginName;
            $scope.vm.userPassword = data.userPassword;
            $scope.vm.userPhoneNumber = data.userPhoneNumber;
            $scope.vm.userEmail = data.userEmail;
            $scope.vm.remark = data.remark;
            $scope.vm.roleId = data.roleId;
            $scope.vm.prop = data.applicationName;
            console.log(data);
            //$scope.$apply()

            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/userManageDialog2.html",
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
                        httpRequestPost("/api/user/updateUserById",{
                            userId:data.userId,
                            userName:$scope.vm.userName,
                            userLoginName:$scope.vm.userLoginName,
                            userPassword:$scope.vm.userPassword,
                            userPhoneNumber:$scope.vm.userPhoneNumber,
                            userEmail:$scope.vm.userEmail,
                            roleId:$scope.vm.roleId,
                            applicationIds:$scope.vm.prop,
                            remark:$scope.vm.remark
                        },function(data){
                            //刷新页面
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //删除用户
        function deleteUser(userId){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
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
                        httpRequestPost("/api/user/deleteUser",{
                            userId:userId,
                        },function(data){
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //改变用户状态
        function stop(userId,statusId){
            httpRequestPost("/api/user/updateStatus",{
                userId:userId,
                statusId:statusId
            },function(data){
                $state.reload()
            },function(){
                layer.msg("请求失败")
            })
        }

        getApplication();
        //得到应用列表
        function getApplication(){
            httpRequestPost("/api/application/application/listAllApplication",{
            },function(data){
                $scope.vm.listApplication = data.data
            },function(){
                layer.msg("请求失败")
            })
        }

        //得到角色列表
        getRole();
        function getRole(){
            httpRequestPost("/api/user/queryRoleList",{
            },function(data){
                $scope.vm.listRole = data.data
            },function(){
                layer.msg("请求失败")
            })
        }
        function savaProp(ev,id){

            if($(ev.target).prop("checked")){
                $scope.vm.prop.push(id)
            }else{
                $scope.vm.prop.remove(id)
            }
        }
        function filter(val,arr) {
            var len = arr.length;
            for (var i = 0; i < arr.length; i++) {
                if (val != arr[i]) {
                    len -= 1
                }
            }
            if(len == 0){
                return false
            }else{
                return true
            }
        }
            //angular.forEach(arr,function(item){
            //    if(val == item){
            //        console.log(val+"ddddddddddd");
            //        return true;
            //    }else{
            //        return false;
            //    }
            //})

    }
]);