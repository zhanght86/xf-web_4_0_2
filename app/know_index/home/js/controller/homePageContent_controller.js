/**
 * Created by 41212 on 2017/5/2.
 */
//homePageContentController
angular.module('homePage').controller('homePageContentController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$state","$cookieStore",
    function ($scope, $location, localStorageService, AuthService,$state,$cookieStore) {
        $scope.vm = {
            sceneId : $cookieStore.get("sceneId")
        };
    }
]) ;