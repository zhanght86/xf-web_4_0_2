/**
 * Created by dinfo on 2017/3/28.
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('RobotSetupController', [
    '$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope)=> {
        $scope.vm = {
            classicHead:['touxiang1.png','touxiang2.png','touxiang3.png','touxiang4.png', 'touxiang5.png','touxiang6.png','touxiang7.png','touxiang8.png'], //经典头像列表
            imgUrl : "", //文件服务器地址
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
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"static/application_management/views/configuration/robot_setup/classical_avatar.html","",function(){
                ApplicationServer.storeClassicalAvatar.save({
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
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"static/application_management/views/configuration/robot_setup/customized_avatar.html","500px",function(){
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
            ApplicationServer.queryRobotParameter.get({
                "id": APPLICATION_ID
            },function(response){
                if(response.status===200){
                    $scope.vm.imgUrl  = response.data.imgUrl ;
                    $scope.vm.robotName = response.data.name;    //名称
                    $scope.vm.robotWelcome = response.data.welcomes;//欢迎语
                    $scope.vm.robotHead = getCookie("avatarId");//头像
                    $scope.vm.robotHotQuestionTimeout = response.data.hotQuestionTimeout;       //热点问题更新频率
                    $scope.vm.robotUnknown = response.data.defaultUnknownAnswer;                //未知问答回复
                    $scope.vm.robotSensitive = response.data.defaultSensitiveAnswer;            // 敏感问答回复
                    $scope.vm.robotExpire = response.data.defaultExpireAnswer;                  //过期知识回答

                    $scope.vm.robotRepeat = response.data.defaultRepeatAnswer;//重复问答回复
                    $scope.vm.robotRepeatNumber = response.data.repeatNumber;//重复问答次数
                    $scope.vm.robotTimeoutLimit = response.data.sessionTimeoutLimit;//超时时长
                    $scope.vm.robotTimeout = response.data.sessionTimeoutAnswer;//超时提示回复
                    // $scope.vm.robotLearned = response.data.robotLearned;//学到新知识回答
                    $scope.vm.settingId = response.data.id;//机器人参数ID
                    // $scope.vm.newRobotHead = response.data.robotHead; //新的头像
                }else{
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
                    $scope.vm.imgUrl =""; //文件服务器地址
                }
            },function(error){console.log(error)})

        }
        //编辑机器人参数
        function editRobot(flag){
            if(flag){
                ApplicationServer.updateRobotParameter.save({
                    "id": $scope.vm.settingId,
                    "defaultExpireAnswer": $scope.vm.robotExpire,
                    "avatarDocId": $scope.vm.robotHead,
                    "hotQuestionTimeout": $scope.vm.robotHotQuestionTimeout,
                    // "robotLearned": $scope.vm.robotLearned,
                    "name": $scope.vm.robotName,
                    "defaultRepeatAnswer": $scope.vm.robotRepeat,
                    "repeatNumber": $scope.vm.robotRepeatNumber,
                    "defaultSensitiveAnswer": $scope.vm.robotSensitive,
                    "sessionTimeoutAnswer": $scope.vm.robotTimeout,
                    "sessionTimeoutLimit": $scope.vm.robotTimeoutLimit,
                    "defaultUnknownAnswer": $scope.vm.robotUnknown,
                    "welcome": $scope.vm.robotWelcome,
                    imgUrl : $scope.vm.imgUrl

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
])};
