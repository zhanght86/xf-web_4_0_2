/**
 * Created by mileS on 2017/3/23.
 */

angular.module('businessModelingModule').controller('semanticExpressionConceptManageController', [
'$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            applicationId : $cookieStore.get("applicationId"),
            addSemanticExpression : addSemanticExpression,
            editSemanticExpression : editSemanticExpression,
            deleteSemanticExpression:deleteSemanticExpression,
            listData : "",   // table 数据
            singleDelSemanticExpressionConcept : singleDelSemanticExpressionConcept,    //單條刪除
            singleAddSemanticExpressionConcept : singleAddSemanticExpressionConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchSemanticExpressionConcept : searchSemanticExpressionConcept,
            searchVal : "",
            searchType : "semanticExpressionConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            synonym: "" ,
            modifier: $cookieStore.get("userId"),
            term: "",
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            current:1,
            percent:"%",
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            synonymBeyondLimit:"同义概念不能超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000",
            downloadTemplate:downloadTemplate,
            exportAll:exportAll,
            batchUpload:batchUpload
        };

        /**
         * 加载分页条
         * @type
         */
        loadSemanticExpressionConceptTable(1);
        //请求列表
        function loadSemanticExpressionConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/listByAttribute",{
                "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSemanticExpressionConcept(current,data);
            },function(){
                layer.msg("请求失败");
            })
        }
        function loadSemanticExpressionConcept(current,data){
            $scope.vm.listData = data.data;
            $scope.vm.current=current;
            $scope.vm.paginationConf = {
                currentPage: current,//当前页
                totalItems: data.total, //总条数
                pageSize: $scope.vm.pageSize,//第页条目数
                pagesLength: 8,//分页框数量
            };
            $scope.$apply();
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    loadSemanticExpressionConceptTable(current);
                }, 100)
            }
        },true);

        //编辑
        function editSemanticExpression(item){
            $scope.vm.dialogTitle="编辑语义表达概念";
            $scope.vm.key = item.semanticExpressionConceptKey;
            $scope.vm.synonym = item.semanticExpressionSynonymConcept;
            $scope.vm.term =  item.semanticExpressionConceptTerm;
            addSemanticExpressionConceptDialog(singleEditSemanticExpressionConcept,item);
        }
        function searchSemanticExpressionConcept(){
            if($scope.vm.searchType == "semanticExpressionConceptModifier"){
                searchSemanticExpressionConceptByUser();
            }else{
                searchSemanticExpressionConceptByType();
            }
        }
        //查询
        function searchSemanticExpressionConceptByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/listByModifier",{
                "semanticExpressionConceptModifier":$scope.vm.searchVal,
                "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSemanticExpressionConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchSemanticExpressionConceptByType(){
            var request = new Object();
            request.semanticExpressionConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "semanticExpressionConceptModifyTime"){
                request=switchSemanticExpressionConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/listByAttribute",request,function(data){
                loadSemanticExpressionConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息")
            });
        }

        /**
         * 转换查询类型
         * @param request
         * @param value
         * @returns {*}
         */
        function switchSemanticExpressionConceptSearchType(request,value){
            if($("#searchType").val()=="semanticExpressionConceptKey"){
                request.semanticExpressionConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="semanticExpressionConceptTerm"){
                request.semanticExpressionConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="semanticExpressionSynonymConcept"){
                request.semanticExpressionSynonymConcept=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addSemanticExpression(){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/semanticExpression/semanticExpressionConceptManageDialog.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        if(lengthCheck($scope.vm.key,0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                            return false;
                        }
                        httpRequestPost("/api/ms/modeling/concept/semanticexpression/repeatCheck", {
                            "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                            "semanticExpressionConceptKey": $scope.vm.key
                        }, function (data) {          //类名重複
                            if (data.status === 10002) {
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/semanticexpression/listByAttribute", {
                                        "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                                        "semanticExpressionConceptKey": $scope.vm.key,
                                        "index": 0,
                                        "pageSize": 1
                                    }, function (data) {
                                        $scope.vm.dialogTitle = "编辑语义表达概念";
                                        console.log(data);
                                        addSemanticExpressionConceptDialog(singleEditSemanticExpressionConcept, data.data[0]);
                                        $scope.vm.key = data.data[0].semanticExpressionConceptKey;
                                        $scope.vm.term = data.data[0].semanticExpressionConceptTerm;
                                        $scope.vm.synonym = data.data[0].semanticExpressionSynonymConcept;
                                    }, function () {
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            } else {
                                //类名无冲突
                                $scope.vm.dialogTitle = "增加语义表达概念";
                                $scope.vm.term = "";
                                $scope.vm.synonym = "";
                                addSemanticExpressionConceptDialog(singleAddSemanticExpressionConcept);
                            }
                        }, function () {
                            layer.msg("添加失败")
                        });
                    } else {
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.synonym = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#semanticExpressionKey").blur(function(){
                        if(lengthCheck($("#semanticExpressionKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addSemanticExpressionConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/semanticExpression/semanticExpressionConceptManageDialog2.html",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        if(lengthCheck($scope.vm.key,0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                            return false;
                        }
                        if($scope.vm.synonym!=""){
                            if(lengthCheck($scope.vm.synonym,0,50)==false){
                                $("#synonymAddError").html($scope.vm.synonymBeyondLimit);
                                return false;
                            }
                        }
                        var obj = $("#term").next();
                        var term = "";
                        var length = obj.find("li").length;
                        if(length<=0){
                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
                            return false;
                        }else{
                            $("#termAddError").html('');
                        }
                        $.each(obj.find("li"),function(index,value){
                            if(index>0){
                                $.each($(value).find("div"),function(index1,value1){
                                    if(index1==1){
                                        term+=$(value1).html()+$scope.vm.termSpliter;
                                    }
                                });
                            }
                        });
                        term=term.substring(0,term.length-1);
                        $scope.vm.term=term;
                        if(lengthCheck(term,0,500)==false){
                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
                            return false;
                        }else{
                            $("#termAddError").html('');
                        }
                        callback(item);
                    } else {
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.synonym = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#semanticExpressionKeyTwo").blur(function(){
                        if(lengthCheck($("#semanticExpressionKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                    $("#semanticExpressionSynonymConcept").blur(function(){
                        if(nullCheck($("#semanticExpressionSynonymConcept").val())==true){
                            if(lengthCheck($("#semanticExpressionSynonymConcept").val(),0,50)==false){
                                $("#synonymAddError").html($scope.vm.synonymBeyondLimit);
                            }else{
                                $("#synonymAddError").html('');
                            }
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSemanticExpression(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/conceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelSemanticExpressionConcept(id)
                    }
                }
            });
        }
        //批量导入
        function batchUpload(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/batchUpload.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    //refresh
                    loadSemanticExpressionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/concept/semanticexpression/batchAdd?applicationId='+$scope.vm.applicationId+'&modifierId='+$scope.vm.modifier);
                }, 100);
            }
        }
        //編輯事件
        function singleEditSemanticExpressionConcept(item){
            assembleSemanticExpressionConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/update",{
                "semanticExpressionConceptId":item.semanticExpressionConceptId,
                "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "semanticExpressionConceptKey":  $scope.vm.key,
                "semanticExpressionSynonymConcept":  $scope.vm.synonym,
                "semanticExpressionConceptModifier": $scope.vm.modifier,
                "semanticExpressionConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadSemanticExpressionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddSemanticExpressionConcept(){
            assembleSemanticExpressionConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/add",{
                "semanticExpressionConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "semanticExpressionConceptKey":  $scope.vm.key,
                "semanticExpressionSynonymConcept":  $scope.vm.synonym,
                "semanticExpressionConceptModifier": $scope.vm.modifier,
                "semanticExpressionConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadSemanticExpressionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条刪除
        function singleDelSemanticExpressionConcept(id){
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/delete",{
                "semanticExpressionConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadSemanticExpressionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term.split($scope.vm.termSpliter);
                console.log(terms);
                $("#term").tagEditor({
                    initialTags:terms,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
                    forceLowercase: false
                });
            }
        }
        //组装term数据
        function assembleSemanticExpressionConceptTerm(){
            var obj = $("#term").next();
            var term = "";
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term+=$(value1).html()+$scope.vm.termSpliter;
                        }
                    });
                }
            });
            term=term.substring(0,term.length-1);
            $scope.vm.term=term;
        }
        //返回状态显示
        function responseView(data){
            $scope.vm.key = "";
            $scope.vm.term = "";
            $scope.vm.synonym = "";
            if(data==null){
                return false;
            }
            layer.msg(data.info);
            if(data.status==$scope.vm.success){
                console.log("===success===");
                return true;
            }
            return false;
        }
        function downloadTemplate(){
            downloadFile("/api/ms/modeling/download","","semantic_expression_concept_template.xlsx");
        }
        function exportAll(){
            httpRequestPost("/api/ms/modeling/concept/semanticexpression/export",{
                "semanticExpressionConceptApplicationId":$scope.vm.applicationId
            },function(data){
                if(responseView(data)==true){
                    for(var i=0;i<data.exportFileNameList.length;i++){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[i]);
                    }
                }
            });
        }
    }
]);
