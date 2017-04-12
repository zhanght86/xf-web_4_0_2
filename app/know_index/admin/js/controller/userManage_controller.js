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
            userDataTotal:"",   //用户总数
            addUser : addUser,
            editUser : editUser,
            deleteUser:deleteUser,
            search:search,
            stop:stop,
            userId:getCookie("userId"),

            //添加用户所需要数据
            userName : "",
            userLonginName :  "",
            userPassword :  "",
            userPhoneNumber  :  "",
            userEmail :"",
            remark:"",
            //查询所需数据
            searchName:"",
            //查询当前所有应用
            listApplication : "",
            //查询当前所有角色
            listRole:"",
            roleId :"",
            prop :[],
            applicationIds:[],
            savaProp : savaProp,
            saveProp : saveProp ,
            filter : filter,
            selectAll : selectAll,
            selectSingle : selectSingle,
            deleteIds : [],
            selectAllCheck : false,
            deleteUsers : deleteUsers
        };

        function selectAll(ev){
            //var self = $(ev.target);
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.userId);
                });
            }else{
                $scope.vm.selectAllCheck = false
                $scope.vm.deleteIds = [];
            }
            console.log( $scope.vm.deleteIds)
        }
        function selectSingle(ev,id){
            var self = $(ev.target);
            if(self.attr('checked')){
                self.attr('checked',false);
                $scope.vm.deleteIds.remove(id);
                $(".selectAllBtn").attr("checked",false)
            }else{
                $(".selectAllBtn").attr("checked",false)
                $scope.vm.deleteIds.push(id)
            }
            console.log( $scope.vm.deleteIds)
        }


        getData();
        //查询列表
        function getData(){
            httpRequestPost("/api/user/listUser",{
                index:0,
                pageSize:10,
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.userManageList;
                $scope.vm.userDataTotal = data.data.total;
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
                            remark:$scope.vm.remark,
                        },function(data){
                            //刷新页面
                            $state.reload()
                            if(data.status == 10009){
                                layer.msg("数据重复!")
                            }
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //编辑用户
        function editUser(data){
            $scope.vm.userId = data.userId;
            $scope.vm.userName = data.userName;
            $scope.vm.userLoginName = data.userLoginName;
            $scope.vm.userPassword = data.userPassword;
            $scope.vm.userPhoneNumber = data.userPhoneNumber;
            $scope.vm.userEmail = data.userEmail;
            $scope.vm.remark = data.remark;
            $scope.vm.roleId = data.roleId;
            $scope.vm.prop = data.applicationName;
            $scope.vm.applicationIds = data.applicationIds;
            console.log(data.applicationIds);
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
                            applicationIds:$scope.vm.applicationIds,
                            remark:$scope.vm.remark
                        },function(data){
                            //刷新页面
                            $state.reload();
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
        }
        //查询用户
        function search(){
            httpRequestPost("/api/user/queryUserByUserName",{
                userName:$scope.vm.searchName,
            },function(data){
                $scope.vm.listData = data.data.userManageList;
                $scope.vm.userDataTotal = data.data.total;
            },function(){
                layer.msg("请求失败")
            })
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

        //批量删除用户
        function deleteUsers(){
            httpRequestPost("/api/user/deleteUserByIds",{
                ids :  $scope.vm.deleteIds
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
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
            console.log(id)
            if($(ev.target).prop("checked")){
                $scope.vm.prop.push(id)
            }else{
                $scope.vm.prop.remove(id)
            }
        };

        function saveProp(ev,id){
            if($(ev.target).prop("checked")){
                $scope.vm.applicationIds.push(id)
            }else{
                $scope.vm.applicationIds.remove(id)
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
    }
]);