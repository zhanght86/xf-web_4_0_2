
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('businessConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval,$cookieStore) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            addBusiness : addBusiness,
            editBusiness : editBusiness,
            deleteBusiness:deleteBusiness,
            listData : "",   // table 数据
            singleDelBusinessConcept : singleDelBusinessConcept,    //單條刪除
            singleAddBusinessConcept : singleAddBusinessConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchBusinessConcept : searchBusinessConcept,
            searchVal : "",
            searchType : "businessConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: $cookieStore.get("userId"),
            term: "",
            weight: "33" ,   //默認權重
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
        loadBusinessConceptTable(1);
        //请求列表
        function loadBusinessConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/business/listByAttribute",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadBusinessConcept(current,data);
            },function(){
                layer.msg("请求失败");
            });
        }
        function loadBusinessConcept(current,data){
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
                loadBusinessConceptTable(current);
            }
        });
        //编辑
        function editBusiness(item){
            $scope.vm.dialogTitle="编辑业务概念";
            $scope.vm.key = item.businessConceptKey;
            $scope.vm.term =  item.businessConceptTerm;
            console.log($scope.vm.term);
            $scope.vm.weight = item.businessConceptWeight;
            addBusinessConceptDialog(singleEditBusinessConcept,item);
        }
        function searchBusinessConcept(){
            if($scope.vm.searchType == "businessConceptModifier"){
                searchBusinessConceptByUser();
            }else{
                searchBusinessConceptByType();
            }
        }
        //查询
        function searchBusinessConceptByUser(){
            httpRequestPost("/api/ms/modeling/concept/business/listByModifier",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "businessConceptModifier":$scope.vm.searchVal,
                "index":($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize":$scope.vm.pageSize
            },function(data){
                loadBusinessConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchBusinessConceptByType(){
            var request = new Object();
            request.businessConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "businessConceptModifyTime"){
                request=switchBusinessConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/ms/modeling/concept/business/listByAttribute",request,function(data){
                loadBusinessConcept($scope.vm.current,data);
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
        function switchBusinessConceptSearchType(request,value){
            if($("#searchType").val()=="businessConceptKey"){
                request.businessConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="businessConceptWeight"){
                request.businessConceptWeight=$("#businessConceptWeight").val();
            }else if($("#searchType").val()=="businessConceptTerm"){
                request.businessConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addBusiness(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if(lengthCheck($scope.vm.key,0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                            return false;
                        }
                        httpRequestPost("/api/ms/modeling/concept/business/repeatCheck",{
                            "businessConceptApplicationId": $scope.vm.applicationId,
                            "businessConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/business/listByAttribute",{
                                        "businessConceptApplicationId": $scope.vm.applicationId,
                                        "businessConceptKey":$scope.vm.key,
                                        "index":0,
                                        "pageSize":1
                                    },function(data){
                                        $scope.vm.dialogTitle="编辑业务概念";
                                        console.log(data);
                                        addBusinessConceptDialog(singleEditBusinessConcept,data.data[0]);
                                        $scope.vm.key = data.data[0].businessConceptKey;
                                        $scope.vm.term =  data.data[0].businessConceptTerm;
                                        $scope.vm.weight =  data.data[0].businessConceptWeight;
                                    },function(){
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加业务概念";
                                $scope.vm.term="";
                                $scope.vm.weight="33" ;   //默認權重
                                addBusinessConceptDialog(singleAddBusinessConcept);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight = 33;
                    }
                }
            });
            if(dialog){
                $timeout(function(){
                    $("#businessKey").blur(function(){
                        if(lengthCheck($("#businessKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                },100);
            }
        }

        //編輯彈框   添加公用
        function addBusinessConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
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
                    }else{
                         $scope.vm.key = "";
                         $scope.vm.term = "";
                         $scope.vm.weight = 33;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#businessKeyTwo").blur(function(){
                        if(lengthCheck($("#businessKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteBusiness(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelBusinessConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditBusinessConcept(item){
            assembleBusinessConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/business/update",{
                "businessConceptId":item.businessConceptId,
                "businessConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": item.businessConceptModifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                if (data) {
                    console.log(data);
                }
                layer.msg("编辑成功");
                $state.reload();
            },function(){
                layer.msg("编辑失败");
            })
        }
        //单条新增
        function singleAddBusinessConcept(){
            assembleBusinessConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/business/add",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": $scope.vm.modifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                if (data) {
                    console.log(data);
                }
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelBusinessConcept(id){
            httpRequestPost("/api/ms/modeling/concept/business/delete",{
                "businessConceptId":id
            },function(data){
                if (data) {
                    console.log(data);
                }
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
        function assembleBusinessConceptTerm(){
            var obj = $("#term").next();
            var term = "";
            var length = obj.find("li").length;
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