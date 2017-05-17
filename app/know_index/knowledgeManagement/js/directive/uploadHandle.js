/**
 * Created by 41212 on 2017/4/24.
 */

/**
 * Created by miles on 2017/4/11.
 *
 * webuploader  ====》》  指令
 */

knowledge_static_web.directive("uploaderFactor", ["$parse", function($parse) {
    return {
        restrict:'EA',
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
        '<button  id="picker" >上传线下编辑场景知识</button><span class="f-14 pl-10">请先<a href="/api/ms/elementKnowledgeAdd/download?fileName=factor_template.xlsx"  class="c-primary">下载模板</a>进行填写</span>'
        ,
        link:function(scope,element,attrs){
            //var $list = angular.element("#thelist");
            var server = angular.copy(scope.server) ;
            var uploader = WebUploader.create({
                auto: true, // 选完文件后，是否自动上传
                // swf文件路径
                swf: 'Uploader.swf',
                //formData : {title:"is Image  ====   uploader"}  ,   // 上传参数
                // 文件接收服务端。
                //server: "/api/application/application/uploadHead",

                server: "/api/ms/elementKnowledgeAdd/upload",
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
    .directive("uploaderHandle2", ["$parse", function($parse) {
        return {
            restrict:'EA',
            scope:{
                accept:'=',
                server : '='   , //url
                //item  : '@'
                type : "="   ,   //image：图片 video：音视频  flash：flash   file：办公文档，压缩文件等等
                isAuto : "=",
                selectBtn : "="
            },
            template:'<div id="uploader" class="wu-example upWrapper">'+
                //<!--用来存放文件信息-->
            '<div id="thelist" class="uploader-list upList"></div>'+
            '<div class="btns">'+
            '<div id="picker">上传线下编辑场景知识</div>' +
                '<button id="ctlBtn" clas="btn btn-default">开始上传</button>'+
            '</div>'+
            '</div>'
            ,
            link:function(scope,element,attrs){
                console.log(scope.selectBtn);
                var $list = angular.element("#thelist");
                var uploader = WebUploader.create({
                    auto: true, // 选完文件后，是否自动上传
                    // swf文件路径
                    swf: 'Uploader.swf',
                    formData : {title:"is Image  ====   uploader"}  ,   // 上传参数
                    // 文件接收服务端。
                    server: "/api/application/application/uploadHead",
                    accept: {
                        title: 'file',
                        extensions: 'xls,xlsx',
                        mimeTypes: 'file/*'
                    },
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: '#picker',
                    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                    resize: false,
                    chunked: true,  // 分片上传大文件
                    chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？
                    thread: 100,// 最大上传并发数
                    // 禁掉全局的拖拽功能。这样不会出现文件拖进页面的时候，把文件打开。
                    disableGlobalDnd: true,

                    fileNumLimit: 300,
                    fileSizeLimit: 200 * 1024 * 1024,    // 200 M    all
                    fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M   single
                });
                //// 当有文件被添加进队列的时候
                //uploader.on( 'fileQueued', function( file ) {
                //    $list.append( '<div id="' + file.id + '" class="item">' +
                //        '<h4 class="info">' + file.name + '</h4>' +
                //        '<p class="state">等待上传...</p>' +
                //        '</div>' );
                //});
                //// 文件上传过程中创建进度条实时显示。
                //uploader.on( 'uploadProgress', function( file, percentage ) {
                //    var $li = $( '#'+file.id ),
                //        $percent = $li.find('.progress .progress-bar');
                //    // 避免重复创建
                //    if ( !$percent.length ) {
                //        $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
                //            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                //            '</div>' +
                //            '</div>').appendTo( $li ).find('.progress-bar');
                //    }
                //    $li.find('p.state').text('上传中');
                //    $percent.css( 'width', percentage * 100 + '%' );
                //    console.log(percentage);
                //});
                ////文件上传成功
                //uploader.on('uploadSuccess', function (file) {
                //    $('#' + file.id).find('p.state').text('已上传');
                //});
                ////文件上传失败
                //uploader.on('uploadError', function (file) {
                //    $('#' + file.id).find('p.state').text('上传失败');
                //});
                ////文件上传完成
                //uploader.on('uploadComplete', function (file) {
                //    $('#' + file.id).find('.progress').fadeOut();
                //    //$("#editModal").fadeOut(2000, window.location.reload());
                //});
                //
                //$('#btnSave').bind('click', function () {
                //    var  name = $("#txtName").val();
                //    var  id = $("#txtId").val();
                //
                //    if (!name || name.length == 0) {
                //        alert("请填写名称");
                //        return false;
                //    }
                //    var obj = new Object();
                //    obj.name = name;
                //    obj.id = id;
                //    uploader.options.formData = obj;
                //    //  uploader.options.formData = { "name": name, "id": id, };
                //    if (state === 'uploading') {
                //        uploader.stop();
                //    } else {
                //        uploader.upload();
                //    }
                //});
            }
        }
    }]);

/*
 $scope.accept = {
 //图片
 image: {
 title : 'Images',//标题
 extensions : 'gif,jpg,jpeg,bmp,png,ico',//允许上传文件的后缀
 mimeTypes : 'image/*'//允许的mimetype
 },
 //音视频
 video: {
 title : 'Videos',
 extensions : 'wmv,asf,asx,rm,rmvb,ram,avi,mpg,dat,mp4,mpeg,divx,m4v,mov,qt,flv,f4v,mp3,wav,aac,m4a,wma,ra,3gp,3g2,dv,vob,mkv,ts',
 mimeTypes : 'video/*,audio/*'
 },
 //flash
 flash: {
 title : 'Flashs',
 extensions : 'swf,fla',
 mimeTypes : 'application/x-shockwave-flash'
 },
 //办公文档，压缩文件等等
 file: {
 title : 'Files',
 extensions : 'zip,rar,ppt,pptx,doc,docx,xls,xlsx,pdf',
 mimeTypes : 'application/zip,application/x-rar-compressed,application/vnd.ms-powerpoint,application/vnd.openxmlformats-             officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-   excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf'
 }
 };
 */




// 实例化
//var uploader = WebUploader.create({
//    //指定选择文件的按钮容器
//    //multiple是否开启多文件上传，默认为true
//    pick : {
//        id : '#filePicker',
//        //label : '点击选择图片'
//        innerHTML: '点击选择' + $scope.selectType[items.type],
//        multiple: true
//    },
//    //指定拖拽的容器
//    dnd : '#uploader .queueList',
//    //启用通过截屏来粘贴图片
//    paste : document.body,
//    //指定接受哪些类型的文件
//    accept : items.accept[items.type],
//
//    // swf文件路径
//    swf : 'Uploader.swf',
//
//    disableGlobalDnd : true,
//    //是否分片
//    chunked : true,
//    //chunkSize: 700000,  //每个分片的大小，默认为5M
//    // server: 'http://webuploader.duapp.com/server/fileupload.php',
//    server : '../demo',
//    //文件最大数量
//    fileNumLimit : 30,
//    //验证文件总大小是否超出限制
//    fileSizeLimit : 5 * 1024 * 1024, // 200 M
//    //验证单个文件大小是否超出限制
//    fileSingleSizeLimit : 1 * 1024 * 1024
//    // 50 M
//});
