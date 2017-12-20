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
            roleList:"",
            roleId :"",
            prop :[],
            applicationIds:[],
        };
        // 定义弹框
        let verifyHtml = require("../../../../share/dialog_simple_operate.html") ;
        let userHtml = require("../../views/permission_management/dialog_user.html") ;
        //查询用户列表
        queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize)
        function queryUserList(index,pageSize,userName){
            $scope.vm.deleteIds    = [];   // 清楚选中用户
            $scope.vm.userListIds  = [];   // 清楚用户id列表
            HomePageServer.queryUserList.save({
                "account" : $scope.vm.userName?$scope.vm.userName:"" ,
                "index":(index -1)*pageSize,
                "pageSize":pageSize
            },function(response){
                if(response.status == 200 ){
                    $scope.vm.userIds = [] ;
                    $scope.vm.userList = response.data;
                    $scope.vm.paginationConf.totalItems = response.total ;
                    $scope.vm.paginationConf.numberOfPages = response.total/$scope.vm.paginationConf.pageSize;
                    angular.forEach(response.data,function(user,index){
                        $scope.vm.userListIds.push(user.id)
                    })
                }
            },function(error){
                console.log(error);
            })
        }
        // var timeout ;
        // $scope.$watch('vm.paginationConf', function(current,old){
        //     if((current.currentPage != old.currentPage) || (current.pageSize != old.pageSize )){
        //         $location.search({"currentPage":current.currentPage,"pageSize":current.pageSize}) ;
        //         if (timeout) {
        //             $timeout.cancel(timeout)
        //         }
        //         timeout = $timeout(function () {
        //             queryUserList(current.currentPage,current.pageSize,$scope.vm.searchName);
        //         }, 0)
        //     }
        // },true);


        // // 修改密码
        function changePassword(){

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
                // HomePageServer.addUser.save({
                //
                // },function (response) {
                //     if(response.status == 200){
                //         close(1) ;
                //     }else{
                //         layer.msg(response.data)
                //     }
                // },function (error) {console.log(error)})

            }
        }
        // 添加/编辑用户
        function addUser(data){
            let callback, param ;
            if(data){  // 编辑
                useData() ; // 初始化列表数据
                callback = function(parameter){
                    HomePageServer.addUser.save(parameter, function (response) {
                        if (data.status == 200) {
                            layer.msg("用户修改成功!");
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.searchName);
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
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.searchName);
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
                    "pwd"           : $scope.vm.userPassword,
                    "phone"         : $scope.vm.userPhoneNumber,
                    "email"         : $scope.vm.userEmail,
                    "roleId"        : $scope.vm.roleId,
                    "applicationIds": $scope.vm.applicationIds
                } ;
                if($scope.vm.userId){param.id = $scope.vm.userId }
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
                    }else{
                    }
                },function (error) {console.log(error)})
            }) ;
        }
        //改变用户状态
        function changeStatus(userId,status = 1) {
            if(status == 0){
                $scope.vm.simpleOperateTitle = "确认要启用该用户吗？" ;
            }else {
                status = 0 ;
                $scope.vm.simpleOperateTitle = "确认要停用该用户吗？" ;
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,verifyHtml,"",function(){
                HomePageServer.updateUserStatus.save({
                    "id": userId,
                    "status": status
                }, function (response) {
                    if(response.status == 200){
                        queryUserList(1) ;
                        layer.msg("用户状态修改成功!");
                    }else{

                    }
                }, function (error) {
                    console.log(error);
                })
            });
        }
        function useData(data){
            $scope.vm.userId = data.userId;
            $scope.vm.userName = data.userName;
            $scope.vm.userLoginName = data.userLoginName;
            $scope.vm.userPassword = data.userPassword;
            $scope.vm.userPhoneNumber = data.userPhoneNumber;
            $scope.vm.userEmail = data.userEmail;
            $scope.vm.roleId = data.roleId;
            $scope.vm.applicationIds = data.applicationIds;
        }
        // 弹框数据初始化
        function initDate(){
            //取消的同时清空数据
            $scope.vm.userId = "";
            $scope.vm.userName = "";
            $scope.vm.userLoginName = "";
            $scope.vm.userPassword = "";
            $scope.vm.userPassWord = "";
            $scope.vm.userPhoneNumber = "";
            $scope.vm.userEmail = "";
            $scope.vm.prop = [];
            $scope.vm.remark = "";
            $scope.vm.roleId = $scope.vm.roleList[0].id ;  // 初始化roleId
        }
        queryAllApplication();
        //得到应用列表
        function queryAllApplication(){
            HomePageServer.queryAllApplication.save({},function (response) {
                if(response.status == 200 ){
                    $scope.vm.listApplication = response.data
                }
            },function(error){console.log(error)}) ;
        }
        //得到角色列表
        queryRoleList();
        function queryRoleList(index){
            HomePageServer.queryRoleList.save({
                "index":(index -1)*$scope.vm.paginationConf.pageSize,
                "pageSize":$scope.vm.paginationConf.pageSize
            },function (response) {
                if(response.status == 200) {
                    $scope.vm.roleList = response.data.filter(item => (item.name != '超级管理员'));
                }
            })
        }

}])
};