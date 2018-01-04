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
            "extensionQuestionList" : [""], //扩展问集合
            "contentList"           : []    //内容集合
        } ;
        $scope.newKnow = {
            "content"	: "",           //知识内容
            "channel"	: "",           //渠道
        } ;
        $scope.vm = {
            ctrName : "faq" ,
            titleTip :  "",
//时间
            isTimeTable : false,  //时间表隐藏
//bot
            frames : [],      //业务框架
            creatSelectBot : [] ,//点击bot类目数生成
            botRoot : "",      //根节点
            botFullPath : null ,
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
            limitSave : false , //限制多次打标
            isEditIndex : -1,   // 知识内容 弹框
                                // -1 为内容新增
                                // index 为知识的编辑索引
            skipNewLine : skipNewLine ,
//引导页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
        };
        let knowNewHtml = require("../../views/public_html/knowledge_increase.html") ;
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10011,
                "index": 0,
                "pageSize":999999
            },function(data){
                //console.log(data);
                if(data.status!=10005){
                    if(data.data.length){
                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
                        $scope.$apply();
                    }
                }
            },function(){
                //layer.msg("err or err")
            });
        }
        // 通过frame 获取扩展问
        function knowledgeAdd(data,index){
            if(data){    //增加
                $scope.vm.isEditIndex = index ;
                $scope.vm.newTitle = data.knowledgeContent;
                $scope.vm.channelIdList = data.channelIdList;

                $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                $scope.vm.question = data.knowledgeRelatedQuestionOn;
                $scope.vm.tail = data.knowledgeCommonOn;
                $scope.vm.knowledgeRelevantContentList = data.knowledgeRelevantContentList;
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

        var limitTimer ;
        function save(){
                if (!checkSave()) {
                    return false
                }
                if(!$scope.vm.limitSave) {
                    $timeout.cancel(limitTimer) ;
                    limitTimer = "" ;
                    $scope.vm.limitSave = true ;
                    limitTimer = $timeout(function(){
                        $scope.vm.limitSave = false ;
                    },180000) ;
                    KnowledgeService.storeFaqKnow.save($scope.parameter,function (response) {
                        if (response.status == 200) {
                            if ($scope.vm.docmentation) {
                                //文档知识分类状态回掉
                                knowledgeClassifyCall()
                            } else {
                                // $state.go('knowledgeManagement.custOverview');
                            }

                        }else if (data.status == 500) {
                            layer.msg("知识保存失败") ;
                            $timeout.cancel(limitTimer) ;
                            $scope.vm.limitSave = false ;
                        }
                    }, function (err) {
                        $timeout.cancel(limitTimer) ;
                        $scope.vm.limitSave = false ;
                    });
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
        function scan(api){
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
            $scope.parameter.contentList[cur] =  {
                "channel":$scope.newKnow.channel,
                "type": 110,
                "content":$scope.newKnow.content
            } ;
        }
//        提交 检验参数
        function checkSave(){
            var params = $scope.parameter;
            $scope.parameter.classifyList = [] ;
            console.log(params) ;
            if($scope.vm.titleTip!=""){
                layer.msg($scope.vm.titleTip);
                return false;
            }
            if(!$scope.parameter.title){
                layer.msg("知识标题不能为空，请填写");
                return false
            }else if(!nullCheck($scope.parameter.classifyList)){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!nullCheck($scope.parameter.contentList)){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false
            }else{
                return true
            }
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
            if(e!="blur"){
                e = e || window.event ;
                let keycode = e.keyCode|| e.which;
                if(keycode==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])){
                    $scope.parameter.extensionQuestionList.push("")
                }
            }else{
                if(nullCheck($scope.parameter.extensionQuestionList[len-1])){
                    $scope.parameter.extensionQuestionList.push("")
                }
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