/**
 * Created by 41212 on 2017/5/23.
 */
knowledge_static_web.directive("uploaderBase", ["$parse", function($parse) {
    return {
        restrict:'EA',
        scope:{
            accept:'=',
            server : '='   , //url
            //item  : '@'
            type : "="   ,   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
            isAuto : "=",
            selectBtn : "=",
            "tableList" : "=" ,
            userId : "=" ,
            applicationId : "="
        },
        template:
            '<button  id="picker">批量导入</button>'
        ,
        link:function(scope,element,attrs){
            var userId = scope.userId ,
                applicationId = scope.applicationId ;
            //var $list = angular.element("#thelist");
            var server = angular.copy(scope.server) ;
            var uploader = WebUploader.create({
                auto: true, // 选完文件后，是否自动上传
                // swf文件路径
                swf: 'Uploader.swf',
                formData : {"userId":userId,"applicationId":applicationId}  ,   // 上传参数
                // 文件接收服务端。
                //server: "/api/application/application/uploadHead",

                server: "/api/ms/chatKnowledge/upload",
                //accept: {
                //    title: 'file',
                //    extensions: 'xls,xlsx',
                //    mimeTypes: 'file/*'
                //},
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#picker',
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                //resize: false,
                //chunked: true,  // 分片上传大文件
                //chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
                //thread: 100,// 最大上传并发数
                //// 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
                //disableGlobalDnd: true,
                //
                //fileNumLimit: 1,
                //fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
                //fileSingleSizeLimit: 5 * 1024 * 1024    // 50 M   single
            });
            uploader.on( 'fileQueued', function( file ) {
                console.log(file + "file  add success");
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
                console.log(percentage);
            });
            uploader.on('uploadError', function (file) {
                console.log("上传失败")
            });
            uploader.on('uploadSuccess', function (file,response) {
                   console.log(response)
                /*if(response.status == 500){
                 layer.msg("模板错误")
                 }else{
                 scope.tableList = response ;
                 scope.$apply();
                 }

                 console.log(response)*/
            });

        }
    }
}])
