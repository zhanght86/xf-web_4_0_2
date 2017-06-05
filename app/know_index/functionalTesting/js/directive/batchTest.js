/**
 * Created by miles on 2017/5/27.
 *
 * webuploader  ====》》  指令
 */
knowledge_static_web.directive("batchTest", ["$parse", "ngDialog", "$cookieStore", "$state", "$timeout",
        function ($parse, ngDialog, $cookieStore, $state, $timeout) {
            return {
                //restrict: 'EA',
                scope: {
                    accept: '=',
                    server: '=', //url
                    type: "=",   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
                    isAuto: "=",
                    isUpload: "=",
                    factor : "="
                },
                template: '<div class="$container">' +
                '<ul class="pick-list">' +
                      //    li  列表
                '</ul>' +
                '<div  id="picker" style="">请添加文件</div><span class=""></span>' +
                '</div>'
                ,
                link: function (scope, element, attrs) {
                    // console.log(1) ;
                    $timeout(function () {
                        var uploader = WebUploader.create({
                            auto: false, // 选完文件后，是否自动上传
                            // swf文件路径
                            //sendAsBinary:true, //指明使用二进制的方式上传文件
                            swf: '/bower_components/webuploader-0.1.5/dist/Uploader.swf',
                            formData: {
                                "userId": $cookieStore.get("userId"),
                                "applicationId": $cookieStore.get("applicationId")
                            },   // 上传参数
                            // 文件接收服务端。
                            server: scope.server,
                            accept: {
                                title: 'file',
                                extensions: 'xls,xlsx',
                                mimeTypes: 'file/xls,file/xlsx'
                            },
                            // 选择文件的按钮。可选。
                            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                            pick: {
                                id: '#picker',
                                multiple: true
                            },
                            //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                            resize: false,
                            chunked: true,  // 分片上传大文件
                            chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
                            //thread: 100,// 最大上传并发数
                            // 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
                            disableGlobalDnd: true,

                            fileNumLimit: 10,
                            fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
                            fileSingleSizeLimit: 5 * 1024 * 1024    // 50 M   single
                });
                scope.$watch("isUpload",function(isUpload){
                    if(isUpload){
                        uploader.upload() ;
                        ngDialog.closeAll();
			            scope.isUpload = false
                    }
                }) ;
                //
                uploader.on( 'fileQueued', function( file ) {
                    var item = $('<li class="pick-item mb-5 pl-5 pr-5"  style="line-height: 25px;background:#e8ebec;">'+file.name+'<a href="javascript:;" data-id="'+file.id+'" class="R removeItem">X</a></li>') ;
                    $(".pick-list").append(item) ;
                    console.log(file + "file  add success");
                });
                //当validate不通过时，会以派送错误事件的形式通知
                uploader.on('error', function (type) {
                    switch (type) {
                        case 'Q_EXCEED_NUM_LIMIT':
                            alert("错误：上传文件数量过多！");
                            break;
                        case 'Q_EXCEED_SIZE_LIMIT':
                            alert("错误：文件总大小超出限制！");
                            break;
                        case 'F_EXCEED_SIZE':
                            alert("错误：文件大小超出限制！");
                            break;
                        case 'Q_TYPE_DENIED':
                            alert("错误：禁止上传该类型文件！");
                            break;
                        case 'F_DUPLICATE':
                            alert("错误：请勿重复上传该文件！");
                            break;
                        default:
                            alert('错误代码：' + type);
                            break;
                    }
                });
                uploader.on('uploadProgress', function (file, percentage) {
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress .progress-bar');
                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
                            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                            '</div> ' +
                            '</div>').appendTo($li).find('.progress-bar');
                    }
                    $li.find('p.state').text('上传中');
                    $percent.css('width', percentage * 100 + '%');
                    console.log(percentage);
                });
                uploader.on('uploadError', function (file) {
                    console.log("上传失败")
                });
                //        单个文件上传成功 之后 刷新数据列表
                uploader.on('uploadSuccess', function (file, response) {
                    if (response.status == 500) {
                        scope.isUpload = false;
                        layer.msg("模板错误")
                    } else {
                        scope.isUpload = false;
                        scope.factor = 1 ;
                        $state.reload();
                    }
                    console.log(response)
                });
                //        所有文件上传成功 之后 刷新数据列表
                //uploader.on('uploadFinished', function (file) {
                //        scope.isUpload = false;
                //        $state.reload();
                //});
                //删除某个文件
                $(".framework").delegate(".removeItem","click",function(){
                    var self = $(this) ;
                    uploader.removeFile(uploader.getFile(self.attr("data-id")),true);//队列中移除其中某个文件
                    self.parent().remove() ;
                }) ;
             }, 0)
        }
    }
}])