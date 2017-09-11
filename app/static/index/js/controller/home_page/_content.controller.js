/**
 * Created by 41212 on 2017/5/2.
 */
//首页controller
angular.module('homePage').controller('homePageContentController', [
    '$scope', '$location', 'localStorageService',"$state","$cookieStore",
    function ($scope, $location, localStorageService,$state,$cookieStore) {
        $scope.vm = {
            sceneId : SCENE_ID
        };
    }
]) ;