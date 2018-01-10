/**
 * @Author : MILES .
 * @Create : 2017/3/28.
 * @Module : 客服场景 概念单单条知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('ConceptNewController',
     ['$scope', 'localStorageService',"KnowledgeService" ,"$state" ,"ngDialog","$cookieStore",
    "$timeout","$window","$stateParams","$interval","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,
     $timeout,$window,$stateParams,$interval,$filter)=> {
        $scope.parameter = {
            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [""], //扩展问集合
            "contents"           : []    //内容集合
        } ;
        $scope.newKnow = {
            "content"	: "",           //知识内容
            "channel"	: "",           //渠道
        } ;
        $scope.vm = {
            apiQueryRelatedQuestion : "queryConceptRelatedQuestion" , // 相关问 api
            localNameOfExt : "cust_concept_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            titleTip :  "",
            isTimeTable : false,  //时间表隐藏
            frames: [],      //业务框
            save : save ,   //保存
            scan :scan ,   //预览
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
            enterEvent : enterEvent,
            limitSave : false ,
        };

        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        //    文檔加工添加知識
        //  if ($stateParams.data  && angular.fromJson($stateParams.data).docmentation) {
        //     $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
        //     $scope.vm.title = $scope.vm.docmentation.documentationTitle;
        //     $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
        //     $scope.vm.knowledgeOrigin = 122 ;
        //     $timeout(function(){openContentConfirm(function(){saveAddNew(0)});},0)
        // }else if($stateParams.knowledgeTitle){
        //     console.log("======"+$stateParams.knowledgeTitle);
        //     $scope.vm.title=$stateParams.knowledgeTitle;
        // }
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
                    var params;   // 保存參數
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
                var params ;
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
                knowledgeRelatedQuestionOn : $scope.vm.question,
                knowledgeBeRelatedOn : $scope.vm.tip,
                knowledgeCommonOn : $scope.vm.tail,
                knowledgeRelevantContentList : $scope.vm.knowledgeRelevantContentList
            } ;
        }
//        提交 检验参数
        function checkSave(){
            var params;
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
            if(!$scope.vm.newTitle && !$scope.vm.channelIdList.length){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.vm.newTitle){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.vm.channelIdList.length) {
                layer.msg("请选择渠道后保存")
            }else{
                ngDialog.closeAll(1) ;
            }
        }
    }
])};