/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  faq知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('FaqNewController', [
    '$scope', 'localStorageService',"KnowledgeService" ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","$stateParams","$window","$rootScope","$filter",
    ($scope,localStorageService,KnowledgeService , $state,ngDialog,$cookieStore,$timeout,$compile,$stateParams,$window,$rootScope,$filter) =>{
        $state.go("KM.faq") ;
        $scope.parameter = {
            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [{"title":""}], //扩展问集合
            "contents"           : []    //内容集合
        } ;
        $scope.newKnow = {
            "content"	: "",           //知识内容
            "channel"	: "",           //渠道
            "type"      : 1010
        } ;
        $scope.vm = {
            ctrName : "faq" ,
            titleTip :  "",
            localExtensionName : "cust_faq_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
//时间
            isTimeTable : false ,  //时间表隐藏
//bot
            frames : [],      //业务框架
//展示内容
            save : save ,   //保存
            scan :scan ,    //预览
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
//D 知识内容配置
            knowledgeRelevantContentList : [] ,
            saveLimitTimer : true , //限制多次打标
            showFrame : showFrame //选择业务框架
        };
        let knowNewHtml = require("../../views/public_html/knowledge_increase.html") ;
        let frameHtml   = require("../../views/public_html/frame.html") ;
        let limitTimer ;
        function showFrame(scope){
            if(!$scope.parameter.classifyList.length){
                return layer.msg("请先选择添加类目")
            }
            let html = "<div frame='100'></div>";
            scope.$parent.$parent.MASTER.openNgDialog($scope,html,"650px",function(){

            },"",function(){

            });

        }
        function knowledgeAdd(data,index){
            // 判断是否渠道添加重复
            if(!data){
                if(($scope.parameter.contents.length==1 && $scope.parameter.contents[0].channel == 130) || $scope.parameter.contents.length==3){
                    return layer.msg("已添加所有渠道内容");
                }
            }
            if(data){    //增加
                $scope.newKnow.content = data.content;
                $scope.newKnow.channel = data.channel ;
                $scope.vm.knowledgeRelevantContentList = data.contentRelevantList;
            }else{
                $scope.newKnow.content                 = "";
                $scope.newKnow.channel                 = "" ;
                $scope.vm.knowledgeRelevantContentList = [];
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,knowNewHtml,"650px",function(){
                if($scope.parameter.contents[index] == undefined){
                    $scope.parameter.contents[index] =  {
                        "channel"             : $scope.newKnow.channel,
                        "type"                : $scope.newKnow.type,
                        "content"             : $scope.newKnow.content,
                        "contentRelevantList" : $scope.vm.knowledgeRelevantContentList
                    }
                }else{
                    $scope.parameter.contents[index].channel             = $scope.newKnow.channel;
                    $scope.parameter.contents[index].type                = $scope.newKnow.type;
                    $scope.parameter.contents[index].content             = $scope.newKnow.content;
                    $scope.parameter.contents[index].contentRelevantList = $scope.vm.knowledgeRelevantContentList;
                }
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
            KnowledgeService.storeFaqKnow.save(resultParams,function (response) {
                if (response.status == 200) {
                    layer.confirm('是前往总览页面查看？', {
                        btn: ['是','继续添加'] //按钮
                    }, function(){
                        $state.go("KM.overview")
                    },function(){
                        $state.go("KM.faq")
                    });
                }else{
                    layer.msg(response.info) ;
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.saveLimitTimer = true ;
                }
            }, function (err) {
                $timeout.cancel(limitTimer) ;
                $scope.vm.saveLimitTimer = true ;
            });

        }
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                obj.params = $scope.parameter;
                obj.type = 100;
                obj.back = "KM.faq" ;
                obj.save = save ;
                $window.knowledge = obj;
                var url = $state.href('KM.scan');
                $window.open(url,'_blank');
            }
        };
//        提交 检验参数
        function checkSave(){
            let result = false ;
            var params = angular.copy($scope.parameter);
            params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
            params.extensionQuestionList = params.extensionQuestionList.map((item)=>(item.title)) ;
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
}])};