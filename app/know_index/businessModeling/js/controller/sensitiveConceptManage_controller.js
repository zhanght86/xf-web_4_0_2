/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('sensitiveConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout",function ($scope,localStorageService, $state,ngDialog,$timeout) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addSensitive : addSensitive,
            editSensitive : editSensitive,
            deleteSensitive:deleteSensitive,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "sensitiveConceptKey",
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
            termSpliter: "；"
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //请求列表
        function getAggre(index){
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });
        //编辑
        function editSensitive(item){
            $scope.vm.dialogTitle="编辑敏感概念";
            $scope.vm.key = item.sensitiveConceptKey;
            $scope.vm.term =  item.sensitiveConceptTerm;
            addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "sensitiveConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/sensitive/listByModifier",{
                "sensitiveConceptModifier":$scope.vm.searchVal,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "sensitiveConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                    key: $scope.vm.searchVal,
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( $scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        var key = angular.copy($scope.vm.searchType);

        //添加 窗口
        function addSensitive(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/sensitive/sensitiveConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/sensitive/repeatCheck",{
                            "sensitiveConceptApplicationId": $scope.vm.applicationId,
                            "sensitiveConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/sensitive/listByAttribute",{
                                    "sensitiveConceptApplicationId": $scope.vm.applicationId,
                                    "sensitiveConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改敏感概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].sensitiveConceptKey;
                                    $scope.vm.term =  data.data[0].sensitiveConceptTerm;
                                },function(){
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加敏感概念";
                                $scope.vm.term="";
                                addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/sensitive/sensitiveConceptManageDialog2.html",
                scope: $scope,
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
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                }, 100);
            }
        }
        //   刪除 彈框
        function deleteSensitive(id){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id);
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/sensitive/update",{
                "sensitiveConceptId":item.sensitiveConceptId,
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": item.sensitiveConceptModifier,
                "sensitiveConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("编辑成功");
                $state.reload();
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            assembleTerm();
            httpRequestPost("/api/modeling/concept/sensitive/add",{
                "sensitiveConceptApplicationId": $scope.vm.applicationId,
                "sensitiveConceptKey":  $scope.vm.key,
                "sensitiveConceptModifier": $scope.vm.modifier,
                "sensitiveConceptTerm": $scope.vm.term,
            },function(data){
                layer.msg("添加成功");
                $state.reload();
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
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
        function assembleTerm(){
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