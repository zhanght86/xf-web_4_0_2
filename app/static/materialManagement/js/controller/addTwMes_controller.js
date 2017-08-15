/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('addTwMesController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.addtemes");
        $scope.vm = {
            title:'',
            author:'',
            selectMat:selectMat,
        };
        $scope.vm.config = {
            "autoHeight" : true ,
            toolbars: [[
                'fullscreen', 'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor',
                //'backcolor', 'insertorderedlist', 'insertunorderedlist',
                'selectall', 'cleardoc', '|',
                //'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                //'customstyle', 'paragraph',
                'fontfamily', 'fontsize', '|',
                //'directionalityltr', 'directionalityrtl', 'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'link', 'unlink',
                // 'anchor',
                '|', 'imagenone', //'imageleft', 'imageright', 'imagecenter', '|',
                'simpleupload', 'insertimage', 'emotion',
                //'scrawl',
                'insertvideo',
                //'music',
                'attachment', 'map',
                //'gmap',
                'insertframe', //'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                'horizontal',
                'date', 'time','wordimage', //'spechars', 'snapscreen', 'wordimage', '|',
                //'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                // 'print', 'preview', 'searchreplace', 'help', 'drafts'
            ]]
            ,UEDITOR_HOME_URL: "/js/ueditor1_4_3_3-utf8-jsp/utf8-jsp/"
            ,serverUrl : "/api/ms/picture/uploadGet"
            ,wordCount:false           //是否开启字数统计
            ,elementPathEnabled : false  //是否启用元素路径，默认是显示
            ,initialFrameWidth:800  //初始化编辑器宽度,默认1000
            ,initialFrameHeight:300  //初始化编辑器高度,默认320
            ,indentValue:'2em'      // 首行缩进
            ,zIndex : 9999     //编辑器层级的基数,默认是900
            ,enableAutoSave: false
            ,autoSyncData: false
        }

        function selectMat(){
            var dialog = ngDialog.openConfirm({
                template:"/static/materialManagement/pictureLibrary/selectImage2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }


    }
]);

