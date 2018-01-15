/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  faq知识编辑
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('FaqEditController', [
    '$scope', 'localStorageService',"KnowledgeService" ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","$stateParams","$window","$rootScope","$filter",
    ($scope,localStorageService,KnowledgeService , $state,ngDialog,$cookieStore,$timeout,$compile,$stateParams,$window,$rootScope,$filter) =>{
        $state.go("KM.faq.edit") ;
        $scope.parameter = {
            "id"	                : "",   //知识id
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
            ctrName : "faq" ,
            titleTip :  "",
            localExtensionName : "cust_faq_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
//时间
            isTimeTable : false,  //时间表隐藏
//bot
            frames : [],      //业务框架
//展示内容
            save : save ,   //保存
            scan :scan ,    //预览
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
//D 知识内容配置
            newTitle: "",    //标题
            channelIdList : "",     //新添加的 channel
            appointRelativeGroup : [],
            enterEvent : enterEvent ,
            saveLimitTimer : true , //限制多次打标
            isEditIndex : -1,   // 知识内容 弹框
                                // -1 为内容新增
                                // index 为知识的编辑索引
            skipNewLine : skipNewLine ,
            showFrame : showFrame //选择业务框架
        };
        let knowNewHtml = require("../../views/public_html/knowledge_increase.html") ;
        let frameHtml   = require("../../views/public_html/frame.html") ;
        let limitTimer ;
        getKnowledge();
        function getKnowledge(){
            KnowledgeService.getFaqKnow.get({"id":$scope.parameter.id}).$promise.then(function (response) {
                if(response.status == 200){
                    $scope.parameter = response.data;
                    if(response.data.expDateEnd || response.data.expDateStart ){
                        $scope.vm.isTimeTable = true ;
                        $scope.parameter.expDateStart =  $scope.parameter.expDateStart?$filter("date")(response.data.expDateStart,"yyyy-MM-dd"):"";
                        $scope.parameter.expDateEnd =  $scope.parameter.expDateEnd? $filter("date")(response.data.expDateEnd,"yyyy-MM-dd"):"";
                    }
                }
            })
        }
        function showFrame(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,frameHtml,"650px",function(){

            },"",function(){

            });
        }
        // 通过frame 获取扩展问
        function knowledgeAdd(data,index){
            if(data){    //增加
                $scope.vm.isEditIndex = index ;
                $scope.vm.newTitle = data.knowledgeContent;
                $scope.vm.channelIdList = data.channelIdList;
                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
            }else{
                $scope.vm.isEditIndex = "" ;
                $scope.vm.newTitle = ""
                $scope.vm.channelIdList = "";
                $scope.vm.knowledgeRelevantContentList = [];
            }
            openContentConfirm(function(){saveAddNew(index)})
        }
        //打开知识内容对话框
        function openContentConfirm(callback){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,knowNewHtml,"650px",function(){
                callback();
            },"",function(){
                $scope.$parent.knowCtr.setKnowParamHasDialog($scope)
            });
        }
        function save(){
            let resultParams = checkSave();
            if (!resultParams||!$scope.vm.saveLimitTimer) {
                return false
            }
            $timeout.cancel(limitTimer) ;
            limitTimer = "" ;
            $scope.vm.saveLimitTimer = false ;
            limitTimer = $timeout(function(){
                $scope.vm.saveLimitTimer = true ;
            },180000) ;
            KnowledgeService.updateFaqKnow.save(resultParams,function (response) {
                if (response.status == 200) {
                    if ($scope.vm.docmentation) {
                        //文档知识分类状态回掉
                        knowledgeClassifyCall()
                    } else {
                        // $state.go('knowledgeManagement.custOverview');
                    }

                }else{
                    layer.msg(response.info) ;
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.saveLimitTimer = false ;
                }
            }, function (err) {
                $timeout.cancel(limitTimer) ;
                $scope.vm.saveLimitTimer = false ;
            });

        }
        // 知识文档分类回调
        function knowledgeClassifyCall(){
            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify",
                {
                    knowledgeId: $scope.vm.docmentation.knowledgeId,
                    knowledgeStatus: 2
                },
                function(data){
                    if(data && data.status == 200) {
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
        };
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                obj.params = $scope.paremeter;
                obj.editUrl = "knowledgeManagement.faqAdd";
                obj.api = "/api/ms/faqKnowledge/addFAQKnowledge" ;
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/faqKnowledge/editFAQKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api = "/api/ms/faqKnowledge/addFAQKnowledge"
                }
                obj.knowledgeType = 101 ;
                obj.knowledgeId = $scope.vm.knowledgeId ;
                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        };
        function saveAddNew(cur){
            $scope.parameter.contents[cur] =  {
                "channel":$scope.newKnow.channel,
                "type": 110,
                "content":$scope.newKnow.content,
                "contentRelevantList" : []
            }
        }
//        提交 检验参数
        function checkSave(){
            let result = false ;
            var params = angular.copy($scope.parameter);
            params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
            params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!="")) ;
            if(!$scope.parameter.title){
                layer.msg("知识标题不能为空，请填写");
                return false
            }else if(!nullCheck($scope.parameter.classifyList)){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!nullCheck($scope.parameter.contents)){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false
            }else{
                result = params
            }
            return result ;
        }
        function increaseCheck(){
            //判斷维度是否为空 0 不变 1 全维度
            if(!$scope.newKnow.content && !$scope.newKnow.channel){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.newKnow.content){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.newKnow.channel){
                layer.msg("请选择渠道后保存")
            }else{
                ngDialog.closeAll(1) ;
            }
        }
        function skipNewLine(e) {
            let len = $scope.parameter.extensionQuestionList.length ;
            e = e || window.event ;
            if((e!="blur" && (e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])) || e=="blur"&& nullCheck($scope.parameter.extensionQuestionList[len-1])){
                $scope.parameter.extensionQuestionList.push("") ;
            }
            $timeout(function(){
                $(e.target).parent().next().find("input").focus();
            },)
        }
}])};