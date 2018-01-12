/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=functionalTestModule=>{
    functionalTestModule
    .controller('NewKnowDiscoveryLearnController',
     ['$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore","$location",
     ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore,$location, )=>{
        $scope.vm = {
            //-------未学习-------
            searchNewKnowledgeDiscovery : searchNewKnowledgeDiscovery ,
            paginationConf : {      //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchNewKnowledgeDiscovery ,
                location:true
            },
            listData : [] ,   // table 数据
            channels : [] ,
            channelId  :130,
            timeType : 0,
            timeStart : '',
            timeEnd : '',
            question:'',
            content:content,                        //上下文
            associate:associate,                   //关联
            ignore:ignore,
            learn:learn,
            clustering :'全部',                       //聚类
            clusteringList:[],
            getClusteringList : getClusteringList,             //获取聚类列表
            talkDetail:[],                       //聊天数据




            //弹窗
            searchByKnowledgeTitle:searchByKnowledgeTitle,
            paginationConf2 : {       //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchByKnowledgeTitle ,
                location:true
            } ,


            //--------------------已学习------------------------
            listNoReview : listNoReview ,
            paginationConf1 : {       //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: listNoReview ,
                location:true
            } ,
            listData1 : [] ,       // table 数据
            channelId1  : 130 ,
            timeType1 : 0,
            timeStart1 : '',
            timeEnd1 : '',
            question1:'',
            statusId:0,
            review:review,
            clustering1 : '全部',                  //聚类
            clusteringList1:[],
            getClusteringList1 : getClusteringList1,             //获取聚类列表

            //---------------------------------------

            passStatusId:0,
            currQuestion:"",
            knowledgeList:[],

            associateCheck:associateCheck,
            currKnowledgeTitle:'' ,
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
          * 未学习获取聚类列表
         **/
         getClusteringList();
        function getClusteringList(){
            FunctionServer.clusteringList.save({
                "learnType": 3,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "requestType": $scope.vm.timeType,
                "status": 1,
                "channelId": $scope.vm.channelId,
            },function (data) {
                if(data.status==500){
                    layer.msg(data.info,{time:10000});
                }
                if(data.status==200){
                    console.log(data);
                    $scope.vm.clusteringList = data.data;
                }
            },function(err){
                layer.msg(err);
            });
         }
         /**
          * 已学习获取聚类列表
          **/
         //getClusteringList1();
         function getClusteringList1(){
             FunctionServer.clusteringList.save({
                 "learnType": 3,
                 "startTime": $scope.vm.timeStart1 ,
                 "endTime": $scope.vm.timeEnd1 ,
                 "requestType": $scope.vm.timeType1 ,
                 "status": 0,
                 "channelId": $scope.vm.channelId1 ,
             },function (data) {
                 if(data.status==500){
                     layer.msg(data.info,{time:10000});
                 }
                 if(data.status==200){
                     console.log(data);
                     $scope.vm.clusteringList1 = data.data;
                 }
             },function(err){
                 layer.msg(err);
             });
         }

        /**
         *  页面初始化 获取
         **/
         searchNewKnowledgeDiscovery($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
         listNoReview($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);

        /**
         *  表格列表 未学习
         **/
        function searchNewKnowledgeDiscovery(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage=1;
                $location.search('currentPage',1);
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            var question = null;
            if(nullCheck($scope.vm.question)==true){
                question = "%"+$scope.vm.question+"%";
            }
            FunctionServer.searchNewKnowledgeDiscovery.save({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "startTime": $scope.vm.timeStart,
                "endTime": $scope.vm.timeEnd,
                "requestType":$scope.vm.timeType,
                "channelId": $scope.vm.channelId,
                "question": question,
                "clustering":$scope.vm.clustering,

            },function(data){
                layer.close(i);
                if(data.status==500){
                    layer.msg(data.info,{time:10000});
                }
                if(data.status==200){
                    console.log(data);
                    clearSelect();
                    $scope.vm.listData = data.data.data;
                    $scope.vm.paginationConf.currentPage = index;
                    $scope.vm.paginationConf.totalItems = data.data.total;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
                    console.log($scope.vm.paginationConf);
                }

            },function(err){
                layer.close(i);
                console.log(err);
            });
        }

        /**
         *  表格列表 已学习
         **/
        function listNoReview(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage=1;
                $location.search('currentPage',1);
            }
            var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            var question = null;
            if(nullCheck($scope.vm.question1)==true){
                question = "%"+$scope.vm.question1+"%";
            }
            FunctionServer.listNoReview2.save({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "startTime": $scope.vm.timeStart1,
                "endTime": $scope.vm.timeEnd1,
                "channelId": $scope.vm.channelId1,
                "status": $scope.vm.statusId,
                "question": question,
                "clustering":$scope.vm.clustering1,

            },function(data){
                layer.close(i);
                if(data.status==200){
                    console.log(data);
                    clearSelect1();
                    $scope.vm.listData1 = data.data.data;
                    $scope.vm.paginationConf1.currentPage = index;
                    $scope.vm.paginationConf1.totalItems = data.data.total;
                    $scope.vm.paginationConf1.numberOfPages = data.data.total/$scope.vm.paginationConf1.pageSize;
                    console.log($scope.vm.paginationConf1);
                }
                if(data.status==500){
                    layer.msg(data.info,{time:10000});
                }
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

                 FunctionServer.searchByKnowledgeTitle2.save({
                     "applicationId": APPLICATION_ID,
                     "index": (index-1)*$scope.vm.paginationConf2.pageSize,
                     "pageSize": $scope.vm.paginationConf2.pageSize,
                     "sceneIds":null,
                     "knowledgeTitle": $("#inputValue").val().trim(),
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
         *  忽略
         **/
         function ignore(unstudyArr){
             if (!unstudyArr.length) {
                 layer.msg("请选择要忽略的记录！");
                 return;
             }else{
                 layer.confirm('确认要忽略吗？',{
                     btn:['确定','取消']
                 },function(){
                     FunctionServer.batchIgnore.save({
                         "idList":unstudyArr
                     },function(data){
                         if(data.status==200){
                             layer.msg("文件忽略成功");
                             clearSelect();
                             layer.closeAll();
                             $state.reload();
                         }
                         if(data.status==500){
                             layer.msg(data.info,{time:10000});
                         }

                     },function(err){
                         console.log(err);
                     });

                 },function(err){
                     console.log(err);
                 } );
             }

         }

         /**
          * 上下文
          * @param requestId
          */
         function content(requestId){
             let context = require('../../../views/division_knowledge/new_know_discovery_learn/content.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,context,'930px',function(){
                 //getContent(requestId);
             },function(){

             });
             getContent(requestId);
             function getContent(requestId){
                 FunctionServer.content.save({
                     "requestId":requestId,
                     "direction": 1  ,                //1:向后 0:向前     （第一次传1，）
                     "includeBoundary": 1,            //1:包含边界 0:不包含  （第一次传1，再请求传0）；
                     "pageSize":5,
                 },function(data){
                     if(data.status==500){
                         layer.msg(data.info,{time:1000});
                     }
                     if(data.status==200){
                         $scope.vm.talkDetail = data.data.data;
                     }
                 },function(err){
                     console.log(err);
                 });
             }
         }


        /**
         * 关联
         **/
        function associate(requestId,content){
            $scope.vm.knowledgeList=null;
            $scope.vm.currQuestion="用户问题:"+content;

            let associateLearn = require('../../../views/division_knowledge/new_know_discovery_learn/associate_learn_check.html');
            $scope.$parent.$parent.MASTER.openNgDialog($scope,associateLearn,'480px',function () {
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
            FunctionServer.assembleLearnData2.save({
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
                FunctionServer.review2.save({
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
         * 未学习全选
         */
        function selectAll(){
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.unstudyArr = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.unstudyArr.push(item.id);
                });
            }else{
                $scope.vm.selectAllCheck = false;
                $scope.vm.unstudyArr = [];
            }
            console.log($scope.vm.unstudyArr);
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
])};