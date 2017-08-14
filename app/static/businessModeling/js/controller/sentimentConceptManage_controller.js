/**
 * Created by mileS on 2017/3/23.
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
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            percent:"%",
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000",
            classify:490,
            strength:5,
            polar:0,
            batchUpload:batchUpload,
            exportAll:exportAll,
            batchDelete:batchDelete,
            downloadTemplate:downloadTemplate
        };

        /**
         * 加载分页条
         * @type
         */
        loadSentimentConceptTable(1);
        //请求列表
        function loadSentimentConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/listByAttribute",{
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSentimentConcept(current,data);
            },function(){
               // layer.msg("请求失败");
                console.log('请求失败');
            })
        }
        function loadSentimentConcept(current,data){
            clearSelectAll();
            $scope.vm.listData = data.data;
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
                    if(nullCheck($("#sentimentConceptClassify").val())==true || nullCheck($scope.vm.searchVal)==true || (nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true)){
                        searchSentimentConcept(current);
                    }else{
                        loadSentimentConceptTable(current);
                    }
                }, 100);
            }
        },true);
        //编辑
        function editSentiment(item){
            $scope.vm.dialogTitle="编辑情感概念";
            $scope.vm.key = item.sentimentConceptKey;
            $scope.vm.classify =  item.sentimentConceptClassify;
            addSentimentConceptDialog(singleEditSentimentConcept,item);
        }
        function searchSentimentConcept(current){
            if($scope.vm.searchType == "sentimentConceptModifier"){
                searchSentimentConceptByUser(current);
            }else{
                searchSentimentConceptByType(current);
            }
        }
        //查询
        function searchSentimentConceptByUser(current){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/listByModifier",{
                "sentimentConceptModifier":$scope.vm.searchVal,
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSentimentConcept(current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchSentimentConceptByType(current){
            var request = new Object();
            request.sentimentConceptApplicationId=$scope.vm.applicationId;
            request.index=(current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "sentimentConceptModifyTime"){
                request=switchSentimentConceptSearchType(request,$scope.vm.searchVal);
            }else if(nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true){
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }else{
                layer.msg("请选择时间段");
                return;
            }
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/listByAttribute",request,function(data){
                loadSentimentConcept(current,data);
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
            }else if($("#searchType").val()=="sentimentConceptClassify"){
                request.sentimentConceptClassify=$("#sentimentConceptClassify").val();
            }else if($("#searchType").val()=="sentimentConceptStrength"){
                request.sentimentConceptStrength=value;
            }else if($("#searchType").val()=="sentimentConceptPolar"){
                request.sentimentConceptPolar=value;
            }
            return request;
        }

        //添加 窗口
        function addSentiment(){
            var dialog = ngDialog.openConfirm({
                template: "/static/businessModeling/sentiment/sentimentConceptManageDialog.html",
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
                        httpRequestPost("/api/ms/modeling/concept/poc/sentiment/repeatCheck", {
                            "sentimentConceptApplicationId": $scope.vm.applicationId,
                            "sentimentConceptKey": $scope.vm.key
                        }, function (data) {          //类名重複
                            if (data.status === 10002) {
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/poc/sentiment/listByAttribute", {
                                        "sentimentConceptApplicationId": $scope.vm.applicationId,
                                        "sentimentConceptKey": $scope.vm.key,
                                        "index": 0,
                                        "pageSize": 1
                                    }, function (data) {
                                        $scope.vm.dialogTitle = "编辑情感概念";
                                        console.log(data);
                                        addSentimentConceptDialog(singleEditSentimentConcept, data.data[0]);
                                        $scope.vm.key = data.data[0].sentimentConceptKey;
                                        $scope.vm.classify = data.data[0].sentimentConceptClassify;
                                        $scope.vm.strength = data.data[0].sentimentConceptStrength;
                                        $scope.vm.polar = data.data[0].sentimentConceptPolar;
                                    }, function () {
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            } else {
                                //类名无冲突
                                $scope.vm.dialogTitle = "增加情感概念";
                                $scope.vm.classify = "";
                                addSentimentConceptDialog(singleAddSentimentConcept);
                            }
                        }, function () {
                            console.log('添加失败');
                        })
                    } else {
                        $scope.vm.key = "";
                        $scope.vm.classify = 490;
                        $scope.vm.strength = 5;
                        $scope.vm.polar = 0;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
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
                template: "/static/businessModeling/sentiment/sentimentConceptManageDialog2.html",
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
                        callback(item);
                    } else {
                        $scope.vm.key = "";
                        $scope.vm.classify = 490;
                        $scope.vm.strength = 5;
                        $scope.vm.polar = 0;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
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
                template:"/static/businessModeling/conceptManageDialog.html",
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
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/update",{
                "sentimentConceptId":item.sentimentConceptId,
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "sentimentConceptKey":  $scope.vm.key,
                "sentimentConceptModifier": $scope.vm.modifier,
                "sentimentConceptClassify": $scope.vm.classify,
                "sentimentConceptStrength": $scope.vm.strength,
                "sentimentConceptPolar": $scope.vm.polar
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddSentimentConcept(){
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/add",{
                "sentimentConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "sentimentConceptKey":  $scope.vm.key,
                "sentimentConceptModifier": $scope.vm.modifier,
                "sentimentConceptClassify": $scope.vm.classify,
                "sentimentConceptStrength": $scope.vm.strength,
                "sentimentConceptPolar": $scope.vm.polar
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条刪除
        function singleDelSentimentConcept(id){
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/delete",{
                "sentimentConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
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
        function exportAll(){
            httpRequestPost("/api/ms/modeling/concept/poc/sentiment/export",{
                "sentimentConceptApplicationId":$scope.vm.applicationId
            },function(data){
                if(responseView(data)==true){
                    for(var i=0;i<data.exportFileNameList.length;i++){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[0]);
                    }
                }
            });
        }
        //批量导入
        function batchUpload(){
            var dialog = ngDialog.openConfirm({
                template:"/static/businessModeling/batchUpload.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    //refresh
                    loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/concept/poc/sentiment/batchAdd?applicationId='+$scope.vm.applicationId+'&modifierId='+$scope.vm.modifier);
                }, 100);
            }
        }
        function downloadTemplate(){
            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","","sentiment_concept_template.xlsx");
        }
        //全选
        $("#selectAll").on("click",function(){
            var ids = document.getElementsByName("sid");
            var flag = false;
            if(this.checked){
                flag = true;
            }
            $.each(ids,function(index,value){
                if(flag){
                    $(value).attr("checked",true);
                    $(value).prop("checked",true);
                }else{
                    $(value).attr("checked",false);
                    $(value).prop("checked",false);
                }
            });
        });
        //清空全选
        function clearSelectAll(){
            console.log("=====clearSelectAll=====");
            $("#selectAll").attr("checked",false);
            $("#selectAll").prop("checked",false);
        }
        //批量删除
        function batchDelete(){
            var ids = document.getElementsByName("sid");
            var id_array = [];
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].checked) {
                    id_array.push(ids[i].value);
                }
            }
            if (id_array.length == 0) {
                layer.msg("请选择要删除的记录！",{time:1000});
                return;
            }
            layer.confirm('确认要删除吗？', function (index) {
                layer.close(index);
                var request = new Object();
                request.ids=id_array;
                httpRequestPost("/api/ms/modeling/concept/poc/sentiment/batchDelete",request,function(data){
                    if(responseView(data)==true){
                        loadSentimentConceptTable($scope.vm.paginationConf.currentPage);
                    }
                });
            });
        }
    }
]);
