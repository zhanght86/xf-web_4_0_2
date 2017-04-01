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
    '$scope', "$state", "$stateParams",
    function ($scope,$state, $stateParams) {
       // alert();
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
        };

        function isSlide(event){
            var self=event.target;
            if($(self).hasClass("slideActive")){
                $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
            }

        }
    }
]);