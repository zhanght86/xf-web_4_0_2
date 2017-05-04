/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('loginModule').controller('loginController', [
    '$scope', '$location', 'localStorageService' ,"$state" ,"$cookieStore",
    function ($scope, $location, localStorageService, $state,$cookieStore) {

        $scope.vm = {
            userName: '',
            password: '',
            randomNumber: randomNumber(4),
            randomNumberValue: "",
            randomNumberChange : randomNumberChange,
            login: login,
            keyLogin : keyLogin
        };
       function keyLogin($event){
            if($event.keyCode==13){//回车
                login();
            }
        }
        //改变验证码
        function randomNumberChange(){
            $scope.vm.randomNumber = randomNumber(4)
        }
         //登陆
        function login(){
            //$state.go("materialManagement.chatKnowledgeBase",{userPermission : "['超级管理员','初级管理员']"});
            if($scope.vm.randomNumberValue.length==0){
                console.log($scope.vm.randomNumberValue);
                layer.msg("验证码不能为空")
            }else if($scope.vm.randomNumberValue!=$scope.vm.randomNumber){
                layer.msg("验证码错误");
            }else if($scope.vm.userName == ""){
                layer.msg("用户名不能为空");
            }else if($scope.vm.password == ""){
                layer.msg("密码不能为空");
            }else{
                httpRequestPost("/api/user/userLogin",{
                    "userLoginName":$scope.vm.userName,
                    "userPassword":$scope.vm.password
                },function(data){
                    if(data.status==10006){
                        // cookie  userId userName
                        $cookieStore.put("userId" , data.data.userId);
                        $cookieStore.put("userName" , data.data.userName);
                        $state.go("admin");
                    }else if(data.status==10007){
                        $scope.vm.randomNumber = randomNumber(4);
                        $scope.vm.randomNumberValue = "";
                        layer.msg("用户名或密码错误");
                    }
                    console.log(data)

                },function(err){
                    layer.msg("登陆失败");
                    $scope.vm.randomNumber = randomNumber(4);
                    $scope.vm.randomNumberValue = "";
                    //console.log(err)
                });
            }
        }

        //  随机产生四位验证码
        function randomNumber(number){
            var rnd="";
            for(var i=0;i<number;i++){
                rnd+=Math.floor(Math.random()*10);
            }
                return rnd;
        }
        //$scope.loginFailed = false;
      //
      //  $scope.login = function () {
      //      //校验表单数据
      //      var credentials = $scope.credentials;
      //      // console.log(credentials)
      //      if(!credentials.loginName){
      //          loginControllerScope.errMsg = '用户名不能为空';
      //          return;
      //      }
      //      if(!credentials.loginPwd){
      //          loginControllerScope.errMsg = '密码不能为空';
      //          return;
      //      }
      //      if(!credentials.randCheckCode){
      //          loginControllerScope.errMsg = '验证码不能为空';
      //          return;
      //      }
      //      AuthService.login($scope.credentials, function (data) {
      //          // console.log(data);
      //          loginControllerScope.setCurrentUser(data);
      //      }, function (errMsg) {
      //          loginControllerScope.loginFailed = true;
      //          loginControllerScope.errMsg = errMsg;
      //          credentials.randCheckCode='';
      //          $scope.reloadRandCheckCode();
      //      });
      //  }
      //
      //  $scope.reloadRandCheckCode = function () {
      //      document.getElementById("CreateCheckCode").src = document.getElementById("CreateCheckCode").src + "?nocache=" + new Date().getTime();
      //  }
      //
      //  $scope.reloadRandCheckCode();
      //
      //  $scope.enterEvent = function(e){
      //      loginControllerScope.errMsg = '';
      //      var keycode = window.event?e.keyCode:e.which;
      //      if(keycode==13){
      //          $scope.login();
      //      }
      //  }
    }
])