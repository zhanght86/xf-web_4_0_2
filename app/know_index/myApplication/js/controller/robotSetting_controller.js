/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('robotSettingController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, $state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.robot = {
            classicHead:['touxiang1.png','touxiang2.png','touxiang3.png','touxiang4.png', 'touxiang5.png','touxiang6.png','touxiang7.png','touxiang8.png'], //经典头像列表
            applicationId: $cookieStore.get("applicationId"),
            userId :  $cookieStore.get("userId"),   //用户id
            robotExpire : "", //时间到期回复
            robotHead : "",//头像
            imgUrl : "", //文件服务器地址
            newRobotHead : "", //新的头像
            robotHotQuestionTimeout : "",//热点问题更新频率
            robotLearned : "",//学到新知识回答
            robotName : "", //名称
            robotRepeat : "",//重复问答回复
            robotRepeatNumber : "",//重复问答次数
            robotSensitive : "",// 敏感问答回复
            robotTimeout : "",//超时提示回复
            robotTimeoutLimit : "",//超时时长
            robotUnknown : "",//未知问答回复
            robotUpdateId :  $cookieStore.get("userId"),//更新人员id
            robotWelcome : "",//欢迎语
            settingId : "",//机器人参数ID
            editRobot : editRobot,  //编辑机器人参数
            findRobotSetting : findRobotSetting, //查询机器人参数
            addClassic : addClassic,  //弹出经典头像对话框
            addCustom : addCustom,  //弹出自定义头像对话框
            selectClassic : selectClassic, //选择经典头像

            myFile : "" ,//上传的图片
            //x : "", //坐标x
            //y : "", //坐标y
            //w : "", //截取的宽度
            //h : "", //截取的高度
            fileChange : fileChange
        };

        //弹出经典头像对话框
        function addClassic(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/settingContentDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        $scope.robot.robotHead=$scope.robot.newRobotHead;
                        httpRequestPost("/api/application/application/saveClassicHead",{
                            "robotHead": $scope.robot.robotHead,
                            "settingId": $scope.robot.settingId
                        },function(data){
                            if(data.status===200){
                                layer.msg("修改头像成功");
                                $state.reload();
                            }else{
                                layer.msg("修改头像失敗");
                            }
                        },function(){
                            layer.msg("修改头像请求失败");
                        })
                    }
                }
            });
        }

        //选择经典头像
        function selectClassic(item){
            console.log("点击"+item);
            $scope.robot.newRobotHead=item;
        }

        //弹出自定义头像对话框
        function addCustom(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/settingContentDialog2.html",
                width:"500px",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.robot.settingId);
                        var fd = new FormData();
                        //var file =$scope.robot.myFile
                        var file = document.querySelector('input[type=file]').files[0];
                        fd.append('file', file);
                        fd.append('settingId',$scope.robot.settingId);
                        fd.append('x',$('#x').val())
                        fd.append('y',$('#y').val());
                        fd.append('w',$('#w').val());
                        fd.append('h',$('#h').val());
                        $http({
                            method:'POST',
                            url:"/api/application/application/uploadHead",
                            data: fd,
                            headers: {'Content-Type':undefined},
                            transformRequest: angular.identity
                        }).success( function (response){
                            /*6.30add-图片大小限制*/
                            var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
                            function fileChange(e) {
                                var  target = e.srcElement ? e.srcElement : e.target;
                                var fileSize = 0;
                                if (isIE && !target.files) {
                                    var filePath = target.value;
                                    var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                                    var file = fileSystem.GetFile (filePath);
                                    fileSize = file.Size;
                                } else {
                                    fileSize = target.files[0].size;
                                }
                                var size = fileSize / 1024;
                                if(size>1000){
                                    alert("附件不能大于1M,请重新选择");
                                }
                            }
                            /*6.30-图片大小限制ennd*/
                            if(response.status==200){
                                layer.msg("修改头像成功");
                                //$state.go("setting.robot");
                                $state.reload();
                            }else{
                                layer.msg("上传头像失敗");
                            }
                        });
                    }
                }
            });
        }

        $scope.app = {
            applicationId: $cookieStore.get("applicationId"),
            userId : $cookieStore.get("userId"),   //用户id
            settingCommentOn : 1,   //评价开关
            settingDataTimeoutLimit : "",//获取数据时间
            settingGreetingOn : 1,//寒暄开关
            settingGreetingThreshold : "",//寒暄阈值
            settingId : "",//应用参数id
            settingLowerLimit : "",//下限阈值
            settingRecommendNumber : "",//推荐问题数量
            settingRelateNumber : "",//关联问题数量
            settingTurnRoundOn : 1,//话轮识别开关
            settingUpperLimit : "",//上限阈值
            settingUpdateId : $cookieStore.get("userId"),//更新人员
            editApplication : editApplication,  //编辑应用参数
            findApplicationSetting : findApplicationSetting, //查询应用参数
            turnOn : turnOn,//开关函数
            parameterLimit : parameterLimit
        };
        function parameterLimit(type,val){
            // type 0   lt1
            //type 1    0-1
           if(type){
               if($scope.app[val]<1){
                   $scope.app[val] = 1 ;
               }
           }else{
               if($scope.app[val]>1 ){
                   $scope.app[val] = 1
               }else if($scope.app[val]<0){
                   $scope.app[val] = 0
               }
           }
        }

        //查看应用参数设置
        findApplicationSetting();
        //查看机器人设置
        findRobotSetting();

        //$scope.$watch('robot.robotName', function(current){
        //    if(current==""){
        //        $scope.robot.robotName="小富机器人";
        //    }
        //});

        //查看机器人参数
        function findRobotSetting(){
            httpRequestPost("/api/application/application/findRobotSetting",{
                "applicationId": $scope.robot.applicationId
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.robot.robotExpire=""; //过期知识回答
                    $scope.robot.robotHead= "";//头像
                    $scope.robot.robotHotQuestionTimeout = "";//热点问题更新频率
                    $scope.robot.robotLearned = "";//学到新知识回答
                    $scope.robot.robotName = ""; //名称
                    $scope.robot.robotRepeat = "";//重复问答回复
                    $scope.robot.robotRepeatNumber = "";//重复问答次数
                    $scope.robot.robotSensitive = "";// 敏感问答回复
                    $scope.robot.robotTimeout = "";//超时提示回复
                    $scope.robot.robotTimeoutLimit = "";//超时时长
                    $scope.robot.robotUnknown = "";//未知问答回复
                    $scope.robot.robotWelcome = "";//欢迎语
                    $scope.robot.settingId = "" ;  //机器人参数ID
                    $scope.robot.newRobotHead =""; //新的头像
                    $scope.robot.imgUrl =""; //文件服务器地址
                }else{
                    $scope.robot.robotExpire= data.data.robotExpire; //过期知识回答
                    $scope.robot.robotHead= data.data.robotHead;//头像
                    $scope.robot.imgUrl = data.data.imgUrl; //文件服务器地址
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
                    $scope.robot.newRobotHead = data.data.robotHead; //新的头像
                    $scope.$apply();
                }
            },function(){
                layer.msg("查询失敗");
            })
        }

        //查看应用参数
        function findApplicationSetting(){
            httpRequestPost("/api/application/application/findApplicationSetting",{
                "applicationId": $scope.app.applicationId
            },function(data){
                if(data.data===10005){
                    $scope.app.settingCommentOn = 1;   //评价开关
                    $scope.app.settingDataTimeoutLimit = "";//获取数据时间
                    $scope.app.settingGreetingOn = 1;//寒暄开关
                    $scope.app.settingGreetingThreshold = "";//寒暄阈值
                    $scope.app.settingId = "";//应用参数id
                    $scope.app.settingLowerLimit = "";//下限阈值
                    $scope.app.settingRecommendNumber = "";//推荐问题数量
                    $scope.app.settingRelateNumber = "";//关联问题数量
                    $scope.app.settingTurnRoundOn = 1;//话轮识别开关
                    $scope.app.settingUpperLimit = "";//上限阈值
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
                    $scope.$apply();
                }
            },function(){
                layer.msg("查询失敗");
            })
        }


        //编辑机器人参数
        function editRobot(flag){
            if(flag){
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
                        //$state.reload();
                    }else{
                        layer.msg("保存失敗");
                    }
                },function(){
                    layer.msg("保存失敗");
                })
            }
        }

        //编辑应用参数
        function editApplication(){
            httpRequestPost("/api/application/application/saveApplicationSetting",{
                "applicationId": $scope.app.applicationId,
                "settingCommentOn": $scope.app.settingCommentOn,
                "settingDataTimeoutLimit": $scope.app.settingDataTimeoutLimit,
                "settingGreetingOn": $scope.app.settingGreetingOn,
                "settingGreetingThreshold": $scope.app.settingGreetingThreshold,
                "settingId": $scope.app.settingId,
                "settingLowerLimit": $scope.app.settingLowerLimit,
                "settingRecommendNumber": $scope.app.settingRecommendNumber,
                "settingRelateNumber": $scope.app.settingRelateNumber,
                "settingTurnRoundOn": $scope.app.settingTurnRoundOn,
                "settingUpdateId": $scope.app.settingUpdateId,
                "settingUpperLimit": $scope.app.settingUpperLimit
            },function(data){
                if(data.status===200){
                    layer.msg("保存成功");
                    //$state.reload();
                }else{
                    layer.msg("保存失敗");
                }
            },function(){
                layer.msg("保存失敗");
            })
        }

        //开关
        function turnOn(targetValue,targetName){
            $scope.app[targetName] = targetValue ? 0 : 1 ;
        }


    }
]).directive('checkWelcome', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                console.log(scope.robot.robotWelcome);
                var welcomes=scope.robot.robotWelcome.split("\n");
                console.log(welcomes.length);
                if(welcomes.length>10){
                    c.$setValidity('len', false);
                }else{
                    c.$setValidity('len', true);
                }
            });
        }
    }
});