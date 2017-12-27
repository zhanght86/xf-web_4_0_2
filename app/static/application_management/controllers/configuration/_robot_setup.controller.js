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
            cropper : {    // 上传头像尺寸
                x : "", //坐标x
                y : "", //坐标y
                w : "", //截取的宽度
                h : "", //截取的高度
            } ,
            // isHeadPicSize : isHeadPicSize  //头像大小是否合格 1Mb
        };
        $scope.robot = {
            "imgUrl"                 : "", //文件服务器地址
            "name"                   : "", //名称
            "id"                     : "", //机器人参数ID
            "avatarDocId"            : "", //头像
            // "newAvatar"              : "", //新的头像
            "welcomes"                : "", //欢迎语
            "defaultUnknownAnswer"   : "", //未知问答回复
            "defaultSensitiveAnswer" : "", // 敏感问答回复
            "repeatNumber"           : "", //重复问答次数
            "defaultRepeatAnswer"    : "", //重复问答回复
            "sessionTimeoutLimit"    : "", //超时时长
            "sessionTimeoutAnswer"   : "", //超时提示回复
            "defaultExpireAnswer"    : "", //超时提示回复
            "defaultFuzzyAnswer"     : "", //默认模糊问题回答
        };
        let classAvatarHtml      = require("../../views/configuration/robot_setup/classical_avatar.html") ;  // 经典头像
        let customizedAvatarHtml = require("../../views/configuration/robot_setup/customized_avatar.html") ; // 自定义头像
        //弹出经典头像对话框
        function addClassic(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,classAvatarHtml,"",function(){
                ApplicationServer.storeClassicalAvatar.save({
                    "avatarDocId": $scope.vm.newRobotHead,
                },function(response){
                    if(response.status===200){
                        layer.msg("修改头像成功");
                        $state.reload();
                    }else{
                        layer.msg(response.data);
                    }
                },function(error){console.log(error)})
            })
        }
        //弹出自定义头像对话框
        function addCustom(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,customizedAvatarHtml,"500px",function(){
                // var file = document.querySelector('input[type=file]').files[0];
                //if(file.size>1024){
                //    layer.msg("头像尺寸不能超过1Mb")
                //}else{
                // var fd = new FormData();
                //var file =$scope.vm.myFile
                // fd.append('file', file);
                // fd.append('settingId',$scope.vm.settingId);
                // fd.append('x',$('#x').val()) ;
                // fd.append('y',$('#y').val());
                // fd.append('w',$('#w').val());
                // fd.append('h',$('#h').val());
                // console.log(fd)

            })
        }
        queryRobotParameter() ;
        //查看机器人参数
        function queryRobotParameter(){
            ApplicationServer.queryRobotParameter.get({
                "id": APPLICATION_ID
            },function(response){
                if(response.status===200){
                    voluation(response.data) ;
                }else{
                    layer.msg(response.data) ;
                    voluation() ;
                }
            },function(error){console.log(error)})
        }
        //查看机器人头像获取
        function queryAvatarList(flag){

        }
        //编辑机器人参数
        function editRobot(flag){
            if(flag){
                ApplicationServer.updateRobotParameter.save($scope.robot,function(response){

                    if(response.status===200){
                        layer.msg("机器人设置修改成功");
                        voluation(response.data)
                    }else{
                        layer.msg(response.data);
                    }
                },function(error){console.log(error)})
            }
        }
        // 参数赋值
        function voluation(data){
            for(let key in $scope.robot){
                if(data){
                    $scope.robot[key] = data[key]
                }else{
                    $scope.robot[key] = "" ;
                }
            }
        }
    }
])};
