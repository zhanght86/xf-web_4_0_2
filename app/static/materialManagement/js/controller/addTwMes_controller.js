/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('addTwMesController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.addtemes");
        $scope.vm = {
            title : '',
            author :'',
            selectLocalImg:selectLocalImg,
            imageList : "" ,
            imgPaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            imgSelected : "" ,
            selectImage : selectImage ,
            storeKnow : storeKnow
        };

        //设置富文本编辑器
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
            ,serverUrl : "/api/ms//picture/uploadGet"
            ,wordCount:false           //是否开启字数统计
            ,elementPathEnabled : false  //是否启用元素路径，默认是显示
            ,initialFrameWidth:800  //初始化编辑器宽度,默认1000
            ,initialFrameHeight:300  //初始化编辑器高度,默认320
            ,indentValue:'2em'      // 首行缩进
            ,zIndex : 9999     //编辑器层级的基数,默认是900
            ,enableAutoSave: false
            ,autoSyncData: false
            ,saveInterval: 5000000, // 将其设置大点，模拟去掉自动保存功能
        } ;
        //UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
        //UE.Editor.prototype.getActionUrl = function(action) {
        //    return '/api/ms/graphicMessage/upload';
        //    if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadvideo') {
        //
        //    } else {
        //        return this._bkGetActionUrl.call(this, action);
        //    }
        //}

        //获取本地图片
        getPicList(1) ;
       function getPicList(index){
            httpRequestPost("/api/ms/picture/queryPicture",{
                "index": (index-1)*$scope.vm.imgPaginationConf.pageSize,
                "pageSize": $scope.vm.imgPaginationConf.pageSize ,
                "applicationId":APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.imageList = response.data.objs ;
                        $scope.vm.imgPaginationConf.currentPage =index ;
                        $scope.vm.imgPaginationConf.totalItems =response.data.total ;
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }
        //设置本地图片分页
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
        // 选择图片
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
    //    验证标题/api/ms/graphicMessage/checkGraphicTitle
        function isTitleStandard(title){
            httpRequestPost("/api/ms/graphicMessage/checkGraphicTitle",{
                "graphicMessageTitle": title,
                "applicationId": APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    //标题验证通过
                }else if(response.status == 500){
                 //layer.msg("标题验证失败")
                }else if(response.status == 10002){
                    layer.msg("标题重复，请返回修改")
                }
            },function(err){console.log(err)}) ;
        }
        // 保存图文知识
            /*
             applicationId	String	是	100	应用ID
             graphicMessageAuthor	String	是	20	作者
             graphicMessageText	String	是	20	图文内容
             graphicMessageTextLink	String	是	20	原文连接
             graphicMessageTitle	String	是	20	图文标题
             pictureUrl	String	是	20	图片路劲
           */
        function storeKnow(){
            httpRequestPost("/api/ms/graphicMessage/insert",{
                "applicationId": APPLICATION_ID ,
                "graphicMessageAuthor": APPLICATION_ID ,
                "graphicMessageText": APPLICATION_ID ,
                "graphicMessageTextLink": APPLICATION_ID ,
                "graphicMessageTitle": APPLICATION_ID ,
                "pictureUrl": APPLICATION_ID
            },function(response){
                if(response.status == 200){
                //    保存成功
                }else if(response.status == 500){
                //    保存失敗
                }
            },function(err){console.log(err)}) ;
        }



        /*
                     编辑
        * */
        function getImgText(graphicMessageId){
            httpRequestPost("/api/ms/voiceManage/insertVoice",{
                "graphicMessageId" : graphicMessageId ,
                 "aplicationId": APPLICATION_ID
            },function(response){
                if(response.status == 200){

                }else if(response.status == 500){
                //    获取失败
                }
            },function(error){console.log(err)})
        }
        //编辑保存知识
        function updataImgText(){
            httpRequestPost("/api/ms/graphicMessage/update",{
                "applicationId": APPLICATION_ID ,
                "graphicMessageAuthor": APPLICATION_ID ,
                "graphicMessageText": APPLICATION_ID ,
                "graphicMessageTextLink": APPLICATION_ID ,
                "graphicMessageTitle": APPLICATION_ID ,
                "pictureUrl": APPLICATION_ID ,
                "raphicMessageId"	:  APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    //    保存成功
                }else if(response.status == 500){
                    //    保存失敗
                }
            })
        }

    }
]);

