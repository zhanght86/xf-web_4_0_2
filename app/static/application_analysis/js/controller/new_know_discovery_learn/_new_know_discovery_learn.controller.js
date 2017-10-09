/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('applAnalysisModule').controller('newKnowledgeDiscoveryLearnController', [
    '$scope',"localStorageService","$state","$log","AppAnalysisServer","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state,$log,AppAnalysisServer, $timeout,$stateParams,ngDialog,$cookieStore) {
        $scope.vm = {
            searchNewKnowledgeDiscovery : searchNewKnowledgeDiscovery ,
            listNoReview : listNoReview ,
            listData : null ,   // table 数据
            paginationConf : {      //分页条件
                pageSize : 5  , //默认每页数量
                pagesLength : 10
            },

            listData1 : null ,       // table 数据
            paginationConf1 : {       //分页条件
                pageSize : 5  , //默认每页数量
                pagesLength : 10
            } ,
            paginationConf2 : {       //分页条件
                pageSize : 5  , //默认每页数量
                pagesLength : 10
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
            associate:associate,
            learn:learn,
            review:review,
            statusId:0,
            passStatusId:0,
            currQuestion:"",
            searchByKnowledgeTitle:searchByKnowledgeTitle,
            knowledgeList:null,
            question:null,
            question1:null,
            content:content,
            talkDetail:null,
            associateCheck:associateCheck,
            currKnowledgeTitle:null ,
            knowledgeContent : "",
            keyLogin:keyLogin,
            contentType : 0 ,  //默认显示未学习
            //未学习全选 单选；
            selectAllCheck : false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            unstudyArr : [],
            //已学习全选 单选；
            selectAllCheck1 : false,
            selectAll1 : selectAll1,
            selectSingle1 : selectSingle1,
            studyArr : [],

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
         *  页面初始化 获取
         **/
        init();
        function init(){
           // getDimensions();
           // getChannel();
            searchNewKnowledgeDiscovery(1);
            listNoReview(1);
        }

        /**
         * 未学习分页监控
         **/
        var timer ;
        $scope.$watch('vm.paginationConf.currentPage', function(current,old){
            if(current && old != undefined){
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    searchNewKnowledgeDiscovery(current);
                    clearSelect();
                }, 100)
            }
        },true);
        /**
         * 已学习分页监控
         **/
        var timer1 ;
        $scope.$watch('vm.paginationConf1.currentPage', function(current,old){
            if(current && old != undefined){
                if (timer1) {
                    $timeout.cancel(timer1)
                }
                timer1 = $timeout(function () {
                    listNoReview(current);
                    clearSelect1();
                }, 100)
            }
        },true);
        /**
         * 未学习关联弹窗 分页监控
         **/
        var timer2 ;
        $scope.$watch('vm.paginationConf2.currentPage', function(current){
            if(current){
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
         *  表格列表 未学习
         **/
        function searchNewKnowledgeDiscovery(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            var question = null;
            if(nullCheck($scope.vm.question)==true){
                question = "%"+$scope.vm.question+"%";
            }            
            AppAnalysisServer.searchNewKnowledgeDiscovery.save({
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
                clearSelect();
                $scope.vm.listData = data.qaLogs;
                $scope.vm.paginationConf.currentPage = index;
                $scope.vm.paginationConf.totalItems = data.qalogTotal;
                $scope.vm.paginationConf.numberOfPages = data.qalogTotal/$scope.vm.paginationConf.pageSize;
                console.log($scope.vm.paginationConf);
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }
        /**
         *  表格列表 未学习关联弹窗
         **/
        function searchByKnowledgeTitle(index){
            if(nullCheck($("#inputValue").val())==true){

                AppAnalysisServer.searchByKnowledgeTitle2.save({
                    "applicationId": APPLICATION_ID,
                    "index": (index-1)*$scope.vm.paginationConf2.pageSize,
                    "pageSize": $scope.vm.paginationConf2.pageSize,
                    "sceneIds":null,
                    "knowledgeTitle": $("#inputValue").val(),
                    "knowledgeContent":null,
                    "knowledgeUpdate":null,
                    "knowledgeExpDateEnd":null,
                    "knowledgeExpDateStart":null,
                    "knowledgeOrigin":0,
                    "updateTimeType":0,
                    "knowledgeType":"",
                    "knowledgeExtensionQuestion":""
                },function(data){
                    $scope.vm.knowledgeList = data.data.objs;
                    $scope.vm.paginationConf2.currentPage =index ;
                    $scope.vm.paginationConf2.totalItems =data.data.total ;
                    $scope.vm.paginationConf2.numberOfPages = data.data.total/$scope.vm.paginationConf2.pageSize ;
                    console.log($scope.vm.paginationConf2);
                },function(err){
                    console.log(err);
                });
            }else{
                layer.msg("请输入要查找的标题");
            }
        }
        /**
         *  表格列表 已学习
         **/
        function listNoReview(index){
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            var question = null;
            if(nullCheck($scope.vm.question1)==true){
                question = "%"+$scope.vm.question1+"%";
            }
            AppAnalysisServer.listNoReview2.save({
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
                "learn_type": 1
            },function(data){
                layer.close(i);
                clearSelect1();
                $scope.vm.listData1 = data.reviewRecords;
                $scope.vm.paginationConf1.currentPage = index;
                $scope.vm.paginationConf1.totalItems = data.reviewRecordTotal;
                $scope.vm.paginationConf1.numberOfPages = data.reviewRecordTotal/$scope.vm.paginationConf1.pageSize;
                console.log($scope.vm.paginationConf1);
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }

        /**
         *  忽略
         **/
        function ignore(){
            if ($scope.vm.unstudyArr.length == 0) {
                layer.msg("请选择要忽略的记录！");
                return;
            }
            layer.confirm('确认要忽略吗？', function (index) {
                layer.close(index);
                var request = new Object();
                request.ids=$scope.vm.unstudyArr;
                AppAnalysisServer.ignore2.save(request,function(data){
                    if(data!=null){
                        searchNewKnowledgeDiscovery($scope.vm.paginationConf.currentPage);
                        layer.msg('已忽略',{time:2000});
                        clearSelect();
                    }
                },function(err){
                    $log.log(err);
                });
            });
        }
        /**
         * 关联
         **/
        function associate(requestId,content){
            $scope.vm.knowledgeList=null;
            $scope.vm.currQuestion="用户问题:"+content;

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/reinforcement_learn/associate_learn.html','480px',function () {
                assembleLearnData(requestId);
            },function(){

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
            AppAnalysisServer.assembleLearnData2.save({
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
            },function (err) {
                console.log(err);
            });
        }

        /**
         * 通过 不通过
         **/
        function review(pass){
            var msg = "";
            if(pass==0){
                msg = "拒绝";
            }else{
                msg = "通过";
            }
            if ($scope.vm.studyArr.length == 0) {
                layer.msg("请选择要"+msg+"的记录！");
                return;
            }
            layer.confirm('确认要'+msg+'吗？', function (index) {
                layer.close(index);                
                AppAnalysisServer.review2.save({
                    "ids" : $scope.vm.studyArr,
                    "pass_status_id": pass,
                    "userId": USER_ID,
                    "userName": USER_NAME
                },function(data){
                    if(data.info){
                        layer.msg(data.info);
                        listNoReview(1);
                        clearSelect1();
                    }
                },function(err){
                    console.log(err);
                });
            });
        }

        /**
         * 学习
         **/
        function learn(requestId,content){
            $scope.vm.knowledgeContent = content ;
            console.log("======="+$scope.vm.knowledgeContent);

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/new_know_discovery_learn/switch_knowledge_type.html','500px',function(){

            },function(){

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

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/new_know_discovery_learn/associate_learn_check.html','450px',function(){

            },function () {

            });
        }

        /**
         * 上下文
         * @param requestId
         */
        function content(requestId){
            AppAnalysisServer.content.save({
                "qalogId" : requestId,
                "index": 0,
                "pageSize": 32767
            },function(data){
                if(data!=null){
                    $scope.vm.talkDetail = data.data.objs;
                }
            },function(err){
                console.log(err);
            });

            $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/application_analysis/new_know_discovery_learn/content.html','930px',function(){

            },function(){

            });
        }

        /**
         * 未学习全选
         */
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.unstudyArr = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.unstudyArr.push(item.content);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.unstudyArr = [];
            }
            //console.log($scope.vm.unstudyArr);
        }
        /**
         * 未学习单选
         */
        function selectSingle(id){
            if($scope.vm.unstudyArr.inArray(id)){
                $scope.vm.unstudyArr.remove(id);
                $scope.vm.selectAllCheck = false;
            }else{
                $scope.vm.unstudyArr.push(id);
            }
            if($scope.vm.unstudyArr.length == $scope.vm.listData.length){
                $scope.vm.selectAllCheck = true;
            }
            console.log($scope.vm.unstudyArr);
        }
        /**
         * 未学习清空全选 数组
         */
        function clearSelect(){
            $scope.vm.selectAllCheck = false;
            $scope.vm.unstudyArr = [];
        }

        /**
         * 已学习全选
         */
        function selectAll1(){
            if(!$scope.vm.selectAllCheck1){
                $scope.vm.selectAllCheck1 = true;
                $scope.vm.studyArr = [];
                angular.forEach($scope.vm.listData1,function(item){
                    $scope.vm.studyArr.push(item.recordId);
                });
            }else{
                $scope.vm.selectAllCheck1 = false;
                $scope.vm.studyArr = [];
            }
            console.log($scope.vm.studyArr);
        }
        /**
         * 已学习单选
         */
        function selectSingle1(id){
            if($scope.vm.studyArr.inArray(id)){
                $scope.vm.studyArr.remove(id);
                $scope.vm.selectAllCheck1 = false;
            }else{
                $scope.vm.studyArr.push(id);
            }
            if($scope.vm.studyArr.length == $scope.vm.listData1.length){
                $scope.vm.selectAllCheck1 = true;
            }
            console.log($scope.vm.studyArr);
        }

        /**
         * 已学习清空全选 数组
         */
        function clearSelect1(){
            $scope.vm.selectAllCheck1 = false;
            $scope.vm.studyArr = [];
        }

    }
]);