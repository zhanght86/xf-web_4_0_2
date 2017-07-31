/**
 * Created by miles on 2017/7/16.
 *
 * 语音上传  ====》》  指令
 */
knowledge_static_web.directive("voiceUpload", ["$parse","$state","$timeout", "ngDialog",
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
                    server: "/api/ms/voiceManage/uploadVoice",
                    pick: '#picker',
                });
                uploader.on( 'fileQueued', function( file ) {
                    //if(scope.fileNames.length>1){
                    //    scope.fileNames = []
                    //}
                    scope.$apply(function(){
                        scope.vm.isUploadStart = false ;
                        scope.fileNames.push(file.name) ;
                        console.log(scope.fileName)
                    }) ;
                });
                uploader.on( 'uploadProgress', function( file, percentage ) {

                });
                uploader.on('uploadError', function (file) {
                    console.log("上传失败")
                });
                uploader.on('uploadSuccess', function (file,response) {
                    if(response.status == 500){
                        scope.vm.isUploadStart = false ;
                        //layer.msg("模板错误")
                    }else{
                        ngDialog.closeAll();
                        layer.msg("上传成功");
                        $state.reload() ;
                    }
                    console.log(response)
                });
                //runtimeOrder : flash
                scope.$watch("vm.isUploadStart",function(val){
                    if(val && scope.vm.voiceTitle){
                        if(!scope.vm.voiceTitle){
                            layer.msg("请添加语音标题")
                        }else{
                            uploader.options.formData = {
                                "voiceName" : scope.vm.voiceTitle
                            } ;
                            uploader.upload() ;
                        }
                    }
                })
            },0)

        }
    }
}])