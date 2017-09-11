/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('robotSetupController', [
    '$scope', 'localStorageService' ,"configurationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    function ($scope,localStorageService, configurationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) {
        $scope.vm = {
            classicHead:['touxiang1.png','touxiang2.png','touxiang3.png','touxiang4.png', 'touxiang5.png','touxiang6.png','touxiang7.png','touxiang8.png'], //经典头像列表
            //imgUrl : "", //文件服务器地址
            robotExpire : "", //时间到期回复
            robotHead : "",//头像
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
            robotWelcome : "",//欢迎语
            settingId : "",//机器人参数ID

            editRobot : editRobot,  //编辑机器人参数
            queryRobotParameter : queryRobotParameter, //查询机器人参数
            addClassic : addClassic,  //弹出经典头像对话框
            addCustom : addCustom,  //弹出自定义头像对话框
            myFile : "" ,//上传的图片
            //x : "", //坐标x
            //y : "", //坐标y
            //w : "", //截取的宽度
            //h : "", //截取的高度
            isHeadPicSize : isHeadPicSize  //头像大小是否合格 1Mb
        };
        //弹出经典头像对话框
        function addClassic(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/config/robot_setup/add_classical_avatar.html","",function(){
                configurationServer.storeClassicalAvatar.save({
                    "robotHead": $scope.vm.newRobotHead,
                    "settingId": $scope.vm.settingId
                },function(data){
                    if(data.status===200){
                        layer.msg("修改头像成功");
                        $state.reload();
                    }else{
                        layer.msg("修改头像失敗");
                    }
                },function(error){console.log(error)})
            })
        }

        //确定头像 大小检测
        function isHeadPicSize(){
            var file = document.querySelector('input[type=file]').files[0];
            console.log(file)
            //if(!file){
            //    layer.msg("请选择要上传的头像")
            //}else if(file.size>1024){
            //    layer.msg("头像尺寸不能超过1Mb")
            //}else{
                ngDialog.closeAll(1) ;
            //}
        }
        //弹出自定义头像对话框
        function addCustom(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/config/robot_setup/add_custom_avatar.html","500px",function(){
                var file = document.querySelector('input[type=file]').files[0];
                //if(file.size>1024){
                //    layer.msg("头像尺寸不能超过1Mb")
                //}else{
                var fd = new FormData();
                //var file =$scope.vm.myFile
                fd.append('file', file);
                fd.append('settingId',$scope.vm.settingId);
                fd.append('x',$('#x').val()) ;
                fd.append('y',$('#y').val());
                fd.append('w',$('#w').val());
                fd.append('h',$('#h').val());
                console.log(fd)
                $http({
                    method:'POST',
                    url:"/api/application/application/uploadHead",
                    data: fd,
                    headers: {'Content-Type':undefined},
                    transformRequest: angular.identity
                }).success( function (response){
                    if(response.status==200){
                        layer.msg("修改头像成功");
                        //$state.go("setting.vm");
                        $state.reload();
                    }else{
                        layer.msg("上传头像失敗");
                    }
                });
            })
        }
        queryRobotParameter() ;
        //查看机器人参数
        function queryRobotParameter(){
            configurationServer.queryRobotParameter.save({
                "applicationId": APPLICATION_ID
            },function(data){          //类名重複
                if(data.data===10005){
                    $scope.vm.robotExpire=""; //过期知识回答
                    $scope.vm.robotHead= "";//头像
                    $scope.vm.robotHotQuestionTimeout = "";//热点问题更新频率
                    $scope.vm.robotLearned = "";//学到新知识回答
                    $scope.vm.robotName = ""; //名称
                    $scope.vm.robotRepeat = "";//重复问答回复
                    $scope.vm.robotRepeatNumber = "";//重复问答次数
                    $scope.vm.robotSensitive = "";// 敏感问答回复
                    $scope.vm.robotTimeout = "";//超时提示回复
                    $scope.vm.robotTimeoutLimit = "";//超时时长
                    $scope.vm.robotUnknown = "";//未知问答回复
                    $scope.vm.robotWelcome = "";//欢迎语
                    $scope.vm.settingId = "" ;  //机器人参数ID
                    $scope.vm.newRobotHead =""; //新的头像
                    //$scope.vm.imgUrl =""; //文件服务器地址
                }else{
                    $scope.vm.robotExpire= data.data.robotExpire; //过期知识回答
                    $scope.vm.robotHead= data.data.robotHead;//头像
                    //$scope.vm.imgUrl = data.data.imgUrl; //文件服务器地址
                    $scope.vm.robotHotQuestionTimeout = data.data.robotHotQuestionTimeout;//热点问题更新频率
                    $scope.vm.robotLearned = data.data.robotLearned;//学到新知识回答
                    $scope.vm.robotName = data.data.robotName; //名称
                    $scope.vm.robotRepeat = data.data.robotRepeat;//重复问答回复
                    $scope.vm.robotRepeatNumber = data.data.robotRepeatNumber;//重复问答次数
                    $scope.vm.robotSensitive = data.data.robotSensitive;// 敏感问答回复
                    $scope.vm.robotTimeout = data.data.robotTimeout;//超时提示回复
                    $scope.vm.robotTimeoutLimit = data.data.robotTimeoutLimit;//超时时长
                    $scope.vm.robotUnknown = data.data.robotUnknown;//未知问答回复
                    $scope.vm.robotWelcome = data.data.robotWelcome;//欢迎语
                    $scope.vm.settingId = data.data.settingId;//机器人参数ID
                    $scope.vm.newRobotHead = data.data.robotHead; //新的头像

                }
            },function(error){console.log(error)})

        }
        //编辑机器人参数
        function editRobot(flag){
            if(flag){
                configurationServer.updateRobotParameter.save({
                    "robotUpdateId":USER_ID ,
                    "applicationId": APPLICATION_ID,
                    "robotExpire": $scope.vm.robotExpire,
                    "robotHead": $scope.vm.robotHead,
                    "robotHotQuestionTimeout": $scope.vm.robotHotQuestionTimeout,
                    "robotLearned": $scope.vm.robotLearned,
                    "robotName": $scope.vm.robotName,
                    "robotRepeat": $scope.vm.robotRepeat,
                    "robotRepeatNumber": $scope.vm.robotRepeatNumber,
                    "robotSensitive": $scope.vm.robotSensitive,
                    "robotTimeout": $scope.vm.robotTimeout,
                    "robotTimeoutLimit": $scope.vm.robotTimeoutLimit,
                    "robotUnknown": $scope.vm.robotUnknown,
                    "robotWelcome": $scope.vm.robotWelcome,
                    "settingId": $scope.vm.settingId
                },function(data){
                    if(data.status===200){
                        layer.msg("保存成功");
                        //$state.reload();
                    }else{
                        layer.msg("保存失敗");
                    }
                },function(error){console.log(error)})
            }
        }
    }
]);
//    .directive('checkWelcome', function($http){
//    return {
//        require: 'ngModel',
//        link: function(scope, ele, attrs, c){
//            scope.$watch(attrs.ngModel, function(n){
//                if(!n) return;
//                console.log(scope.robot.robotWelcome);
//                var welcomes=scope.robot.robotWelcome.split("\n");
//                console.log(welcomes.length);
//                if(welcomes.length>10){
//                    c.$setValidity('len', false);
//                }else{
//                    c.$setValidity('len', true);
//                }
//            });
//        }
//    }
//});