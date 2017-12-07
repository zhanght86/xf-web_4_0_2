/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :对话知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('DialogueNewController', [
        '$scope', 'localStorageService',"KnowledgeService" ,"$state" ,"ngDialog","$cookieStore","$timeout","knowledgeAddServer","$window","$stateParams","$interval","$filter",
        ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,knowledgeAddServer,$window,$stateParams,$interval,$filter) =>{

            $scope.vm = {
                knowledgeId : $stateParams.knowledgeId?$stateParams.knowledgeId:"" ,// 知识id
                selectNodeVal : "" , //弹框选择的节点名称
                recommendKnow : [] , // 机器人回复 输入搜索
                flowKnowledgeContentList : [] , // 流程
                isFactorKnow : false, // 是否为要素知识
                newIndex : null ,// 新建节点位置
                isEditIndex : null ,
                botRoot : "" ,// root bot
                disabled : {
                    "background" : "#eee"
                } ,
                relatedIndex : null , //
//------------------       val  ---------------------------------------------------
                triggerKnowledge : "" , // 机器人回复标题
                triggerKnowTitle : "", // 触发要素标题
                actionType : 0, // 后续动作类型
                triggerCondition : 0,  //触发条件
                nodeName : "" , // 节点名称
                strikeNumber : "" , // 触发次数
                botVal : ""  ,// bot
                factorContent : [] ,  // 要素之时 内容
                knowJump : [{
                    answer :  "",
                    nodeNo : null
                }],
                removeAutoList:removeAutoList ,
//----------------------            method    ---------------------------------------------------
                openSelectNodeDialog : openSelectNodeDialog , // 打开选择节点弹框
                //processList : [] , // 所有流程
                moveUp : moveUp ,// 向下移动
                moveDown : moveDown ,// 向下移动
                storeNewProcess : storeNewProcess ,// 新增一个流程
                addNewKnow : addNewKnow ,// 添加新知识
                selectKnowTitle : selectKnowTitle, // 选择知识标题
                editNode : editNode, // 编辑节点
                resetParams : resetParams ,//重置参数
                bindingNodeChange : bindingNodeChange , // 已绑定节点的移动
                newNode : newNode ,// 新建节点
                inputBlur : inputBlur,
                deleteNode : deleteNode

            };
            //删除节点
            function deleteNode(index,num,type){
                var layerDialog = layer.confirm('是否要删除？',{
                    btn:['确定','取消']
                },function(){
                    console.log(111);
                    $scope.$apply(function () {
                        $scope.vm.flowKnowledgeContentList.splice(index,num);
                    });
                    bindingNodeChange(type,index);
                    layer.close(layerDialog)
                },function(){

                });

            }

            //失去焦点
            function inputBlur(){
                $timeout(function(){
                    if($scope.vm.triggerCondition==3){
                        $scope.vm.triggerCondition=0;
                    }
                },200);
            }
            // 编辑知识
            (function(id){
                //隱藏
                // $(".right_popup_div").show();
                // $(".arrow").removeClass("act");
                if(id){
                    $http.get("api/ms/flowKnowledge/"+id).then(function(response){
                        var data = response.data.data ;
                        var list = data.flowKnowledgeContentList ;
                        angular.forEach(list,function(item,index){
                            //"triggerKnowledgeOfTitle": triggerKnowledgeOfTitle,  //----机器人回复知识标题title
                            //"triggerValueOfTitle": triggerValueOfTitle ,// ----bot 或知识name
                            if(item.triggerType==1){  // bot
                                list[index].triggerValueOfTitle = item.className.join(",").replace(/\,/g,"/");
                                list[index].triggerKnowledgeOfTitle = item.knowledge!=null?item.knowledge.knowledgeTitle:"" ;
                            }else if(item.triggerType==2){
                                list[index].triggerValueOfTitle = item.knowledge.knowledgeTitle ;
                                list[index].triggerKnowledgeOfTitle = "" ;
                            }else if(item.triggerType==3){
                                list[index].triggerValueOfTitle = "" ;
                                list[index].triggerKnowledgeOfTitle = item.knowledge.knowledgeTitle ;
                            }
                            if(item.knowledge != null){
                                list[index].knowType = item.knowledge.knowledgeType;
                            }else{
                                list[index].knowType = null ;
                            }
                        }) ;
                        $scope.vm.flowKnowledgeContentList = list ;
                        // 隱藏
                        $(".right_popup_div").hide();
                        $(".arrow").removeClass("act");
                    })
                }else{
                    $(".right_popup_div").show();
                    $(".arrow").removeClass("act");
                }
            })($scope.vm.knowledgeId) ;

            $(".trigger_know_title_key,.robot_key_words").bind("input focus",function(){
                var keyWords = $(this).val() ;
                httpRequestPost("/api/ms/knowledgeManage/getKnowledgeTitle",{
                    "applicationId":APPLICATION_ID ,
                    "title" : keyWords
                },function(response){
                    if(response.status == 200){
                        $scope.$apply(function(){
                            $scope.vm.recommendKnow = response.data
                        })
                    }
                },function(error){
                    console.log(error)
                })
            }) ;
            // 节点位置变动 引起的绑定 num 发生变化
            //@1 绑定name    ---- 较简单
            //@2 绑定 num    ---- 较复杂  temp
            function bindingNodeChange(type,index) {
                //    type 0 删除 ， 1 新增 ，2 上移 3 下移
                //    删除     --首尾删除，中间删除
                //    新增     --首尾新增，中间新增
                //    上移     --first --last
                //    下移     --first --last
                //$timeout(function(){
                var nodeLen = $scope.vm.flowKnowledgeContentList.length ; // 操作完之后 节点数量
                if(nodeLen == 1){  //2
                    angular.forEach($scope.vm.flowKnowledgeContentList[0].contentSubsequentList,function(item,cur){
                        $scope.vm.flowKnowledgeContentList[0].contentSubsequentList[cur].nodeNo = null ;
                    })
                }
                else if(nodeLen >= 2){
                    if(type == 0){
                        angular.forEach($scope.vm.flowKnowledgeContentList,function(process,processCur){
                            angular.forEach(process.contentSubsequentList,function(item,itemCur){
                                if(item.nodeNo==null ){
                                    return true ;
                                }
                                var nodeNumber = null ;
                                var number = parseInt(item.nodeNo) ;
                                if(number > index){
                                    nodeNumber = number - 1 ;
                                }else if(number < index){
                                    nodeNumber = number  ;
                                }
                                $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = nodeNumber;
                            }) ;
                        })
                    }else if(type == 1){
                        angular.forEach($scope.vm.flowKnowledgeContentList,function(process,processCur){
                            angular.forEach(process.contentSubsequentList,function(item,itemCur){
                                if(item.nodeNo==null ){
                                    return true ;
                                }
                                var number =  parseInt(item.nodeNo) ;
                                if(number >= index){
                                    $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = number + 1;
                                }
                            }) ;
                        })
                    }else if(type == 2){ //index , index-1  两个位置变动了
                        var movingIndex = index,movedIndex = index-1 ;
                        angular.forEach($scope.vm.flowKnowledgeContentList,function(process,processCur){
                            angular.forEach(process.contentSubsequentList,function(item,itemCur){
                                if(item.nodeNo==null ){
                                    return true ;
                                }
                                var number =  parseInt(item.nodeNo) ;
                                if(number == movingIndex){
                                    $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = movedIndex;
                                }else if(number == movedIndex){
                                    $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = movingIndex;
                                }
                            }) ;
                        })
                    }else if(type == 3){ //index , index+1  两个位置变动了
                        var movingIndex = index,movedIndex = index+1;
                        angular.forEach($scope.vm.flowKnowledgeContentList,function(process,processCur){
                            angular.forEach(process.contentSubsequentList,function(item,itemCur){
                                if(item.nodeNo==null ){
                                    return true ;
                                }
                                var number =  parseInt(item.nodeNo) ;
                                if(number == movingIndex){
                                    $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = movedIndex;
                                }else if(number == movedIndex){
                                    $scope.vm.flowKnowledgeContentList[processCur].contentSubsequentList[itemCur].nodeNo = movingIndex;
                                }
                            }) ;
                        })
                    }
                }
                console.log($scope.vm.flowKnowledgeContentList)
                //})
            }
//-------------------------------------------------------------------------
            function moveUp(index){
                var temp = angular.copy($scope.vm.flowKnowledgeContentList[index]) ;
                $scope.vm.flowKnowledgeContentList.splice(index,1) ;
                $scope.vm.flowKnowledgeContentList.insert(index-1,temp) ;
                bindingNodeChange(2,index)
            }
            function moveDown(index){
                var temp = angular.copy($scope.vm.flowKnowledgeContentList[index]) ;
                $scope.vm.flowKnowledgeContentList.splice(index,1) ;
                $scope.vm.flowKnowledgeContentList.insert(index+1,temp) ;
                bindingNodeChange(3,index)
            }
            function newNode(index){
                //type  0 上方 1 下方
                resetParams() ;
                $(".right_popup_div").show();
                $(".arrow").removeClass("act");
                $scope.vm.newIndex = index ;
            }
            // 获取要素知识内容
            function getFactorContent(id){
                $scope.vm.factorContent = [] ;
                $http.get('api/ms/knowledgeManage/getKnowledgeContent/'+id).then(function(response){
                    $scope.vm.factorContent = [] ;
                    angular.forEach(angular.fromJson(response.data.data[0].knowledgeContent).items,function(item,index){
                        $scope.vm.factorContent.push({
                            answer : item.name ,
                            nodeNo : null
                        })
                    }) ;
                })
            }
            // 保存知识
            function addNewKnow(){
                var api = $scope.vm.knowledgeId?"api/ms/flowKnowledge/edit":"/api/ms/flowKnowledge/add" ;
                angular.forEach($scope.vm.flowKnowledgeContentList,function(item,index){
                    // nodeNo 参数
                    $scope.vm.flowKnowledgeContentList[index].nodeNo = index;
                    // 删除多余属性
                    //delete $scope.vm.flowKnowledgeContentList[index].triggerKnowledgeOfTitle ;
                    //delete $scope.vm.flowKnowledgeContentList[index].triggerValueOfTitle ;
                }) ;
                var params= {
                    "applicationId": APPLICATION_ID,
                    "knowledgeTitle" : $scope.vm.flowKnowledgeContentList[0].nodeName ,
                    "knowledgeCreator": USER_LOGIN_NAME , //操作人
                    "flowKnowledgeContentList": $scope.vm.flowKnowledgeContentList , //节点集合
                    "userId" : USER_ID
                } ;
                if($scope.vm.knowledgeId){
                    params.knowledgeId = $scope.vm.knowledgeId
                }
                console.log(params) ;
                //return ;
                httpRequestPost(api,params,function(response){
                    if(response.status == 200){
                        //var layDialog = layer.confirm('是跳转到知识总览页面？', {
                        //     btn: ['是','继续添加'] //按钮
                        // }, function(){
                        //     layer.close(layDialog) ;
                        $state.go("knowledgeManagement.custOverview") ;
                        //}, function(){
                        //   $state.reload()
                        //});
                    }else if(response.status == 500){
                        layer.msg(response.data)
                    }
                })
            }
            // 保存节点
            function storeNewProcess(editIndex){
                console.log(editIndex);
                if(!$scope.vm.nodeName){  // 节点名称必须
                    return layer.msg("请输入节点名称")
                }
                // 触发条件 1 bot ；2 知识   后续动作
                var isRepeat ,curIndex;
                angular.forEach($scope.vm.flowKnowledgeContentList,function(item,index){
                    if($scope.vm.nodeName == item.nodeName && editIndex !=index){
                        isRepeat = true ;
                        return layer.msg("节点名称重复")
                    }
                }) ;
                if(isRepeat){
                    return ;
                }
                //      触发条件                    机器人回复
                var strikeValue = "",           triggerKnowledge = "",contentSubsequentList = [],strikeNumber = 1;
                var triggerValueOfTitle = "" , triggerKnowledgeOfTitle = "" ,triggerType = 3 ;   //  不需字段页面判断
                var knowType = null ; // 知识类型
                if($scope.vm.isFactorKnow){
                    knowType = 103 ;
                }
                if($scope.vm.triggerCondition == 1 && $scope.vm.strikeValue.id && $scope.vm.strikeValue.name){
                    triggerType = 1 ;
                    strikeNumber = $scope.vm.strikeNumber ;
                    strikeValue = $scope.vm.strikeValue.id ;
                    triggerValueOfTitle = $scope.vm.strikeValue.name ;
                }else if($scope.vm.triggerCondition == 2 && $scope.vm.triggerKnowTitle.id  && $scope.vm.triggerKnowTitle.name){
                    triggerType = 2 ;
                    strikeNumber = 1 ;
                    strikeValue = $scope.vm.triggerKnowTitle.id ;
                    triggerValueOfTitle = $scope.vm.triggerKnowTitle.name ;
                }
                //机器人回复
                if($scope.vm.triggerKnowledge.name && $scope.vm.triggerKnowledge.id){
                    triggerKnowledgeOfTitle =  $scope.vm.triggerKnowledge.name;
                    triggerKnowledge = $scope.vm.triggerKnowledge.id
                }
                if($scope.vm.actionType == 0){
                    contentSubsequentList.push({
                        "answer": "等待用户输入",
                        "nodeNo": null
                    })
                }else if($scope.vm.actionType == 1){
                    contentSubsequentList = $scope.vm.factorContent
                }else if($scope.vm.actionType == 2){
                    contentSubsequentList = $scope.vm.knowJump
                }
                if($scope.vm.newIndex!=null){
                    curIndex = $scope.vm.newIndex
                }else{
                    curIndex = $scope.vm.flowKnowledgeContentList.length
                }
                // 需保存的参数
                var storeParams  = {
                    "nodeName": $scope.vm.nodeName,
                    "triggerType": triggerType,
                    "triggerValue": strikeValue,   // bot 或知识id
                    "triggerValueOfTitle": triggerValueOfTitle ,// ----bot 或知识name
                    "triggerNum": strikeNumber,  //触发次数
                    "triggerKnowledge": triggerKnowledge,  //机器人回复知识标题id
                    "triggerKnowledgeOfTitle": triggerKnowledgeOfTitle,  //----机器人回复知识标题title
                    "actionType": $scope.vm.actionType,   //后续动作类型
                    "contentSubsequentList": contentSubsequentList,
                    "knowType":knowType
                };
                console.log(storeParams);
                var storeParamsCopy = angular.copy(storeParams) ;
                if(editIndex!=null){
                    $scope.vm.flowKnowledgeContentList[editIndex] = storeParamsCopy ;
                }else{
                    $scope.vm.flowKnowledgeContentList.insert(curIndex,storeParamsCopy) ;
                    bindingNodeChange(1,curIndex) ;
                }
                // 重置参数
                resetParams() ;
                $(".right_popup_div").hide();
                $(".arrow").removeClass("act");
            }
            // 选择知识标题
            function selectKnowTitle(know,title){
                // 要素知识 添加知识内容
                if(know.knowledgeType == 103){
                    $scope.vm.isFactorKnow = true ;
                    getFactorContent(know.knowledgeId)
                }else{
                    $scope.vm.isFactorKnow = false ;
                    $scope.vm.factorContent = item.contentSubsequentList ;
                }
                $scope.vm[title]={
                    id :know.knowledgeId ,
                    name : know.knowledgeTitle
                } ;
                $scope.vm.recommendKnow = [] ;
            }
            function editNode(item,index){
                // $(".container").animate({
                //     'scrollTop':0
                // },200);
                console.log(item) ;
                var factorKnowId ;
                $scope.vm.relatedIndex = index ;
                $scope.vm.isEditIndex = index ;
                //触发
                if(item.triggerType == 1){  // bot
                    $scope.vm.triggerCondition = 1 ;
                    $scope.vm.strikeValue={
                        id : item.triggerValue ,
                        name : item.triggerValueOfTitle
                    } ;
                    $scope.vm.triggerKnowTitle = {
                        id : "" ,
                        name : ""
                    } ;
                }else if(item.triggerType == 2){  // 知识
                    $scope.vm.triggerCondition=2 ;
                    $scope.vm.strikeValue={
                        id : "" ,
                        name : ""
                    } ;
                    $scope.vm.triggerKnowTitle = {
                        id : item.triggerValue ,
                        name : item.triggerValueOfTitle
                    } ;
                    factorKnowId =  item.triggerValue ;
                }else if(item.triggerType == 3){  // 机器人回复知识  无触发条件
                    $scope.vm.triggerCondition = 0 ;
                    $scope.vm.triggerKnowTitle = {
                        id : "" ,
                        name : ""
                    } ;
                    $scope.vm.strikeValue={
                        id : "" ,
                        name : ""
                    } ;
                }
                if(item.triggerKnowledge){
                    factorKnowId = item.triggerKnowledge ;
                }
                // 要素知识 查询知识内容
                if(item.knowType == 103 &&  item.actionType != 1){
                    $scope.vm.isFactorKnow = true ;
                    getFactorContent(factorKnowId)
                }else if(item.knowType == 103 &&  item.actionType == 1){
                    $scope.vm.isFactorKnow = true ;

                }else{
                    $scope.vm.isFactorKnow = false;
                }
                //机器人回复
                $scope.vm.triggerKnowledge = {
                    id : item.triggerKnowledge ,
                    name : item.triggerKnowledgeOfTitle
                } ;
                console.log($scope.vm.triggerKnowledge,$scope.vm.triggerKnowTitle) ;
                // 后续动作
                if(item.actionType == 1){
                    // $scope.vm.isFactorKnow = true ;
                    $scope.vm.factorContent = item.contentSubsequentList
                }else if(item.actionType == 2){
                    // $scope.vm.isFactorKnow = false ;
                    $scope.vm.knowJump = item.contentSubsequentList
                }
                // else{
                //     $scope.vm.isFactorKnow = false ;
                // }

                $scope.vm.nodeName = item.nodeName ; // 节点名称
                $scope.vm.strikeNumber = item.triggerNum ; // 触发次数
                // $scope.vm.triggerCondition = item.triggerType;  //触发条件
                $scope.vm.triggerType = item.triggerType;  //触发条件
                $scope.vm.actionType = item.actionType;  //触发条件
            }
            function resetParams(){
                console.log("------重置参数------") ;
                $scope.vm.relatedIndex = null ;
                $scope.vm.isEditIndex = null ; // 编辑索引
                $scope.vm.newIndex = null ; // 重置 新建节点位置
                $scope.vm.selectNodeVal = "" ; //弹框选择的节点名称
                $scope.vm.isFactorKnow = false; // 是否为要素知识
                $scope.vm.triggerKnowledge = "" ; // 机器人回复标题
                $scope.vm.triggerKnowTitle = ""; // 触发要素标题
                $scope.vm.actionType = 0; // 后续动作类型
                $scope.vm.triggerCondition = 0;  //触发条件
                $scope.vm.nodeName = "" ; // 节点名称
                $scope.vm.strikeNumber = "" ; // 触发次数
                $scope.vm.botVal = ""  ;// bot
                $scope.vm.factorContent = [] ;  // 要素之时 内容
                $scope.vm.knowJump = [{
                    answer : "",
                    nodeNo : null
                }];
                $scope.vm.strikeValue = "" ;
                $scope.vm.triggerKnowTitle = "" ;
                $scope.vm.triggerKnowledge = "" ;
                $("#knowTitle").val("") ;
            }
            function removeAutoList(){
                $timeout(function(){
                    $scope.vm.recommendKnow=[] ;
                },200)
            }
            //    ------------------------           init   bot   -----------------------------
            $scope.master.botTreeOperate($scope, "/api/ms/modeling/category/listbycategorypid", "/api/ms/modeling/category/listbycategorypid", function (id) {
                httpRequestPost("/api/ms/modeling/category/getcategoryfullname", {
                    categoryId: id
                }, function (data) {
                    console.log(data);
                    if (data.status = 10000) {
                        $scope.$apply(function () {
                            $scope.vm.strikeValue = {
                                id: id,
                                name: data.categoryFullName
                            }
                        });
                    }
                })
            }, "", ".strikeRootClassfy") ;
            function openSelectNodeDialog(type,index,num){
                if(type==1){  //    跳转

                }else{ //    答案内容
                    $scope.vm.factorContent
                }
                // 触发次数
                if(index && num!=null){
                    $scope.vm.selectNodeVal = num ;
                }else{
                    $scope.vm.selectNodeVal = 0 ;
                }
                var dialog = ngDialog.openConfirm({
                    template: "/static/knowledgeManagement/processKnow/select_node.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            if(type==1){  //    跳转
                                $scope.vm.knowJump[0].nodeNo = $scope.vm.selectNodeVal
                            }else{ //    答案内容
                                $scope.vm.factorContent[index].nodeNo =  $scope.vm.selectNodeVal
                            }
                        }
                    }
                });
            }
        }])
};
