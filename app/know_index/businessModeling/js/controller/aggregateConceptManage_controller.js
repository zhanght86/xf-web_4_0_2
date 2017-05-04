/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('businessModelingModule').controller('aggregateConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
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
            modifier: getCookie("userName"),
            term: "",
            weight: "33" ,   //默認權重
            dialogTitle : "",
            inputSelect : [],
            inputVal : "",
            termSpliter: "；",
            current:3,
            percent:"%"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        loadCollectiveConceptTable(3);
        //请求列表
        function loadCollectiveConceptTable(current){
            httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
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
            httpRequestPost("/api/modeling/concept/collective/listByModifier",{
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
            httpRequestPost("/api/modeling/concept/collective/listByAttribute",request,function(data){
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
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/collective/repeatCheck",{
                            "collectiveConceptApplicationId": $scope.vm.applicationId,
                            "collectiveConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("集合概念类名重复");
                                httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
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
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加集合概念";
                                $scope.vm.term="";
                                $scope.vm.weight="33" ;   //默認權重
                                addCollectiveConceptDialog(singleAddCollectiveConcept);
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
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  33;
                    }
                }

            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor()
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteCollective(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
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
            httpRequestPost("/api/modeling/concept/collective/update",{
                "collectiveConceptId":item.collectiveConceptId,
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "collectiveConceptKey": $scope.vm.key,
                "collectiveConceptModifier": item.collectiveConceptModifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                console.log(item);
                console.log(item.collectiveConceptId,$scope.vm.applicationId,$scope.vm.key,typeof $scope.vm.modifier,$scope.vm.term, $scope.vm.weight);
                console.log(data);
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAddCollectiveConcept(){
            assembleCollectiveConceptTerm();
            httpRequestPost("/api/modeling/concept/collective/add",{
                "collectiveConceptApplicationId": $scope.vm.applicationId,
                "collectiveConceptKey":  $scope.vm.key,
                "collectiveConceptModifier": $scope.vm.modifier,
                "collectiveConceptTerm": $scope.vm.term,
                "collectiveConceptWeight": $scope.vm.weight
            },function(data){
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDelCollectiveConcept(id){
            httpRequestPost("/api/modeling/concept/collective/delete",{
                "collectiveConceptId":id
            },function(data){
                layer.msg("刪除成功");
                $state.reload();
            },function(){
                layer.msg("刪除失敗")
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
    }
]);

