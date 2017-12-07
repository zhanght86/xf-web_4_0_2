/**
 * Created by 41212 on 2017/5/2.
 */
//首页controller
module.exports = homePageModule =>{
    homePageModule
        .controller('HomePageContentController', [
            '$scope', '$location', 'localStorageService',"$state","$cookieStore",
            function ($scope, $location, localStorageService,$state,$cookieStore) {
                $scope.vm = {
                    sceneId : SCENE_ID
                };
            }
        ])
}