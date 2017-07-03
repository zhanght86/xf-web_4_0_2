/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('errorCorrectionConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            applicationId : $cookieStore.get("applicationId"),
            addCorrection : addCorrection,
            editCorrection : editCorrection,
            deleteCorrection:deleteCorrection,
            listData : "",   // table 数据
            singleDelCorrectionConcept : singleDelCorrectionConcept,    //單條刪除
            singleAddCorrectionConcept : singleAddCorrectionConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchCorrectionConcept : searchCorrectionConcept,
            searchVal : "",
            searchType : "correctionConceptKey",
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
            percent:"%",
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000",
            downloadTemplate:downloadTemplate,
            exportAll:exportAll,
            batchUpload:batchUpload,
            batchDelete:batchDelete
        };

        /**
         * 加载分页条
         * @type
         */
        loadCorrectionConceptTable(1);
        //请求列表
        function loadCorrectionConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/correction/listByAttribute",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadCorrectionConcept(current,data);
            },function(){
               // layer.msg("请求失败")
                console.log('请求失败');
            });
        }
        function loadCorrectionConcept(current,data){
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
                    if(nullCheck($scope.vm.searchVal)==true || (nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true)){
                        searchCorrectionConcept(current);
                    }else{
                        loadCorrectionConceptTable(current);
                    }
                }, 100);
            }
        },true);
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
                layer.msg("请选择要删除的记录！");
                return;
            }
            layer.confirm('确认要删除吗？', function () {
                var request = new Object();
                request.ids=id_array;
                httpRequestPost("/api/ms/modeling/concept/correction/batchDelete",request,function(data){
                    if(responseView(data)==true){
                        loadCorrectionConceptTable($scope.vm.paginationConf.currentPage);
                    }
                });
            });
        }
        //编辑
        function editCorrection(item){
            $scope.vm.dialogTitle="编辑纠错概念";
            $scope.vm.key = item.correctionConceptKey;
            $scope.vm.term =  item.correctionConceptTerm;
            addCorrectionConceptDialog(singleEditCorrectionConcept,item);
        }
        function searchCorrectionConcept(current){
            if($scope.vm.searchType == "correctionConceptModifier"){
                searchCorrectionConceptByUser(current);
            }else{
                searchCorrectionConceptByType(current);
            }
        }
        //查询
        function searchCorrectionConceptByUser(current){
            httpRequestPost("/api/ms/modeling/concept/correction/listByModifier",{
                "correctionConceptModifier":$scope.vm.searchVal,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadCorrectionConcept(current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchCorrectionConceptByType(current){
            var request = new Object();
            request.correctionConceptApplicationId=$scope.vm.applicationId;
            request.index=(current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "correctionConceptModifyTime"){
                request=switchCorrectionConceptSearchType(request,$scope.vm.searchVal);
            }else if(nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true){
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }else{
                layer.msg("请选择时间段");
                return;
            }
            httpRequestPost("/api/ms/modeling/concept/correction/listByAttribute",request,function(data){
                loadCorrectionConcept(current,data);
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
        function switchCorrectionConceptSearchType(request,value){
            if($("#searchType").val()=="correctionConceptKey"){
                request.correctionConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="correctionConceptTerm"){
                request.correctionConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addCorrection(){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog.html",
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
                        httpRequestPost("/api/ms/modeling/concept/correction/repeatCheck", {
                            "correctionConceptApplicationId": $scope.vm.applicationId,
                            "correctionConceptKey": $scope.vm.key
                        }, function (data) {          //类名重複
                            if (data.status === 10002) {
                                layer.confirm("您添加的概念类已经在   ，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/correction/listByAttribute", {
                                        "correctionConceptApplicationId": $scope.vm.applicationId,
                                        "correctionConceptKey": $scope.vm.key,
                                        "index": 0,
                                        "pageSize": 1
                                    }, function (data) {
                                        $scope.vm.dialogTitle = "编辑纠错概念";
                                        console.log(data);
                                        addCorrectionConceptDialog(singleEditCorrectionConcept, data.data[0]);
                                        $scope.vm.key = data.data[0].correctionConceptKey;
                                        $scope.vm.term = data.data[0].correctionConceptTerm;
                                    }, function () {
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            } else {
                                //类名无冲突
                                $scope.vm.dialogTitle = "增加纠错概念";
                                $scope.vm.term = "";
                                addCorrectionConceptDialog(singleAddCorrectionConcept);
                            }
                        }, function () {
                            //layer.msg("添加失败")
                            console.log('添加失败');
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
                    $("#correctionKey").blur(function(){
                        if(lengthCheck($("#correctionKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addCorrectionConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog2.html",
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
                    $("#correctionKeyTwo").blur(function(){
                        if(lengthCheck($("#correctionKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCorrection(id){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/conceptManageDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            singleDelCorrectionConcept(id)
                        }
                    }
                });
            }
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
                    loadCorrectionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/concept/correction/batchAdd?applicationId='+$scope.vm.applicationId+'&modifierId='+$scope.vm.modifier);
                }, 100);
            }
        }
        //編輯事件
        function singleEditCorrectionConcept(item){
            assembleCorrectionConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/correction/update",{
                "correctionConceptId":item.correctionConceptId,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": $scope.vm.modifier,
                "correctionConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadCorrectionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddCorrectionConcept(){
            assembleCorrectionConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/correction/add",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": $scope.vm.modifier,
                "correctionConceptTerm": $scope.vm.term
            },function(data){
                if(responseView(data)==true){
                    loadCorrectionConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条刪除
        function singleDelCorrectionConcept(id){
            httpRequestPost("/api/ms/modeling/concept/correction/delete",{
                "correctionConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadCorrectionConceptTable($scope.vm.paginationConf.currentPage);
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
        function assembleCorrectionConceptTerm(){
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
            clearSelectAll();
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
            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","","concept_template.xlsx");
        }
        function exportAll(){
            httpRequestPost("/api/ms/modeling/concept/correction/export",{
                "correctionConceptApplicationId":$scope.vm.applicationId
            },function(data){
                if(responseView(data)==true){
                    for(var i=0;i<data.exportFileNameList.length;i++){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[0]);
                    }
                }
            });
        }
    }
]);