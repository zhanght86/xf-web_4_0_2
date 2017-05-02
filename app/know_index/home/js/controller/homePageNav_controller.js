/**
 * Created by 41212 on 2017/3/21.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('homePage').controller('homePageNavController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$timeout", "$cookieStore",
    function ($scope, $location, localStorageService, AuthService,$timeout,$cookieStore) {
            $scope.vm = {

                applicationId : true,

                sceneId : $cookieStore.get('sceneId'),

            };
        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
])