/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('disableConceptManageController', [
'$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            addStop : addStop,
            editStop : editStop,
            deleteStop:deleteStop,
            listData : "",   // table 数据
            singleDelStopConcept : singleDelStopConcept,    //單條刪除
            singleAddStopConcept : singleAddStopConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchStopConcept : searchStopConcept,
            searchVal : "",
            searchType : "stopConceptKey",
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
        loadStopConceptTable(1);
        //请求列表
        function loadStopConceptTable(current){
            httpRequestPost("/api/modeling/concept/stop/listByAttribute",{
                "stopConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadStopConcept(current,data);
            },function(){
                layer.msg("请求失败");
            })
        }
        function loadStopConcept(current,data){
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
                loadStopConceptTable(current);
            }
        });
        //编辑
        function editStop(item){
            $scope.vm.dialogTitle="编辑停用概念";
            $scope.vm.key = item.stopConceptKey;
            $scope.vm.term =  item.stopConceptTerm;
            addStopConceptDialog(singleEditStopConcept,item);
        }
        function searchStopConcept(){
            if($scope.vm.searchType == "stopConceptModifier"){
                searchStopConceptByUser();
            }else{
                searchStopConceptByType();
            }
        }
        //查询
        function searchStopConceptByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/stop/listByModifier",{
                "stopConceptModifier":$scope.vm.searchVal,
                "stopConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadStopConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchStopConceptByType(){
            var request = new Object();
            request.stopConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "stopConceptModifyTime"){
                request=switchStopConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/modeling/concept/stop/listByAttribute",request,function(data){
                loadStopConcept($scope.vm.current,data);
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
        function switchStopConceptSearchType(request,value){
            if($("#searchType").val()=="stopConceptKey"){
                request.stopConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="stopConceptTerm"){
                request.stopConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addStop(){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/disable/disableConceptManageDialog.html",
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
                        httpRequestPost("/api/modeling/concept/stop/repeatCheck", {
                            "stopConceptApplicationId": $scope.vm.applicationId,
                            "stopConceptKey": $scope.vm.key
                        }, function (data) {          //类名重複
                            if (data.status === 10002) {
                                layer.msg("停用概念类名重复");
                                httpRequestPost("/api/modeling/concept/stop/listByAttribute", {
                                    "stopConceptApplicationId": $scope.vm.applicationId,
                                    "stopConceptKey": $scope.vm.key,
                                    "index": 0,
                                    "pageSize": 1
                                }, function (data) {
                                    $scope.vm.dialogTitle = "编辑停用概念";
                                    console.log(data);
                                    addStopConceptDialog(singleEditStopConcept, data.data[0]);
                                    $scope.vm.key = data.data[0].stopConceptKey;
                                    $scope.vm.term = data.data[0].stopConceptTerm;
                                }, function () {
                                });
                            } else {
                                //类名无冲突
                                $scope.vm.dialogTitle = "增加停用概念";
                                $scope.vm.term = "";
                                addStopConceptDialog(singleAddStopConcept);
                            }
                        }, function () {
                            layer.msg("添加失敗")
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
                    $("#stopKey").blur(function(){
                        if(lengthCheck($("#stopKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addStopConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/businessModeling/disable/disableConceptManageDialog2.html",
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
                    $("#stopKeyTwo").blur(function(){
                        if(lengthCheck($("#stopKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteStop(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelStopConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditStopConcept(item){
            assembleStopConceptTerm();
            httpRequestPost("/api/modeling/concept/stop/update",{
                "stopConceptId":item.stopConceptId,
                "stopConceptApplicationId": $scope.vm.applicationId,
                "stopConceptKey":  $scope.vm.key,
                "stopConceptModifier": item.stopConceptModifier,
                "stopConceptTerm": $scope.vm.term,
            },function(data){
                console.log(item);
                console.log(item.stopConceptId,$scope.vm.applicationId,$scope.vm.key,typeof $scope.vm.modifier,$scope.vm.term);
                console.log(data);
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAddStopConcept(){
            assembleStopConceptTerm();
            httpRequestPost("/api/modeling/concept/stop/add",{
                "stopConceptApplicationId": $scope.vm.applicationId,
                "stopConceptKey":  $scope.vm.key,
                "stopConceptModifier": $scope.vm.modifier,
                "stopConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelStopConcept(id){
            httpRequestPost("/api/modeling/concept/stop/delete",{
                "stopConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
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
        function assembleStopConceptTerm(){
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
    }
]);
