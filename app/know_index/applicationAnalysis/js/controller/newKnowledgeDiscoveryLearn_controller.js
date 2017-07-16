/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('newKnowledgeDiscoveryLearnController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
        $scope.vm = {
            applicationId :$cookieStore.get("applicationId"),
            searchNewKnowledgeDiscovery : searchNewKnowledgeDiscovery ,
            listNoReview : listNoReview ,
            listData : null ,   // table 数据
            paginationConf : null ,//分页条件
            pageSize : 5  , //默认每页数量
            listData1 : null ,   // table 数据
            paginationConf1 : null ,//分页条件
            paginationConf2 : null ,//分页条件
            pageSize1 : 5  , //默认每页数量
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
            associate:associate,
            learn:learn,
            review:review,
            statusId:0,
            passStatusId:0,
            tab:tab,
            currQuestion:"",
            searchByKnowledgeTitle:searchByKnowledgeTitle,
            knowledgeList:null,
            question:null,
            question1:null,
            content:content,
            talkDetail:null,
            associateCheck:associateCheck,
            currKnowledgeTitle:null
        };
        //选项卡
        function tab(obj1, obj2) {
            $(obj1).click(function () {
                $(this).addClass('cur').siblings().removeClass();
                $(obj2).children('div').eq($(this).index()).attr('class', 'db').siblings().attr('class', 'dn');
                searchNewKnowledgeDiscovery(1);
                listNoReview(1);
            });
        }

        tab('.tab_tit span', '.tab_con');

        //list 分页变化加载数据
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                searchNewKnowledgeDiscovery(current);
            }
        });
        $scope.$watch('vm.paginationConf1.currentPage', function(current){
            if(current){
                searchNewKnowledgeDiscovery(current);
            }
        });
        $scope.$watch('vm.paginationConf2.currentPage', function(current){
            if(current){
                searchNewKnowledgeDiscovery(current);
            }
        });

        //表格列表
        function searchNewKnowledgeDiscovery(index){
            var question = null;
            if(nullCheck($scope.vm.question1)==true){
                question = nullCheck($scope.vm.question);
            }
            httpRequestPost("/api/analysis/knowledgeLearn/newKnowledgeDiscoveryLearnUnlearn",{
                "applicationId" : $scope.vm.applicationId,
                "channelId": $scope.vm.channelId,
                "question": question,
                "dimensionId": $scope.vm.dimensionId,
                "requestTimeType":$scope.vm.timeType,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.listData = data.qaLogs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.qalogTotal/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8//分页框数量
                };
                $scope.$apply();
            });
        }
        function searchByKnowledgeTitle(index){
            if(nullCheck($("#inputValue").val())==true){
                httpRequestPost("/api/ms/knowledgeManage/overView/searchList",{
                    "applicationId" : $scope.vm.applicationId,
                    "knowledgeTitle": $("#inputValue").val(),
                    "index": (index-1)*$scope.vm.pageSize1,
                    "pageSize": $scope.vm.pageSize1,
                    "sourceType": 0,
                    "updateTimeType": 0
                },function(data){
                    $scope.vm.knowledgeList = data.data.objs;
                    $scope.vm.paginationConf2 = {
                        currentPage: index,//当前页
                        totalItems: Math.ceil(data.data.total/5), //总条数
                        pageSize: 1,//第页条目数
                        pagesLength: 8//分页框数量
                    };
                    $scope.$apply();
                });
            }else{
                layer.msg("请输入要查找的标题");
            }
        }
        function listNoReview(index){
            var question = null;
            if(nullCheck($scope.vm.question1)==true){
                question = nullCheck($scope.vm.question1);
            }
            httpRequestPost("/api/analysis/knowledgeLearn/listNoReview",{
                "applicationId" : $scope.vm.applicationId,
                "channelId": $scope.vm.channelId1,
                "question": question,
                "dimensionId": $scope.vm.dimensionId1,
                "requestTimeType":$scope.vm.timeType1,
                "startTime": $scope.vm.timeStart1,
                "endTime": $scope.vm.timeEnd1,
                "index": (index-1)*$scope.vm.pageSize1,
                "pageSize": $scope.vm.pageSize1,
                "status_id": $scope.vm.statusId,
                "pass_status_id": $scope.vm.passStatusId,
                "learn_type": 1
            },function(data){
                $scope.vm.listData1 = data.reviewRecords;
                $scope.vm.paginationConf1 = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.reviewRecordTotal/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8//分页框数量
                };
                $scope.$apply();
            });
        }
        //获取
        init();
        function init(){
            getDimensions();
            getChannel();
            searchNewKnowledgeDiscovery(1);
            listNoReview(1);
        }
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
            layer.confirm('确认要忽略吗？', function () {
                var request = new Object();
                request.ids=id_array;
                httpRequestPost("/api/analysis/knowledgeLearn/ignore",request,function(data){
                    if(data!=null){
                        searchNewKnowledgeDiscovery($scope.vm.paginationConf.currentPage);
                    }
                });
            });
        }
        function associate(requestId,content){
            $scope.vm.currQuestion="用户问题:"+content;
            var dialog = ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/associateLearn.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){
                    if(e === 1){
                        assembleLearnData(requestId);
                    }
                }
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
            httpRequestPost("/api/analysis/knowledgeLearn/learn",{
                "qalog_id" : requestId,
                "knowledge_id":id_array.pop(),
                "knowledge_type":knowledgeType,
                "knowledge_title":knowledgeTitle,
                "learn_type":1,
                "knowledge_learn_type":0
            },function(data){
                if(data.info){
                    layer.msg(data.info);
                    searchNewKnowledgeDiscovery(1);
                }
            },function(err){
                console.log(err);
            });
        }
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
            layer.confirm('确认要'+msg+'吗？', function () {
                httpRequestPost("/api/analysis/knowledgeLearn/review",{
                    "ids" : id_array,
                    "pass_status_id": pass
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
        //維度
        function getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
        }

        //渠道
        function getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
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
        //学习
        function learn(requestId,content){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/switchKnowledgeType.html",
                width:'500px',
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){
                    if(e === 1){
                    }
                }
            });
        }

        /**
         * 关联知识查看
         * @param content
         * @param knowledgeTitle
         */
        function associateCheck(content,knowledgeTitle){
            $scope.vm.currQuestion="用户问题:"+content;
            $scope.vm.currKnowledgeTitle=knowledgeTitle;
            ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/associateLearnCheck.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){
                    if(e === 1){
                    }
                }
            });
        }

        /**
         * 上下文
         * @param requestId
         */
        function content(requestId){
            httpRequestPost("/api/analysis/userSession/searchContent",{
                "qalogId" : requestId,
                "index": 0,
                "pageSize": 32767
            },function(data){
                if(data!=null){
                    $scope.vm.talkDetail = data.data.objs;
                    $scope.$apply();
                }
            },function(err){
                console.log(err);
            });
            ngDialog.openConfirm({
                template:"/know_index/applicationAnalysis/content.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                width:'930px',
                preCloseCallback:function(e){
                    if(e === 1){
                    }
                }
            });
        }
    }
]);