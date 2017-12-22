/**
 * @Author : MILES .
 * @Create : 2017/12/7.
 * @Module : 业务词概念管理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('BusinessConceptController', [
    '$scope', 'localStorageService' ,'BusinessModelingServer',"$http","$state" ,"ngDialog","$timeout","$location",
    ($scope,localStorageService,BusinessModelingServer,$http,$state,ngDialog,$timeout,$location) =>{
        $scope.vm = {
            listData : "",   // table 数据
            topic:"",
            key: "" ,
            oldKey: "" ,
            term: "",
            relate:"",      //相关问
            termList:'',
            weight: "33" ,   //默認權重
            dialogTitle : "",
            downloadTemplate:downloadTemplate,
            exportAll:exportAll,
            batchUpload:batchUpload,
            paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : loadSynonymConceptTable,
                location : true
            }, 
            listData : "",   // table 数据  
            keyNullOrBeyondLimit:"概念类名不能为空或超过长度限制50",
            termNullOrBeyondLimit:"概念集合不能为空或超过长度限制5000",
            loadSynonymConceptTable:loadSynonymConceptTable,
            selectAll:selectAll,           //全选
            selectSingle:selectSingle,     //单选 
            singleAdd : singleAdd,
            editSingle : editSingle,
            deleteSingle:deleteSingle,
            batchDelete:batchDelete,         //批量删除
            addConcept : addConcept,    //新增概念
            ids:[],
        };

        //查询/请求列表 
         loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function loadSynonymConceptTable(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
                // $location.search().currentPage = 1 ;
            }
            let i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            BusinessModelingServer.busConceptGetParam.save({
                "topic":$scope.vm.topic,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
            },(data)=>{
                layer.close(i);
               if(data.status==200){
                 $scope.vm.listData = data.data.data;
                $scope.vm.paginationConf.totalItems = data.data.total;
                 $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
               }else{
                  layer.close(i);
               }
            },(err)=>{
                 layer.close(i);
            })
        }
       
       

    //概念单条新增
        function singleAdd(){
            assembleSynonymConceptTerm();
            assembleBusinessConceptRelate();
            BusinessModelingServer.busConceptAdd.save({
                "topic":  $scope.vm.key,
                "termList":$scope.vm.term,
                "weight": $scope.vm.weight,
                "relate":$scope.vm.relate,
            },(data)=>{
                 if(data.status==200){
                    layer.msg(data.info)
                     loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                }else if(data.status==500){
                    layer.msg(data.info)
                }
            })
        }
    //概念编辑       
        function editSingle(item){
            console.log(item)
            console.log(item.term.split(";"))
            console.log(item.relate.split(";"))
            $scope.vm.dialogTitle="编辑业务概念";
            $scope.vm.key = item.topic;
            $scope.vm.id = item.id;
            $scope.vm.term =  item.term.split(";");
            $scope.vm.relate =  item.relate;
            $scope.vm.weight =  item.weight
            addSynonymConceptDialog(singleEditSynonymConcept,item);
        }
      //編輯事件
    function singleEditSynonymConcept(item){
        assembleBusinessConceptRelate();
        assembleSynonymConceptTerm();
        console.log(item)
        console.log($scope.vm.item)
        BusinessModelingServer.busConceptUpdate.save({
            "id":item.id,
            "topic":  $scope.vm.key,
            "weight":  $scope.vm.weight,
            "termList": $scope.vm.term,
            "relate":$scope.vm.relate,
        },(data)=>{
           if(data.status==200){
                layer.msg(data.info);
                 loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                $scope.vm.key = "";
                $scope.vm.oldKey = "";
                $scope.vm.term = "";
                 $scope.vm.relate = "";
                $scope.vm.weight = 33;
            }else{
                layer.msg(data.info)
                $scope.vm.key = "";
                $scope.vm.oldKey = "";
                $scope.vm.term = "";
                 $scope.vm.relate = "";
                $scope.vm.weight = 33;
            }
        })
    }
       
        //添加窗口
        function addConcept(){
                $scope.vm.key = "";
                $scope.vm.oldKey = "";
                $scope.vm.term = "";
                 $scope.vm.relate = "";
                $scope.vm.weight = 33;
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/concept/business/business_dialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:(e)=>{    //关闭回掉
                    if(e === 1){
                        if(lengthCheck($scope.vm.key,0,50)==false){
                            $("#keyAddError").html($scope.vm.keyNullOrBeyondLimit);
                            return false;
                        }
                        BusinessModelingServer.busConceptRepeat.get({
                            "value":$scope.vm.key
                        },(data)=>{
                            //类名重複
                            if(data.status==200&&data.data==true){
                                layer.confirm("您添加的概念类已经在，是否前往编辑？",{
                                    btn:['前往','取消'],
                                    shade:false
                                },(index)=>{
                                    layer.close(index);
                                    BusinessModelingServer.busConceptGetParam.save({
                                        "topic":$scope.vm.topic,
                                        "index": 0,
                                        "pageSize": 1,
                                    },(data)=>{
                                        $scope.vm.dialogTitle="编辑业务概念";
                                        $scope.vm.key = data.data.data[0].topic;
                                        $scope.vm.term =  data.data.data[0].term.split(";");
                                        $scope.vm.weight =  data.data.data[0].weight;
                                        $scope.vm.id =  data.data.data[0].id; 
                                        $scope.vm.relate =  data.data.data[0].relate.split(";");
                                        addSynonymConceptDialog(singleEditSynonymConcept,data.data.data[0]);
                                        console.log("cancel");
                                    });
                                },()=>{
                                    console.log("cancel");
                                });
                            }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加业务概念";
                                addSynonymConceptDialog(singleAdd);
                            }
                        },()=>{
                            console.log('添加失败');
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.oldKey = "";
                        $scope.vm.term = "";
                        $scope.vm.relate = "";
                        $scope.vm.weight = 33;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    relateSpliterTagEditor();
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
                template:"/static/business_modeling/views/concept/business/business_dialog2.html",
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
                        var objRelate = $("#relate").next();
                        var term = [];
                        var length = obj.find("li").length;
                        var relate = "";
                        var lengthRelate = objRelate.find("li").length;
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
                                        term.push($(value1).html());
                                    }
                                });
                            }
                        });
                         $.each(objRelate.find("li"),function(index,value){
                            if(index>0){
                                $.each($(value).find("div"),function(index1,value1){
                                    if(index1==1){
                                        relate+=$(value1).html()+";";
                                    }
                                });
                            }
                        });
                        console.log(term)
                        $scope.vm.term=term;
                        if(lengthCheck(term.join(";"),0,500)==false){
                            $("#termAddError").html($scope.vm.termNullOrBeyondLimit);
                            return false;
                        }else if(relate!=""){
                             relate=relate.substring(0,relate.length-1);
                            $scope.vm.relate=relate;
                            if(lengthCheck(relate,0,5000)==false){
                                $("#relateAddError").html($scope.vm.relateNullOrBeyondLimit);
                                return false;
                            }else{
                                $("#relateAddError").html('');
                            }
                        }else{
                            $("#termAddError").html('');
                        }
                        callback(item);
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.oldKey = "";
                        $scope.vm.term = "";
                        $scope.vm.weight = 33;
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    termSpliterTagEditor();
                    relateSpliterTagEditor();
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
        
        //刪除彈框
        function deleteSingle(id){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/concept/delete.html",
                scope: $scope,
                width: '260px',
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    httpRequestPost("/api/ms/concept/business/delete/"+id+"",{
                    },function(data){
                        if(data.status==200){
                             layer.msg("删除成功",{time:2000})
                             loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                        }
                    });
                 }
                }
            });
        }
       //批量删除
        function batchDelete(){
            if($scope.vm.ids.length==0){
               layer.msg("请选择要删除的概念",{time:2000})
               return false
            }
            BusinessModelingServer.busConceptAllDelete.save({
                 "conceptIds":$scope.vm.ids
            },(data)=>{
               if(data.status==200){
                    console.log(data)
                     loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    layer.msg("删除成功");
                    initBatchTest();
               }
            })
        }

        //批量导入
        function batchUpload(){
            var dialog = ngDialog.openConfirm({
                template:"/static/businessModeling/batchUpload.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    //refresh
                     loadSynonymConceptTable($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/concept/synonym/batchAdd?applicationId='+$scope.vm.applicationId+'&modifierId='+$scope.vm.modifier);
                }, 100);
            }
        }
         //全选
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.ids = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.ids=[];
                angular.forEach($scope.vm.listData,function (val) {
                    $scope.vm.ids.push(val.id);
                })
            }
            console.log($scope.vm.ids);
        }
        //单选
        function selectSingle(id){
            if($scope.vm.ids.inArray(id)){
                $scope.vm.ids.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.ids.push(id);

            }
            if($scope.vm.ids.length==$scope.vm.listData.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.ids);
            }
            //全选清空
            function initBatchTest(){
                $scope.vm.isSelectAll=false;
                $scope.vm.ids=[];

            }
       



        //初始化tagEditor插件
        function termSpliterTagEditor() {
            var term = $scope.vm.term;
            if(term==""){
                $("#term").tagEditor({
                    forceLowercase: false
                });
            }else{
                var terms = term
                console.log(terms);
                console.log()
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
            var term = [];
            $.each(obj.find("li"),function(index,value){
                if(index>0){
                    $.each($(value).find("div"),function(index1,value1){
                        if(index1==1){
                            term.push($(value1).html());
                        }
                    });
                }
            });
            $scope.vm.term=term;
        }

       //初始化tagEditor插件
        function relateSpliterTagEditor() {
            var relate = $scope.vm.relate;
            if(relate=="" || relate==null){
                console.log("===relate===");
                $("#relate").tagEditor({
                    forceLowercase: false
                });
            }else{
                var relates = relate.split(";");
                console.log(relates);
                $("#relate").tagEditor({
                    initialTags:relates,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: relates},
                    forceLowercase: false
                });
            }
        }
      
        function assembleBusinessConceptRelate(){
             var relate = $scope.vm.relate;
             console.log("----------")
             console.log(relate)
            if(relate=="" || relate==null){
                console.log("===relate===");
                $("#relate").tagEditor({
                    forceLowercase: false
                });
            }else{
                var relates = relate.split(";");
                console.log(relates);
                $("#relate").tagEditor({
                    initialTags:relates,
                    autocomplete: {delay: 0, position: {collision: 'flip'}, source: relates},
                    forceLowercase: false
                });
            }
        }



        function downloadTemplate(){
            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","","concept_with_weight_template.xlsx");
        }
        function exportAll(){
            httpRequestPost("/api/ms/modeling/concept/synonym/export",{
                "synonymConceptApplicationId":$scope.vm.applicationId
            },function(data){
                    for(var i=0;i<data.exportFileNameList.length;i++){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[0]);
                    }
                
            });
        }
    }
])};