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

            };
        //$timeout(function(){
        //    $scope.vm.applicatioinId = false;
        //},1000)
    }
]);