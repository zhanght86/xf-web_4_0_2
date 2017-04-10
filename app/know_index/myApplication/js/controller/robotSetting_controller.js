/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('myApplicationSettingModule').controller('channelManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        setCookie("userId","359873057331875840");
        $scope.robot = {
            applicationId: getCookie("applicationId"),
            userId : getCookie("userId"),   //用户id
            robotExpire : "", //时间到期回复
            robotHead : "",//头像
            robotHotQuestionTimeout : 0,//热点问题更新频率
            robotLearned : "",//学到新知识回答
            robotName : "", //名称
            robotRepeat : "",//重复问答回复
            robotRepeatNumber : 0,//重复问答次数
            robotSensitive : "",// 敏感问答回复
            robotTimeout : "",//超时提示回复
            robotTimeoutLimit : 0,//超时时长
            robotUnknown : "",//未知问答回复
            robotUpdateId : getCookie("userId"),//更新人员id
            robotWelcome : "",//欢迎语
            settingId : "",//机器人参数ID
            editRobot : editRobot,  //编辑机器人参数
            findRobotSetting : findRobotSetting, //查询机器人参数
        };

        $scope.app = {
            applicationId: getCookie("applicationId"),
            userId : getCookie("userId"),   //用户id
            settingCommentOn : 0,   //评价开关
            settingDataTimeoutLimit : 0,//获取数据时间
            settingGreetingOn : 0,//寒暄开关
            settingGreetingThreshold : 0,//寒暄阈值
            settingId : "",//应用参数id
            settingLowerLimit : 0,//下限阈值
            settingRecommendNumber : 0,//推荐问题数量
            settingRelateNumber : 0,//关联问题数量
            settingTurnRoundOn : 0,//话轮识别开关
            settingUpperLimit : 0,//上限阈值
            settingUpdateId : getCookie("userId"),//更新人员
            editApplication : editApplication,  //编辑应用参数
            findApplicationSetting : findApplicationSetting, //查询应用参数
        };


        //查看机器人参数
        function findRobotSetting(){
            httpRequestPost("/api/application/application/findRobotSetting",{
                "applicationId": $scope.robot.applicationId
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.robot.robotExpire=""; //过期知识回答
                    $scope.robot.robotHead= "";//头像
                    $scope.robot.robotHotQuestionTimeout = 0;//热点问题更新频率
                    $scope.robot.robotLearned = "";//学到新知识回答
                    $scope.robot.robotName = ""; //名称
                    $scope.robot.robotRepeat = "";//重复问答回复
                    $scope.robot.robotRepeatNumber = 0;//重复问答次数
                    $scope.robot.robotSensitive = "";// 敏感问答回复
                    $scope.robot.robotTimeout = "";//超时提示回复
                    $scope.robot.robotTimeoutLimit = 0;//超时时长
                    $scope.robot.robotUnknown = "";//未知问答回复
                    $scope.robot.robotWelcome = "";//欢迎语
                    $scope.robot.settingId = "" ;  //机器人参数ID
                }else{
                    $scope.robot.robotExpire= data.data.robotExpire; //过期知识回答
                    $scope.robot.robotHead= data.data.robotHead;//头像
                    $scope.robot.robotHotQuestionTimeout = data.data.robotHotQuestionTimeout;//热点问题更新频率
                    $scope.robot.robotLearned = data.data.robotLearned;//学到新知识回答
                    $scope.robot.robotName = data.data.robotName; //名称
                    $scope.robot.robotRepeat = data.data.robotRepeat;//重复问答回复
                    $scope.robot.robotRepeatNumber = data.data.robotRepeatNumber;//重复问答次数
                    $scope.robot.robotSensitive = data.data.robotSensitive;// 敏感问答回复
                    $scope.robot.robotTimeout = data.data.robotTimeout;//超时提示回复
                    $scope.robot.robotTimeoutLimit = data.data.robotTimeoutLimit;//超时时长
                    $scope.robot.robotUnknown = data.data.robotUnknown;//未知问答回复
                    $scope.robot.robotWelcome = data.data.robotWelcome;//欢迎语
                    $scope.robot.settingId = data.data.settingId;//机器人参数ID
                    $state.reload();
                }
            },function(){
                layer.msg("查询失敗");
            })
        }

        //查看应用参数
        function findApplicationSetting(){
            httpRequestPost("/api/application/application/findApplicationSetting",{
                "applicationId": $scope.app.applicationId
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.app.settingCommentOn = 0;   //评价开关
                    $scope.app.settingDataTimeoutLimit = 0;//获取数据时间
                    $scope.app.settingGreetingOn = 0;//寒暄开关
                    $scope.app.settingGreetingThreshold = 0;//寒暄阈值
                    $scope.app.settingId = "";//应用参数id
                    $scope.app.settingLowerLimit = 0;//下限阈值
                    $scope.app.settingRecommendNumber = 0;//推荐问题数量
                    $scope.app.settingRelateNumber = 0;//关联问题数量
                    $scope.app.settingTurnRoundOn = 0;//话轮识别开关
                    $scope.app.settingUpperLimit = 0 ;//上限阈值
                }else{
                    $scope.app.settingCommentOn = data.data.settingCommentOn;   //评价开关
                    $scope.app.settingDataTimeoutLimit = data.data.settingDataTimeoutLimit;//获取数据时间
                    $scope.app.settingGreetingOn = data.data.settingGreetingOn;//寒暄开关
                    $scope.app.settingGreetingThreshold = data.data.settingGreetingThreshold;//寒暄阈值
                    $scope.app.settingId = data.data.settingId;//应用参数id
                    $scope.app.settingLowerLimit = data.data.settingLowerLimit;//下限阈值
                    $scope.app.settingRecommendNumber = data.data.settingRecommendNumber;//推荐问题数量
                    $scope.app.settingRelateNumber = data.data.settingRelateNumber;//关联问题数量
                    $scope.app.settingTurnRoundOn = data.data.settingTurnRoundOn;//话轮识别开关
                    $scope.app.settingUpperLimit = data.data.settingUpperLimit ;//上限阈值
                    $state.reload();
                }
            },function(){
                layer.msg("查询失敗");
            })
        }



        //编辑机器人参数
        function editRobot(){
            httpRequestPost("/api/application/application/saveRobotSetting",{
                "applicationId": $scope.robot.applicationId,
                "robotExpire": $scope.robot.robotExpire,
                "robotHead": $scope.robot.robotHead,
                "robotHotQuestionTimeout": $scope.robot.robotHotQuestionTimeout,
                "robotLearned": $scope.robot.robotLearned,
                "robotName": $scope.robot.robotName,
                "robotRepeat": $scope.robot.robotRepeat,
                "robotRepeatNumber": $scope.robot.robotRepeatNumber,
                "robotSensitive": $scope.robot.robotSensitive,
                "robotTimeout": $scope.robot.robotTimeout,
                "robotTimeoutLimit": $scope.robot.robotTimeoutLimit,
                "robotUnknown": $scope.robot.robotUnknown,
                "robotUpdateId":$scope.robot.settingUpdateId ,
                "robotWelcome": $scope.robot.robotWelcome,
                "settingId": $scope.robot.settingId
            },function(data){
                if(data.status===200){
                    layer.msg("保存成功");
                    $state.reload()
                }else{
                    layer.msg("保存失敗");
                }
            },function(){
                layer.msg("保存失敗");
            })
        }


        //编辑应用参数
        function editApplication(){
            httpRequestPost("/api/application/application/saveApplicationSetting",{


            },function(data){
                if(data.status===200){
                    layer.msg("保存成功");
                    $state.reload()
                }else{
                    layer.msg("保存失敗");
                }
            },function(){
                layer.msg("保存失敗");
            })
        }








    }
]);