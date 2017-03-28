/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('homePage').controller('homePageController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$state", function ($scope, $location, localStorageService, AuthService,$state) {
        //默认跳转到
        $state.go("homePage.define")
    }
])