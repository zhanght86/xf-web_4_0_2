/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('errorCorrectionConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
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
            modifier: getCookie("userName"),
            term: "",
            weight: "3" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            current:1
        };

        /**
         * 加载分页条
         * @type
         */
        loadCorrectionConceptTable(1);
        //请求列表
        function loadCorrectionConceptTable(current){
            httpRequestPost("/api/modeling/concept/correction/listByAttribute",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadCorrectionConcept(current,data);
            },function(){
                layer.msg("请求失败")
            });
        }
        function loadCorrectionConcept(current,data){
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
                loadCorrectionConceptTable(current);
            }
        });
        //编辑
        function editCorrection(item){
            $scope.vm.dialogTitle="编辑纠错概念";
            $scope.vm.key = item.correctionConceptKey;
            $scope.vm.term =  item.correctionConceptTerm;
            addCorrectionConceptDialog(singleEditCorrectionConcept,item);
        }
        function searchCorrectionConcept(){
            if($scope.vm.searchType == "correctionConceptModifier"){
                searchCorrectionConceptByUser();
            }else{
                searchCorrectionConceptByType();
            }
        }
        //查询
        function searchCorrectionConceptByUser(){
            httpRequestPost("/api/modeling/concept/correction/listByModifier",{
                "correctionConceptModifier":$scope.vm.searchVal,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadCorrectionConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchCorrectionConceptByType(){
            var request = new Object();
            request.correctionConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "correctionConceptModifyTime"){
                request=switchCorrectionConceptSearchType(request,$scope.vm.searchVal);
            }else{
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/modeling/concept/correction/listByAttribute",request,function(data){
                loadCorrectionConcept($scope.vm.current,data);
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
                request.correctionConceptKey=value;
            }else if($("#searchType").val()=="correctionConceptTerm"){
                request.correctionConceptTerm=value;
            }
            return request;
        }

        //添加 窗口
        function addCorrection(){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
                            console.log($scope.vm.key);
                            httpRequestPost("/api/modeling/concept/correction/repeatCheck", {
                                "correctionConceptApplicationId": $scope.vm.applicationId,
                                "correctionConceptKey": $scope.vm.key
                            }, function (data) {          //类名重複
                                if (data.status === 10002) {
                                    layer.msg("纠错概念类名重复");
                                    httpRequestPost("/api/modeling/concept/correction/listByAttribute", {
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
                                    });
                                } else {
                                    //类名无冲突
                                    $scope.vm.dialogTitle = "增加纠错概念";
                                    $scope.vm.term = "";
                                    addCorrectionConceptDialog(singleAddCorrectionConcept);
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
        function addCorrectionConceptDialog(callback,item){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/businessModeling/errorCorrection/errorCorrectionConceptManageDialog2.html",
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
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCorrection(id){
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
                            singleDelCorrectionConcept(id)
                        }
                    }
                });
            }
        }
        //編輯事件
        function singleEditCorrectionConcept(item){
            assembleCorrectionConceptTerm();
            httpRequestPost("/api/modeling/concept/correction/update",{
                "correctionConceptId":item.correctionConceptId,
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": item.correctionConceptModifier,
                "correctionConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAddCorrectionConcept(){
            assembleCorrectionConceptTerm();
            httpRequestPost("/api/modeling/concept/correction/add",{
                "correctionConceptApplicationId": $scope.vm.applicationId,
                "correctionConceptKey":  $scope.vm.key,
                "correctionConceptModifier": $scope.vm.modifier,
                "correctionConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelCorrectionConcept(id){
            httpRequestPost("/api/modeling/concept/correction/delete",{
                "correctionConceptId":id
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
    }
]);