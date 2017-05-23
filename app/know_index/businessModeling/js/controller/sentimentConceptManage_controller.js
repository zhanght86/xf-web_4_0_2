/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('sentimentConceptManageController', [
'$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            applicationId : $cookieStore.get("applicationId"),
            addSentiment : addSentiment,
            editSentiment : editSentiment,
            deleteSentiment:deleteSentiment,
            listData : "",   // table 数据
            singleDelSentimentConcept : singleDelSentimentConcept,    //單條刪除
            singleAddSentimentConcept : singleAddSentimentConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchSentimentConcept : searchSentimentConcept,
            searchVal : "",
            searchType : "sentimentConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: $cookieStore.get("userId"),
            term: "",
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            current:1,
            percent:"%",
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000"
        };

        /**
         * 加载分页条
         * @type
         */
        loadSentimentConceptTable(1);
        //请求列表
        function loadSentimentConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/sentiment/listByAttribute",{
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSentimentConcept(current,data);
            },function(){
                layer.msg("请求失败");
            })
        }
        function loadSentimentConcept(current,data){
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
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                loadSentimentConceptTable(current);
            }
        });
        //编辑
        function editSentiment(item){
            $scope.vm.dialogTitle="编辑情感概念";
            $scope.vm.key = item.sentimentConceptKey;
            $scope.vm.term =  item.sentimentConceptTerm;
            addSentimentConceptDialog(singleEditSentimentConcept,item);
        }
        function searchSentimentConcept(){
            if($scope.vm.searchType == "sentimentConceptModifier"){
                searchSentimentConceptByUser();
            }else{
                searchSentimentConceptByType();
            }
        }
        //查询
        function searchSentimentConceptByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/ms/modeling/concept/sentiment/listByModifier",{
                "sentimentConceptModifier":$scope.vm.searchVal,
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSentimentConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchSentimentConceptByType(){
            var request = new Object();
            request.sentimentConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "sentimentConceptModifyTime"){
                request=switchSentimentConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/ms/modeling/concept/sentiment/listByAttribute",request,function(data){
                loadSentimentConcept($scope.vm.current,data);
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
        function switchSentimentConceptSearchType(request,value){
            if($("#searchType").val()=="sentimentConceptKey"){
                request.sentimentConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="sentimentConceptTerm"){
                request.sentimentConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addSentiment(){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/sentiment/sentimentConceptManageDialog.html",
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
                        httpRequestPost("/api/ms/modeling/concept/sentiment/repeatCheck", {
                            "sentimentConceptApplicationId": $scope.vm.applicationId,
                            "sentimentConceptKey": $scope.vm.key
                        }, function (data) {          //类名重複
                            if (data.status === 10002) {
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/sentiment/listByAttribute", {
                                        "sentimentConceptApplicationId": $scope.vm.applicationId,
                                        "sentimentConceptKey": $scope.vm.key,
                                        "index": 0,
                                        "pageSize": 1
                                    }, function (data) {
                                        $scope.vm.dialogTitle = "编辑情感概念";
                                        console.log(data);
                                        addSentimentConceptDialog(singleEditSentimentConcept, data.data[0]);
                                        $scope.vm.key = data.data[0].sentimentConceptKey;
                                        $scope.vm.term = data.data[0].sentimentConceptTerm;
                                    }, function () {
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            } else {
                                //类名无冲突
                                $scope.vm.dialogTitle = "增加情感概念";
                                $scope.vm.term = "";
                                addSentimentConceptDialog(singleAddSentimentConcept);
                            }
                        }, function () {
                            layer.msg("添加失败")
                        })
                    } else {
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#sentimentKey").blur(function(){
                        if(lengthCheck($("#sentimentKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addSentimentConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/sentiment/sentimentConceptManageDialog2.html",
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
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#sentimentKeyTwo").blur(function(){
                        if(lengthCheck($("#sentimentKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSentiment(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/conceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelSentimentConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditSentimentConcept(item){
            assembleSentimentConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/sentiment/update",{
                "sentimentConceptId":item.sentimentConceptId,
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "sentimentConceptKey":  $scope.vm.key,
                "sentimentConceptModifier": $scope.vm.modifier,
                "sentimentConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddSentimentConcept(){
            assembleSentimentConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/sentiment/add",{
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "sentimentConceptKey":  $scope.vm.key,
                "sentimentConceptModifier": $scope.vm.modifier,
                "sentimentConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条刪除
        function singleDelSentimentConcept(id){
            httpRequestPost("/api/ms/modeling/concept/sentiment/delete",{
                "sentimentConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
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
        function assembleSentimentConceptTerm(){
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
    }
]);
