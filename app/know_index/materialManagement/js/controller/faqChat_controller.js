/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('faqChatController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams",function ($scope,$state,ngDialog,$cookieStore,$stateParams) {
        $state.go("materialManagement.faqChat");
        console.log($stateParams.scanDataList);
        $scope.vm = {
            userName :  $stateParams.scanDataList?$stateParams.scanDataList.chatKnowledgeModifier:$cookieStore.get("userName"),
            applicationId : $cookieStore.get("applicationId"),
            standardQuestion :  $stateParams.scanDataList?$stateParams.scanDataList.standardQuestion:null,   //标准问
            extendedQuestion : "",    //扩展问
            extendedQuestionArr : $stateParams.scanDataList?$stateParams.scanDataList.extendedQuestionArr:[],  //扩展问数组
            remove : remove ,
            weight : "60" ,         //  权重
            addExtension : addExtension ,  //添加扩展
            chatKnowledgeId : $stateParams.scanDataList?$stateParams.scanDataList.chatKnowledgeId:null,
            contentVal : "",
            contentArr : $stateParams.scanDataList?$stateParams.scanDataList.contentArr:[] ,
            addContentDialog : addContentDialog,// 添加知识内容
            save : save ,
            scan : scan,
            scanData : $stateParams.scanData,
            type : $stateParams.scanData?$stateParams.scanData.type:1,
            knowledgeEdit : knowledgeEdit,
        };
        function knowledgeEdit(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/faqChatDialogEdit.html",
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
        //擴展問
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.extendedQuestion , $scope.vm.extendedQuestionArr ,"chatQuestionContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkFAQChatQuestion",{
                    "chatQuestionContent" : $scope.vm.extendedQuestion
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion);
                        obj.chatQuestionType = angular.copy($scope.vm.weight);
                        $scope.vm.extendedQuestionArr.push(obj);
                        $scope.vm.extendedQuestion = "";
                        $scope.$apply();
                        console.log($scope.vm.extendedQuestionArr)
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })

            }
        }
        function addContentDialog(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/materialManagement/faq/addContentDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        addContent()
                    }
                }
            });
        }
        function addContent(){
            console.log();
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.contentVal , $scope.vm.contentArr ,"chatKnowledgeContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                httpRequestPost("/api/chatKnowledge/checkChatKnowledgeContent",{
                    "chatKnowledgeContent" : $scope.vm.contentVal
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                        $scope.vm.contentArr.push(obj);
                        $scope.vm.contentVal = "";
                        $scope.$apply();
                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    layer.msg("连接网路失败")
                })
            }

        }
       //刪除
        function remove(item,arr){
            arr.remove(item);
        }
        function saveScan(params){
            if(check()){
                httpRequestPost("/api/chatKnowledge/addFAQChatKnowledge",{
                    "chatKnowledgeId" : params.chatKnowledgeId?params.chatKnowledgeId:null,
                    "applicationId": params.applicationId,
                    "chatKnowledgeModifier": params.chatKnowledgeModifier,
                    "chatKnowledgeTopic": params.standardQuestion,
                    "chatQuestionList" : params.extendedQuestionArr,
                    "chatKnowledgeContentList" : params.contentArr,
                },function(data){
                    if(data.data==10004){
                        layer.msg("标准问重复")
                    }else{
                        $state.go("materialManagement.chatKnowledgeBase");
                    }
                },function(err){
                })
            }
        };
        //预览
        function scan(){
            //if(check()){    // 方便测试  后期放开
                var params = {
                    chatKnowledgeId : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                    standardQuestion : $scope.vm.standardQuestion,
                    extendedQuestionArr : $scope.vm.extendedQuestionArr,
                    contentArr : $scope.vm.contentArr,
                    applicationId: $scope.vm.applicationId,
                    chatKnowledgeModifier : $scope.vm.userName,
                    save : saveScan,
                    editUrl : "materialManagement.faqChat",
                    type : 1
                };
                $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:params});
            //}
        }
        //保存  0 无验证   1  需要验证
        function save(){
                if(check()){
                    httpRequestPost("/api/chatKnowledge/addFAQChatKnowledge",{
                        "chatKnowledgeId" : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                        "applicationId": $scope.vm.applicationId,
                        "chatKnowledgeModifier": $scope.vm.userName,
                        "chatKnowledgeTopic": $scope.vm.standardQuestion,
                        "chatQuestionList" : $scope.vm.extendedQuestionArr,
                        "chatKnowledgeContentList" : $scope.vm.contentArr,
                        "knoweledgeId" : $scope.vm.knoweledgeId
                    },function(data){
                        if(data.data==10004){
                            layer.msg("标准问重复")
                        }else{
                            $state.go("materialManagement.chatKnowledgeBase");
                        }
                    },function(err){

                    })
                }
            }

        //    判断重复
        function checkRepeat(val , arr ,prop){
            var result;
            if(arr.length==0){
                result = 0;
            }else{
                angular.forEach(arr,function(item){
                    if(item[prop]==val){
                        result = 1
                    }else{
                        result = 0
                    }
                })
            }
            return result
        }
        //验证 所有数据是否合格
        function check(){
            if($scope.vm.standardQuestion==""){
                layer.msg("标准问不能为空");
                return false
            }else if($scope.vm.extendedQuestionArr.length==0){
                layer.msg("扩展问不能为空");
                return false;
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空");
                return false
            }else{
                return true
            }
        }
    }
]);

