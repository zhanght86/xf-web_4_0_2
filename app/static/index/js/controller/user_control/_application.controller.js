/**
 * @Author : MILES .
 * @Create : 2017/6/13.
 * @Module : 应用管理
 */
angular.module('homePage').controller('adminContentController', [
    '$scope',"$state","$timeout","$stateParams","ngDialog","$cookieStore","$rootScope",
    function ($scope,  $state,$timeout,$stateParams,ngDialog,$cookieStore,$rootScope) {
        $scope.vm = {
            userName : USER_NAME,
            userPermission : $stateParams.userPermission,
            addApplicationWindow : addApplicationWindow,
            myApplication : "",

            newApplicationName : "",
            newLicence : "",
            newDescribe : "",
            selectScene : selectScene
        };
        function selectScene(id,applicationId){
            $cookieStore.put("applicationId",applicationId);
            $.getScript('/js/common/config.js');
            $scope.MASTER.queryChannelList(applicationId) ;
        }
        getUserInfo();
        myApplication();
        //获取用户信息
        function getUserInfo(){
            httpRequestPost("/api/user/findRoleIdByUserId",{
                "userId":USER_ID
            },function(data){
                //if(data.status==200){
                    console.log(data);
                    $scope.vm.userPermission = data.data.roleList;
                $scope.$apply();
                //}
            },function(err){
            });
        }
        //获取所有应用
        function myApplication(){
            httpRequestPost("/api/application/application/get/user",{
            },function(response){
                console.log(response);
                $scope.vm.myApplication = response.data;
                $scope.$apply();
            },function(err){
                //console.log(err)
            });

        }
        //打开添加窗口
        function addApplicationWindow() {
            var dialog = ngDialog.openConfirm({
                template:"/static/index/user_control/switch_application/add_application.html",
                scope:$scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if(applicationValidate()==false){
                            return false;
                        }
                        addApplication();
                    }else{
                        $scope.vm.newApplicationName="";
                        $scope.vm.newLicence="";
                        $scope.vm.newDescribe="";
                    }
                }

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
            //console.log(getCookie("userId"),$scope.vm.newApplicationName,$scope.vm.newScene,$scope.vm.newLicence,$scope.vm.newDescribe);
            httpRequestPost("/api/application/application/add",{
                "name": $scope.vm.newApplicationName,
                "license": $scope.vm.newLicence,
                "description": $scope.vm.newDescribe
            },function(data){
                if(data.status==200){
                    $state.reload();
                }else{
                    layer.msg(data.data);
                }
                console.log(data)
            },function(err){
                console.log(err)
            });
        }
    }
]);