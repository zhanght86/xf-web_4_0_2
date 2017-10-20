/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('botConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            // applicationId : $cookieStore.get("applicationId"),
            applicationId : APPLICATION_ID,
            addBot : addBot,
            editBot : editBot,
            deleteBot:deleteBot,
            listData : "",   // table 数据
            singleDelBotConcept : singleDelBotConcept,    //單條刪除
            singleAddBotConcept : singleAddBotConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchBotConcept : searchBotConcept,
            searchVal : "",
            searchType : "botConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            // modifier: $cookieStore.get("userId"),
            modifier: USER_ID,
            term: "",
            weight: "33" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            percent:"%",
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000"
        };

        /**
         * 加载分页条
         * @type
         */
        init();

        function init(){
            $scope.vm.paginationConf = {
                currentPage: 1,
                totalItems: 0,
                pageSize: 0,
                pagesLength: 8
            };
        }
        //请求列表
        function loadBotConceptTable(current){
            httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute",{
                "botConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadBotConcept(current,data);
            },function(){
                //layer.msg("请求失败")
                console.log('请求失败');
            })
        }
        function loadBotConcept(current,data){
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
                    if(nullCheck($("#botConceptWeight").val())==true || nullCheck($scope.vm.searchVal)==true || (nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true)){
                        searchBotConcept(current);
                    }else{
                        loadBotConceptTable(current);
                    }
                }, 100);
            }
        },true);

        //编辑
        function editBot(item){
            $scope.vm.dialogTitle="编辑BOT概念";
            $scope.vm.key = item.botConceptKey;
            $scope.vm.term =  item.botConceptTerm;
            $scope.vm.weight =  item.botConceptWeight;
            addBotConceptDialog(singleEditBotConcept,item);
        }
        function searchBotConcept(current){
            if($scope.vm.searchType == "botConceptModifier"){
                searchBotConceptByUser(current);
            }else{
                searchBotConceptByType(current);
            }
        }
        //查询
        function searchBotConceptByUser(current){
            httpRequestPost("/api/ms/modeling/concept/bot/listByModifier",{
                "botConceptModifier":$scope.vm.searchVal,
                "botConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadBotConcept(current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchBotConceptByType(current){
            var request = new Object();
            request.botConceptApplicationId=$scope.vm.applicationId;
            request.index=(current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "botConceptModifyTime"){
                request=switchBotConceptSearchType(request,$scope.vm.searchVal);
            }else if(nullCheck($scope.vm.timeStart)==true && nullCheck($scope.vm.timeEnd)==true){
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }else{
                layer.msg("请选择时间段");
                return;
            }
            httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute",request,function(data){
                loadBotConcept(current,data);
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
        function switchBotConceptSearchType(request,value){
            if($("#searchType").val()=="botConceptKey"){
                request.botConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="botConceptWeight"){
                request.botConceptWeight=$("#botConceptWeight").val();
            }else if($("#searchType").val()=="botConceptTerm"){
                request.botConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }
        //添加 窗口
        function addBot(){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/concept_library/bot/bot_concept_manage_dialog.html",
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
                        httpRequestPost("/api/ms/modeling/concept/bot/repeatCheck",{
                            "botConceptApplicationId": $scope.vm.applicationId,
                            "botConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/ms/modeling/concept/bot/listByAttribute",{
                                        "botConceptApplicationId": $scope.vm.applicationId,
                                        "botConceptKey":$scope.vm.key,
                                        "index":0,
                                        "pageSize":1
                                    },function(data){
                                        $scope.vm.dialogTitle="编辑BOT概念";
                                        console.log(data);
                                        addBotConceptDialog(singleEditBotConcept,data.data[0]);
                                        $scope.vm.key = data.data[0].botConceptKey;
                                        $scope.vm.term =  data.data[0].botConceptTerm;
                                        $scope.vm.weight =  data.data[0].botConceptWeight;
                                    },function(){
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加BOT概念";
                                $scope.vm.term="";
                                $scope.vm.weight="33" ;   //默認權重
                                addBotConceptDialog(singleAddBotConcept);
                            }
                        },function(){
                            //layer.msg("添加失败")
                            console.log('添加失败');
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
                    $("#botKey").blur(function(){
                        if(lengthCheck($("#botKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addBotConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/concept_library/bot/bot_concept_manage_dialog2.html",
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
                    $("#botKeyTwo").blur(function(){
                        if(lengthCheck($("#botKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteBot(id){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/concept_library/delete.html",
                scope: $scope,
                width: '260px',
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelBotConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditBotConcept(item){
            assembleBotConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/bot/update",{
                "botConceptId":item.botConceptId,
                "botConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "botConceptKey":  $scope.vm.key,
                "botConceptModifier": $scope.vm.modifier,
                "botConceptTerm": $scope.vm.term,
                "botConceptWeight": $scope.vm.weight
            },function(data){
                if(responseView(data)==true){
                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
                }
            });
        }
        //单条新增
        function singleAddBotConcept(){
            assembleBotConceptTerm();
            httpRequestPost("/api/ms/modeling/concept/bot/add",{
                "botConceptApplicationId": $scope.vm.applicationId,
                "applicationId": $scope.vm.applicationId,
                "botConceptKey":  $scope.vm.key,
                "botConceptModifier": $scope.vm.modifier,
                "botConceptTerm": $scope.vm.term,
                "botConceptWeight": $scope.vm.weight
            },function(data){
                if(responseView(data)==true){
                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
                }
            })
        }
        //单条刪除
        function singleDelBotConcept(id){
            httpRequestPost("/api/ms/modeling/concept/bot/delete",{
                "botConceptId":id
            },function(data){
                if(responseView(data)==true){
                    loadBotConceptTable($scope.vm.paginationConf.currentPage);
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
        function assembleBotConceptTerm(){
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