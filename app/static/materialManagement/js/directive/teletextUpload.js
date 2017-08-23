/**
 * Created by miles on 2017/7/16.
 *
 * 图片上传  ====》》  指令
 */
knowledge_static_web.directive("teletextUpload", ["$parse","$state", function($parse,$state) {
    return {
        restrict:'EA',
        template:
            '<span  id="picker" style="float:left;">本地上传</span>'
        ,
        link:function(scope,element,attrs){
            var uploader = WebUploader.create({
                auto: true, // 选完文件后，是否自动上传
                // swf文件路径
                swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                server: "/api/ms/graphicMessage/upload",
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

            });
            uploader.on('uploadError', function (file) {
                console.log("上传失败")
            });
            uploader.on('uploadSuccess', function (file,response) {
                console.log(response)
                if(response.status == 500){
                    layer.msg("模板错误")
                }else{
                    scope.$apply(function(){
                        scope.vm.imgSelected = response.data ;
                    }) ;
                    layer.msg("上传成功");
                    //$state.reload() ;
                }
                console.log(response)
            });

        }
    }
}])