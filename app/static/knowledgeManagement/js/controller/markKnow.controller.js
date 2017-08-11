/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('markKnowController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","$interval","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,$interval,$filter) {
        $scope.vm = {
            knowledgeId : "",
            knowledgeOrigin : 120 ,
            frames: [],      //业务框架
            frameId: "",
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            botRoot : "",      //根节点
            //knowledgeClassifyCall: knowledgeClassifyCall, //知识分类的回调方法
            openContentConfirm: openContentConfirm, //打开内容对话框
            knowledgeBotVal : "",  //bot 内容
            botSelectAdd : botSelectAdd,
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏

            //生成  知识标题 打标生成 BOT 扩展问
            getBotAndExtensionByTitle : getBotAndExtensionByTitle,
            //creatBot : [],

            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :60,
            getExtension : getExtension,  //獲取擴展問
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
            extensionByTitleTag : [] , //标题打标生成扩展问
            extensionEdit : extensionEdit,

            //展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览
            //弹框相关
            newTitle: "",    //标题
            channel : [],     //新添加的 channel
            channels : [],     //所有渠道
            channelArr : [] ,
            selectChannel : selectChannel , //獲取渠道
            dimension  : "",
            dimensions : []
            ,  //所有维度
            dimensionArr : [],  //選擇的維度
            dimensionsCopy :[]
            ,

            checkChannelDimension : checkChannelDimension ,
            //高级选项内容
            slideDown : slideDown,
            slideFlag : false,

            question : 1,
            tip : 1,
            tail : 1 ,

            knowledgeTitleTag : [],

            appointRelative : "",
            appointRelativeList :[],
            addAppoint  : addAppoint,
            removeAppointRelative : removeAppointRelative ,
            //vm.appointRelativeGroup.push(item)
            appointRelativeGroup : [],
            replaceType : 0 ,
            enterEvent : enterEvent,
            dialogExtension : [],

            limitSave : false ,
            isEditIndex : -1,   // 知识内容 弹框
            // -1 为内容新增
            // index 为知识的编辑索引
  //*******************2017/7/14*******************//
            contentType : 113 ,  //新增内容类型
            imgPaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            voicePaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            } ,
            getPicList : getPicList ,   //获得所有图片
            selectMultimedia : selectMultimedia,   //图片选择弹出框
            imageList : [] ,     //所有图片文件
            addMultimedia : addMultimedia , //选择图片
            imgSelected : "",    // 已选图片
            //getEmotion : getEmotion ,
            voiceList : "",                //所有声音文件
            getVoiceList : getVoiceList,  //获取素有声音文件
            voiceSelected : "" ,    //以选择声音文件
            qqFaceText : "" ,
//*******************2017/7/14*******************//
//*******************2017/8/3  BEGIN   删除扩展问本地备份 *******************//
            rmExtensionBackup : [] ,
//*******************2017/8/3  END   删除扩展问本地备份   *******************//

//*******************2017/8/9  添加链接 BEGIN *******************//
            addLint : addLint ,
            isNewLinkAble : isNewLinkAble ,
            newLint : "" ,
//*******************2017/8/9  添加链接  END *******************//
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
            backupsOfExtension : "" //扩展问 编辑备份
        };
        //獲取渠道
        $scope.master.getDimensions($scope,["dimensions","dimensionsCopy"]) ;
        //获取维度
        $scope.master.getChannels($scope,["channels"]) ;
        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //console.log($stateParams.data);
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 标题打标结果
            $scope.vm.knowledgeTitleTag = data.knowledgeBase.knowledgeTitleTag ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin ;

            // 时间
            if(data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd){
                $scope.vm.isTimeTable = true
            }
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            angular.forEach(data.extensionQuestions,function(item){
            });
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                var obj = {} ;

                //維度，添加預覽效果   以name id 的 形式显示
                obj.knowledgeContentNegative = item.knowledgeContentNegative ;
                if(item.knowledgeContentNegative==113){
                    obj.knowledgeContent = $filter("emotion")(item.knowledgeContent);
                }else{
                    obj.knowledgeContent = item.knowledgeContent;
                }
                obj.channelIdList =  item.channelIdList ;
                obj.dimensionIdList =  item.dimensionIdList ;
                obj.knowledgeRelatedQuestionOn =item.knowledgeRelatedQuestionOn ;   //显示相关问
                obj.knowledgeBeRelatedOn  =  item.knowledgeBeRelatedOn ; //在提示
                obj.knowledgeCommonOn = item.knowledgeCommonOn ;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = item.knowledgeRelevantContentList ;  //业务扩展问
                $scope.vm.scanContent.push(obj);
            });
        }
// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10012,
                "index": 0,
                "pageSize":999999
            },function(data){
                //console.log(data);
                if(data.status!=10005){
                    if(data.data.length){
                        $scope.vm.frames = $scope.vm.frames.concat(data.data) ;
                        $scope.$apply();
                    }
                }
            },function(){
                // layer.msg("err or err")
            });
        }
        $scope.$watch("vm.frameCategoryId",function(val,old){
            if(val&&val!=old){
                getFrame( val )
            }
        });
        //  根據框架添加擴展問  --》 替換原來的條件
        $scope.$watch("vm.frameId",function(val,old){
            if(val&&val!=old){
                //if($scope.vm.extensionsByFrame.length){
                //    //  替換條件
                //    replace(val);
                //}else{
                // 在未生成扩展问情況
                getExtensionByFrame(val);
                //}
            }
        });

        // 通过frame 获取扩展问
        function getExtensionByFrame(id,type){
            console.log(id);
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameTypeId": 10012,
                "frameId": id,
                "index": 0,
                "pageSize":999999
            },function(data){
                if(data.status==10000){
                    //var extensionQuestionList = [],
                    //    frameQuestionTagList = [];
                    var obj = {};
                    if (data.data[0].elements) {
                        angular.forEach(data.data[0].elements, function (item, index) {
                            var  extensionQuestionList = [] ,
                                frameQuestionTagList = [];
                            obj={
                                "extensionQuestionType": 60 ,  //61
                                "extensionQuestionTitle": data.data[0].frameTitle
                            } ;
                            extensionQuestionList.push((item.elementContent.substring(0,item.elementContent.indexOf('#'))));
                            frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#')+1).split('；'));
                            checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
                        });
                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
                    }
                    $scope.$apply();
                }
            }, function (error) {console.log(error)});
        }

        // 获取Bot全路径
        function getBotFullPath(id){
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                if(data.status = 10000){
                    var allBot = angular.copy($scope.vm.creatSelectBot.concat($scope.vm.botClassfy)) ,
                        botResult = $scope.master.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                    $scope.$apply(function(){
                        $scope.vm.knowledgeBotVal = data.categoryFullName;
                        if(botResult != false){
                            $scope.vm.botFullPath= botResult;
                        }
                    });
                }
            },function(error){console.log(error)});
        }
        //打开知识内容对话框
        function openContentConfirm(callback) {
            var dialog = ngDialog.openConfirm({
                template: "/static/knowledgeManagement/public-html/knowledge_increase.html",
                width:"650px",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        callback();
                    } else {
                        setDialog();//清空内容对话框
                    }
                }
            });
        }
        //y业务框架生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            //var title = oldWord.extensionQuestionTitle ;
            var title = extensionQuestionList[0] ;
            var weight = oldWord.extensionQuestionType ;
            console.log(oldWord,title);
            httpRequestPost("/api/ms/richtextKnowledge/checkFrameTag",{
                "applicationId": APPLICATION_ID,
                "extensionQuestionList" : extensionQuestionList,
                "frameQuestionTagList" : frameQuestionTagList
            },function(data){
                if(data.status==200){
                    $scope.$apply(function(){
                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
                        var result = $scope.master.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                        if(result != false){
                            $scope.vm.extensionTitle = "";
                            $scope.vm.extensionsByFrame.push(result);
                        }
                    })
                }
            }, function () {
            });
        }
        //手动添加扩展问
        function getExtension(title,weight,source){
            //source  0 默认  1 标题
            var question = new Array(title);
            var obj = {
                "extensionQuestionTitle" : $scope.vm.extensionTitle,
                "extensionQuestionType" : $scope.vm.extensionWeight
            } ;
            if(!title){
                layer.msg("扩展问不能为空")
            }else if(!checkExtensionByTitle(obj)){
                layer.msg("生成扩展问重复,已阻止添加");
                return false
            } else {
                httpRequestPost("/api/ms/richtextKnowledge/checkExtensionQuestion", {
                    "applicationId": APPLICATION_ID,
                    "extendQuestionList": question
                }, function (data) {
                    if (data.status == 500) {
                        layer.msg(data.data);
                    }else if(data.status == 10026 ){
                        layer.msg("扩展问添加重复，请重新添加")
                    } else if (data.status == 200) {
                        $scope.$apply(function(){
                            var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
                            var result = $scope.master.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                            if(result != false){
                                $scope.vm.extensionTitle = "";
                                if(!source){
                                    $scope.vm.extensions.push(result);
                                }else{
                                    $scope.vm.extensionByTitleTag = new Array(result)
                                }
                            }
                        });
                    }
                }, function (error,e,er) {
                    console.log(error)
                });
            }
        }
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        $scope.master.botTreeOperate($scope,"/api/ms/modeling/category/listbycategorypid","/api/ms/modeling/category/listbycategorypid",getBotFullPath
           //"/api/ms/modeling/category/searchbycategoryname"
        ) ;
        //BOT搜索自动补全
        $scope.master.searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
            $scope.$apply(function(){
                var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)) ,
                    botResult = $scope.master.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                $scope.vm.knowledgeBotVal = suggestion.value;
                if(botResult != false){
                    $scope.vm.botFullPath= botResult;
                }
            })
        });
        //点击bot分类的 加号
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                console.log($scope.vm.botFullPath)
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = "";
                $scope.vm.knowledgeBotVal = "";
            }
        };
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
//        function replace(id){
//                var replace = ngDialog.openConfirm({
//                    template:"/static/knowledgeManagement/faq/replace.html",
//                    scope: $scope,
//                    closeByDocument:false,
//                    closeByEscape: true,
//                    showClose : true,
//                    backdrop : 'static',
//                    preCloseCallback:function(e){     //关闭回掉
//                        if(e === 1){    //替换
//                            getExtensionByFrame( id ,1 )
//                        }else if(e === 0){
//                            // 添加不替换
//                            getExtensionByFrame( id ,0 )
//                        }
//                    }
//                });
//        }
        function knowledgeAdd(data, index) {
            if(!$scope.vm.title){
                layer.msg("请先输入知识标题") ;
                return false ;
            }else{
                var dia = angular.element(".ngdialog ");
                if(data){    //增加
                /* **************** 2017/8/2   知识内容编辑  BEGIN     **************/ //
                    switch (data.knowledgeContentNegative){
                        case  "111" :
                            $scope.vm.imgSelected = {
                                "name" : data.knowledgeContent ,
                                "url" : data.knowledgeContent
                            };
                            break ;
                        case  "112 ":
                            $scope.vm.voiceSelected = {
                                "name" : data.knowledgeContent
                            };
                            break ;
                        case  "113" :
                            $timeout(function(){
                                $("#emotion-container").html(data.knowledgeContent) ;
                            },100);
                            break ;
                    }
                    $scope.vm.contentType  = data.knowledgeContentNegative ;  //新增内容类型
                 /* **************** 2017/8/2   知识内容编辑 END   **************/ //
                    $scope.vm.isEditIndex = index ;
                    $scope.vm.channel = data.channelIdList;
                    angular.forEach($scope.vm.dimensions,function(item){
                        if(data.dimensionIdList.inArray(item.dimensionId)){
                            var obj = {
                              "dimensionId" : item.dimensionId ,
                              "dimensionName" : item.dimensionName
                            } ;
                            $scope.vm.dimensionArr.push(obj) ;
                        }
                    }) ;
                    $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                    $scope.vm.question = data.knowledgeRelatedQuestionOn;
                    $scope.vm.tail = data.knowledgeCommonOn;
                    $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList;
                }
                if(dia.length==0) {
                    var dialog = ngDialog.openConfirm({
                        template: "/static/knowledgeManagement/public-html/markKnow_increase.html",
                        width:"650px",
                        scope:$scope ,
                        closeByDocument: false,
                        closeByEscape: true,
                        showClose: true,
                        backdrop: 'static',
                        preCloseCallback: function (e) {    //关闭回掉
                            if (e === 1) {
                                addNewOrEditKnow(index);
                            } else {
                                $scope.vm.isEditIndex = -1  ;
                            }
                            setDialog()
                        }
                    }) ;
                    var isDialog = $interval(function(){
                        if(angular.element(".ngdialog ")){
                            $interval.cancel(isDialog) ;
                            var qqFaceWatcher = $scope.$watch("vm.contentType",function(val){
                                if(val == 113){
                                    $('.emotion').qqFace({
                                        id : 'facebox',
                                        //assign:'emotion-container',       //赋值对象
                                        assign:'emotinon-backup',       //赋值对象
                                        path:'/libs/qqFace/arclist/'	//表情存放的路径
                                    });
                                    var  intervaler = $interval(function(){
                                        var val = $("#emotinon-backup").val() ;
                                        if(val){
                                            var html = $("#emotion-container").html()+$filter('emotion')(val);
                                            $("#emotion-container").html(html) ;
                                            $("#emotinon-backup").val("") ;
                                            //console.log($filter("faceToString")(html))
                                        }
                                    },500) ;
                                    qqFaceWatcher() ;
                                }else{
                                    $interval.cancel(intervaler) ;
                                }
                            })
                        }
                    },10) ;

                }
            }
        }
        function extensionEdit(type,item,index){
            //type  1 框架生成  0 手动添加
            $scope.vm.backupsOfExtension = angular.copy(item) ;
            console.log($scope.vm.backupsOfExtension) ;
            var dia = angular.element(".ngdialog ");
            if(dia.length==0){
                var extensionEdit = ngDialog.openConfirm({
                    template:"/static/knowledgeManagement/public-html/extension_edit.html",
                    width:"500px",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){     //关闭回掉
                        if(e === 1){
                            //console.log( $scope.vm.backupsOfExtension ) ;
                            if(type == 1){
                                $scope.vm.extensionsByFrame[index] = $scope.vm.backupsOfExtension ;
                            }else if(type == 0){
                                $scope.vm.extensions[index] = $scope.vm.backupsOfExtension ;
                            }else if(type == 2){
                                $scope.vm.extensionByTitleTag[index] = $scope.vm.backupsOfExtension ;
                            }
                        }else{$scope.vm.backupsOfExtension = ""; }
                    }
                });
            }
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }
        //根據 標題 生成 bot 跟 扩展问
        function getBotAndExtensionByTitle(){
            if($scope.vm.title){
                httpRequestPost("/api/ms/richtextKnowledge/checkKnowledgeTitleAndGetAutoClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : APPLICATION_ID,
                    "knowledgeId" : $scope.vm.knowledgeId
                },function(data){
                    console.log(data) ;
                    if(data.status == 500){    //标题打标失败
                        $scope.vm.titleTip = "知识标题重复";
                        $scope.$apply()
                    }else if(data.status == 200){
                        getExtension($scope.vm.title,"60",1) ; //生成扩展问
                        $scope.$apply(function(){
                            //標題打标结果
                            $scope.vm.knowledgeTitleTag = data.data.knowledgeTitleTagList ;
                            $scope.vm.botClassfy = [];   //reset 标题生成bot
                            //添加校验是否添加校验  获取所有bot 验证是否重复
                            var allBot = angular.copy($scope.vm.creatSelectBot) ;
                            //生成bot
                            angular.forEach(data.data.classifyList, function (item) {
                                var botResult = $scope.master.isBotRepeat(item.id,item.fullPath,item.type,allBot) ;
                                if(botResult != false){
                                    $scope.vm.botClassfy.push(botResult);
                                }
                                $scope.vm.frameCategoryId = item.id;
                            });
                        });
                    }
                },function(error){
                    console.log(error)
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }
        }

        //  主页保存 获取参数
        function getParams(){
            var params =  {
                "applicationId": APPLICATION_ID,
                "userId" : USER_ID ,
                "sceneId" :SCENE_ID ,
                "knowledgeTitle": $scope.vm.title,//
                "knowledgeType": 106,
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:"",  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:"",     //结束时间
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME , //操作人
                "knowledgeOrigin" : $scope.vm.knowledgeOrigin
            };

            //var knowledgeContent ;
            var content = angular.copy($scope.vm.scanContent) ;
            angular.forEach(content,function(item,index){
                if(item.knowledgeContentNegative ==113){
                    var html = angular.copy(item.knowledgeContent) ;
                    content[index].knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
                }
            }) ;
            params.knowledgeContents =  content;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
            return params
        }
        //限制一个知识多次保存
        var limitTimer ;
        function save() {
            if (!checkSave()) {
                return false
            } else {
                if(!$scope.vm.limitSave) {
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.limitSave = true ;
                    limitTimer = $timeout(function(){
                        $scope.vm.limitSave = false ;
                    },180000) ;
                    var params = getParams();   // 保存參數
                    var api;                    // 返回編輯的 url
                    if ($scope.vm.knowledgeId) {
                        //编辑
                        api = "/api/ms/richtextKnowledge/editKnowledge";
                        params.knowledgeId = $scope.vm.knowledgeId;
                    } else {
                        //新增
                        api = "/api/ms/richtextKnowledge/addKnowledge"
                    }
                    httpRequestPost(api, params, function (data) {
                        console.log(getParams());
                        if (data.status == 200) {
                            //if ($scope.vm.docmentation) {
                            //    $scope.vm.knowledgeClassifyCall();
                            //}else{
                                $state.go('knowledgeManagement.custOverview');
                            //}
                        } else if (data.status == 500) {
                            layer.msg("知识保存失败") ;
                            $timeout.cancel(limitTimer) ;
                            $scope.$apply(function(){
                                $scope.vm.limitSave = false ;
                            });
                        }
                    }, function (err) {
                        $timeout.cancel(limitTimer) ;
                        $scope.$apply(function(){
                            $scope.vm.limitSave = false ;
                        });
                        console.log(err)
                    });
                }
            }
        }
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                var params = getParams();
                console.log(params);
                obj.params = params;
                obj.editUrl = "knowledgeManagement.markKnow";
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/richtextKnowledge/editKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api = "/api/ms/richtextKnowledge/addKnowledge"
                }
                obj.params = params;
                obj.knowledgeType = 106;
                $window.knowledgeScan = obj;
                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        };

        /* *********************              弹框相关           **************************/ //
        function removeAppointRelative(item){
            $scope.vm.appointRelativeGroup.remove(item);
        }
//重置参数
        function setDialog() {
         /* **************** 2017/8/2   重置参数  BEGIN     **************/ //
            $scope.vm.contentType  = 113 ,  //新增内容类型
            $scope.vm.imgSelected = "",    // 已选图片
            $scope.vm.voiceSelected = "" ,    //以选择声音文件
          /* **************** 2017/8/2   重置参数 END   **************/ //
            $scope.vm.slideFlag = false ;
            $scope.vm.channel = [];
            $scope.vm.dimension = [];
            $scope.vm.question = 1;    //显示相关问
            $scope.vm.tip = 1;   //在提示
            $scope.vm.tail =1;   //弹出评价小尾巴
            $scope.vm.appointRelativeGroup = [] ;//业务扩展问
            $scope.vm.appointRelative = "";
            $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);
            $scope.vm.dimensionArr = [];
        }

        function addNewOrEditKnow(index){
            if(isNewKnowledgeTitle()){
                var knowledgeContent ;
                if($scope.vm.contentType==111){
                    knowledgeContent = $scope.vm.imgSelected.url
                }else if($scope.vm.contentType==112){
                    knowledgeContent = $scope.vm.voiceSelected.url
                }else if($scope.vm.contentType==113){
                    //faceToString
                    knowledgeContent = $("#emotion-container").html() ;
                    //console.log($("#emotion-container").html()) ;
                    //var html = $("#emotion-container").html() ;
                    //knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
                }
                if(!$scope.vm.dimensionArr.id.length){
                    $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
                };
               var parameter = {
                   "knowledgeContent": knowledgeContent,
                   "channelIdList": $scope.vm.channel,
                   "knowledgeContentNegative": $scope.vm.contentType.toString(),
                   "dimensionIdList": $scope.vm.dimensionArr.id.length ? $scope.vm.dimensionArr.id : $scope.vm.dimensionsCopy.id,
                   "knowledgeRelatedQuestionOn": $scope.vm.question,    //显示相关问
                   "knowledgeBeRelatedOn": $scope.vm.tip, //在提示
                   "knowledgeCommonOn": $scope.vm.tail,   //弹出评价小尾巴
                   "knowledgeRelevantContentList": $scope.vm.appointRelativeGroup  //业务扩展问
               };
                if(index>=0){
                    $scope.vm.scanContent[index] = parameter ;
                }else{
                    $scope.vm.scanContent.push(parameter);
                }

            }
        }
        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/ms/richtextKnowledge/checkDistribute",{
                    "title" : title
                },function(data){
                    console.log(data);
                    return true;
                },function(error){
                    console.log(error) ;
                    return false
                });
            }
        }
        //检验扩展问是否重复
        function checkExtensionByTitle(item){
            var result ;
            //所有标题以及手动打标生成的扩展问
            var arr = $scope.vm.extensionByTitleTag.concat($scope.vm.extensions);
            if(!arr.length){
                result = true ;
            }else{
                var len = arr.length;
                angular.forEach(arr,function(val){
                    if(val.extensionQuestionTitle == item.extensionQuestionTitle && val.extensionQuestionType == item.extensionQuestionType){
                        len-=1 ;
                        //console.log(val.extensionQuestionTitle == item.extensionQuestionTitle);
                        result = false ;
                    }
                    if(len==arr.length){
                        result = true ;
                    }
                })
            }
            return  result ;
        }

        function checkSave(){
            var params = getParams();
            console.log(params) ;
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false ;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!params.knowledgeContents.length){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false ;
            }else if(!params.knowledgeTitleTag.length){
                layer.msg("知识标题未打标") ;

            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("分类知识Bot不能为空")
            }else{
                return true
            }
        }
//***************************    save check channel dimension  **********************************************
        function increaseCheck(){
            //判斷维度是否为空 0 不变 1 全维度
            if(!$scope.vm.dimensionArr.id.length){
                $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
            };
            if(!isNewKnowledgeTitle() && !$scope.vm.channel.length){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!isNewKnowledgeTitle()){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.vm.channel.length){
                layer.msg("请选择渠道后保存")
            }else if(checkChannelDimension($scope.vm.channel,$scope.vm.dimensionArr.id)){
                //存在重复条件
            }else{
                ngDialog.closeAll(1) ;
            }
        }
        //选择渠道
        function selectChannel(channelId){
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
        }
        function checkChannelDimension(channel,dimension){
            var isRepeat  = false;
            //    新增的 channel = []  dimension = [] ,
            //   页面以添加 scanContent.dimensions   scanContent.channels
            angular.forEach($scope.vm.scanContent,function(item,contentIndex){
                if($scope.vm.isEditIndex != contentIndex){
                    angular.forEach(item.channelIdList,function(v){
                        angular.forEach(channel,function(val,indexChannel) {
                            if(val == v){
                                angular.forEach(item.dimensionIdList,function(value){
                                    angular.forEach(dimension,function(key,indexDimension){
                                        if(key==value){
                                            var channelTip;
                                            angular.forEach($scope.vm.channels,function(all){
                                                if(all.channelCode==v){
                                                    channelTip = all.channelName
                                                }
                                            });
                                            layer.msg("重复添加"+"渠道 "+channelTip+" 维度 "+$scope.vm.dimensionArr.name[indexDimension]);
                                            isRepeat = true
                                        }
                                    })
                                })
                            }
                        });
                    });
                }
            });
            return isRepeat
        }
//*******************       2017/7/14  BEGIN    *******************//
        //弹出选择图片声音对话框
        function selectMultimedia(){
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/public-html/selectImage.html",
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
        function addMultimedia(item){
            if($scope.vm.contentType==111){
                $scope.vm.imgSelected = {
                    "url" : item.pictureUrl ,
                    "id" : item.pictureId,
                    "name" : item.pictureName
                } ;
            }else if($scope.vm.contentType==112){
                $scope.vm.voiceSelected = {
                    "url" : item.voiceUrl ,
                    "id" : item.voiceId ,
                    "name" : item.voiceName
                } ;
            }
            ngDialog.close(ngDialog.latestID) ;
        }
        getPicList(1) ;
        //获取所有图片
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
        getVoiceList(1) ;
        function getVoiceList(index){
            httpRequestPost("/api/ms/voiceManage/queryVioce ",{
                "index": (index-1)*$scope.vm.voicePaginationConf.pageSize,
                "pageSize": $scope.vm.voicePaginationConf.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.voiceList = data.data.objs ;
                        $scope.vm.voicePaginationConf.currentPage =index ;
                        $scope.vm.voicePaginationConf.totalItems =data.data.total ;
                        console.log($scope.vm.voicePaginationConf)
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
        var voiceTimer ;
        $scope.$watch('vm.voicePaginationConf.currentPage', function(current){
            if(current){
                if (voiceTimer) {
                    $timeout.cancel(voiceTimer)
                }
                voiceTimer = $timeout(function () {
                    getVoiceList(current);
                }, 100)
            }
        },true);
        function isNewKnowledgeTitle(){
            var info = "" , isPass = true;
            if($scope.vm.contentType == 111 && !$scope.vm.imgSelected.url){         //图片
                isPass = false;
            }else if($scope.vm.contentType == 112 && !$scope.vm.voiceSelected.name){  //声音
                isPass = false;
            }else if($scope.vm.contentType == 113 &&  !$("#emotion-container").html()){  //表情
                isPass = false;
            } ;
            return isPass
        }

        //*******************2017/8/9  添加链接 BEGIN *******************//
        function addLint(){
            var addLink = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/markKnow/addLink.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    console.log(e)
                    if(e === 1){
                        var aLink = "<a href='"+$scope.vm.newLink+"' target='_blank'>"+$scope.vm.newLink+"</a>" ;
                        var html = $("#emotion-container").html() + aLink ;

                        $("#emotion-container").html(html)
                        console.log($scope.vm.newLink)
                    }
                    $scope.vm.newLink = ""
                }
            })
        }
        function isNewLinkAble(val){
            var regex =/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i
            if(regex.test(val)){
                ngDialog.close(ngDialog.latestID,1) ;
            }else{
                layer.msg("请输入正确的链接地址")
            }
        }
//*******************2017/8/9  添加链接  END *******************//
//*******************       2017/7/14      END *******************//
        function addAppoint(item,arr){
            if(arr.indexOf(item)==-1){
                arr.push(item)
            }
            $scope.vm.appointRelative = "";  //清楚title
            $scope.vm.appointRelativeList = [];  //清除 列表

        }
        // 動態加載 title
        $scope.$watch("vm.appointRelative",function(title){
            //console.log(title);
            if(title){
                $timeout(getAppointRelative(title),300)
            }
        });

        function getAppointRelative(title){
            httpRequestPost("/api/ms/richtextKnowledge/getKnowledgeTitle",{
                "title" : title
            },function(data){
                if(data.status == 200){
                    $scope.vm.appointRelativeList = data.data;
                    $scope.$apply()
                }else{
                }
                console.log(data);
            },function(error){
                console.log(error)
            });
        }
        //引导页方法
        function showTip(){
            $('.shadow_div').show();
            $('.step_div').show();
            $('#step_one').show().siblings().hide();

        }
        function hideTip(){
            $('.shadow_div').hide();
            $('.step_div').hide();
        }

        //上一个
        function prevDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().prev()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().prev().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().prev().offset().top-20
                }, 500);
            }else{
                // $(obj).attr('disabled',true);
                return;
            }
        }
        //下一个
        function nextDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().next()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().next().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().next().offset().top-20
                }, 500);
            }else{
                //$(obj).attr('disabled',true);
                return;
            }
        }
        //引导页方法end

    }
]);