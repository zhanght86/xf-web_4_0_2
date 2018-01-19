/**
 * @Author : MILES .
 * @Create : 2018/1/18.
 * @Module :
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
        .directive("restore", ["$parse", function($parse) {
            return {
                restrict:'A',
                scope:{
                    accept:'=',
                    server : '='   , //url
                    //item  : '@'
                    type : "="   ,   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
                    isAuto : "=",
                    selectBtn : "=",
                    "tableList" : "="
                },
                template:
                    '<span  id="picker" style="float:left">选择文件</span>'
                ,
                link:function(scope,element,attrs){
                    //var $list = angular.element("#thelist");
                    var uploader = WebUploader.create({
                        auto: true, // 选完文件后，是否自动上传
                        // swf文件路径
                        swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                        server: API_APPLICATION+"/backuprestore/restore",
                        //accept: {
                        //    title: 'file',
                        //    extensions: 'xls,xlsx',
                        //    mimeTypes: 'file/*'
                        //},
                        pick: '#picker',
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
                        if(response.status == 500){
                            layer.msg("模板错误")
                        }else{
                            scope.tableList = response ;
                            scope.$apply();
                        }
                        console.log(response)
                    });

                }
            }
        }])
}