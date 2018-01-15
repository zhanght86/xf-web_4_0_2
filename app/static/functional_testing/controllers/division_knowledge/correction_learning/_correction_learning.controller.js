/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=functionalTestModule =>{
    functionalTestModule
    .controller('CorrectionLearnController',
     ['$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore","$location",
     ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore,$location,) => {
        $scope.vm = {
            contentType : 0,    //默认显示未学习；
            //--------未学习------------
            searchReinforcement : searchReinforcement ,
            paginationConf : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchReinforcement ,
                location:true
            } ,
            listData : [] ,     // table 数据
            question:'',
            //channelId  : 130 ,
            timeType : '',
            timeStart : '',
            timeEnd : '',
            ignore:ignore,             //忽略


            //-----弹窗
            inputValue :'',
            keyLogin:keyLogin,
            knowledgeList:[],          //学习弹窗，关联知识列表
            currQuestion:"",           //学习弹窗问题
            searchByKnowledgeTitle:searchByKnowledgeTitle,       //弹窗查询
            paginationConf2 : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchByKnowledgeTitle ,
                location:true
            } ,
            unLearnLook : unLearnLook,          //查看
            unlearnContent : unlearnContent,     //上下文
            talkDetail : [],                     //上下文数据列表
            unlearnRelation : unlearnRelation ,           //关联其他
            unlearnRelationTit :'',

            studyData :[],
            paginationConf3 : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: getUnstudyData ,
                location:true
            } ,

            //----------------------已学习--------------
            listNoReview : listNoReview ,
            paginationConf1 : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: listNoReview ,
                location:true
            } ,
            listData1 : [] ,     // table 数据
            question1:'',
            //channelId1  : 130 ,
            timeType1 : '',
            timeStart1 : '',
            timeEnd1 : '',
            review:review,         //通过   不通过

            learnLook : learnLook,          //查看
            currQuestion1 :'',
           // learnContent : learnContent,     //上下文
            paginationConf4 : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: getstudyData ,
                location:true
            } ,
            studyData1 :[],


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
        searchReinforcement($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        listNoReview($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
         /**
          * 表格列表 未学习
          */
         function searchReinforcement(index,pageSize,reset){
             if(reset){
                 $scope.vm.paginationConf.currentPage=1;
                 $location.search('currentPage',1);
             }

             var question = null;
             if(nullCheck($scope.vm.question)==true){
                 question = "%"+$scope.vm.question+"%";
             }
             var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
             FunctionServer.unStudy.save({
                 "index": (index-1)*pageSize,
                 "pageSize": pageSize,
                 "startTime": $scope.vm.timeStart,
                 "endTime": $scope.vm.timeEnd,
                 "requestType":$scope.vm.timeType,
                 "question": question,

             },function(data){
                 layer.close(i);
                 if(data.status==200){
                     console.log(data);
                    // clearSelect();
                     $scope.vm.listData = data.data.data;
                     $scope.vm.paginationConf.currentPage =index ;
                     $scope.vm.paginationConf.totalItems =data.data.total ;
                     $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                     console.log($scope.vm.paginationConf);
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
          * 表格列表 已学习
          */
         function listNoReview(index,pageSize,reset){
             if(reset){
                 $scope.vm.paginationConf.currentPage=1;
                 $location.search('currentPage',1);
             }
             var question = null;
             if(nullCheck($scope.vm.question1)==true){
                 question = "%"+$scope.vm.question1+"%";
             }
             var i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
             FunctionServer.studyed.save({
                 "index": (index-1)*pageSize,
                 "pageSize": pageSize,
                 "startTime": $scope.vm.timeStart1,
                 "endTime": $scope.vm.timeEnd1,
                 "requestType":$scope.vm.timeType1,
                 "status":2,
                 "question": question,

             },function(data){
                 layer.close(i);
                 if(data.status==200){
                     console.log(data);
                     //clearSelect1();
                     $scope.vm.listData1 = data.data.data;
                     $scope.vm.paginationConf1.currentPage =index ;
                     $scope.vm.paginationConf1.totalItems =data.data.total ;
                     $scope.vm.paginationConf1.numberOfPages = data.data.total/$scope.vm.paginationConf1.pageSize ;
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
          * 表格列表 学习弹窗
          */
         function searchByKnowledgeTitle(index){
             var i = layer.msg('查询中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
             $scope.vm.knowledgeList=[];
             if(nullCheck($("#inputValue").val())==true){
                 //if(nullCheck($scope.vm.inputValue)==true){
                 FunctionServer.searchByKnowledgeTitle.save({
                     "index": (index-1)*$scope.vm.paginationConf2.pageSize,
                     "pageSize": $scope.vm.paginationConf2.pageSize,
                     "title": $("#inputValue").val().trim(),
                     //"title": $scope.vm.inputValue,

                 },function (data) {
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

         //关联其他
         function unlearnRelation(requestId,question){
             //alert("关联其他");
             $scope.vm.knowledgeList = [];
             getRecommend(requestId);
            $scope.vm.unlearnRelationTit = question;

             let unlearn_relation = require('../../../views/division_knowledge/correction_learning/unlearn_relation.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,unlearn_relation,'600px',function(){
                 assembleLearnData(requestId);
             },function(){

             },'',2)

         }
         /**
          * 获取推荐知识
          * @param requestId
          */
         function getRecommend(requestId){
             console.log("====="+requestId);
             FunctionServer.getRecommend.get({
                 "id": requestId
             },function(data){
                 if(data.status==200){
                     console.log(data);
                     $scope.vm.knowledgeList = data.data;
                 }
             },function(err){
                 $log.log(err);
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
             //console.log('aaaaaaaaaaaa'+id_array.pop());
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
          * 未学习查看
          ***/
         function unLearnLook(index,knowledgeId,knowledgeTitle){
             $scope.vm.currQuestion = knowledgeTitle;
             getUnstudyData(index,knowledgeId);
             let unLearnLook = require('../../../views/division_knowledge/correction_learning/unlearn_look.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,unLearnLook,'900px',function(){

             },function(){

             })

         }
         //未学习获取查看数据
         function getUnstudyData(index,knowledgeId){
             FunctionServer.getUnstudyData.save({
                 "index": (index-1)*$scope.vm.paginationConf3.pageSize,
                 "pageSize": $scope.vm.paginationConf3.pageSize,
                 "startTime": $scope.vm.timeStart,
                 "endTime": $scope.vm.timeEnd,
                 "requestType":$scope.vm.timeType,
                 "knowledgeId":knowledgeId
             },function(data){
                 if(data.status==200){
                     console.log(data);
                     $scope.vm.studyData = data.data.data;
                     $scope.vm.paginationConf3.currentPage =index ;
                     $scope.vm.paginationConf3.totalItems =data.data.total ;
                     $scope.vm.paginationConf3.numberOfPages = data.data.total/$scope.vm.paginationConf3.pageSize ;
                     console.log($scope.vm.paginationConf3);
                 }
                 if(data.status==500){
                     layer.msg(data.info,{time:10000});
                 }
             },function(err){
                 console.log(err);
             });
         }

         /**
          * 已学习查看
          ***/
         function learnLook(index,knowledgeId,knowledgeTitle){
             $scope.vm.currQuestion1 = knowledgeTitle;
             getstudyData(index,knowledgeId);

             let learnLook = require('../../../views/division_knowledge/correction_learning/learn_look.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,learnLook,'900px',function(){

             },function(){

             })
         }
         //已学习获取查看数据
         function getstudyData(index,knowledgeId){
             FunctionServer.getstudyData.save({
                 "index": (index-1)*$scope.vm.paginationConf4.pageSize,
                 "pageSize": $scope.vm.paginationConf4.pageSize,
                 "startTime": $scope.vm.timeStart1,
                 "endTime": $scope.vm.timeEnd1,
                 "requestType":$scope.vm.timeType1,
                 "status":2,
                 "knowledgeId":knowledgeId
             },function(data){
                 if(data.status==200){
                     console.log(data);
                     $scope.vm.studyData1 = data.data.data;
                     $scope.vm.paginationConf4.currentPage =index ;
                     $scope.vm.paginationConf4.totalItems =data.data.total ;
                     $scope.vm.paginationConf4.numberOfPages = data.data.total/$scope.vm.paginationConf4.pageSize ;
                     console.log($scope.vm.paginationConf4);
                 }
                 if(data.status==500){
                     layer.msg(data.info,{time:10000});
                 }
             },function(err){
                 console.log(err);
             });
         }

         // 未学习上下文
         function unlearnContent(requestId){
             //alert("上下文");
             let unlearnContent = require('../../../views/division_knowledge/correction_learning/unlearn_content.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,unlearnContent,'800px',function(){

             },function(){

             },'',2)

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


         // 上下文
         // function learnContent(requestId){
         //     //alert("上下文");
         //     let learnContent = require('../../../views/division_knowledge/correction_learning/learn_content.html');
         //     $scope.$parent.$parent.MASTER.openNgDialog($scope,learnContent,'800px',function(){
         //
         //     },function(){
         //
         //     },'',2)
         //
         // }

        /**
         *  忽略
         **/
        function ignore(id){
            layer.confirm('确认要忽略吗？',{
                btn:['确定','取消']
            },function(){
                FunctionServer.ignoreSig.get({
                    "id":id
                },function(data){
                    if(data.status==200){
                        layer.msg("文件忽略成功");
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

         /**
          * 审核
          */
         function review(pass,id){
             var msg = "";
             if(pass==1){
                 msg = "拒绝";
             }else if(pass==3){
                 msg = "通过";
             }

             layer.confirm('确定要'+msg+'吗？',{
                 btn:['确定','取消']
             },function(){
                 FunctionServer.reviewSig.save({
                     "id": id,              //知识编号
                     "status": pass                          //1:拒绝 3:通过
                 },function(data){
                     if(data.status==500){
                         layer.msg(data.info,{time:1000});
                     }
                     if(data.status==200){
                         layer.msg('审核完成');
                         layer.closeAll();
                         searchReinforcement($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
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
])};