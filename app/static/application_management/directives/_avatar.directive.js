/**
 * @Author : MILES .
 * @Create : 2017/12/22.
 * @Module : 裁剪工具
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .directive('uploadAvatar', function($timeout,ngDialog,ApplicationServer){
        return {
            restrict:'EA',
            template :'<span id="picker">选择图片</span>' ,
            replace:true,
            link: function($scope, ele, attrs, c){
                 let position = {} ;
                $timeout(function(){
                    var uploader = WebUploader.create({
                        auto: false, // 选完文件后，是否自动上传
                        // swf文件路径
                        swf: 'assets/libs/webuploader-0.1.5/dist/Uploader.swf',
                        server: API_MATERIAL+"/picture/upload/head/img",
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
                            });
                        },1,1);
                    });

                    uploader.on('uploadError', function (file) {
                        console.log("上传失败")
                    });
                    uploader.on('uploadSuccess', function (file,responseAvatar) {
                        if(responseAvatar.status == 200){
                            ApplicationServer.storeClassicalAvatar.save({
                                "avatarDocId": responseAvatar.data,
                            },function(response){
                                if(response.status===200){
                                    console.log(response)
                                    setCookie('avatarUrl',API_MATERIAL+"/picture/get/img/id?pictureId=");
                                    setCookie('avatarId',responseAvatar.data);
                                    $scope.$parent.$parent.MASTER.avatarUrl = API_MATERIAL+"/picture/get/img/id?pictureId=" ;
                                    $scope.$parent.$parent.MASTER.avatarId = responseAvatar.data ;
                                }
                                layer.msg(response.data);
                            },function(error){console.log(error)})
                            ngDialog.closeAll();
                        }else{
                            layer.msg(response.data)
                        }
                        console.log(response)
                    });
                    $(".start_upload_avatar").click(function () {
                        uploader.options.formData = {
                            status : 1,
                            x : position.x,
                            y : position.y,
                            height : position.h,
                            width : position.w,
                            origin : 1 ,
                            inTrusteeship : 1
                        } ;
                        uploader.upload();
                    })
                })
            }
        }
    })
} ;