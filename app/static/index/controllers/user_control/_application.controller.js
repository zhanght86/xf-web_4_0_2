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
            userRole : $stateParams.userPermission,
            addApplicationWindow : addApplicationWindow,
            myApplication : "",
            newApplicationName : "",
            newLicence : "",
            newDescribe : "",
            selectApplication : selectApplication
        };
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
            $.getScript('assets/js/common/config.js');
            $scope.MASTER.queryChannelList(application.id) ;
        }
        //打开添加窗口
        function addApplicationWindow() {
            $scope.$parent.$parent.MASTER.openNgDialog($scope,addApplicationHtml,"650px",function(){
                if(applicationValidate()==false){
                    return false;
                }
                addApplication();
            },function(){
                $scope.vm.newApplicationName="";
                $scope.vm.newLicence="";
                $scope.vm.newDescribe="";
            },function(){
            });
        }
        function applicationValidate(){
            if(lengthCheck($scope.vm.newApplicationName,0,50)==false){
                layer.msg("应用名称不能为空或超过长度限制50");
                return false;
            }
            if(lengthCheck($scope.vm.newLicence,0,20)==false){
                layer.msg("LICENSE不能为空或超过长度限制20");
                return false;
            }
            return true;
        }
        //添加
        function addApplication(){
            HomePageServer.addApplication.save({
                "name": $scope.vm.newApplicationName,
                "license": $scope.vm.newLicence,
                "description": $scope.vm.newDescribe
            },function(data){
                if(data.status==200){
                    $state.reload();
                }else{
                    layer.msg(data.data);
                }
            },function(err){
                console.log(err)
            })
        }
    }])
};