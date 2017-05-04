
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('adminModule').controller('adminContentController', [
    '$scope',"$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,  $state,$timeout,$stateParams,ngDialog,$cookieStore) {
        $scope.vm = {
            userName :"",
            userPermission : $stateParams.userPermission,
            addApplicationWindow : addApplicationWindow,
            myApplication : "",
            selectLicence : "",
            newApplicationName : "",
            newScene : "",
            newLicence : "",
            newDescribe : "",
            selectScene : selectScene
        };

        function selectScene(id,applicationId){
            $cookieStore.put("sceneId",id);
            $cookieStore.put("applicationId",applicationId);
        }
        getUserInfo();
        myApplication();
        selectLicence();
        //获取用户信息
        function getUserInfo(){
            httpRequestPost("/api/user/findRoleIdByUserId",{
                "userId":$cookieStore.get("userId")
            },function(data){
                //if(data.status==200){
                    console.log(data);
                    $scope.vm.userPermission = data.data.roleList;
                //}
            },function(err){
            });
        }
        //获取当前 应用场景
        function myApplication(){
            //console.log(getCookie("userId"));
            httpRequestPost("/api/application/application/listApplicationByUserId",{
                "userId":$cookieStore.get("userId")
            },function(data){
                console.log(data);
                $scope.vm.myApplication = data.data;
                $scope.$apply();
            },function(err){
                //console.log(err)
            });

        }

        //var timeout = $timeout(function () {
        //     $scope.vm.selectLicence = ["d","a","b"]
        //},3000);
        //获取 scene
       function selectLicence(){
           httpRequestPost("/api/application/scene/listAllScene",{
            },function(data){
                $scope.vm.selectLicence = data.data;
                $scope.vm.newScene=data.data[0].sceneId;
                console.log(data.data);
                $scope.$apply();
                return data.data
            },function(err){
                console.log(err)
         });
       }

        //打开添加窗口
        function addApplicationWindow() {
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/addAdmin.html",
                scope:$scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addApplication()
                    }else{
                        $scope.vm.newApplicationName="";
                        $scope.vm.newLicence="";
                        $scope.vm.newDescribe="";
                    }
                }

            });
        }
        //添加
        function addApplication(){
            console.log(getCookie("userId"),$scope.vm.newApplicationName,$scope.vm.newScene,$scope.vm.newLicence,$scope.vm.newDescribe);
            httpRequestPost("/api/application/application/addApplication",{
                "userId":$cookieStore.get("userId"),
                "applicationName": $scope.vm.newApplicationName,
                "sceneId": $scope.vm.newScene,
                "applicationLisence": $scope.vm.newLicence,
                "applicationDescription": $scope.vm.newDescribe
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