/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  转人工
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('ManualSettingController',
    [ '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope","$filter",
    ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope,$filter) =>{
        $scope.vm = {
            id : '',                      //返回的id
            workStartTime: '',               //开始时间
            workEndTime: '',                  //结束时间
            commandOn: 0,                     //人工命令开关 Int
            noAnswerOn: 0,                     //机器人未直接回答  Int
            noAnswerNumber: 0,                  //机器人未直接回答次数 Int
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
        /**
         *** 获取数据
         **/
        function getData(){
            var i = layer.msg('资源加载中..',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:1000});
            ApplicationServer.manualGetData.get({
                applicationId : APPLICATION_ID
            },function(response){
                layer.close(i);
                if(response.status==200){
                    $scope.vm.workStartTime  = response.data.workStartTime;
                    $scope.vm.workEndTime    = response.data.workEndTime;
                    $scope.vm.commandOn      = response.data.commandOn;
                    $scope.vm.noAnswerOn     = response.data.noAnswerOn;
                    $scope.vm.noAnswerNumber = response.data.noAnswerNumber;
                    $scope.vm.id             =  response.data.id;
                }
            },function(error){
                layer.close(i);
                console.log(error);
            });
            if($scope.vm.noAnswerOn ==0){
                $scope.vm.noAnswerNumber = 0;
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
    }
])};
