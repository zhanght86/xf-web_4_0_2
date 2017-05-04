/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('sensitiveConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addSensitive : addSensitive,
            editSensitive : editSensitive,
            deleteSensitive:deleteSensitive,
            listData : "",   // table 数据
            singleDelSensitiveConcept : singleDelSensitiveConcept,    //單條刪除
            singleAddSensitiveConcept : singleAddSensitiveConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchSensitiveConcept : searchSensitiveConcept,
            searchVal : "",
            searchType : "sensitiveConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userId"),
            term: "",
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            current:1,
            percent:"%"
        };

        /**
         * 加载分页条
         * @type
         */
        loadSensitiveConceptTable(1);
        //请求列表
        function loadSensitiveConceptTable(current){
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSensitiveConcept(current,data);
            },function(){
                layer.msg("请求失败");
            });
        }
        function loadSensitiveConcept(current,data){
            $scope.vm.listData = data.data;
            $scope.vm.current=current;
            $scope.vm.paginationConf = {
                currentPage: current,//当前页
                totalItems: data.total, //总条数
                pageSize: $scope.vm.pageSize,//第页条目数
                pagesLength: 8//分页框数量
            };
            $scope.$apply();
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                loadSensitiveConceptTable(current);
            }
        });
        //编辑
        function editSensitive(item){
            $scope.vm.dialogTitle="编辑敏感概念";
            $scope.vm.key = item.sensitiveConceptKey;
            $scope.vm.term =  item.sensitiveConceptTerm;
            addSensitiveConceptDialog(singleEditSensitiveConcept,item);
        }
        function searchSensitiveConcept(){
            if($scope.vm.searchType == "sensitiveConceptModifier"){
                searchSensitiveConceptByUser();
            }else{
                searchSensitiveConceptByType();
            }
        }
        //查询
        function searchSensitiveConceptByUser(){
            httpRequestPost("/api/modeling/concept/sensitive/listByModifier",{
                "sensitiveConceptModifier":$scope.vm.searchVal,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSensitiveConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchSensitiveConceptByType(){
            var request = new Object();
            request.sensitiveConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "sensitiveConceptModifyTime"){
                request=switchSensitiveConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",request,function(data){
                loadSensitiveConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }

        /**
         * 转换查询类型
         * @param request
         * @param value
         * @returns {*}
         */
        function switchSensitiveConceptSearchType(request,value){
            if($("#searchType").val()=="sensitiveConceptKey"){
                request.sensitiveConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="sensitiveConceptTerm"){
                request.sensitiveConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addSensitive(){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/sensitive/sensitiveConceptManageDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            console.log($scope.vm.key);
                            httpRequestPost("/api/modeling/concept/sensitive/repeatCheck", {
                                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                                "sensitiveConceptKey": $scope.vm.key
                            }, function (data) {          //类名重複
                                if (data.status === 10002) {
                                    layer.msg("敏感概念类名重复");
                                    httpRequestPost("/api/modeling/concept/sensitive/listByAttribute", {
                                        "sensitiveConceptApplicationId": $scope.vm.applicationId,
                                        "sensitiveConceptKey": $scope.vm.key,
                                        "index": 0,
                                        "pageSize": 1
                                    }, function (data) {
                                        $scope.vm.dialogTitle = "编辑敏感概念";
                                        console.log(data);
                                        addSensitiveConceptDialog(singleEditSensitiveConcept, data.data[0]);
                                        $scope.vm.key = data.data[0].sensitiveConceptKey;
                                        $scope.vm.term = data.data[0].sensitiveConceptTerm;
                                    }, function () {
                                    });
                                } else {
                                    //类名无冲突
                                    $scope.vm.dialogTitle = "增加敏感概念";
                                    $scope.vm.term = "";
                                    addSensitiveConceptDialog(singleAddSensitiveConcept);
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
            }
        }

        //編輯彈框   添加公用
        function addSensitiveConceptDialog(callback,item){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/sensitive/sensitiveConceptManageDialog2.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            callback(item)
                        } else {
                            $scope.vm.key = "";
                            $scope.vm.term = "";
                        }
                    }
                });
            }
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSensitive(id){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/ConceptManageDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            singleDelSensitiveConcept(id);
                        }
                    }
                });
            }
        }
        //編輯事件
        function singleEditSensitiveConcept(item){
            assembleSensitiveConceptTerm();
            httpRequestPost("/api/modeling/concept/sensitive/update",{
                "sensitiveConceptId":item.sensitiveConceptId,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": item.sensitiveConceptModifier,
                "sensitiveConceptTerm": $scope.vm.term
            },function(data){
                layer.msg("编辑成功");
                $state.reload();
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAddSensitiveConcept(){
            assembleSensitiveConceptTerm();
            httpRequestPost("/api/modeling/concept/sensitive/add",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": $scope.vm.modifier,
                "sensitiveConceptTerm": $scope.vm.term
            },function(data){
                layer.msg("添加成功");
                $state.reload();
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelSensitiveConcept(id){
            httpRequestPost("/api/modeling/concept/sensitive/delete",{
                "sensitiveConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload();
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
        function assembleSensitiveConceptTerm(){
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