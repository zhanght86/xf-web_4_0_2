/**
 * Created by miles on 2017/7/16.
 *
 * 图片上传  ====》》  指令
 */
knowledge_static_web.directive("imgUpload", ["$parse","$state", function($parse,$state) {
    return {
        restrict:'EA',
        template:
            '<span  id="picker" style="float:left">上传图片</span>'
        ,
        link:function(scope,element,attrs){
            var uploader = WebUploader.create({
                auto: true, // 选完文件后，是否自动上传
                // swf文件路径
                swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                server: "/api/ms/picture/upload",
                formData : {
                    "applicationId":APPLICATION_ID,
                    "userName":USER_LOGIN_NAME
                }  ,   // 上传参数
                accept: {
                   title: 'Images',
                   extensions: 'jpg,,png',
                   mimeTypes: 'image/*'

                },
                pick: '#picker',
                fileNumLimit : 10
            });

            uploader.on( 'fileQueued', function( file ,file2,file3 ) {
                if(scope.vm.uploadParemeter.queueNumber<10){
                    scope.vm.uploadParemeter.queueNumber +=1 ;
                }
                console.log(uploader) ;
                //if(file)
                //scope.vm.uploadParemeter.uploadParemeter+=1
                //console.log(file + "file  add success");
            });

            uploader.on( 'fileDequeued', function() {
            });
            uploader.on( 'uploadProgress', function( file, percentage ) {
                scope.vm.uploadParemeter.process = percentage * 100 + '%' ;
                $(".progress .bar_span").css("width",percentage * 100 + '%');
                console.log(percentage) ;
                // var $li = $( '#'+file.id ),
                //     $percent = $li.find('.progress span');
                //
                // // 避免重复创建
                // if ( !$percent.length ) {
                //     $percent = $('<div class="progress"><span></span></div>')
                //         .appendTo( $li )
                //         .find('span');
                // }
                // $percent.css( 'width', percentage * 100 + '%' );

            });
            uploader.on('error',function(type){
                switch (type) {
                    case 'Q_EXCEED_NUM_LIMIT':
                        layer.msg("单次最多上传10张图！");
                        break;
                    case 'Q_EXCEED_SIZE_LIMIT':
                        layer.msg("错误：文件总大小超出限制！");
                        break;
                    // case 'F_EXCEED_SIZE':
                    //     layer.msg("文件大小不能超过1.95M");
                    //     break;
                    case 'Q_TYPE_DENIED':
                        layer.msg("请上传 jpg, png 格式文件");
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
                console.log("上传失败")
                layer.msg('请检查'+reason);
            });
            uploader.on('uploadSuccess', function (file,response) {
                if(response.status == 500){
                    layer.msg("模板错误")
                }else{
                    //layer.msg("上传成功");
                    //$state.reload() ;
                }
                //console.log(response)
            });
            // 所有文件上传成功 之后 刷新数据列表
            uploader.on('uploadFinished', function (file) {
                   layer.msg("上传成功");
                   scope.isUpload = false;
                   $state.reload();
                   //console.log(response);
            });

        }
    }
}])