/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('addTwMesController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.addtemes");
        $scope.vm = {
            selectLocalImg:selectLocalImg,
            imageList : "" ,
            imgPaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            imgSelected : "" ,
            selectImage : selectImage ,
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
        } ;
        getPicList(1) ;
       function getPicList(index){
            httpRequestPost("/api/ms/picture/queryPicture",{
                "index": (index-1)*$scope.vm.imgPaginationConf.pageSize,
                "pageSize": $scope.vm.imgPaginationConf.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.imageList = data.data.objs ;
                        $scope.vm.imgPaginationConf.currentPage =index ;
                        $scope.vm.imgPaginationConf.totalItems =data.data.total ;
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }
        var picTimer ;
        $scope.$watch('vm.imgPaginationConf.currentPage', function(current){
            if(current){
                if (picTimer) {
                    $timeout.cancel(picTimer)
                }
                picTimer = $timeout(function () {
                    getPicList(current);
                }, 100)
            }
        },true);
        function selectImage(item){
                $scope.vm.imgSelected = {
                    "url" : item.pictureUrl ,
                    "id" : item.pictureId,
                    "name" : item.pictureName
                } ;
            ngDialog.close(ngDialog.latestID) ;
        }
        function selectLocalImg(){
            $scope.master.openNgDialog($scope,"/static/materialManagement/image-text-store/selectImage.html","")
        }


    }
]);

