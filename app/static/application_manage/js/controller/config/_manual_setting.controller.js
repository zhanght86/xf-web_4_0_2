/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('manualSettingController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            workStartTime : '',               //开始时间
            workEndTime :'',                  //结束时间
            commandOn : 0,                     //人工命令开关 Int
            noAnswerOn : 0,                     //机器人未直接回答  Int
            noAnswerNumber : 0,                        //机器人未直接回答次数 Int
            showTip : showTip,
            hideTip : hideTip,
            getData : getData,
            save : save

        };
        getData();
        /*
        ** 获取数据
        */
        function getData(){
            httpRequestPost("artificialTurn/getArtificialTurnSetting",{
                "applicationId" :APPLICATION_ID

            },function(data){
                console.log(data);

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
