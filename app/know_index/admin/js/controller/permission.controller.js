/**
 * Created by mileS on 2017/3/21.
 */
angular.module('adminModule').controller('userManageController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",

    function ($scope,localStorageService, $state,$timeout,$stateParams,ngDialog,$cookieStore) {
        $state.go("admin.userManage");
        $scope.vm = {
            listData : "",   // table 数据
            getData : getData,
            paginationConf : "", //分页条件
            userDataTotal:"",   //用户总数
            pageSize : 5,
            addUser : addUser,
            editUser : editUser,
            deleteUser:deleteUser,
            search:search,
            stop:stop,
            userId:$cookieStore.get("userId"),
            verifyRelease:verifyRelease,
            //添加用户所需要数据
            userName : "",
            userLonginName :  "",
            userPassword :  "",
            userPassWord : "", //用户所输入确认密码
            userPhoneNumber  :  "",
            userEmail :"",
            remark:"",
            allowSubmit : 1, //是否允许提交
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


        getData(1);
        //查询列表
        function getData(index){
            httpRequestPost("/api/user/listUser",{
                index:(index -1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
            },function(data){
                $scope.vm.listData = data.data.userManageList;
                $scope.vm.userDataTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                //layer.msg("请求失败")
                console.log("请求失败");
            })
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    if($scope.vm.searchName){
                        search(current);
                    }else{
                        getData(current);
                    }
                }, 0)
            }
        },true);

        //添加用户校验
        function verifyRelease(){
            if($scope.vm.userName == null || $scope.vm.userName == ""){
                layer.msg("姓名不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var name = /^[A-Za-z\u4e00-\u9fa5]+$/;
            if(!name.test($scope.vm.userName)){
                layer.msg("姓名只可以输入汉字或字母的组合!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userName.length > 20){
                layer.msg("姓名的长度不能超过20个字符!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userLoginName == null || $scope.vm.userLoginName == ""){
                layer.msg("登录名不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var reg = /^[0-9a-zA-Z_]{4,20}$/;
            if(!reg.test($scope.vm.userLoginName)){
                layer.msg("登录名只可以是数字、字母、下划线组合，4-20个字符!",{time:1000})
                $scope.vm.allowSubmit=0;
                return 0;
            }

            if($scope.vm.userPassword == null || $scope.vm.userPassword == ""){
                layer.msg("密码不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var password = /^[0-9a-zA-Z]+$/;
            if(!password.test($scope.vm.userPassword)){
                layer.msg("密码只可以是数字和字母组合!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userPassword.length>20){
                layer.msg("密码长度不能超过20个字符!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userPhoneNumber == null || $scope.vm.userPhoneNumber == ""){
                layer.msg("手机号不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var re = /^1[0-9]{10}$/;
            if (!re.test($scope.vm.userPhoneNumber)) {
                layer.msg("手机号只可以为1开头的11位数字!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userEmail == null || $scope.vm.userEmail == ""){
                layer.msg("邮箱不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.prop.length == 0){
                layer.msg("请至少选择一个应用!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            return 1;
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
                width : "680px" ,
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.allowSubmit) {
                            httpRequestPost("/api/user/addUser", {
                                userId: $scope.vm.userId,
                                userName: $scope.vm.userName,
                                userLoginName: $scope.vm.userLoginName,
                                userPassword: $scope.vm.userPassword,
                                userPhoneNumber: $scope.vm.userPhoneNumber,
                                userEmail: $scope.vm.userEmail,
                                roleId: $scope.vm.roleId,
                                applicationIds: $scope.vm.prop,
                                remark: $scope.vm.remark,
                            }, function (data) {
                                //刷新页面
                                $state.reload();
                                if (data.status == 10009) {
                                    layer.msg("该登录名已经存在，请重新添加!")
                                } else if (data.status == 10008) {
                                    layer.msg("用户添加成功!");
                                } else {
                                    //layer.msg("用户添加失败!");
                                    console.log("用户添加失败!");
                                }
                            }, function () {
                                //layer.msg("请求失败")
                                console.log("请求失败");
                            })
                        }
                        //保存的同时清空数据
                        $scope.vm.userName = "";
                        $scope.vm.userLoginName = "";
                        $scope.vm.userPassword = "";
                        $scope.vm.userPassWord = "";
                        $scope.vm.userPhoneNumber = "";
                        $scope.vm.userEmail = "";
                        $scope.vm.prop = [];
                        $scope.vm.remark = "";
                    }else{
                        //取消的同时清空数据
                        $scope.vm.userName = "";
                        $scope.vm.userLoginName = "";
                        $scope.vm.userPassword = "";
                        $scope.vm.userPassWord = "";
                        $scope.vm.userPhoneNumber = "";
                        $scope.vm.userEmail = "";
                        $scope.vm.prop = [];
                        $scope.vm.remark = "";
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
            $scope.vm.userPassWord = data.userPassword;
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
                width : "680px" ,
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.allowSubmit) {
                            httpRequestPost("/api/user/updateUserById", {
                                userId: data.userId,
                                userName: $scope.vm.userName,
                                userLoginName: $scope.vm.userLoginName,
                                userPassword: $scope.vm.userPassword,
                                userPhoneNumber: $scope.vm.userPhoneNumber,
                                userEmail: $scope.vm.userEmail,
                                roleId: $scope.vm.roleId,
                                applicationIds: $scope.vm.applicationIds,
                                remark: $scope.vm.remark
                            }, function (data) {
                                //刷新页面
                                $state.reload();
                                if (data.status == 10012) {
                                    layer.msg("用户修改成功!");
                                }else if(data.status = 10009){
                                    layer.msg("登录名重复!");
                                } else {
                                    //layer.msg("用户修改失败!");
                                    console.log("用户修改失败!");
                                }
                            }, function () {
                                //layer.msg("请求失败");
                                console.log("请求失败");
                            })
                        }
                    }else{
                        //取消的同时清空数据
                        $scope.vm.userName = "";
                        $scope.vm.userLoginName = "";
                        $scope.vm.userPassword = "";
                        $scope.vm.userPassWord = "";
                        $scope.vm.userPhoneNumber = "";
                        $scope.vm.userEmail = "";
                        $scope.vm.prop = [];
                        $scope.vm.remark = "";
                    }
                }
            });
        }
        //查询用户
        function search(index){
            if($scope.vm.searchName == '' || $scope.vm.searchName == null){
                getData(1);
            }else {
                httpRequestPost("/api/user/queryUserByUserName", {
                    userName: $scope.vm.searchName,
                    index:(index -1)*$scope.vm.pageSize,
                    pageSize:$scope.vm.pageSize,
                }, function (data) {
                    if (data.status == 10016) {
                        $scope.vm.listData = "";
                        $scope.vm.userDataTotal = 0;
                        $scope.$apply()
                        layer.msg("没有查询到记录!")
                    }
                    $scope.vm.listData = data.data.userManageList;
                    $scope.vm.userDataTotal = data.data.total;
                    $scope.vm.paginationConf = {
                        currentPage: index,//当前页
                        totalItems: data.data.total, //总条数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8,//分页框数量
                    };
                    $scope.$apply()
                }, function () {
                    //layer.msg("请求失败")
                    console.log("请求失败");
                })
            }
        }

        //删除用户
        function deleteUser(userId){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
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
                            if(data.status == 10010){
                                layer.msg("用户删除成功!");
                            }else{
                                //layer.msg("用户删除失败!");
                                console.log("用户删除失败!");
                            }
                            $state.reload()
                        },function(){
                            //layer.msg("请求失败")
                            console.log("请求失败");
                        })
                    }
                }
            });
        }

        //批量删除用户
        //function deleteUsers(){
        //    httpRequestPost("/api/user/deleteUserByIds",{
        //        ids :  $scope.vm.deleteIds
        //    },function(data){
        //        $state.reload();
        //    },function(){
        //        layer.msg("请求失败")
        //    })
        //}

        //批量删除用户
        function deleteUsers(){
            if($scope.vm.deleteIds == 0){
                layer.msg("请您选择要删除的用户！");
                return;
            }
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback : function(e){
                    if(e === 1) {
                        httpRequestPost("/api/user/deleteUserByIds", {
                            ids: $scope.vm.deleteIds
                        }, function (data) {
                            $state.reload();
                        }, function () {
                            //layer.msg("请求失败")
                            console.log("请求失败");
                        })
                    }
                }
            });
        }

        //改变用户状态
        function stop(userId,statusId) {
            if(statusId == 10002){
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/admin/updateDialog1.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {
                        if (e === 1) {
                            httpRequestPost("/api/user/updateStatus", {
                                userId: userId,
                                statusId: statusId
                            }, function (data) {
                                $state.reload();
                                if (data.status == 10012) {
                                    layer.msg("用户状态修改成功!");
                                } else {
                                    //layer.msg("用户状态修改失败!");
                                    console.log("用户状态修改失败!");
                                }
                            }, function () {
                                //layer.msg("请求失败")
                                console.log("请求失败");
                            })
                        }
                    }
                });
            }else {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/admin/updateDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {
                        if (e === 1) {
                            httpRequestPost("/api/user/updateStatus", {
                                userId: userId,
                                statusId: statusId
                            }, function (data) {
                                $state.reload();
                                if (data.status == 10012) {
                                    layer.msg("用户状态修改成功!");
                                } else {
                                    //layer.msg("用户状态修改失败!");
                                    console.log("用户状态修改失败!");
                                }
                            }, function () {
                                //layer.msg("请求失败")
                                console.log("请求失败");
                            })
                        }
                    }
                });
            }
        }

        getApplication();
        //得到应用列表
        function getApplication(){
            httpRequestPost("/api/application/application/listAllApplication",{
            },function(data){
                $scope.vm.listApplication = data.data
            },function(){
                //layer.msg("请求失败")
                console.log("请求失败");
            })
        }

        //得到角色列表
        getRole();
        function getRole(){
            httpRequestPost("/api/user/queryRoleList",{
            },function(data){
                $scope.vm.listRole = data.data
            },function(){
                //layer.msg("请求失败")
                console.log("请求失败");
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