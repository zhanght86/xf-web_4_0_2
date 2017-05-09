/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('synonyConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$cookieStore",function ($scope,localStorageService, $state,ngDialog,$timeout,$cookieStore) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            addSynonym : addSynonym,
            editSynonym : editSynonym,
            deleteSynonym:deleteSynonym,
            listData : "",   // table 数据
            singleDelSynonymConcept : singleDelSynonymConcept,    //單條刪除
            singleAddSynonymConcept : singleAddSynonymConcept,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            searchSynonymConcept : searchSynonymConcept,
            searchVal : "",
            searchType : "synonymConceptKey",
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
        loadSynonymConceptTable(1);
        //请求列表
        function loadSynonymConceptTable(current){
            httpRequestPost("/api/modeling/concept/synonym/listByAttribute",{
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "index" :(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSynonymConcept(current,data);
            },function(){
                layer.msg("请求失败")
            })
        }
        function loadSynonymConcept(current,data){
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
                loadSynonymConceptTable(current);
            }
        });
        //编辑
        function editSynonym(item){
            $scope.vm.dialogTitle="编辑同义概念";
            $scope.vm.key = item.synonymConceptKey;
            $scope.vm.term =  item.synonymConceptTerm;
            $scope.vm.weight =  item.synonymConceptWeight;
            addSynonymConceptDialog(singleEditSynonymConcept,item);
        }
        function searchSynonymConcept(){
            if($scope.vm.searchType == "synonymConceptModifier"){
                searchSynonymConceptByUser();
            }else{
                searchSynonymConceptByType();
            }
        }
        //查询
        function searchSynonymConceptByUser(){
            httpRequestPost("/api/modeling/concept/synonym/listByModifier",{
                "synonymConceptModifier":$scope.vm.searchVal,
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "index" :($scope.vm.current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                loadSynonymConcept($scope.vm.current,data);
            },function(){
                layer.msg("查询没有对应信息");
            });
        }
        function searchSynonymConceptByType(){
            var request = new Object();
            request.synonymConceptApplicationId=$scope.vm.applicationId;
            request.index=($scope.vm.current-1)*$scope.vm.pageSize;
            request.pageSize=$scope.vm.pageSize;
            if($scope.vm.searchType != "synonymConceptModifyTime"){
                request=switchSynonymConceptSearchType(request,$scope.vm.searchVal);
            }else{
                console.log("time"+$scope.vm.timeStart,$scope.vm.timeStart);
                request.startTimeRequest=$scope.vm.timeStart;
                request.endTimeRequest=$scope.vm.timeEnd;
            }
            httpRequestPost("/api/modeling/concept/synonym/listByAttribute",request,function(data){
                loadSynonymConcept($scope.vm.current,data);
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
        function switchSynonymConceptSearchType(request,value){
            if($("#searchType").val()=="synonymConceptKey"){
                request.synonymConceptKey=$scope.vm.percent+value+$scope.vm.percent;
            }else if($("#searchType").val()=="synonymConceptWeight"){
                request.synonymConceptWeight=$("#synonymConceptWeight").val();
            }else if($("#searchType").val()=="synonymConceptTerm"){
                request.synonymConceptTerm=$scope.vm.percent+value+$scope.vm.percent;
            }
            return request;
        }
        //添加 窗口
        function addSynonym(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/synony/synonyConceptManageDialog.html",
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
                        httpRequestPost("/api/modeling/concept/synonym/repeatCheck",{
                            "synonymConceptApplicationId": $scope.vm.applicationId,
                            "synonymConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },function(index){
                                    layer.close(index);
                                    httpRequestPost("/api/modeling/concept/synonym/listByAttribute",{
                                        "synonymConceptApplicationId": $scope.vm.applicationId,
                                        "synonymConceptKey":$scope.vm.key,
                                        "index":0,
                                        "pageSize":1
                                    },function(data){
                                        $scope.vm.dialogTitle="编辑同义概念";
                                        console.log(data);
                                        addSynonymConceptDialog(singleEditSynonymConcept,data.data[0]);
                                        $scope.vm.key = data.data[0].synonymConceptKey;
                                        $scope.vm.term =  data.data[0].synonymConceptTerm;
                                        $scope.vm.weight =  data.data[0].synonymConceptWeight;
                                    },function(){
                                        console.log("cancel");
                                    });
                                },function(){
                                    console.log("cancel");
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加同义概念";
                                $scope.vm.term="";
                                $scope.vm.weight="33" ;   //默認權重
                                addSynonymConceptDialog(singleAddSynonymConcept);
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
                $timeout(function () {
                    termSpliterTagEditor();
                    $("#synonymKey").blur(function(){
                        if(lengthCheck($("#synonymKey").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }

        //編輯彈框   添加公用
        function addSynonymConceptDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/synony/synonyConceptManageDialog2.html",
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
                    $("#synonymKeyTwo").blur(function(){
                        if(lengthCheck($("#synonymKeyTwo").val(),0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                        }else{
                            $("#keyAddError").html('');
                        }
                    });
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSynonym(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDelSynonymConcept(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEditSynonymConcept(item){
            assembleSynonymConceptTerm();
            httpRequestPost("/api/modeling/concept/synonym/update",{
                "synonymConceptId":item.synonymConceptId,
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "synonymConceptKey":  $scope.vm.key,
                "synonymConceptModifier": item.synonymConceptModifier,
                "synonymConceptTerm": $scope.vm.term,
                "synonymConceptWeight": $scope.vm.weight
            },function(data){
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAddSynonymConcept(){
            assembleSynonymConceptTerm();
            httpRequestPost("/api/modeling/concept/synonym/add",{
                "synonymConceptApplicationId": $scope.vm.applicationId,
                "synonymConceptKey":  $scope.vm.key,
                "synonymConceptModifier": $scope.vm.modifier,
                "synonymConceptTerm": $scope.vm.term,
                "synonymConceptWeight": $scope.vm.weight
            },function(data){
                console.log(data);
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelSynonymConcept(id){
            httpRequestPost("/api/modeling/concept/synonym/delete",{
                "synonymConceptId":id
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
        function assembleSynonymConceptTerm(){
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