/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('AddTwMesController', [
    '$scope',"$state","ngDialog","$log","MaterialServer", "$cookieStore","$stateParams","$timeout","$location",
    ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout,$location )=> {
        $state.go("MM.addTw");
        $scope.vm = {
            pictureName :'',
           // ip : "" , // 图片 ip路径
            graphicMessageId :"" , //图文知识id 编辑使用
            title : '',                     //标题
            author :'',                     //作者
            link : "" ,                      // 链接
            selectLocalImg:selectLocalImg,  //选择本地图片
            imageList : "" ,         //图片库所有图片
            // imgPaginationConf : {    //图片库分页
            //     pageSize: 8,//第页条目数
            //     pagesLength: 10//分页框数量
            // },
            paginationConf : {
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: getPicList ,
                location:true
            },
            imgSelected : "" ,       //已选择图片库选择封面图片
            selectImage : selectImage , //选择图片库图片
            storeKnow : storeKnow ,  //保存知识
            ueditorText : "",    //编辑器内容
            insertCoverImg : insertCoverImg ,// 插入封面图片到编辑器
            storeLimit :false,
            checkUrl : checkUrl  ,               //校验网址
            editTitle : ''
        };

        /**
         *设置富文本编辑器
         */
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
                '|'//, 'imagenone' , 'imageleft', 'imageright', 'imagecenter', '|',
                ,'simpleupload',
                //'insertimage',
                'emotion',
                //'scrawl',
                //'insertvideo',
                //'music',
                //'attachment', 'map',
                //'gmap',
                //'insertframe', //'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                'horizontal',
                'date', 'time',//'wordimage', //'spechars', 'snapscreen', 'wordimage', '|',
                //'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                // 'print', 'preview', 'searchreplace', 'help', 'drafts'
            ]]
            ,UEDITOR_HOME_URL: "/assets/libs/ueditor1_4_3_3-utf8-jsp/utf8-jsp/"
            ,serverUrl : "/api/material/picture/upload/get"
            ,wordCount:false           //是否开启字数统计
            ,elementPathEnabled : false  //是否启用元素路径，默认是显示
            ,initialFrameWidth:800  //初始化编辑器宽度,默认1000
            ,initialFrameHeight:300  //初始化编辑器高度,默认320
            ,indentValue:'2em'      // imagePathFormat首行缩进
            ,zIndex : 9999     //编辑器层级的基数,默认是900
            ,enableAutoSave: false
            ,autoSyncData: false
            ,saveInterval: 5000000// 将其设置大点，模拟去掉自动保存功能
            ,compressSide:1     //等比压缩的基准，确定maxImageSideLength参数的参照对象。0为按照最长边，1为按照宽度，2为按照高度
            //scaleEnabled
            //是否可以拉伸长高,默认true(当开启时，自动长高失效)
            //,scaleEnabled:false

        } ;
        // void function(){
        //     // httpRequestPost("/api/ms/picture/getIP",{},function(response){
        //     //     $scope.vm.ip = response.data
        //     // },function(error){})
        //     MaterialServer.getIp.save({
        //
        //     },function(response){
        //         $scope.vm.ip = response.data
        //     },function(error){
        //         $log.log(error);
        //     });
        //
        // }() ;
        /**
         *获取本地图片
         */
        getPicList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize) ;
        function getPicList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            MaterialServer.getPicList.get({
                "index": (index-1)*pageSize,
                "pageSize": pageSize ,
                "name" : $scope.vm.pictureName,
            },function(response){
                if(response.status == 200){
                    console.log(response);
                    $scope.vm.imageList = response.data.objs ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =response.data.total ;
                }else{
                    $scope.vm.imageList="";
                    $scope.vm.paginationConf.totalItems=0;
                }
            },function(err){
                console.log(err);
            });

        }

        /**
         * 选择图片
         */
        function selectImage(item){
            //$scope.vm.imgSelected = item.url ;
            $scope.vm.imgSelected = item.id;
            ngDialog.close(ngDialog.latestID);
        }
        function selectLocalImg(){
            //$scope.MASTER.openNgDialog($scope,"/static/material_management/views/teletext_message/select_image.html","")

            let select_html = require("../../views/teletext_message/select_image.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,select_html,"400px",function(){

            },"",function(){

            })

        }
        //封面
        function insertCoverImg(url){
            if(url){
                UE.getEditor('ueditor').focus();
                UE.getEditor('ueditor').execCommand('inserthtml', '<img src="'+ url+'" alt=""/>',{style:"width:200px;height:120px;"});
            }else{
                layer.msg("请先选择封面图片")
            }
        }
        /*
         applicationId	String	是	100	应用ID
         graphicMessageAuthor	String	是	20	作者
         graphicMessageText	String	是	20	图文内容
         graphicMessageTextLink	String	是	20	原文连接
         graphicMessageTitle	String	是	20	图文标题
         pictureUrl	String	是	20	图片路劲
         */


        //校验网址
        function checkUrl(){
            var url=$scope.vm.link;
            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if(url.length>0){
                if(!reg.test(url)){
                    alert("请输入以http://或者 https://开头的正确网址！");
                    //return false;
                }
            }

        }
        /**
         * 验证必填
         */

        function storeKnow(title,author,ueditorText,link,coverPicId,graphicMessageId){
            if(!title){
                layer.msg("请填写图文标题后保存")
            }else if(!author){
                layer.msg("请填写图文作者后保存")
            }else if(!ueditorText){
                layer.msg("请填写图文内容后保存")
            }else if(!coverPicId){
                layer.msg("请选择图文封面后保存")
            }else if($scope.vm.editTitle ){                 // 判断是编辑还是添加,有$scope.vm.editTitle为编辑
                if(title==$scope.vm.editTitle){
                    //alert("名称未修改,不用校验标题");
                    $scope.vm.storeLimit = true ;
                    if($scope.vm.storeLimit){
                        var parameter = {
                                "modifierId" : USER_ID,
                                "author": author,
                                "content": ueditorText ,
                                "link": link ,
                                "title": title ,
                                "coverPicId": coverPicId    ,
                                "id" : graphicMessageId               //图文id
                            }  ,
                            api;
                        api="editTwApi";
                        save(api,parameter);
                    }else{
                        layer.msg("知识保存中...");
                    }
                }else{
                    //alert("名称改了，需要校验标题");
                    //编辑校验
                    MaterialServer.checkTitle.get({
                        "title" : $scope.vm.title
                    },{
                        "title" : $scope.vm.title
                    },function(response){
                        if(response.code==10006){
                            layer.msg("图文名称重复,请重新输入");
                        }else{
                            $scope.vm.storeLimit = true ;
                            if($scope.vm.storeLimit){
                                var parameter = {
                                        "modifierId" : USER_ID,
                                        "author": author,
                                        "content": ueditorText ,
                                        "link": link ,
                                        "title": title ,
                                        "coverPicId": coverPicId    ,      // 图片id
                                        "id" : graphicMessageId
                                    }  ,
                                    api;
                                    api="editTwApi";
                                save(api,parameter);
                            }else{
                                layer.msg("知识保存中...");
                            }
                        }
                    },function(){

                    });
                }
            }
            else{
                //新增保存
                MaterialServer.checkTitle.get({
                        "title" : $scope.vm.title
                    },{
                        "title" : $scope.vm.title
                    },function(response){
                        if(response.code==10006){
                            layer.msg("图文名称重复,请重新输入");
                        }else{
                            $scope.vm.storeLimit = true ;
                            if($scope.vm.storeLimit){
                                var parameter = {
                                        "modifierId" : USER_ID,
                                        "author": author,
                                        "content": ueditorText ,
                                        "link": link ,
                                        "title": title ,
                                        "coverPicId": coverPicId          // 图片id
                                    }  ,
                                    api;
                                    api="addTwApi";
                                save(api,parameter);
                            }else{
                                layer.msg("知识保存中...");
                            }
                        }
                    },function(){

                    });
            }
        }
        /**
         * 保存
         */
        function save(api,parameter){
            MaterialServer[api].save(parameter,function(response){
                if(response.status == 200){
                    $state.go("MM.teletext");
                    //    保存成功
                }else if(response.status == 500){
                    $scope.vm.storeLimit = false ;
                    //    保存失敗
                }
            },function(err){
                $scope.vm.storeLimit = false;
                console.log(err);
            });
        }

        /**
         *  检测时候都符合
         *
         */

        /**
         *获取编辑图文知识
         */
        if($stateParams.imgTextId ){
            $scope.vm.graphicMessageId = $stateParams.imgTextId ;
            getImgText($stateParams.imgTextId)
        }
        /*
         编辑
         * */
        function getImgText(graphicMessageId){
            MaterialServer.getImgText.get({
                "graphicMessageId" : graphicMessageId
            },{
                "graphicMessageId" : graphicMessageId
            },function(response){
                if(response.status == 200){
                    $scope.vm.title = response.data.title ;
                    $scope.vm.author = response.data.author ;
                    $scope.vm.ueditorText = response.data.content ;
                    $scope.vm.link = response.data.link ;
                    $scope.vm.imgSelected = response.data.coverPicId ;

                    $scope.vm.editTitle = response.data.title ;

                }else if(response.status == 500){
                    //    获取失败
                }
            },function(error){
                console.log(error);
            });
        }
    }
    ])};

