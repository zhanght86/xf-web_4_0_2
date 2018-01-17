/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module : 用户管理
 */
module.exports = homePageModule =>{
    homePageModule.controller('UserController',
    ['$scope',"localStorageService","$state","$timeout","$stateParams","HomePageServer","ngDialog","$location" ,
    function ($scope,localStorageService, $state,$timeout,$stateParams,HomePageServer,ngDialog,$location) {
        $scope.vm = {
            userList : "",   // table 数据
            userListIds : [] , // 用户所有的 id
            queryUserList : queryUserList,
            paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : queryUserList,
                location : true
            }  ,
            addUser : addUser,
            deleteIds : [],
            changePassword : changePassword ,
            deleteUser:deleteUser,
            changeStatus:changeStatus,
            userId:"",
            verifyRelease:verifyRelease,
            //添加用户所需要数据
            userName : "",
            userLonginName :  "",
            userPassword :  "",
            userConfirmPassword : "", //用户所输入确认密码
            userPhoneNumber  :  "",
            userEmail :"",
            //查询所需数据
            searchName:"",
            //查询当前所有应用
            listApplication : "",
            //查询当前所有角色
            roleList:"",
            roleId :"",
            applicationIds:[],
        };
        // 定义弹框
        let verifyHtml         = require("../../../../share/dialog_simple_operate.html") ;
        let userHtml           = require("../../views/permission_management/dialog_user.html") ;
        let changePasswordHtml = require("../../views/permission_management/dialog_change_password.html");
        //查询用户列表
        queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function queryUserList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
            let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
            $scope.vm.deleteIds    = [];   // 清楚选中用户
            $scope.vm.userListIds  = [];   // 清楚用户id列表
            HomePageServer.queryUserList.save({
                "account" : $scope.vm.searchName?$scope.vm.searchName:"" ,
                "index":(index -1)*pageSize,
                "pageSize":pageSize
            },function(response){
                layer.close(i) ;
                if(response.status == 200 ){
                    $scope.vm.userIds = [] ;
                    $scope.vm.userList = response.data.data;
                    $scope.vm.paginationConf.totalItems = response.data.total ;
                    $scope.vm.paginationConf.numberOfPages = response.data.total/pageSize;
                    $scope.vm.userListIds = response.data.data.map(user=>user.id)
                }
            },function(error){
                layer.close(i) ;
                console.log(error);
            })
        }
        // // 修改密码
        function changePassword(id){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,changePasswordHtml,"450px",function(){
                HomePageServer.changePassword.save({
                    "id"    : id,
                    "oldPwd": hex_md5($scope.vm.userOldPassword) ,
                    "pwd"   : hex_md5($scope.vm.userPassword)
                },function (response) {
                    if(response.status == 200){
                        $state.reload() ;
                    }else{
                        layer.msg(response.data);
                    }
                },function (error) {console.log(error);})
            })
        }
        //添加用户校验
        function verifyRelease(id,account,close){
            if(!nullCheck($scope.vm.applicationIds)){
                layer.msg("请至少选择一个应用!") ;
            }else{
                HomePageServer.checkUserName.save({
                    "account" :account ,
                    "id"      :id
                },function (response) {
                    if(response.status == 200){
                        close(1)
                    }else{
                        layer.msg(response.data)
                    }
                },function (error) {console.log(error)}) ;
            }
        }
        // 添加/编辑用户
        function addUser(data){
            let callback, param ;
            if(data){  // 编辑
                useData(data) ; // 初始化列表数据
                callback = function(parameter){
                    HomePageServer.updateUser.save(parameter, function (response) {
                        if (response.status == 200) {
                            layer.msg("用户修改成功!");
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        } else {
                            layer.msg(response.data)
                        }
                    }, function (error) {console.log(error);})
                }
            }else{    // 新增
                initDate(); // 初始化列表数据
                callback = function(parameter){
                    HomePageServer.addUser.save(parameter, function (response) {
                        if(response.status == 200){
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        }else{
                            layer.msg(response.data)
                        }
                    }, function (error) {console.log(error);})
                }
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,userHtml,"680px",function(){
                param = {
                    "name"          : $scope.vm.userName ,
                    "account"       : $scope.vm.userLoginName,
                    "phone"         : $scope.vm.userPhoneNumber,
                    "email"         : $scope.vm.userEmail,
                    "roleId"        : $scope.vm.roleId,
                    "applicationIds": $scope.vm.applicationIds
                } ;
                if($scope.vm.userId){
                    param.id = $scope.vm.userId
                }else{
                    param.pwd = hex_md5($scope.vm.userPassword)
                }
                callback(param) ;
            })
        }
        //删除用户
        function deleteUser(userIds){
            if(!nullCheck(userIds)){
                layer.msg("请您选择要删除的用户！");
                return;
            }
            $scope.vm.simpleOperateTitle = "确认要删除吗" ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,verifyHtml,"",function(){
                HomePageServer.deleteUser.save({
                    ids:userIds
                },function (response) {
                    if(response.status == 200){
                        layer.msg("用户删除成功!");
                        if($scope.vm.userList.length==1){
                            $scope.vm.paginationConf.currentPage -= 1 ;
                            console.log($scope.vm.paginationConf.currentPage )
                        }else{
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize)
                        }
                    }else{
                        layer.msg(response.data)
                    }
                },function (error) {console.log(error)})
            }) ;
        }
        //改变用户状态
        function changeStatus(userId,status = 1) {
            if(status == 0){
                $scope.vm.simpleOperateTitle = "确认要启用该用户吗？" ;
            }else {
                $scope.vm.simpleOperateTitle = "确认要停用该用户吗？" ;
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,verifyHtml,"",function(){
                HomePageServer.updateUserStatus.save({
                    "id": userId,
                    "status": status?0:1
                }, function (response) {
                    if(response.status == 200){
                        queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        layer.msg("用户状态修改成功!");
                    }else{

                    }
                }, function (error) {
                    console.log(error);
                })
            });
        }
        function useData(data){
            $scope.vm.userId = data.id;
            $scope.vm.userName = data.name;
            $scope.vm.userLoginName = data.account;
            $scope.vm.userPassword = null;
            $scope.vm.userPhoneNumber = data.phone;
            $scope.vm.userEmail = data.email;
            $scope.vm.roleId = data.roleId;
            $scope.vm.applicationIds = data.applicationIdList;
        }
        // 弹框数据初始化
        function initDate(){
            //取消的同时清空数据
            $scope.vm.userId = "";
            $scope.vm.userName = "";
            $scope.vm.userLoginName = "";
            $scope.vm.userPassword = "";
            $scope.vm.userConfirmPassword = "";
            $scope.vm.userPhoneNumber = "";
            $scope.vm.userEmail = "";
            $scope.vm.applicationIds = [];
            $scope.vm.roleId = $scope.vm.roleList[0].id ;  // 初始化roleId
        }
        //获取应用列表
        (function queryAllApplication(){
            HomePageServer.queryAllApplication.save({},function (response) {
                if(response.status == 200 ){
                    $scope.vm.listApplication = response.data
                }
            },function(error){console.log(error)}) ;
        })()
        //获取角色列表
        queryRoleList();
        function queryRoleList(){
            HomePageServer.queryRoleList.save({
                "index":0,
                "pageSize":999
            },function (response) {
                if(response.status == 200) {
                    $scope.vm.roleList = response.data.data.filter(item => (item.name != '超级管理员'));
                }
            })
        }
}])};
