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
            // randomNumber: randomNumber(4),
            // randomNumberValue: "",
            randomNumber: 0,
            randomNumberValue:0,
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
            //$state.go("materialManagement.chatKnowledgeBase",{userPermission : "['超级管理员','初级管理员']"});
            // if($scope.vm.randomNumberValue.length==0){
            //     console.log($scope.vm.randomNumberValue);
            //     layer.msg("验证码不能为空");
            //     setRandomNumber();
            // }else if($scope.vm.randomNumberValue!=$scope.vm.randomNumber){
            //     layer.msg("验证码错误");
            //     setRandomNumber();
            // }else
                if($scope.vm.userName == ""){
                layer.msg("用户名不能为空");
                // setRandomNumber();
            }else if($scope.vm.password == ""){
                layer.msg("密码不能为空");
                // setRandomNumber();
            }else{
                LoginServer.login.save({
                    "account":$scope.vm.userName,
                    "pwd": hex_md5($scope.vm.password)
                },function(response){
                    if(response.status==200){
                        // cookie  userId userName
                        setCookie("userId" , response.data.userId);
                        setCookie("userName" , response.data.account);
                        setCookie("accessToken" , response.data.accessToken);
                        $state.go("HP.management");
                    }else{
                        // setRandomNumber();
                        layer.msg(response.info);
                    }
                },function(error){
                    // setRandomNumber();
                   console.log(error)
                });
            }
        }
        //改变验证码
        function randomNumberChange(){
            $scope.vm.randomNumber = randomNumber(4)
        }
        function setRandomNumber(){
            $scope.vm.randomNumberValue = "";
            $scope.vm.randomNumber = randomNumber(4);
        }

        //  随机产生四位验证码
        function randomNumber(number){
            var rnd="";
            for(var i=0;i<number;i++){
                rnd+=Math.floor(Math.random()*10);
            }
            return rnd;
        }
    }
])}