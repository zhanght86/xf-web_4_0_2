/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('aggregateConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            applicationId : $cookieStore.get("applicationId"),
            addCollective : addCollective,
            editCollective : editCollective,
            deleteCollective:deleteCollective,
            listData : "",   // table 数据
            singleDelCollectiveConcept : singleDelCollectiveConcept,    //單條刪除
            singleAddCollectiveConcept : singleAddCollectiveConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchCollectiveConcept : searchCollectiveConcept,
            searchVal : "",
            searchType : "collectiveConceptKey",
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
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        loadCollectiveConceptTable(1);
        //请求列表
        function loadCollectiveConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute",{
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadCollectiveConcept(current,data);
            },function(){
                layer.msg("请求失败")
            })
        }
        function loadCollectiveConcept(current,data){
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
                loadCollectiveConceptTable(current);
            }
        });
        //编辑
        function editCollective(item){
            $scope.vm.dialogTitle="编辑集合概念";
            $scope.vm.key = item.collectiveConceptKey;
            $scope.vm.term =  item.collectiveConceptTerm;
            $scope.vm.weight =  item.collectiveConceptWeight;
            addCollectiveConceptDialog(singleEditCollectiveConcept,item);
        }
        function searchCollectiveConcept(){
            if($scope.vm.searchType == "collectiveConceptModifier"){
                searchCollectiveConceptByUser();
            }else{
                searchCollectiveConceptByType();
            }
        }
        //查询
        function searchCollectiveConceptByUser(){
            httpRequestPost("/api/ms/modeling/concept/collective/listByModifier",{
                "collectiveConceptModifier":$scope.vm.searchVal,
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "index":($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize":$scope.vm.pageSize
            },function(data){
                loadCollectiveConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchCollectiveConceptByType(){
            var request = new Object();
            request.collectiveConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "collectiveConceptModifyTime"){
                request=switchCollectiveConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute",request,function(data){
                loadCollectiveConcept($scope.vm.current,data);
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
        function switchCollectiveConceptSearchType(request,value){
            if($("#searchType").val()=="collectiveConceptKey"){
                request.collectiveConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="collectiveConceptWeight"){
                request.collectiveConceptWeight=$("#collectiveConceptWeight").val();
            }else if($("#searchType").val()=="collectiveConceptTerm"){
                request.collectiveConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }

        //添加 窗口
        function addCollective(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog.html",
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
                        httpRequestPost("/api/ms/modeling/concept/collective/repeatCheck",{
                            "collectiveConceptApplicationId": $scope.vm.applicationId,
                            "collectiveConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/collective/listByAttribute",{
                                        "collectiveConceptApplicationId": $scope.vm.applicationId,
                                        "collectiveConceptKey":$scope.vm.key,
                                        "index":0,
                                        "pageSize":1
                                    },function(data){
                                        $scope.vm.dialogTitle="编辑集合概念";
                                        console.log(data);
                                        addCollectiveConceptDialog(singleEditCollectiveConcept,data.data[0]);
                                        $scope.vm.key = data.data[0].collectiveConceptKey;
                                        $scope.vm.term =  data.data[0].collectiveConceptTerm;
                                        $scope.vm.weight =  data.data[0].collectiveConceptWeight;
                                    },function(){
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加集合概念";
                                $scope.vm.term="";
                                $scope.vm.weight="33" ;   //默認權重
                                addCollectiveConceptDialog(singleAddCollectiveConcept);
                            }
                        },function(){
                            layer.msg("添加失败")
                        })
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
                    $("#collectiveKey").blur(function(){
                        if(lengthCheck($("#collectiveKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addCollectiveConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog2.html",
                scope: $scope,
                Returns : {a:1},
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
                        $scope.vm.weight =  33;
                    }
                }

            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#colectiveKeyTwo").blur(function(){
                        if(lengthCheck($("#colectiveKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCollective(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/conceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelCollectiveConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditCollectiveConcept(item){
            assembleCollectiveConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/collective/update",{
                "collectiveConceptId":item.collectiveConceptId,
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "collectiveConceptKey": $scope.vm.key,
                "collectiveConceptModifier": $scope.vm.modifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                if(responseView(data)==true){
                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddCollectiveConcept(){
            assembleCollectiveConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/collective/add",{
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "collectiveConceptKey":  $scope.vm.key,
                "collectiveConceptModifier": $scope.vm.modifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                if(responseView(data)==true){
                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条刪除
        function singleDelCollectiveConcept(id){
            httpRequestPost("/api/ms/modeling/concept/collective/delete",{
                "collectiveConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadCollectiveConceptTable($scope.vm.paginationConf.currentPage);
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
        function assembleCollectiveConceptTerm(){
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

