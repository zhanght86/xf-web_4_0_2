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
    '$scope', "$state", "$stateParams","$cookieStore","$rootScope",
    function ($scope,$state, $stateParams,$cookieStore,$rootScope) {
       // alert();
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
            isSlide2 : isSlide2,
            sceneId : $cookieStore.get('sceneId'),
            applicationId: $cookieStore.get("applicationId"),
            applicationName : $cookieStore.get("applicationName"),

            robotHead : "",//头像
            imgUrl : "", //文件服务器地址
            robotName : "", //机器人名称
        };

        //获取应用的头像
        findRobotHead();

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

        //获取应用的头像
        function findRobotHead(){
            httpRequestPost("/api/application/application/findRobotSetting",{
                "applicationId": $scope.vm.applicationId
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.vm.robotHead= "";//头像
                    $scope.vm.imgUrl =""; //文件服务器地址
                }else{
                    $cookieStore.put('robotHead',data.data.robotHead);
                    $cookieStore.put('imgUrl',data.data.imgUrl);
                    
                    $scope.vm.robotHead= data.data.robotHead;//头像
                    $scope.vm.imgUrl = data.data.imgUrl; //文件服务器地址
                    $scope.vm.robotName = data.data.robotName; //机器人名称
                    $scope.$apply();
                }
            },function(){
                layer.msg("获取头像失敗");
            })
        }
    }
]);