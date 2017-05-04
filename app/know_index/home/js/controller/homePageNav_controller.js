/**
 * Created by 41212 on 2017/3/21.
 */
angular.module('homePage').controller('homePageNavController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$timeout", "$cookieStore","$state",
    function ($scope, $location, localStorageService, AuthService,$timeout,$cookieStore,$state) {
            $scope.vm = {
                applicationId : $cookieStore.get('applicationId'),
                sceneId : $cookieStore.get('sceneId'),
                loginout : loginout,
                userName : $cookieStore.get('userName'),
                logApplication : logApplication,
                jump: jump

            };
        function logApplication(){
            if($scope.vm.sceneId){
                $state.go("setting.Infor")
            }else{
                return false
            }
        }
        function loginout(){
            $cookieStore.remove('applicationId');
            $cookieStore.remove('sceneId');
            $cookieStore.remove('userId');
            $cookieStore.remove('userName');
            $state.go("login")
        }
        function jump() {
            window.open('http://'+window.location.host+':7003/index.html');
        }
        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
]);