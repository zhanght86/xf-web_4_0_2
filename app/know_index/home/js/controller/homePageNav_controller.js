/**
 * Created by 41212 on 2017/3/21.
 */
angular.module('homePage').controller('homePageNavController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$timeout", "$cookieStore",
    function ($scope, $location, localStorageService, AuthService,$timeout,$cookieStore) {
            $scope.vm = {
     
                applicationId : $cookieStore.get('applicationId'),
                                //$cookieStore.get("applicationId")

                sceneId : $cookieStore.get('sceneId'),
                jump: jump

            };
        function jump() {
            window.open('http://'+window.location.host+':7003/index.html');
        }
        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
]);