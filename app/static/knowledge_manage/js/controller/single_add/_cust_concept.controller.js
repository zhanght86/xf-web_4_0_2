/**
 * Created by dinfo on 2017/3/28
 */

angular.module('knowledgeManagementModule').controller('conceptController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","$interval","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,$interval,$filter) {
      //console.log($stateParams)
        $scope.vm = {
            knowledgeId : "",
            knowledgeOrigin : 120 , //知识来源
            frames: [],      //业务框架
            frameId: "",
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            botRoot : "",      //根节点
            knowledgeClassifyCall: knowledgeClassifyCall, //知识分类的回调方法
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
            appointRelativeGroup : [],
            replaceType : 0 ,
            enterEvent : enterEvent,
            dialogExtension : [],

            limitSave : false ,
            isEditIndex : -1,   // 知识内容 弹框
                        // -1 为内容新增
                        // index 为知识的编辑索引
//*******************2017/8/3  BEGIN   删除扩展问本地备份 *******************//
            rmExtensionBackup : [] ,
//*******************2017/8/3  END   删除扩展问本地备份   *******************//
                        //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
            backupsOfExtension : "" , //扩展问 编辑备份
            backUpExt: backUpExt , // 扩展问 假删除
            extensionDeleted : []
        };

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
                obj.knowledgeContent = item.knowledgeContent;
                //維度，添加預覽效果   以name id 的 形式显示
                obj.channelIdList =  item.channelIdList ;
                obj.dimensionIdList =  item.dimensionIdList ;
                obj.knowledgeRelatedQuestionOn =item.knowledgeRelatedQuestionOn ;   //显示相关问
                obj.knowledgeBeRelatedOn  =  item.knowledgeBeRelatedOn ; //在提示
                obj.knowledgeCommonOn = item.knowledgeCommonOn ;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = item.knowledgeRelevantContentList ;  //业务扩展问
                $scope.vm.scanContent.push(obj);
            });
        //    文檔加工添加知識
        } else if ($stateParams.data  && angular.fromJson($stateParams.data).docmentation) {
            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
            $scope.vm.knowledgeOrigin = 122 ;
            $timeout(function(){$scope.vm.openContentConfirm(saveAddNew);},0)
        }

        if($stateParams.knowledgeTitle){
            console.log("======"+$stateParams.knowledgeTitle);
            $scope.vm.title=$stateParams.knowledgeTitle;
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
        // 知识文档分类回调
        function knowledgeClassifyCall() {
            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify",
                {
                    knowledgeId: $scope.vm.docmentation.knowledgeId,
                    knowledgeStatus: 3
                },
                function (data) {
                    if (data && data.status == 200) {
                        $state.go("back.doc_results_view",
                            {
                                knowDocId: $scope.vm.docmentation.documentationId,
                                knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
                                knowDocUserName: $scope.vm.docmentation.knowDocUserName
                            }
                        );
                    }
                }
            );
        }
        //打开知识内容对话框
        function openContentConfirm(callback) {
            $scope.$parent.$parent.openNgDialog($scope,"/static/knowledge_manage/public_html/knowledge_increase.html","650px",function(){
                callback();
            },function(){
                setDialog();//清空内容对话框
            });
        }
        //y业务框架生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            //var title = oldWord.extensionQuestionTitle ;
            var title = extensionQuestionList[0] ;
            var weight = oldWord.extensionQuestionType ;
            console.log(oldWord,title);
            var isLocalHasExt = addLocalExtension(title)  ;
            if(isLocalHasExt){
                $scope.vm.extensionsByFrame.push(isLocalHasExt);
                return ;
            }
            httpRequestPost("/api/ms/conceptKnowledge/checkFrameTag",{
                "applicationId": APPLICATION_ID,
                "extensionQuestionList" : extensionQuestionList,
                "frameQuestionTagList" : frameQuestionTagList
            },function(data){
                if(data.status==200){
                    $scope.$apply(function(){
                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
                        var result = $scope.MASTER.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                        if(result != false){
                            $scope.vm.extensionTitle = "";
                            $scope.vm.extensionsByFrame.push(result);
                        }
                    })
                }
            }, function () {
            });
        }

        function scanCotentByTitle(title,index){
            var answerContentList = new Array(title);
            httpRequestPost("/api/ms/conceptKnowledge/productExtensionQuestion", {
                "applicationId": APPLICATION_ID,
                "title": $scope.vm.title,
                "answerContentList": answerContentList
            }, function (data) {
                console.log(data) ;
                if (data.status == 200) {
                    //console.log(data.data);
                    //console.log(index) ;
                    $scope.vm.scanContent[index].extensionByContentByTitle = data.data;
                    $scope.$apply()
                } else if (data.status == 500) {
                    layer.msg(data.info);
                }
            }, function (error) {
                console.log(error)
            });
        }
        //手动添加扩展问
        function getExtension(title,weight,source){
            //source  0 默认  1 标题
            var isLocalHasExt = addLocalExtension(title)  ;
            if(isLocalHasExt){
                 if(!source){
                     $scope.vm.extensions.push(isLocalHasExt);
                 }else{
                     $scope.vm.extensionByTitleTag = new Array(isLocalHasExt)
                 }
                return ;
            }
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
                httpRequestPost("/api/ms/conceptKnowledge/checkExtensionQuestion", {
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
                            var result = $scope.MASTER.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
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
                }, function (error) {
                    //status == 500
                    //layer.msg("概念扩展打标失败，请检查服务，重新打标");
                    console.log(error)
                });
            }
        }

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////

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
                if(data){    //增加
                    $scope.vm.isEditIndex = index ;
                    $scope.vm.newTitle = data.knowledgeContent;
                    $scope.vm.channel = data.channelIdList;
                    //$scope.vm.dimensionArr.id = data.dimensionIdList;
                    angular.forEach($scope.vm.dimensions,function(item){
                        if(data.dimensionIdList.inArray(item.dimensionId)){
                            var obj = {} ;
                            obj.dimensionId = item.dimensionId ;
                            obj.dimensionName = item.dimensionName ;
                            $scope.vm.dimensionArr.push(obj) ;
                        }
                    }) ;
                    $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                    $scope.vm.question = data.knowledgeRelatedQuestionOn;
                    $scope.vm.tail = data.knowledgeCommonOn;
                    $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList;
                    var callback = function(){
                        var obj = {};
                        obj.knowledgeContent = $scope.vm.newTitle;
                        obj.knowledgeContentType = 0;  // 答案类型
                        obj.channelIdList =  $scope.vm.channel;
                        obj.dimensionIdList =  $scope.vm.dimensionArr.id;
                        obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
                        obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                        obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
                        obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup ; //业务扩展问
                        $scope.vm.scanContent[index] = obj;
                        $scope.vm.isEditIndex = -1 ;
                        scanCotentByTitle(obj.knowledgeContent,index) ;
                        setDialog() ;
                    }
                } else {
                    var callback = saveAddNew;
                }
                $scope.MASTER.openNgDialog($scope,"/static/knowledge_manage/public_html/knowledge_increase.html","650px",callback,function(){
                    $scope.vm.isEditIndex = -1  ;
                    setDialog()
                }) ;
                $timeout(function(){
                    $scope.MASTER.searchAppointAutoTag($scope,".appoint","/api/ms/conceptKnowledge/getKnowledgeTitle","appointRelativeList",function(suggestion){
                        console.log(suggestion) ;
                           //$scope.$apply(function(){
                           //    if($scope.vm.appointRelativeGroup.indexOf(suggestion)==-1){
                           //        $scope.vm.appointRelativeGroup.push(suggestion)
                           //    }else{
                           //        layer.msg("重复添加相关问")
                           //    }
                           //    $scope.vm.appointRelative = "";  //清楚title
                           //})
                       }).listener()
                },2000) ;
            }
        }
        function extensionEdit(type,item,index){
            //type  1 框架生成  0 手动添加
            $scope.vm.backupsOfExtension = angular.copy(item) ;
            console.log($scope.vm.backupsOfExtension) ;
            var dia = angular.element(".ngdialog ");
            if(dia.length==0){
            var extensionEdit = ngDialog.openConfirm({
                template:"/static/knowledge_manage/public_html/extension_edit.html",
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
                httpRequestPost("/api/ms/conceptKnowledge/checkKnowledgeTitleAndGetAutoClassify",{
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
                                var botResult = $scope.MASTER.isBotRepeat(item.id,item.fullPath,item.type,allBot) ;
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
                "knowledgeType": 101,
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:"",  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:"",     //结束时间
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME , //操作人
                "knowledgeOrigin"  : $scope.vm.knowledgeOrigin , //知识来源
            };
            params.knowledgeContents =  $scope.vm.scanContent;
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
                        api = "/api/ms/conceptKnowledge/editKnowledge";
                        params.knowledgeId = $scope.vm.knowledgeId;
                    } else {
                        //新增
                        api = "/api/ms/conceptKnowledge/addConceptKnowledge"
                    }
                    httpRequestPost(api, params, function (data) {
                        console.log(getParams());
                        if (data.status == 200) {
                            if ($scope.vm.docmentation) {
                                $scope.vm.knowledgeClassifyCall();
                            }else{
                                $state.go('knowledgeManagement.custOverview');
                            }
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
                obj.editUrl = "knowledgeManagement.singleAddConcept";
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/conceptKnowledge/editKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api = "/api/ms/conceptKnowledge/addConceptKnowledge"
                }
                obj.params = params;
                obj.knowledgeType = 101;
                $window.knowledgeScan = obj;
                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        };

 /* *********************              弹框相关           **************************/ //
//重置参数
        function setDialog() {
            $scope.vm.newTitle = "";
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

        function saveAddNew(){
            if($scope.vm.newTitle){
                var index = $scope.vm.scanContent.length ;
                var title = angular.copy($scope.vm.newTitle);
                scanCotentByTitle(title,index) ;
                var obj = {};
                obj.knowledgeContent = $scope.vm.newTitle;
                //obj.knowledgeContentType = 0,  // 答案类型
                obj.channelIdList =  $scope.vm.channel;
                obj.dimensionIdList =  $scope.vm.dimensionArr.id.length?$scope.vm.dimensionArr.id:$scope.vm.dimensionsCopy.id;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
                obj.knowledgeBeRelatedOn = $scope.vm.tip; //在提示
                obj.knowledgeCommonOn = $scope.vm.tail;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup;  //业务扩展问
                // 生成扩展问题
                //高級 選項
                $scope.vm.scanContent.push(obj);
                setDialog()
            } else {
                setDialog()
            }
        }
        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/ms/conceptKnowledge/checkDistribute",{
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


//        提交 检验参数
        function checkSave(){

            var params = getParams();
            console.log(params) ;
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false ;
            }else if(!$scope.MASTER.isTitleHasExt($scope.vm.title,params.extensionQuestions)){
                layer.msg("标题未打标")
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!params.knowledgeContents.length){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false ;
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
            if(!$scope.vm.newTitle && !$scope.vm.channel.length){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.vm.newTitle){
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
                                            angular.forEach($scope.$parent.$parent.MASTER.channelList,function(all){
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
/****************************************************************
                     2017/9/1  mengfei  BEGIN
            功能    扩展问删除备份
/*****************************************************************/
        // 假删除本地备份
        function backUpExt(item){
            if(!$scope.vm.extensionDeleted.inArray(item)){
                $scope.vm.extensionDeleted.push(item)
            }
        }
        function addLocalExtension(title){
            var result = false ;
            if($scope.vm.extensionDeleted){
                angular.forEach($scope.vm.extensionDeleted,function(item,index){
                    if(title == item.extensionQuestionTitle){
                        result = item ;
                        $scope.vm.extensionDeleted.splice(index,1)
                    }
                })
            }
            return result ;
        }
 /*******************************2017/9/1 扩展问删除备份  END *********************/
//*************************************************************************

        //function addAppoint(item,arr){
        //    if(arr.indexOf(item)==-1){
        //        arr.push(item)
        //    }
        //    $scope.vm.appointRelative = "";  //清楚title
        //    $scope.vm.appointRelativeList = [];  //清除 列表
        //}
        // 動態加載 title
        //$scope.$watch("vm.appointRelative",function(title){
        //    //console.log(title);
        //    if(title){
        //        $timeout(getAppointRelative(title),300)
        //    }
        //});

        //function getAppointRelative(title){
        //    httpRequestPost("/api/ms/conceptKnowledge/getKnowledgeTitle",{
        //        "title" : title
        //    },function(data){
        //        if(data.status == 200){
        //            $scope.vm.appointRelativeList = data.data;
        //            $scope.$apply()
        //        }else{
        //        }
        //        console.log(data);
        //    },function(error){
        //        console.log(error)
        //    });
        //}
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