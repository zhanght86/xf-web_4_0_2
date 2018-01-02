/**
 * Created by 41212 on 2017/5/23.
 */
// 聊天知识库 上传
module.exports = materialModule =>{
    materialModule
    .directive("uploaderBase", ["$parse","$timeout","$state","ngDialog",
    function($parse,$timeout,ngDialog) {
        return {
        restrict:'EA',
            template:
            '<span  id="picker" style="float:left">批量导入</span><br/><br/>'+
            '<p ng-repeat="item in fileNames">{{item}}</p>'
            ,
        link:function(scope,element,attrs){
            scope.fileNames = [] ;
            $timeout(function(){
                var uploader = WebUploader.create({
                    auto: false, // 选完文件后，是否自动上传
                    // swf文件路径
                    swf: '/assets/libs/webuploader-0.1.5/dist/Uploader.swf',
                    formData : {
                        //"userId":USER_ID,
                    }  ,   // 上传参数
                    // 文件接收服务端。
                    server: "/api/material/chat/knowledge/upload",
                    accept: {
                        title: 'file',
                        extensions: 'xls,xlsx',
                        mimeTypes: 'file/xls,file/xlsx'
                    },
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: '#picker',
                    fileNumLimit: 1,

                });
                uploader.on( 'fileQueued', function( file ) {
                    console.log(file.ext) ;
                    if(file.ext != "xls" &&  file.ext != "xlsx"){
                        console.log(uploader) ;
                        return layer.msg("请选择 excel文件上传")
                    }
                    scope.$apply(function(){
                        scope.vm.isUploadStart = false ;
                        scope.fileNames.push(file.name) ;
                        //console.log(scope.fileName)
                    }) ;
                });

                /**
                 * 验证文件格式以及文件大小
                 */
                uploader.on("error",function(type){
                    switch (type) {
                        case 'Q_EXCEED_NUM_LIMIT':
                            layer.msg("错误：上传文件数量过多！");
                            break;
                        // case 'Q_EXCEED_SIZE_LIMIT':
                        //     layer.msg("错误：文件总大小超出限制！");
                        //     break;
                        // case 'F_EXCEED_SIZE':
                        //     layer.msg("文件大小不能超过1.95M");
                        //     break;
                        case 'Q_TYPE_DENIED':
                            layer.msg("请上传 xls,xlsx 格式文件");
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
                    console.log("上传失败");
                    layer.msg('请检查'+reason);
                    console.log(reason);
                });

                uploader.on('uploadSuccess', function (file,response) {
                    if(response.status == 500){
                        scope.vm.isUploadStart = false ;
                        //layer.msg("模板错误")
                    }
                    if(response.status == 200){
                        ngDialog.closeAll();
                        layer.msg("上传成功");
                        //alert(response.data);
                        $state.reload() ;
                    }
                    console.log(response);
                });
                scope.$watch("vm.isUploadStart",function(val){
                    if(val){
                        if(!uploader.getFiles().length){
                            layer.msg("请选择文件");
                        }else{
                            uploader.options.formData = {
                                "userId":USER_ID,
                            } ;
                            console.log(uploader.options.formData);
                            uploader.upload() ;
                            layer.closeAll();
                        }
                    }
                })
            },0)

        }
    }
}])} ;
