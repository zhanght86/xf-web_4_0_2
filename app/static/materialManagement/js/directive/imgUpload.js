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
                //accept: {
                //    title: 'Images',
                //    extensions: 'jpg,,png',
                //    mimeTypes: 'image/*'
                //
                //},
                pick: '#picker',
            });
            uploader.on( 'fileQueued', function( file ) {
                console.log(file + "file  add success");
            });
            uploader.on( 'uploadProgress', function( file, percentage ) {
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
            uploader.on('uploadError', function (file) {
                console.log("上传失败")
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
                   console.log(response);
            });

        }
    }
}])