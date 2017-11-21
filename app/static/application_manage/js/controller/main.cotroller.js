
angular.module('myApplicationSettingModule').controller('myApplicationSettingController', [
    '$scope', "$state", "$stateParams","$cookieStore","$rootScope",
    function ($scope,$state, $stateParams,$cookieStore,$rootScope) {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
            isSlide2 : isSlide2,
            sceneId : $cookieStore.get('sceneId'),
            applicationName : $cookieStore.get("applicationName"),
            robotName : "" //机器人名称
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
            if($(self).parent().hasClass("slideActive")){
                $(self).parent().removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).parent().addClass("slideActive").next(".menu_1").stop().slideToggle();
            }
        }
        //获取应用的头像
        function findRobotHead(){
            httpRequestPost("/api/application/application/findRobotSetting",{
                "applicationId": APPLICATION_ID
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.MASTER.headImage= "";//头像
                }else{
                    $cookieStore.put('robotHead','/img/'+data.data.robotHead);
                    $scope.MASTER.headImage = '/img/'+data.data.robotHead ;
                    $scope.vm.robotName = data.data.robotName; //机器人名称
                    $scope.$apply();
                }
            },function(){
                console.log("获取头像失敗");
            })
        }
    }
]);