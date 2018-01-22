/**
 * Created by miles on 2017/7/16.
 *
 * 语音上传  ====》》  指令
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .directive("restore", ["$parse","$state","$timeout", "ngDialog",
    function($parse,$state,$timeout,ngDialog) {
    return {
        restrict:'EA',
        template:
            '<span  id="picker" style="float:left">选择文件</span><br/><br/>'+
             '<p ng-repeat="item in fileNames">{{item}}</p>'
        ,
        link:function(scope,element,attrs){
            scope.fileNames = [] ;
            $timeout(function(){
                var uploader = WebUploader.create({
                        auto: true, // 选完文件后，是否自动上传
                        // swf文件路径
                        swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                        server: API_APPLICATION+"/backuprestore/info/read",
                        //accept: {
                        //    title: 'file',
                        //    extensions: 'xls,xlsx',
                        //    mimeTypes: 'file/*'
                        //},
                        pick: '#picker',
                    });
                 uploader.on( 'fileQueued', function( file ) {
                        scope.vm.file=file;
                    });
                    uploader.on( 'uploadProgress', function( file, percentage ) {
                        var $li = $( '#'+file.id ),
                            $percent = $li.find('.progress .progress-bar');
                        // 避免重复创建
                        if ( !$percent.length ) {
                            $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
                                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                                '</div> ' +
                                '</div>').appendTo( $li ).find('.progress-bar');
                        }
                        $li.find('p.state').text('上传中');
                        $percent.css( 'width', percentage * 100 + '%' );
                    });
                    uploader.on('uploadError', function (file) {
                        console.log("上传失败")
                    });
                    uploader.on('uploadSuccess', function (file,response) {
                        if(response.status == 500){
                            layer.msg("模板错误")
                        }else{
                            scope.vm.restoreList = response.data;
                            scope.vm.data=true;
                            scope.vm.flage=true;
                             layer.msg(response.info,{time:1000})
                            scope.$apply();
                        }
                    });
                // scope.$watch("vm.isUploadStart",function(val){
                //     if(val){
                //         if(!scope.vm.voiceTitle){
                //             layer.msg("请添加语音标题");
                //         }else if(!uploader.getFiles().length){
                //             layer.msg("请选择文件");
                //         }else{
                //             uploader.options.formData = {
                //                 // "voiceName" : scope.vm.voiceTitle,
                //                 // "applicationId":APPLICATION_ID,
                //                 // "voiceUserName":USER_LOGIN_NAME
                //                 "voiceName": scope.vm.voiceTitle,
                //                 "modifierId" : USER_ID,

                //             } ;
                //             console.log(uploader.options.formData);
                //             uploader.upload() ;
                //         }
                //     }
                // })
            },0)

        }
    }

}])} ;