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
            type : "="   ,   //image��ͼƬ video������Ƶ  flash��flash   file���칫�ĵ���ѹ���ļ��ȵ�
            isAuto : "=",
            selectBtn : "=",
            "tableList" : "="
        },
        template:
            '<button  id="picker" >�ϴ����±༭����֪ʶ</button>'
        ,
        link:function(scope,element,attrs){
            //var $list = angular.element("#thelist");
            var server = angular.copy(scope.server) ;
            var uploader = WebUploader.create({
                auto: true, // ѡ���ļ����Ƿ��Զ��ϴ�
                // swf�ļ�·��
                swf: 'Uploader.swf',
                //formData : {title:"is Image  ====   uploader"}  ,   // �ϴ�����
                // �ļ����շ���ˡ�
                //server: "/api/application/application/uploadHead",

                server: "/api/ms/elementKnowledgeAdd/upload",
                //accept: {
                //    title: 'file',
                //    extensions: 'xls,xlsx',
                //    mimeTypes: 'file/*'
                //},
                // ѡ���ļ��İ�ť����ѡ��
                // �ڲ����ݵ�ǰ�����Ǵ�����������inputԪ�أ�Ҳ������flash.
                pick: '#picker',
                // ��ѹ��image, Ĭ�������jpeg���ļ��ϴ�ǰ��ѹ��һ�����ϴ���
                //resize: false,
                //chunked: true,  // ��Ƭ�ϴ����ļ�
                //chunkRetry: 10, // ���ĳ����Ƭ��������������������Զ��ش����ٴΣ�
                //thread: 100,// ����ϴ�������
                //// ����ȫ�ֵ���ק���ܡ�������������ļ��Ͻ�ҳ���ʱ�򣬰��ļ��򿪡�
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
                // �����ظ�����
                if ( !$percent.length ) {
                    $percent = $('<div class="progress progress-striped active" style="height: 50px;background: red; width: 200px;">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div> ' +
                        '</div>').appendTo( $li ).find('.progress-bar');
                }
                $li.find('p.state').text('�ϴ���');
                $percent.css( 'width', percentage * 100 + '%' );
                console.log(percentage);
            });
            uploader.on('uploadError', function (file) {
                console.log("�ϴ�ʧ��")
            });
            uploader.on('uploadSuccess', function (file,response) {
                if(response.status == 500){
                    layer.msg("ģ�����")
                }else{
                    scope.tableList = response ;
                    scope.$apply();
                }

                console.log(response)
            });

        }
    }
}])
