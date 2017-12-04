/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('manualSettingController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            workStartTime: '',               //开始时间
            workEndTime: '',                  //结束时间
            commandOn: null,                     //人工命令开关 Int
            noAnswerOn: null,                     //机器人未直接回答  Int
            noAnswerNumber: null,                  //机器人未直接回答次数 Int
            showTip: showTip,
            hideTip: hideTip,
            getData: getData,
            saveData: saveData,
            clearNum: clearNum

        };
        function clearNum(obj, attr) {
            obj[attr] = obj[attr].replace(/^\d/g, "");
        }

        getData();
        function add0(m) {
            return m < 10 ? '0' + m : m
        }

        function format(shijianchuo) {

           // ijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return add0(h) + ':' + add0(mm) + ':' + add0(s);
        }

        //console.log(format(32400000))

        /*
        ** 获取数据
        */
        function getData(){

            ApplicationServer.manualGetData.save({
               // applicationId : APPLICATION_ID
            },function(data){
                console.log(data);
                if(data.status==10000){
                    // $scope.vm.workStartTime = new Date(data.data[0].workStartTime).toLocaleString().substring(9);
                    // $scope.vm.workEndTime = new Date(data.data[0].workEndTime).toLocaleString().substring(9);
                    $scope.vm.workStartTime =format(data.data[0].workStartTime);
                    $scope.vm.workEndTime = format(data.data[0].workEndTime);
                    $scope.vm.commandOn = data.data[0].commandOn;
                    $scope.vm.noAnswerOn = data.data[0].noAnswerOn;
                    $scope.vm.noAnswerNumber = data.data[0].noAnswerNumber;
                    //console.log( $scope.vm.workEndTim);


                }

            },function(err){
                console.log(err);
            });
        }
        function saveData(){
            ApplicationServer.manualSaveData.save({

            },function(){

            },function(){

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
