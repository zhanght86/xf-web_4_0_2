/**
 * @Author : MILES .
 * @Create : 2017/3/28.
 * @Module : 客服场景 概念单单条知识编辑
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('ConceptEditController', [
    '$scope', 'localStorageService',"KnowledgeService" ,"$state" ,"ngDialog","$cookieStore","$timeout","knowledgeAddServer","$window","$stateParams","$interval","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,knowledgeAddServer,$window,$stateParams,$interval,$filter) =>{
        $scope.vm = {
            ctrName : "concept" ,
            apiQueryRelatedQuestion : "queryConceptRelatedQuestion" , // 相关问 api
            localNameOfExt : "cust_concept_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
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
            botRoot : "",      //根节点
            creatSelectBot : [], //手选生成 bot
            botFullPath : null ,
            frameCategoryId : "" ,
//扩展问
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
//展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
//D 知识内容配置
            newTitle : "",           //标题
            channelIdList : [],      //新添加的渠道
            dimensionArr : [],      //選擇的維度
            question : 1,            //显示相关问题
            tip : 1,                 //相关提示
            tail : 1 ,               //小尾巴
            knowledgeRelevantContentList : [] ,  // 相关知识

            enterEvent : enterEvent,
            limitSave : false ,
            isEditIndex : -1,   // 知识内容 弹框
                        // -1 为内容新增
                        // index 为知识的编辑索引


//引导页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv
        };
        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin ;
            // 时间
            $scope.vm.isTimeTable = (data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd)
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                $scope.vm.scanContent.push({
                    knowledgeContent : item.knowledgeContent,    //渠道
                    channelIdList :item.channelIdList ,
                    dimensionIdList : item.dimensionIdList ,   // 维度
                    knowledgeRelatedQuestionOn :item.knowledgeRelatedQuestionOn ,   //显示相关问
                    knowledgeBeRelatedOn  :  item.knowledgeBeRelatedOn , //在提示
                    knowledgeCommonOn : item.knowledgeCommonOn ,   //弹出评价小尾巴
                    knowledgeRelevantContentList : item.knowledgeRelevantContentList==null?[]:item.knowledgeRelevantContentList   //业务扩展问
                });
            });
        //    文檔加工添加知識
        } else if ($stateParams.data  && angular.fromJson($stateParams.data).docmentation) {
            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
            $scope.vm.knowledgeOrigin = 122 ;
            $timeout(function(){openContentConfirm(function(){saveAddNew(0)});},0)
        }else if($stateParams.knowledgeTitle){
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
        function openContentConfirm(callback,elseCall) {
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/public_html/knowledge_increase.html","650px",function(){
                callback();
            },"",function(){
                $scope.$parent.knowCtr.setKnowParamHasDialog($scope)
            });
        }
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
            if(data){    //增加
                $scope.vm.isEditIndex = index ;
                $scope.vm.newTitle = data.knowledgeContent;
                $scope.vm.channelIdList = data.channelIdList;
                $scope.vm.dimensionArr = data.dimensionIdList;
                $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                $scope.vm.question = data.knowledgeRelatedQuestionOn;
                $scope.vm.tail = data.knowledgeCommonOn;
                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
            }
            openContentConfirm(function(){saveAddNew(index)})
        }
        // 主页保存 获取参数
        function getParams(){
          return {
                "applicationId"         : APPLICATION_ID,
                "knowledgeId"           : $scope.vm.knowledgeId ,
                "userId"                : USER_ID ,
                "sceneId"               : SCENE_ID ,
                "knowledgeTitle"        : $scope.vm.title,
                "knowledgeType"         : 101,
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:"",  //开始时间
                "knowledgeExpDateEnd"   : $scope.vm.isTimeTable?$scope.vm.timeEnd:"",     //结束时间
                "knowledgeTitleTag"     : "",    //标题打标生成的name
                "knowledgeUpdater"      : USER_LOGIN_NAME, //操作人
                "knowledgeCreator"      : USER_LOGIN_NAME , //操作人
                "knowledgeOrigin"       : $scope.vm.knowledgeOrigin,  //知识来源
                "knowledgeContents"     : $scope.vm.scanContent,      // 知识内容
                "extensionQuestions"    :  $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ,  // 扩展问
                "classificationAndKnowledgeList" : $scope.vm.creatSelectBot  // bot
            };
        }
        //限制一个知识多次保存
        var limitTimer ;
        function save(api) {
            if(!$scope.vm.limitSave){
                //layer.msg()
            }
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
                KnowledgeService[api].save(params,function (data) {
                    if (data.status == 200) {
                        if ($scope.vm.docmentation) {
                            knowledgeClassifyCall();
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
                }, function (error) {
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.limitSave = false ;
                })
                }
            }
        }
        function scan(){
            if(!checkSave()){
                return false ;
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
        function saveAddNew(cur){
            $scope.vm.scanContent[cur] =  {
                knowledgeContent : $scope.vm.newTitle ,
                channelIdList : $scope.vm.channelIdList ,
                dimensionIdList : $scope.vm.dimensionArr,
                knowledgeRelatedQuestionOn : $scope.vm.question,
                knowledgeBeRelatedOn : $scope.vm.tip,
                knowledgeCommonOn : $scope.vm.tail,
                knowledgeRelevantContentList : $scope.vm.knowledgeRelevantContentList
            } ;
        }
//        提交 检验参数
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
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("分类知识Bot不能为空")
            }else{
                return true
            }
        }
//***************************    save check channel dimension  **********************************************
        function increaseCheck(){
            //判斷维度是否为空 0 不变 1 全维度
            if(!$scope.vm.dimensionArr.length){
                $scope.vm.dimensionArr=angular.copy($scope.$parent.$parent.MASTER.dimensionListIds)
            }
            if(!$scope.vm.newTitle && !$scope.vm.channelIdList.length){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.vm.newTitle){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.vm.channelIdList.length){
                layer.msg("请选择渠道后保存")
            }else if($scope.$parent.knowCtr.checkChannelDimension($scope.vm.scanContent,$scope.vm.isEditIndex,$scope.vm.channelIdList,$scope.vm.dimensionArr)){
                //存在重复条件
            }else{
                ngDialog.closeAll(1) ;
            }
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
])};