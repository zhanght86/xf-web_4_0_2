/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('manualSettingController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            workStartTime : '',               //开始时间
            workEndTime :'',                  //结束时间
            answerNumber : 0,                        //回答次数
            showTip : showTip,
            hideTip : hideTip,
            getData : getData,
            save : save

        };
        /*
        ** 获取数据
        */
        function getData(){
            httpRequestPost("artificialTurn/getArtificialTurnSetting",{
                "applicationId" :APPLICATION_ID

            },function(data){

            },function(err){
                console.log(err);
            });

        }
        //
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
