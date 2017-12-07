/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('markKnowController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","KnowledgeService" ,
    "knowledgeAddServer","$window","$stateParams","$interval","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,KnowledgeService,
              knowledgeAddServer,$window,$stateParams,$interval,$filter) {
        $scope.vm = {
            ctrName : "concept" ,
            apiQueryRelatedQuestion : "queryRichTextRelatedQuestion" , // 相关问 api
            localNameOfExt : "cust_rich_text_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            knowledgeOrigin : 120 , //知识来源
            knowledgeId : "",       // 知识编辑 id
//标题
            title : "",   //标题
            titleTip :  "",
//时间
            isTimeTable : false,  //时间表隐藏
            timeStart : "",      //起始时间
            timeEnd : "",
//bot
            frames: [],      //业务框架
            frameId: "",
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            botRoot : "",      //根节点
            frameCategoryId : "" ,
            creatSelectBot : [], //手选生成 bot
//扩展问
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
//展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
//D 知识内容配置
            textContent : "",
            newTitle: "",    //标题
            channelIdList : [],     //渠道
            dimensionArr : [],  //维度
            question : 1,
            tail : 1 ,
            tip : 1,
            appointRelativeGroup : [],

            replaceType : 0 ,
            enterEvent : enterEvent,
            limitSave : false ,
            isEditIndex : -1,   // 知识内容 弹框
            // -1 为内容新增
            // index 为知识的编辑索引
  //*******************2017/7/14 BEGIN*******************//
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
            selectMultimedia : selectMultimedia,   //图片，语音，图文选择弹出框
            imageList : [] ,     //所有图片文件
            addMultimedia : addMultimedia , //选择图片
            imgSelected : "",    // 已选图片
            //getEmotion : getEmotion ,
            voiceList : "",                //所有声音文件
            getVoiceList : getVoiceList,  //获取素有声音文件
            voiceSelected : "" ,    //以选择声音文件
            qqFaceText : "" ,
//*******************2017/7/14 END *******************//

//*******************2017/8/24 图文 BEGIN *******************//
            imgTextPaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10//分页框数量
            },
            imgTextList : "" ,
            imgTextSelected : "" ,
//*******************2017/8/24 图文  EDN *******************//

//*******************2017/8/9  添加链接 BEGIN *******************//
            addLint : addLint ,
            isNewLinkAble : isNewLinkAble ,
            newLint : "" ,
//*******************2017/8/9  添加链接  END *******************//
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv
            //引到页end
        };

        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //console.log($stateParams.data);
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin ;

            // 时间
            $scope.vm.isTimeTable = (data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd);
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            //内容
            angular.forEach(data.knowledgeContents,function(item,index){
                var content = {
                    "knowledgeContentNegative" : item.knowledgeContentNegative ,//类型
                    "knowledgeContent":item.knowledgeContent ,  // 多媒体信息
                    "knowledgeContentDetail" : {}   ,            // 多媒体展示信息
                    "channelIdList" :  item.channelIdList ,
                    "dimensionIdList" :  item.dimensionIdList ,
                    "knowledgeRelatedQuestionOn" :item.knowledgeRelatedQuestionOn ,   //显示相关问
                    "knowledgeBeRelatedOn"  :  item.knowledgeBeRelatedOn , //在提示
                    "knowledgeCommonOn" : item.knowledgeCommonOn ,   //弹出评价小尾巴
                    "knowledgeRelevantContentList" : item.knowledgeRelevantContentList   //业务扩展问
                } ;
                //根据返回内容查询详细信息 以name id url 的 形式显示
                if(item.knowledgeContentNegative==113){         //emotion
                    content.knowledgeContent = $filter("emotion")(item.knowledgeContent);
                }else if(item.knowledgeContentNegative==111){   // pic
                   KnowledgeService.getMediaPicture.save( {
                       pictureUrl : item.knowledgeContent
                   },function(response){
                       content.knowledgeContentDetail.name  =  response.pictureName
                   }) ;
                }else if(item.knowledgeContentNegative==112){   //voice
                    KnowledgeService.getMediaPicture.save( {
                        voiceUrl : item.knowledgeContent
                    },function(response){
                        content.knowledgeContentDetail.name = response.voiceName
                    })
                }else if(item.knowledgeContentNegative==114){  //img-text
                    KnowledgeService.getMediaPicture.save( {
                        graphicMessageId : item.knowledgeContent
                    },function(response){
                        content.knowledgeContentDetail.name = response.graphicMessageTitle ;
                        content.knowledgeContentDetail.url = response.pictureUrl ;
                    })
                }
                $scope.vm.scanContent.push(content);
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
                    if(nullCheck(data.data)){
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

        //y业务框架生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            //var title = oldWord.extensionQuestionTitle ;
            var title = extensionQuestionList[0] ;
            var weight = oldWord.extensionQuestionType ;
            var isLocalHasExt = addLocalExtension(title)  ;
            if(isLocalHasExt){
                $scope.vm.extensionsByFrame.push(isLocalHasExt);
                return ;
            }
            console.log(oldWord,title);
            httpRequestPost("/api/ms/richtextKnowledge/checkFrameTag",{
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

        function knowledgeAdd(data, index) {
            if(data){    //增加
                /* **************** 2017/8/2   知识内容编辑  BEGIN     **************/ //
                    switch (data.knowledgeContentNegative){
                        case  "111" :  //图片
                            $scope.vm.imgSelected = {
                                "name" : data.knowledgeContentDetail.name ,
                                "url" : data.knowledgeContent ,
                            };
                            break ;
                        case  "112": //声音
                            $scope.vm.voiceSelected = {
                                "name" : data.knowledgeContentDetail.name ,
                                "url" : data.knowledgeContent
                            };
                            break ;
                        case  "113" :    //表情
                            $timeout(function(){
                                $("#emotion-container").html(data.knowledgeContent) ;
                            },100);
                            break ;
                        case  "114" :  // 图文
                            $scope.vm.imgTextSelected = {
                                "id" : data.knowledgeContent ,
                                "name" : data.knowledgeContentDetail.name ,
                                "url":data.knowledgeContentDetail.url
                            };
                            break ;
                    }
                    $scope.vm.contentType  = data.knowledgeContentNegative ;  //新增内容类型
                 /* **************** 2017/8/2   知识内容编辑 END   **************/ //
                    $scope.vm.isEditIndex = index ;
                    $scope.vm.channelIdList = data.channelIdList;
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
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/single_add/rich_text/content.html","650px",function(){addNewOrEditKnow(index)},function(){$scope.vm.isEditIndex = -1},setDialog) ;
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
                            //    $scope.vm.knowledgeClassifyCall();knowledgeAdd
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
//重置参数

        function setDialog() {
         /* **************** 2017/8/2   重置参数  BEGIN     **************/ //
            $scope.vm.contentType  = 113 ;  //新增内容类型
            $scope.vm.imgSelected = "";    // 已选图片
            $scope.vm.voiceSelected = "" ;    //以选择声音文件
            $scope.vm.imgTextSelected = "" ;    //以选择图文
          /* **************** 2017/8/2   重置参数 END   **************/ //
            $scope.vm.channelIdList = [];
            $scope.vm.question = 1;    //显示相关问
            $scope.vm.tip = 1;   //在提示
            $scope.vm.tail =1;   //弹出评价小尾巴
            $scope.vm.appointRelativeGroup = [] ;//业务扩展问
            $scope.vm.appointRelative = "";
            $scope.vm.dimensionArr = [];
        }

        function addNewOrEditKnow(index){
            if(isNewKnowledgeTitle()){
               var parameter = {
                   "knowledgeContent": "",
                   "channelIdList": $scope.vm.channelIdList,
                   "knowledgeContentNegative": $scope.vm.contentType.toString(),
                   "dimensionIdList": nullCheck($scope.vm.dimensionArr) ? $scope.vm.dimensionArr : $scope.$parent.$parent.MASTER.dimensionListIds,
                   "knowledgeRelatedQuestionOn": $scope.vm.question,    //显示相关问
                   "knowledgeBeRelatedOn": $scope.vm.tip, //在提示
                   "knowledgeCommonOn": $scope.vm.tail,   //弹出评价小尾巴
                   "knowledgeRelevantContentList": $scope.vm.appointRelativeGroup  //业务扩展问
               };
                if($scope.vm.contentType==111){
                    parameter.knowledgeContent = $scope.vm.imgSelected.url ;
                    parameter.knowledgeContentDetail = {
                        "name" : $scope.vm.imgSelected.name
                    }
                }else if($scope.vm.contentType==112){
                    parameter.knowledgeContent = $scope.vm.voiceSelected.url ;
                    parameter.knowledgeContentDetail = {
                        "name" : $scope.vm.voiceSelected.name
                    }
                }else if($scope.vm.contentType==113){
                    //faceToString
                    parameter.knowledgeContent = $scope.vm.emotionText ;
                    //console.log($("#emotion-container").html()) ;
                    //var html = $("#emotion-container").html() ;
                    //knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
                }else if($scope.vm.contentType==114){
                    //faceToString
                    parameter.knowledgeContent = $scope.vm.imgTextSelected.id ;
                    parameter.knowledgeContentDetail = {
                        "name": $scope.vm.imgTextSelected.name ,
                        "url" : $scope.vm.imgTextSelected.url
                    } ;
                }
                $scope.vm.scanContent[index] = parameter ;
            }
        }
        function checkSave(){
            var params = getParams();
            console.log(params) ;
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false ;
            }else if(!nullCheck(params.classificationAndKnowledgeList)){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!nullCheck(params.knowledgeContents)){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false ;
            }else if(!nullCheck(params.classificationAndKnowledgeList)){
                layer.msg("分类知识Bot不能为空")
            }else{
                return true
            }
        }
//***************************    save check channel dimension  **********************************************
        function increaseCheck(close){
            //判斷维度是否为空 0 不变 1 全维度
            if(!nullCheck($scope.vm.dimensionArr)){
                $scope.vm.dimensionArr = angular.copy($scope.$parent.$parent.MASTER.dimensionListIds)
            };
            if(!isNewKnowledgeTitle()){
                layer.msg("请填写知识内容后保存")
            }else if(!nullCheck($scope.vm.channelIdList)){
                console.log($scope.vm.channelIdList)
                layer.msg("请选择渠道后保存")
            }else if(!isNewKnowledgeTitle() && !nullCheck($scope.vm.channelIdList)){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent,$scope.vm.isEditIndex,$scope.vm.channelIdList,$scope.vm.dimensionArr)){
                //存在重复条件
            }else{
                close(1) ;
            }
        }
//*******************       2017/7/14  BEGIN    *******************//
        //弹出选择媒体对话框
        function selectMultimedia(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/single_add/rich_text/media.html","450px","","","",2) ;
        }
        function addMultimedia(item){
            // 111 图片
            if($scope.vm.contentType==111){
                $scope.vm.imgSelected = {
                    "url" : item.pictureUrl ,
                    "id" : item.pictureId,
                    "name" : item.pictureName
                } ;
            //    声音
            }else if($scope.vm.contentType==112){
                $scope.vm.voiceSelected = {
                    "url" : item.voiceUrl ,
                    "id" : item.voiceId ,
                    "name" : item.voiceName
                } ;
            //    图文
            }else if($scope.vm.contentType==114){
                console.log(item)
                $scope.vm.imgTextSelected = {
                    "url" : item.pictureUrl ,
                    "id" : item.graphicMessageId ,
                    "name" : item.graphicMessageTitle
                } ;
            }
            ngDialog.close(ngDialog.latestID) ;
        }
        getPicList(1) ;
        //获取所有图片
        function getPicList(index){
            httpRequestPost("/api/ms/picture/queryPicture",{
                "index": (index-1)*$scope.vm.imgPaginationConf.pageSize,
                "pageSize": $scope.vm.imgPaginationConf.pageSize ,
                "applicationId":APPLICATION_ID
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
                "pageSize": $scope.vm.voicePaginationConf.pageSize ,
                "applicationId":APPLICATION_ID
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.voiceList = data.data.objs ;
                        $scope.vm.voicePaginationConf.currentPage =index ;
                        $scope.vm.voicePaginationConf.totalItems =data.data.total ;
                        console.log($scope.vm.voicePaginationConf)
                    })
                }
            },function(err){ console.log(err)}) ;
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
            var info = "" , isPass = false;
            if(!(($scope.vm.contentType == 111 && !$scope.vm.imgSelected.url) ||
                 ($scope.vm.contentType == 112 && !$scope.vm.voiceSelected.name) ||
                 ($scope.vm.contentType == 113 &&  !$("#emotion-container").html()) ||
                 ($scope.vm.contentType == 114 &&  !$scope.vm.imgTextSelected.id)
                )){
                isPass = true;
            }
            return isPass
        }
        //*******************2017/8/9  添加链接 BEGIN *******************//
        function addLint(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/single_add/rich_text/link.html","450px",function(){
                var aLink = "<a href='"+$scope.vm.newLink+"' target='_blank' style=' color: -webkit-link;cursor: auto;text-decoration: underline;'>"+$scope.vm.newLink+"</a>" ;
                var html = $("#emotion-container").html() + aLink ;

                $("#emotion-container").html(html)
                console.log($scope.vm.newLink)
            },"",function(){
                $scope.vm.newLink = ""
            },2) ;
        }
        function isNewLinkAble(val){
            var regex =/[^http(s)?:\/\/]?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i ;
            if(regex.test(val)){
                ngDialog.close(ngDialog.latestID,1) ;
            }else{
                layer.msg("请输入正确的链接地址")
            }
        }
//*******************2017/8/9  添加链接  END *******************//

//*******************2017/8/24 @图文 根据图文id获取图片url @根据图片获取name  BEGIN  *******************//
        queryImgText(1);
        //查询
        function queryImgText(index) {
            httpRequestPost("/api/ms/graphicMessage/queryGraphicMessage",{
                applicationId:APPLICATION_ID,
                index:(index - 1)*$scope.vm.imgTextPaginationConf.pageSize,
                pageSize:$scope.vm.imgTextPaginationConf.pageSize
            },function(data){
                if(data.status == 500){
                    layer.msg("请求失败",{time:1000});
                }else if(data.status == 200){
                    console.log(data);
                    $scope.$apply(function(){
                        $scope.vm.imgTextList = data.data.objs ;
                        $scope.vm.imgTextPaginationConf.totalItems =data.data.total ;
                        $scope.vm.imgTextPaginationConf.numberOfPages = data.data.total/$scope.vm.imgTextPaginationConf.pageSize ;
                    })
                }
            },function(error){ console.log(error);})  ;
        }
        //分页定时器
        var timeoutImgText ;
        $scope.$watch('vm.imgTextPaginationConf.currentPage', function(current){
            if(current){
                if (timeoutImgText) {
                    $timeout.cancel(timeoutImgText);
                }
                timeoutImgText = $timeout(function () {
                    queryImgText(current);
                }, 0);
            }
        },true);
//*******************2017/8/24 图文 END  *******************//
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