/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports = loginModule => {
    loginModule.controller('LoginController', [
    '$scope', '$location', 'localStorageService' ,"$state" ,"$cookieStore","LoginServer",
    ($scope, $location, localStorageService, $state,$cookieStore,LoginServer)=> {
        $scope.vm = {
            userName: '',
            password: '',
            randomSrc: API_USER+"/validate/code/get?r="+Math.random(),
            randomNumberValue: "",
            randomNumberChange : randomNumberChange,
            login: login,
            keyLogin : keyLogin
        };
        //设置 背景样式
        document.getElementsByTagName("body")[0].style.cssText = "background: url(../../images/images/log-bg.jpg) repeat";
        function keyLogin(e){
            var srcObj = e.srcElement ? e.srcElement : e.target;
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){//回车
                srcObj.blur() ;
                login();
                srcObj.focus() ;
            }
        }
        //登陆
        function login(){
            if($scope.vm.randomNumberValue == ""){
                randomNumberChange() ;
                layer.msg("验证码不能为空");
            }else if($scope.vm.userName == ""){
                randomNumberChange() ;
                layer.msg("用户名不能为空");
            }else if($scope.vm.password == ""){
                randomNumberChange() ;
                layer.msg("密码不能为空");
            }else{
                LoginServer.login.save({
                    "account":$scope.vm.userName,
                    "validateCode":$scope.vm.randomNumberValue,
                    "pwd": hex_md5($scope.vm.password)
                },function(response){
                    if(response.status==200){
                        // cookie  userId userName
                        setCookie("userId" , response.data.userId);
                        setCookie("userName" , response.data.account);
                        setCookie("accessToken" , response.data.accessToken);
                        $state.go("HP.management");
                    }else{
                        randomNumberChange() ;
                        layer.msg(response.info);
                    }
                },function(error){
                    randomNumberChange() ;
                   console.log(error)
                });
            }
        }
        //改变验证码
        function randomNumberChange(){
            $scope.vm.randomSrc = API_USER+"/validate/code/get?r="+Math.random()
        }
    }
])}