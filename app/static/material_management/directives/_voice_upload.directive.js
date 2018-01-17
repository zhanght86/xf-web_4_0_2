/**
 * Created by miles on 2017/7/16.
 *
 * 语音上传  ====》》  指令
 */
module.exports = materialModule =>{
    materialModule
    .directive("voiceUpload", ["$parse","$state","$timeout", "ngDialog",
    function($parse,$state,$timeout,ngDialog) {
    return {
        restrict:'EA',
        template:
            '<span  id="picker" style="float:left">选择语音</span><br/><br/>'+
             '<p ng-repeat="item in fileNames">{{item}}</p>'
        ,
        link:function(scope,element,attrs){
            scope.fileNames = [] ;
            $timeout(function(){
                var uploader = WebUploader.create({
                    auto: false, // 选完文件后，是否自动上传
                    // swf文件路径
                    swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                    server: "/api/material/voice/upload",
                    formData:{
                        // "voiceName": scope.vm.voiceTitle ,
                        // "modifierId":USER_ID,
                       // "applicationId": APPLICATION_ID
                    },

                    pick: '#picker',
                    fileNumLimit : 1,                //文件个数
                    fileSingleSizeLimit:1.95*1024*1024,   //设定单个文件大小
                    //只允许上传语音文件
                    accept: {
                        title: 'Audio',
                        extensions: 'MP3, WMV',
                        //mimeTypes: 'image/*'
                    }

                });
                uploader.on( 'fileQueued', function( file ) {
                    console.log(file.ext) ;
                    if(file.ext != "mp3" &&  file.ext != "wmv"){
                        console.log(uploader) ;
                        return layer.msg("请选择 mp3 或 wmv 类型语音文件上传")
                    }
                    scope.$apply(function(){
                        scope.vm.isUploadStart = false ;
                        scope.fileNames.push(file.name) ;
                        //console.log(scope.fileName)
                    }) ;
                });
                //上传进度条；
                uploader.on( 'uploadProgress', function( file, percentage ) {
                    scope.vm.uploadParemeter.process = percentage * 100+'%';
                    $('progress .bar_span').css('width',percentage * 100+'%');

                });
                /**
                 * 验证文件格式以及文件大小
                 */
                uploader.on("error",function(type){
                    switch (type) {
                        case 'Q_EXCEED_NUM_LIMIT':
                            layer.msg("错误：上传文件数量过多！");
                            break;
                        case 'Q_EXCEED_SIZE_LIMIT':
                            layer.msg("错误：文件总大小超出限制！");
                            break;
                        case 'F_EXCEED_SIZE':
                            layer.msg("文件大小不能超过1.95M");
                            break;
                        case 'Q_TYPE_DENIED':
                            layer.msg("请上传 MP3, WMV 格式文件");
                            break;
                        case 'F_DUPLICATE':
                            layer.msg("错误：请勿重复上传该文件！");
                            break;
                        default:
                            layer.msg("请检查"+type+"后重新上传");
                            break;
                    }

                });
                uploader.on('uploadError', function (file,reason) {
                    console.log("上传失败");
                    layer.msg('请检查'+reason);
                    console.log(reason);
                });

                uploader.on('uploadSuccess', function (file,response) {
                    if(response.status == 500){
                        scope.vm.isUploadStart = false ;
                        layer.msg(response.info)
                    }
                    if(response.status == 200){
                        ngDialog.closeAll();
                        layer.msg("上传成功");
                        //alert(response.data);
                        $state.reload() ;
                    }
                    console.log(response);
                });
                scope.$watch("vm.isUploadStart",function(val){
                    if(val){
                        if(!scope.vm.voiceTitle){
                            layer.msg("请添加语音标题");
                        }else if(!uploader.getFiles().length){
                            layer.msg("请选择文件");
                        }else{
                            uploader.options.formData = {
                                // "voiceName" : scope.vm.voiceTitle,
                                // "applicationId":APPLICATION_ID,
                                // "voiceUserName":USER_LOGIN_NAME
                                "voiceName": scope.vm.voiceTitle,
                                "modifierId" : USER_ID,

                            } ;
                            console.log(uploader.options.formData);
                            uploader.upload() ;
                        }
                    }
                })
            },0)

        }
    }

}])} ;