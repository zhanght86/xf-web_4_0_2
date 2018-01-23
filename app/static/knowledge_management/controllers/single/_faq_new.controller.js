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
            idArr:[],              //新知识id

            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [{"title":""}], //扩展问集合
            "contents"           : []    //内容集合
        } ;
        $scope.newKnow = {
            "isNewContent" : -1 ,
            "content"	   : "",           //知识内容
            "channel"	   : "",           //渠道
            "type"         : 1010
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
        // 知识学习  （知识学习>新知识发现>学习）
        if($stateParams.knowledgeId){
            getNewKnowledgeLearningList();
        }
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
            }else{
                $scope.newKnow.isNewContent = index ;
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
            },"",function () {
                $scope.newKnow.isNewContent = -1 ;
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
                        $state.reload("KM.faq")
                    });
                    //保存成功，删除知识
                    KnowledgeService.batchIgnore.save({
                        "idList":$scope.parameter.idArr
                    },function(data){
                        if(data.status==200){
                           // layer.msg("文件忽略成功");

                        }
                        if(data.status==500){
                            layer.msg(data.info,{time:10000});
                        }

                    },function(err){
                        console.log(err);
                    });
                    //保存成功，删除知识--end


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
            params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!=""&&item!=null)) ;
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
            let channelUnique = false ;
            if($scope.newKnow.isNewContent==-1){  // 新增
                if($scope.newKnow.channel==130 && $scope.parameter.contents.length ){
                    channelUnique = true ;
                }else if (!$scope.parameter.contents.every(item=>item.channel!=$scope.newKnow.channel)) {
                    channelUnique = true ;
                }
            }else{
                let existChannel = $scope.parameter.contents.filter((item,index)=>index!=$scope.newKnow.isNewContent).map(item=>item.channel);
                if(($scope.newKnow.channel==130 && existChannel.length) || (existChannel.inArray($scope.newKnow.channel))){
                    channelUnique = true ;
                }
            }
            //判斷维度是否为空 0 不变 1 全维度
            if(!$scope.newKnow.content && !$scope.newKnow.channel){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.newKnow.content){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.newKnow.channel){
                layer.msg("请选择渠道后保存")
            }else if(channelUnique){
                layer.msg("添加渠道重复，请重新选择");
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

        //获取本地存储 知识学习
        function getNewKnowledgeLearningList(){
            var str = localStorageService.get("localStorageKey");
            var json = JSON.parse(str);
            console.log("本地存储的"+json);
            // {   "title":null,
            //     "extension":[
            //         {"question":"信用卡办理","id":"460141182823956489"},
            //         {"question":"咋办信用卡","id":"460141182823956490"},
            //         {"question":"我想办个信用卡","id":"460141182823956491"},
            //         {"question":"范德萨范德萨发","id":"460141182823956492"}
            //      ]
            // }
            $scope.parameter.title = json.title;
            var arr=json.extension;
            angular.forEach(arr,function(obj){
                $scope.parameter.idArr.push(obj.id);
                $scope.parameter.extensionQuestionList.push({"title":obj.question});
            });
            console.log("获取的"+$scope.parameter.title);
            console.log($scope.parameter.extensionQuestionList);
            console.log($scope.parameter.idArr);
        }

}])};