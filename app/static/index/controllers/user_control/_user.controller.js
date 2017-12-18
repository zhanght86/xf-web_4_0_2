/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module : 用户管理
 */
module.exports = homePageModule =>{
    homePageModule.controller('UserController',
    ['$scope',"localStorageService","$state","$timeout","$stateParams","HomePageServer","ngDialog",
    function ($scope,localStorageService, $state,$timeout,$stateParams,HomePageServer,ngDialog) {
        $scope.vm = {
            userList : "",   // table 数据
            queryUserList : queryUserList,
            paginationConf : {     //分页条件
                pageSize : 5 ,
                pagesLength : 8
            }  ,
            addUser : addUser,
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
        };
        // 定义弹框
        let verifyHtml = require("../../../../share/dialog_simple_operate.html") ;
        let userHtml = require("../../views/user_control/permission_management/dialog_user.html") ;
        function selectAll(ev){
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
            if($scope.vm.deleteIds.inArray(id)){
                $scope.vm.deleteIds.remove(id);
            }else{
                $scope.vm.deleteIds.push(id);
            }
            console.log( $scope.vm.deleteIds)
        }
        queryUserList(1);
        //查询用户列表
        function queryUserList(index,userName){
            $scope.vm.deleteIds = [];   // 清楚选中用户
            HomePageServer.queryUserList.save({
                "account" : userName?userName:"" ,
                "index":(index -1)*$scope.vm.paginationConf.pageSize,
                "pageSize":$scope.vm.paginationConf.pageSize
            },function(response){
                if(response.status == 200 ){
                    $scope.vm.userList = response.data;
                    $scope.vm.paginationConf.totalItems = response.total ;
                    $scope.vm.paginationConf.numberOfPages = response.total/$scope.vm.paginationConf.pageSize;
                }
            },function(error){
                console.log(error);
            })
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    queryUserList(current,$scope.vm.searchName);
                }, 0)
            }
        },true);
        //添加用户校验
        function verifyRelease(close){
            if($scope.vm.userName == null || $scope.vm.userName == ""){
                layer.msg("姓名不能为空!") ;
                $scope.vm.allowSubmit=0;
                return 0;
            }
            var name = /^[A-Za-z\u4e00-\u9fa5]+$/;
            if(!name.test($scope.vm.userName)){
                layer.msg("姓名只可以输入汉字或字母的组合!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userName.length > 20){
                layer.msg("姓名的长度不能超过20个字符!");
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
                layer.msg("登录名只可以是数字、字母、下划线组合，4-20个字符!",{time:1000});
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
                layer.msg("密码只可以是数字和字母组合!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userPassword.length>20){
                layer.msg("密码长度不能超过20个字符!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.userPhoneNumber == null || $scope.vm.userPhoneNumber == ""){
                layer.msg("手机号不能为空!");
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
                layer.msg("请至少选择一个应用!") ;
                $scope.vm.allowSubmit=0;
                return 0;
            }
            close(1) ;
            // return 1;
        }
        //添加编辑用户
        function addUser(data){
            let callback,
                param = {
                    "account": $scope.vm.userName,
                    "pwd": $scope.vm.userPassword,
                    "phone": $scope.vm.userPhoneNumber,
                    "email": $scope.vm.userEmail,
                    "roleId": $scope.vm.roleId,
                    "applicationIds": $scope.vm.prop
                 };
            if(data){  // 编辑
                useData() ;
                param.id = data.id ;
                callback = function(){
                    HomePageServer.addUser.save(param, function (response) {
                        if (data.status == 200) {
                            layer.msg("用户修改成功!");
                        } else {
                            // console.log("用户修改失败!");
                        }
                    }, function (error) {
                        console.log(error);
                    })
                }
            }else{    // 新增
                initDate();
                callback = function(){
                    HomePageServer.addUser.save(param, function (response) {
                        if(response.status == 200){
                            queryUserList($scope.vm.paginationConf.currentPage,$scope.vm.searchName);
                        }else{
                        }
                    }, function (error) {
                        console.log(error);
                    })
                }
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,userHtml,"680px",function(){
                callback() ;
            })
        }
        //删除用户
        function deleteUser(userIds){
            if(nullCheck($scope.vm.deleteIds) == 0 && !userId){
                layer.msg("请您选择要删除的用户！");
                return;
            } ;
            $scope.vm.simpleOperateTitle = "确认要删除吗" ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,verifyHtml,"",function(){
                HomePageServer.deleteUser.save({},function () {
                    ids:userIds?userId:$scope.vm.deleteIds
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
        function useData(){
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
        }
        // 弹框数据初始化
        function initDate(){
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
        }

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

}])
};