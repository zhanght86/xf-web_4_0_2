/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  切换应用
 */
module.exports = homePageModule =>{
    homePageModule.controller('ApplicationController',
    ['$scope',"$state","$timeout","$stateParams","ngDialog","$cookieStore","$rootScope","HomePageServer",
    ($scope,  $state,$timeout,$stateParams,ngDialog,$cookieStore,$rootScope,HomePageServer) =>{
        $scope.vm = {
            userName :getCookie("userName"),
            licensePass : false ,
            description : "xf",
            userRole : $stateParams.userPermission,
            addApplicationWindow : addApplicationWindow,
            myApplication : "",
            newApplicationName : "",
            newLicence : "",
            selectApplication : selectApplication,
            applicationValidate : applicationValidate,
            isLicenseValidate :isLicenseValidate,
        };
        $scope.info = {

        } ;

        let addApplicationHtml = require("../../views/switch_application/add_application.html") ;
        //获取用户信息
        HomePageServer.getUserRoleList.get({
            "id" : getCookie("userId")
        },function(response){
            if(response.status==200){
                $scope.vm.userRole = response.data.roleList;
            }
        },function(error){
            console.log(error)
        }) ;
         // 获取用户权限
        HomePageServer.queryRoleInfo.get({roleId:"456234996772896768"},function (rolePermission) {
            let PERMISSION_TREE = rolePermission.data.roleMenuList.map(item=>item.groupId);
            $scope.$parent.$parent.MASTER.permissionTree = PERMISSION_TREE;
            setCookie("permissionTree",PERMISSION_TREE);
            // console.log(rolePermission)
            // angular.forEach(rolePermission,function(permission,index){
            //
            // }) ;
        })
         //获取用户关联应用
        HomePageServer.qeuryApplicationAtUser.get({
            id : getCookie("userId")
        },function(response){
            if(response.status == 200 ){
                $scope.vm.myApplication = response.data;
            }else{

            }
        },function(error){
            console.log(error)
        });
        function selectApplication(application){
            setCookie("applicationName",application.name);
            setCookie("applicationId",application.id);
            setCookie("description",application.description);
            APPLICATION_ID   = application.id;
            APPLICATION_NAME = application.name;
            $.getScript('assets/js/common/config.js');
        }
        //打开添加窗口
        function addApplicationWindow() {
            $scope.$parent.$parent.MASTER.openNgDialog($scope,addApplicationHtml,"650px",function(){
                addApplication();
            },function(){
            },function(){
                $scope.info = {} ;
                $scope.vm.newApplicationName="";
                $scope.vm.newLicence="";
            });
        }
        function isLicenseValidate() {
            HomePageServer.checkLicense.save({
                "license" : $scope.vm.newLicence
            }).$promise.then(function (response) {
                if(response.status == 200){
                    $scope.info = response.data;
                    $scope.vm.licensePass = true ;
                }else{
                    layer.msg(response.info);
                    $scope.vm.licensePass = false ;
                }
            }) ;
        }
        function applicationValidate(){
            let result = true ;
            if(!lengthCheck($scope.vm.newApplicationName,0,50)){
                layer.msg("应用名称不能为空或超过长度限制50");
                result = false;
            }
            // if(!lengthCheck($scope.vm.newLicence,0,20)){
            //     layer.msg("LICENSE不能为空或超过长度限制20");
            //     result = false;
            // }
            return result;
        }
        //添加
        function addApplication(){
            HomePageServer.addApplication.save({
                "name": $scope.vm.newApplicationName,
                "license": $scope.vm.newLicence,
                "description":$scope.vm.description
            },function(response){
                if(response.status==200){
                    let app = response.data.filter(item=>(item.name==$scope.vm.newApplicationName))[0] ;
                    selectApplication(app);
                    $state.go("AM.info");
                }else{
                    layer.msg(response.info);
                }
            },function(error){
                console.log(error)
            })
        }
    }])
};