/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('addTwMesController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.addtemes");
        $scope.vm = {
            raphicMessageId :"" , //图文知识id 编辑使用
            title : '',                     //标题
            author :'',                     //作者
            link : "" ,                      // 链接
            selectLocalImg:selectLocalImg,  //选择本地图片
            imageList : "" ,         //图片库所有图片
            imgPaginationConf : {    //图片库分页
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            imgSelected : "" ,       //已选择图片库选择封面图片
            selectImage : selectImage , //选择图片库图片
            storeKnow : storeKnow ,  //保存知识
            ueditorText : "",    //编辑器内容
            insertCoverImg : insertCoverImg // 插入封面图片到编辑器
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
            ,saveInterval: 5000000// 将其设置大点，模拟去掉自动保存功能
        } ;
         // 获取编辑图文知识
         if($stateParams.imgTextId){
             $scope.vm.graphicMessageId = $stateParams.imgTextId ;
             getImgText($stateParams.imgTextId)
         }
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
            $scope.vm.imgSelected = item.pictureUrl ;
            ngDialog.close(ngDialog.latestID);
        }
        function selectLocalImg(){
            $scope.master.openNgDialog($scope,"/static/materialManagement/image-text-store/selectImage.html","")
        }
            /*
             applicationId	String	是	100	应用ID
             graphicMessageAuthor	String	是	20	作者
             graphicMessageText	String	是	20	图文内容
             graphicMessageTextLink	String	是	20	原文连接
             graphicMessageTitle	String	是	20	图文标题
             pictureUrl	String	是	20	图片路劲
           */
        function storeKnow(title,author,ueditorText,link,picUrl,raphicMessageId){
            if(canStore(title,author,ueditorText,picUrl)){
                // 参数 url
                var parameter = {
                        "applicationId": APPLICATION_ID ,
                        "graphicMessageAuthor": author,
                        "graphicMessageText": ueditorText ,
                        "graphicMessageTextLink": link ,
                        "graphicMessageTitle": title ,
                        "pictureUrl": picUrl
                    }  ,
                    api;
                // 根据图文id 判断  url 跟 parameter
                raphicMessageId?
                    void function(){
                        parameter.raphicMessageId = raphicMessageId;
                        api="/api/ms/graphicMessage/update"}():
                    api="/api/ms/graphicMessage/insert";
                save(api,parameter)
            }
        }
        function insertCoverImg(url){
            if(url){
                UE.getEditor('ueditor').focus();
                UE.getEditor('ueditor').execCommand('inserthtml', '<img src="/img/'+ url+'" style="width:200px;height:120px" alt=""/>');
            }else{
                layer.msg("请先选择封面图片")
            }
        }
        //验证必填
        function canStore(title,author,ueditorText,picUrl,callBack){
            var result = false ;
            if(!title){
                layer.msg("请填写图文标题后保存")
            }else if(!author){
                layer.msg("请填写图文作者后保存")
            }else if(!ueditorText){
                layer.msg("请填写图文内容后保存")
            }else if(!picUrl){
                layer.msg("请选择图文封面后保存")
            }else{
                result = true
            }
            return result ;
        }
        //保存
        function save(api,parameter){
            httpRequestPost(api,parameter,
                function(response){
                    if(response.status == 200){
                        $state.go("materialManagement.teletextMessage");
                        //    保存成功
                    }else if(response.status == 500){
                        //    保存失敗
                    }
                },function(err){console.log(err)}) ;
        }
        // 检测时候都符合
        /*
                     编辑
        * */
        function getImgText(graphicMessageId){
            httpRequestPost("/api/ms/graphicMessage/findOneGraphicMessage",{
                "graphicMessageId" : graphicMessageId ,
                "applicationId": APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    $scope.vm.graphicMessageId = response.data.graphicMessageId ;
                    $scope.vm.title = response.data.graphicMessageTitle ;
                    $scope.vm.author = response.data.graphicMessageAuthor ;
                    $scope.vm.ueditorText = response.data.graphicMessageText ;
                    $scope.vm.link = response.data.graphicMessageTextLink ;
                    $scope.vm.imgSelected = response.data.pictureUrl ;
                }else if(response.status == 500){
                //    获取失败
                }
            },function(error){console.log(err)})
        }
    }
]);

