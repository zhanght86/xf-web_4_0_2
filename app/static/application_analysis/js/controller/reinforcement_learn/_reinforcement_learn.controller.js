/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('reinforcementLearnController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore) {
        $scope.vm = {
            searchReinforcement : searchReinforcement ,
            listNoReview : listNoReview ,
            listData : null ,   // table 数据
            paginationConf : {    //分页条件
                pageSize : 5,     //默认每页数量
                pagesLength: 10   //分页框数量
            } ,
            listData1 : null ,   // table 数据
            paginationConf1 : {    //分页条件
                pageSize : 5,     //默认每页数量
                pagesLength: 10   //分页框数量
            } ,
            paginationConf2 : {    //分页条件
                pageSize : 5,     //默认每页数量
                pagesLength: 10   //分页框数量
            } ,
            dimensions : [] ,
            channels : [] ,
            channelId  : null ,
            dimensionId : null ,
            timeType : 0,
            timeStart : null,
            timeEnd : null,
            channelId1  : null ,
            dimensionId1 : null ,
            timeType1 : 0,
            timeStart1 : null,
            timeEnd1 : null,
            timeList : [],
            currentPage : 1,
            total : null,
            total1 : null,
            ignore:ignore,
            learn:learn,
            review:review,
            statusId:0,
            passStatusId:0,
            currQuestion:"",
            searchByKnowledgeTitle:searchByKnowledgeTitle,
            knowledgeList:null,
            question:null,
            question1:null,
            keyLogin:keyLogin,
            getRecommend:getRecommend,
            contentType : 0,    //默认显示未学习；
            inputValue :''

        };
        function keyLogin(e){
            var srcObj = e.srcElement ? e.srcElement : e.target;
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){//回车
                srcObj.blur() ;
                searchByKnowledgeTitle(1);
                srcObj.focus() ;
            }
        }
        /**
         * 初始化 获取
         **/
        init();
        function init(){
            //getDimensions();
            //getChannel();
            searchReinforcement(1);
            listNoReview(1);
        }

        /**
         *  list 分页变化加载数据  未学习
         **/
        var timer ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timer) {
                    $timeout.cancel(timer)
                }
                timer = $timeout(function () {
                    searchReinforcement(current);
                }, 0)
            }
        },true);

        /**
         *  list 分页变化加载数据   已学习
         **/
        var timer1 ;
        $scope.$watch('vm.paginationConf1.currentPage', function(current,old){
            if(current && old != undefined){
                if (timer1) {
                    $timeout.cancel(timer1)
                }
                timer1 = $timeout(function () {
                    listNoReview(current);
                }, 0)
            }
        },true);

        /**
         *  list 分页变化加载数据   弹窗分页
         **/
        var timer2 ;
        $scope.$watch('vm.paginationConf2.currentPage', function(current,old){
            if(current && old != undefined){
                if (timer2) {
                    $timeout.cancel(timer2)
                }
                timer2 = $timeout(function () {
                    searchByKnowledgeTitle(current);
                }, 100)
            }
        },true);

        $scope.$watch('vm.channelId1', function(){
            $scope.vm.listData1 = null;
            // $scope.vm.paginationConf1 = {
            //     currentPage: 0,//当前页
            //     totalItems: 0, //总条数
            //     pageSize: 1,//第页条目数
            //     pagesLength: 8//分页框数量
            // };
        });

        /**
         * 表格列表 未学习
         */
        function searchReinforcement(index){

            var question = null;
            if(nullCheck($scope.vm.question)==true){
                question = "%"+$scope.vm.question+"%";
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.searchReinforcement.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId,
                "question": question,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(data){
                layer.close(i);
                console.log(data);
                $scope.vm.listData = data.qaLogs;

                $scope.vm.paginationConf.currentPage =index ;
                $scope.vm.paginationConf.totalItems =data.qalogTotal ;
                $scope.vm.paginationConf.numberOfPages = data.qalogTotal/$scope.vm.paginationConf.pageSize ;
                console.log($scope.vm.paginationConf);
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }
        /**
         * 表格列表 已学习
         */
        function listNoReview(index){

            var question = null;
            if(nullCheck($scope.vm.question1)==true){
                question = "%"+$scope.vm.question1+"%";
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            AppAnalysisServer.listNoReview.save({
                "applicationId" : APPLICATION_ID,
                "channelId": $scope.vm.channelId1,
                "question": question,
                "dimensionId": $scope.vm.dimensionId1,
                "requestTimeType":$scope.vm.timeType1,
                "startTime": $scope.vm.timeStart1,
                "endTime": $scope.vm.timeEnd1,
                "index": (index-1)*$scope.vm.paginationConf1.pageSize,
                "pageSize": $scope.vm.paginationConf1.pageSize,
                "status_id": $scope.vm.statusId,
                "pass_status_id": $scope.vm.passStatusId,
                "learn_type": 0
            },function(data){
                layer.close(i);
                console.log(data);
                $scope.vm.listData1 = data.reviewRecords;                
                $scope.vm.paginationConf1.currentPage =index ;
                $scope.vm.paginationConf1.totalItems =data.reviewRecordTotal ;
                $scope.vm.paginationConf1.numberOfPages = data.reviewRecordTotal/$scope.vm.paginationConf1.pageSize ;
                console.log($scope.vm.paginationConf1);
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }
        /**
         * 表格列表 学习弹窗
         */
        function searchByKnowledgeTitle(index){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            $scope.vm.knowledgeList=null;
          //if(nullCheck($("#inputValue").val())==true){
            if(nullCheck($scope.vm.inputValue)==true){
                AppAnalysisServer.searchByKnowledgeTitle.save({
                    "applicationId": APPLICATION_ID,
                    "index": (index-1)*$scope.vm.paginationConf2.pageSize,
                    "pageSize": $scope.vm.paginationConf2.pageSize,
                    "sceneIds":null,
                    //"knowledgeTitle": $("#inputValue").val(),
                    "knowledgeTitle": $scope.vm.inputValue,
                    "knowledgeContent":null,
                    "knowledgeUpdate":null,
                    "knowledgeExpDateEnd":null,
                    "knowledgeExpDateStart":null,
                    "knowledgeOrigin":0,
                    "updateTimeType":0,
                    "knowledgeType":"",
                    "knowledgeExtensionQuestion":""
                },function (data) {
                    layer.close(i);
                    $scope.vm.knowledgeList = data.data.objs;
                    $scope.vm.paginationConf2.currentPage =index ;
                    $scope.vm.paginationConf2.totalItems =data.data.total ;
                    $scope.vm.paginationConf2.numberOfPages = data.data.total/$scope.vm.paginationConf2.pageSize ;
                    console.log($scope.vm.paginationConf2);
                },function(err){
                    layer.close(i);
                    console.log(err);
                });
            }else{
                layer.msg("请输入要查找的标题");
            }
        }

        /**
         *  忽略
         **/
        function ignore(){
            var ids = document.getElementsByName("sid");
            var id_array = [];
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].checked) {
                    id_array.push(ids[i].value);
                }
            }
            if (id_array.length == 0) {
                layer.msg("请选择要忽略的记录！");
                return;
            }
            layer.confirm('确认要忽略吗？', function (index) {
                layer.close(index);
                var request = new Object();
                request.ids=id_array;                
                AppAnalysisServer.ignore.save(request
                    ,function (data) {
                        if(data!=null){
                            searchReinforcement($scope.vm.paginationConf.currentPage);
                        }
                        layer.msg('已忽略',{time:2000});
                    },function(err){
                        $log.log(err);
                    }
                );
            });
        }

        /**
         * 获取推荐知识
         * @param requestId
         */
        function getRecommend(requestId){
            console.log("====="+requestId);
            httpRequestPost("/api/analysis/userSession/getOneRecommend",{
                "qalogId" : requestId
            },function(data){
                $scope.vm.knowledgeList = data.data;
                $scope.$apply();
            });
        }

        /**
         *  学习
         **/
        function learn(requestId,content){
            $scope.vm.knowledgeList=null;
            getRecommend(requestId);
            $scope.vm.currQuestion="用户问题:"+content;

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/reinforcement_learn/associate_learn.html','455px',function(){
                assembleLearnData(requestId);
            },function () {

            });
        }

        /**
         * 组装知识学习数据
         * @param requestId
         * @param content
         */
        function assembleLearnData(requestId){
            var ids = document.getElementsByName("sid2");
            var id_array = [];
            var knowledgeTitle="";
            var knowledgeType=0;
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].checked) {
                    id_array.push(ids[i].value);
                    knowledgeTitle = $(ids[i]).attr("knowledgeTitle");
                    knowledgeType = $(ids[i]).attr("knowledgeType");
                }
            }
            if (id_array.length == 0) {
                layer.msg("请选择要关联的知识");
                return;
            }
            httpRequestPost("/api/analysis/knowledgeLearn/learnByContent",{
                "qalog_id" : requestId,
                "knowledge_id":id_array.pop(),
                "knowledge_type":100,
                "knowledge_title":knowledgeTitle,
                "learn_type":0,
                "knowledge_learn_type":0
            },function(data){
                if(data.info){
                    layer.msg(data.info);
                    searchReinforcement(1);
                }
            },function(err){
                console.log(err);
            });
        }

        /**
         * 通过  不通过
         */
        function review(pass){
            var ids = document.getElementsByName("sid1");
            var id_array = [];
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].checked) {
                    id_array.push(ids[i].value);
                }
            }
            var msg = "";
            if(pass==0){
                msg = "拒绝";
            }else{
                msg = "通过";
            }
            if (id_array.length == 0) {
                layer.msg("请选择要"+msg+"的记录！");
                return;
            }
            layer.confirm('确认要'+msg+'吗？', function (index) {
                layer.close(index);
                httpRequestPost("/api/analysis/knowledgeLearn/review",{
                    "ids" : id_array,
                    "pass_status_id": pass,
                    "userId": USER_ID,
                    "userName": USER_NAME
                },function(data){
                    if(data.info){
                        layer.msg(data.info);
                        listNoReview(1);
                    }
                },function(err){
                    console.log(err);
                });
            });
        }

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
        //全选
        $("#selectAll1").on("click",function(){
            var ids = document.getElementsByName("sid1");
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
        function clearSelectAll1(){
            console.log("=====clearSelectAll1=====");
            $("#selectAll1").attr("checked",false);
            $("#selectAll1").prop("checked",false);
        }
    }
]);