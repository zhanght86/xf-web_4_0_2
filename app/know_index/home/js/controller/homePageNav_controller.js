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
                logApplication : logApplication
            };
        if(!$cookieStore.get('userId')){
            $state.go("login")
        }
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

        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
]);