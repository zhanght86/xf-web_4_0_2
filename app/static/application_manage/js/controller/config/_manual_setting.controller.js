/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('manualSettingController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            id : '',                      //返回的id
            workStartTime: '',               //开始时间
            workEndTime: '',                  //结束时间
            commandOn: 0,                     //人工命令开关 Int
            noAnswerOn: 0,                     //机器人未直接回答  Int
            noAnswerNumber: 0,                  //机器人未直接回答次数 Int
            showTip: showTip,
            hideTip: hideTip,
            getData: getData,
            saveData: saveData,
            checkNum: checkNum,

        };

        /**
        ***输入框只能输入正整数
        **/
        function checkNum() {
            var num = $scope.vm.noAnswerNumber;
            var re = /^\d*$/;
            if(!re.test(num)){
                $scope.vm.noAnswerNumber = 0;
            }

        }

        getData();

        /**
        *** 获取时分秒
        **/
        function add0(m) {
            return m < 10 ? '0' + m : m;
        }

        function format(shijianchuo) {
           // ijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            return add0(h) + ':' + add0(m) + ':' + add0(s);
        }


        /**
        *** 获取数据
        **/
        function getData(){
            var i = layer.msg('资源加载中..',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:1000});
            ApplicationServer.manualGetData.save({
               // applicationId : APPLICATION_ID
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status==10000){
                    $scope.vm.workStartTime =format(data.data[0].workStartTime);
                    $scope.vm.workEndTime = format(data.data[0].workEndTime);
                    $scope.vm.commandOn = data.data[0].commandOn;
                    $scope.vm.noAnswerOn = data.data[0].noAnswerOn;
                    $scope.vm.noAnswerNumber = data.data[0].noAnswerNumber;
                    $scope.vm.id =  data.data[0].id;
                }

            },function(err){
                layer.close(i);
                console.log(err);
            });
            if($scope.vm.noAnswerOn ==0){
                $scope.vm.noAnswerNumber =0;
            }
        }
        function saveData(){
            if(!$scope.vm.noAnswerOn){
                $scope.vm.noAnswerNumber=0;
            }
            ApplicationServer.manualSaveData.save({
                "applicationId" : APPLICATION_ID,
                "id" : $scope.vm.id ,
                "command": $scope.vm.commandOn,
                "workStartTime" : $scope.vm.workStartTime,
                "workEndTime" : $scope.vm.workEndTime,
                "noAnswer" : $scope.vm.noAnswerOn,
                "noAnswerNumber" : $scope.vm.noAnswerNumber

            },
            function(data){
                if(data.status==10018){
                    layer.msg('修改成功');
                }else{
                    layer.msg(data.info);
                }
            },function(err){
                console.log(err);
            });
        }
        //提示文字
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
