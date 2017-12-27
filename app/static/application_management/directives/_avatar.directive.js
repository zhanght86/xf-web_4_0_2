/**
 * @Author : MILES .
 * @Create : 2017/12/22.
 * @Module : 裁剪工具
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .directive('uploadAvatar', function($timeout){
        return {
            restrict:'EA',
            template :'<span id="picker">1选择图片</span>' ,
            replace:true,
            link: function($scope, ele, attrs, c){
                 let position = {} ;
                 // let imgSize = {
                 //     width : $("#setting_head").width(),
                 //     height : $("#setting_head").height()
                 // };
                $timeout(function(){
                    var uploader = WebUploader.create({
                        auto: false, // 选完文件后，是否自动上传
                        // swf文件路径
                        swf: 'assets/libs/webuploader-0.1.5/dist/Uploader.swf',
                        server: "/api/application/config/upload/avatar",
                        accept: {
                            title: 'Images',
                            extensions: 'jpg,png,bmp',
                            mimeTypes: 'image/*'
                        },
                        pick : {
                            id :  '#picker',
                            multiple: false
                        },

                    });
                    var srcImg ;
                    uploader.on( 'fileQueued', function( file ,file1,file3) {
                        console.log(file,file1,file3 + "file  add success");
                        // 增加预览
                        uploader.makeThumb(file, function (error, src) {
                            if (error) {
                                layer.msg('预览错误');
                                // $img.replaceWith('<span>不能预览</span>');
                                return;
                            }
                            srcImg = src ;
                            console.log(file,src) ;
                            $("#setting_head").attr('src', srcImg);
                            // 裁切
                            $('#setting_head').Jcrop({
                                onChange: function(coord){
                                    position = {
                                        x : coord.x,
                                        y : coord.y,
                                        h : coord.h,
                                        w : coord.w
                                    } ;
                                    console.log(position)
                                },
                                onSelect: function(){},
                                aspectRatio: 1
                            },function(){
                                // Use the API to get the real image size
                                // var bounds = this.getBounds();
                                // boundx = bounds[0];
                                // boundy = bounds[1];
                                // // Store the API in the jcrop_api variable
                                // jcrop_api = this;
                                //
                                // // Move the preview into the jcrop container for css positioning
                                // $preview.appendTo(jcrop_api.ui.holder);
                            });
                        },1,1);
                    });

                    uploader.on('uploadError', function (file) {
                        console.log("上传失败")
                    });
                    uploader.on('uploadSuccess', function (file,response) {
                        // if(response.status == 500){
                        //     layer.msg("模板错误")
                        // }else{
                        //     scope.tableList = response ;
                        //     scope.$apply();
                        // }
                        console.log(response)
                    });
                    $(".start_upload_avatar").click(function () {
                        uploader.options.formData = {
                            x : position.x,
                            y : position.y,
                            h : position.h,
                            w : position.w
                        } ;
                        uploader.upload()
                    })

                })

            }
        }
    })
} ;