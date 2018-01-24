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
            clusteringList:[],                                  //聚类数据
            getClusteringList : getClusteringList,             //获取聚类列表
            talkDetail:[],                       //聊天数据

            setStorage : setStorage,            //本地存储
            clusteringContent : "",                    //
            check : check ,                           //查找聚类名称相同数据
            juleiList:[] ,                           //聚类名称相同的数据列表
            learnQuestion :'',
            learnId :'',


            //弹窗
            searchByKnowledgeTitle:searchByKnowledgeTitle,
            keyLogin:keyLogin,                                       //回车查询
            // paginationConf2 : {       //分页条件
            //     pageSize : 5  ,    //默认每页数量
            //     pagesLength: 10    //分页框数量
            // } ,
            paginationConf2 : {       //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchByKnowledgeTitle ,
                location:false
            } ,
            currQuestion:"",      // 关联弹窗
            knowledgeList:[],     //关联列表


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
            review:review,                        //审核
            clustering1 : '全部',                  //聚类
            clusteringList1:[],                                  //聚类数据
            getClusteringList1 : getClusteringList1,             //获取聚类列表
            associateCheck:associateCheck,              //关联查看
            currKnowledgeTitle:'' ,                    //关联查看弹窗表格数据

            //---------------------------------------
            //passStatusId:0,
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

        //设置本地存储


        function setStorage(titleVal,listData,question,id){

            if(titleVal==null){
                var obj = {
                    "title":"",
                    "extension":[{"question":question,"id":id }]
                }
            }else  if(titleVal!=null && titleVal!="全部" && titleVal!="未聚类"){
                localStorageService.set("localStorageKey",'');
                check(titleVal,listData);
                //var obj = {
                //          "title":"信用卡办理1",
                //          "extension":[{"question":"信用卡办理2","id":"460141182823956482"},{"question":"信用卡办理3","id":"460141182823956483"}]
                // }

                var obj = {
                    title : titleVal,
                    extension : $scope.vm.juleiList
                }
            }
            localStorageService.set("localStorageKey",JSON.stringify(obj));
            var sign =  localStorageService.get("localStorageKey");
            console.log(sign);
        }
        //查找聚类名称相同的知识
         function check(val,listData){
             var allLen = listData.length;
             angular.forEach(listData,function (obj) {
                 if(obj.clustering==val){
                     var object={};
                     object.question = angular.copy(obj.question);
                     object.id = angular.copy(obj.id);
                     $scope.vm.juleiList.push(object);
                     allLen-=1;
                 }
             }) ;
             console.log($scope.vm.juleiList);
         }

         //弹窗回车查询
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
         getClusteringList1();
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
                "status": 2,                             //传固定值,为审核
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
          * 学习
          **/
         function learn(id,clustering,question){
             $scope.vm.learnId = id ;
             $scope.vm.clusteringContent = clustering ;
             $scope.vm.learnQuestion = question ;

             console.log("======="+$scope.vm.knowledgeContent);

             let switch_knowledge_type = require('../../../views/division_knowledge/new_know_discovery_learn/switch_knowledge_type.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,switch_knowledge_type,'500px',function(){

             },function(){

             });
         }

         /**
          *  表格列表 未学习关联弹窗
          **/
         function searchByKnowledgeTitle(index){


             var i = layer.msg('查询中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
             if(nullCheck($("#inputValue").val())==true){

                 FunctionServer.searchByKnowledgeTitle.save({
                     "index": (index-1)*$scope.vm.paginationConf2.pageSize,
                     "pageSize": $scope.vm.paginationConf2.pageSize,
                     "title": $("#inputValue").val().trim(),
                 },function(data){
                     layer.close(i);
                     if(data.status==500){
                         layer.msg(data.info,{time:10000});
                     }
                     if(data.status==200){
                         console.log(data);
                         $scope.vm.knowledgeList = data.data.data;
                         $scope.vm.paginationConf2.currentPage =index ;
                         $scope.vm.paginationConf2.totalItems =data.data.total ;
                         $scope.vm.paginationConf2.numberOfPages = data.data.total/$scope.vm.paginationConf2.pageSize ;
                         console.log($scope.vm.paginationConf2);
                     }
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
            $scope.vm.knowledgeList=[];
            $scope.vm.currQuestion="用户问题:"+content;

            let associateLearn = require('../../../views/division_knowledge/new_know_discovery_learn/associate_learn.html');
            $scope.$parent.$parent.MASTER.openNgDialog($scope,associateLearn,'480px',function () {
                assembleLearnData(requestId);
            },function(){
                $scope.vm.knowledgeList = [];
                $scope.vm.paginationConf2.totalItems = null;

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
            //var knowledgeType=0;
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].checked) {
                    id_array.push(ids[i].value);
                    knowledgeTitle = $(ids[i]).attr("knowledgeTitle");
                   // knowledgeType = $(ids[i]).attr("knowledgeType");
                }
            }

            if (id_array.length == 0) {
                layer.msg("请选择要关联的知识");
                return;
            }

            FunctionServer.assembleLearnData.save({
                "id":requestId,
                "knowledgeId" : id_array.pop(),       //要关联的知识编号

            },function (data) {
                if(data.status==200){
                    console.log(data);
                    $state.reload();
                    //searchReinforcement($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    // listNoReview($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                }
                if(data.status==500){
                    layer.msg(data.info,{time:10000});
                }
            },function(err){
                $log.log(err);
            });
        }

         /**
          * 已学习关联知识查看
          * @param content
          * @param knowledgeTitle
          */
         function associateCheck(content,knowledgeTitle){
             $scope.vm.currQuestion="用户问题:"+content;
             $scope.vm.currKnowledgeTitle=knowledgeTitle;

             let associate_learn_check = require('../../../views/division_knowledge/new_know_discovery_learn/associate_learn_check.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,associate_learn_check,'450px',function(){

             },function () {

             });
         }


         /**
         * 通过 不通过
         **/
        function review(pass){
            var msg = "";
            if(pass==1){
                msg = "拒绝";
            }else if(pass==3){
                msg = "通过";
            }
            if ($scope.vm.studyArr.length == 0) {
                layer.msg("请选择要"+msg+"的记录！");
                return;
            }else{
                layer.confirm('确定要'+msg+'吗？',{
                    btn:['确定','取消']
                },function(){
                    FunctionServer.review.save({
                        "idList": $scope.vm.studyArr,              //知识编号
                        "status": pass                          //1:拒绝 3:通过
                    },function(data){
                        if(data.status==500){
                            layer.msg(data.info,{time:1000});
                        }
                        if(data.status==200){
                            layer.msg('审核完成');
                            clearSelect1();
                            layer.closeAll();
                            searchNewKnowledgeDiscovery($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                            listNoReview($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        }
                    },function(err){
                        $log.log(err);
                    });
                },function(err){
                    console.log(err);
                });
            }

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
                    $scope.vm.studyArr.push(item.id);
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