webpackJsonp([3],{

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @Author : MILES .
	 * @Create : 2017/11/23.
	 * @Module :  登录模块
	 */
	module.exports = function (angular) {
	  var loginModule = angular.module('loginModule', []);
	  __webpack_require__(26)(loginModule);
	};

/***/ }),

/***/ 26:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Created by Administrator on 2016/6/3.
	 * 控制器
	 */
	module.exports = function (loginModule) {
	    loginModule.controller('LoginController', ['$scope', '$location', 'localStorageService', "$state", "$cookieStore", function ($scope, $location, localStorageService, $state, $cookieStore) {
	        $scope.vm = {
	            userName: '',
	            password: '',
	            randomNumber: randomNumber(4),
	            randomNumberValue: "",
	            randomNumberChange: randomNumberChange,
	            login: login,
	            keyLogin: keyLogin
	        };
	        //设置 背景样式
	        document.getElementsByTagName("body")[0].style.cssText = "background: url(../../images/images/log-bg.jpg) repeat";
	        function keyLogin(e) {
	            var srcObj = e.srcElement ? e.srcElement : e.target;
	            var keycode = window.event ? e.keyCode : e.which;
	            if (keycode == 13) {
	                //回车
	                srcObj.blur();
	                login();
	                srcObj.focus();
	            }
	        }
	        //改变验证码
	        function randomNumberChange() {
	            $scope.vm.randomNumber = randomNumber(4);
	        }
	        //登陆
	        function login() {
	            //$state.go("materialManagement.chatKnowledgeBase",{userPermission : "['超级管理员','初级管理员']"});
	            if ($scope.vm.randomNumberValue.length == 0) {
	                console.log($scope.vm.randomNumberValue);
	                layer.msg("验证码不能为空");
	                setRandomNumber();
	            } else if ($scope.vm.randomNumberValue != $scope.vm.randomNumber) {
	                layer.msg("验证码错误");
	                setRandomNumber();
	            } else if ($scope.vm.userName == "") {
	                layer.msg("用户名不能为空");
	                setRandomNumber();
	            } else if ($scope.vm.password == "") {
	                layer.msg("密码不能为空");
	                setRandomNumber();
	            } else {
	                httpRequestPost("/api/user/userLogin", {
	                    "userLoginName": $scope.vm.userName,
	                    "userPassword": $scope.vm.password
	                }, function (data) {
	                    if (data.status == 10006) {
	                        // cookie  userId userName
	                        $cookieStore.put("userId", data.data.userId);
	                        $cookieStore.put("userName", data.data.userName);
	                        $state.go("admin");
	                    } else if (data.status == 10007) {
	                        setRandomNumber();
	                        layer.msg("用户名或密码错误");
	                    } else if (data.status == 10002) {
	                        setRandomNumber();
	                        layer.msg("该用户已停用!");
	                    }
	                    //console.log(data)
	                }, function (err) {
	                    setRandomNumber();
	                    layer.msg("登陆失败");
	                    //console.log(err)
	                });
	            }
	        }
	        function setRandomNumber() {
	            $scope.vm.randomNumberValue = "";
	            $scope.vm.randomNumber = randomNumber(4);
	        }

	        //  随机产生四位验证码
	        function randomNumber(number) {
	            var rnd = "";
	            for (var i = 0; i < number; i++) {
	                rnd += Math.floor(Math.random() * 10);
	            }
	            return rnd;
	        }
	    }]);
	};

/***/ })

});