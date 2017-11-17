/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('manualSettingController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            showTip : showTip,
            hideTip : hideTip,

        };
        function showTip(ev){
            var event=ev.target;
            $(event).addClass("on").next("span").show();
        }
        function hideTip(ev){
            var event=ev.target;
            $(event).removeClass("on").next("span").hide();
        }

    }
]);
