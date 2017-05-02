/**
 * Created by 41212 on 2017/3/27.
 */
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationSettingModule').controller('myApplicationSettingController', [
    '$scope', "$state", "$stateParams","$cookieStore",
    function ($scope,$state, $stateParams,$cookieStore) {
       // alert();
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
            isSlide2 : isSlide2,
            sceneId : $cookieStore.get('sceneId'),
        };

        function isSlide(event){
            var self=event.target;
            if($(self).hasClass("slideActive")){
                $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
            }
        }
        function isSlide2(event){
            var self=event.target;
            if($(self).hasClass("slideActive")){
                $(self).removeClass("slideActive").parent().next(".menu_1").stop().slideToggle();
            }else{
                $(self).addClass("slideActive").parent().next(".menu_1").stop().slideToggle();
            }

        }
    }
]);