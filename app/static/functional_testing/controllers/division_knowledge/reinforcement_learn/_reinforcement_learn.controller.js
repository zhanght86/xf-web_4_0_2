/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
module.exports=functionalTestModule =>{
    functionalTestModule
    .controller('ReinforcementLearnController',
     ['$scope',"localStorageService","$state","$log","FunctionServer","$timeout","$stateParams","ngDialog","$cookieStore","$location",
     ($scope,localStorageService,$state,$log,FunctionServer, $timeout,$stateParams,ngDialog,$cookieStore,$location) => {
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
            channelId  : 130 ,
            timeType : 0,
            timeStart : '',
            timeEnd : '',
            ignore:ignore,             //忽略
            learn:learn,               //学习

            //未学习全选 单选；
            selectAllCheck : false,
            selectAll : selectAll,
            selectSingle : selectSingle,
            unstudyArr : [],

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



            //------已学习--------------
            listNoReview : listNoReview ,
            paginationConf1 : {    //分页条件
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: listNoReview ,
                location:true
            } ,
            listData1 : [] ,     // table 数据
            question1:'',
            channelId1  : 130 ,
            timeType1 : 0,
            timeStart1 : '',
            timeEnd1 : '',
            statusId:0,            //审核状态
            review:review,         //通过   不通过


            //已学习全选 单选；
            selectAllCheck1 : false,
            selectAll1 : selectAll1,
            selectSingle1 : selectSingle1,
            studyArr : [],

            //--------------------------
            //timeList : [],
            //currentPage : 1,





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
             FunctionServer.searchReinforcement.save({
                 "index": (index-1)*pageSize,
                 "pageSize": pageSize,
                 "startTime": $scope.vm.timeStart,
                 "endTime": $scope.vm.timeEnd,
                 "requestType" : $scope.vm.timeType,
                 "channelId": $scope.vm.channelId,
                 "question": question,
             },function(data){
                 layer.close(i);
                 if(data.status==200){
                     console.log(data);
                     clearSelect();
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
             FunctionServer.listNoReview.save({
                 "index": (index-1)*pageSize,
                 "pageSize": pageSize,
                 "startTime": $scope.vm.timeStart1,
                 "endTime": $scope.vm.timeEnd1,
                 "requestType":$scope.vm.timeType1,
                 "channelId": $scope.vm.channelId1,
                 "status": 2,                   //传固定值未审核
                 "question": question,

             },function(data){
                 layer.close(i);
                 if(data.status==200){
                     console.log(data);
                     clearSelect1();
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
          *  学习
          **/
         function learn(requestId,content){
             $scope.vm.knowledgeList=null;
             getRecommend(requestId);
             $scope.vm.currQuestion="用户问题:"+content;

             let study = require('../../../views/division_knowledge/reinforcement_learn/associate_learn.html');
             $scope.$parent.$parent.MASTER.openNgDialog($scope,study,'600px',function(){
                 assembleLearnData(requestId);
             },function () {

             });
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
         * 审核
         */
        function review(pass){
            var msg = "";
            if(pass==1){
                msg = "拒绝";
            }else if(pass==3){
                msg = "通过";
            }
            //$scope.vm.studyArr
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
                            listNoReview($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                            searchReinforcement($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
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