/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  要素知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('FactorEditController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"ngDialog","$cookieStore","$timeout","$compile",
    "knowledgeAddServer","$window","$stateParams","$interval","$rootScope","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,$compile,
     knowledgeAddServer,$window,$stateParams,$interval,$rootScope,$filter) =>{
        $state.go("KM.factor");
        $scope.vm = {
            ctrName : "list" ,
            apiQueryRelatedQuestion : "queryFactorRelatedQuestion" , // 相关问 api
            localNameOfExt : "cust_factor_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            knowledgeOrigin : 120 , //知识来源
            knowledgeId : "",       // 知识编辑 id
//时间
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
//扩展问
            extensions : [],      //手動生成
//展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览

            frames : [],      //业务框架
            frameId : "",
            botRoot : "",      //根节点
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
//bot
            creatSelectBot : [], //手选生成 bot
            botFullPath : "",
//高级选项内容
            newTitle: "",    //标题
            channelIdList : [],     //新添加的 channel
            dimensionArr : [],  //選擇的維度
            question : 1,   //相关问题
            tip : 1,        // 提示
            tail : 1 ,      //尾巴
            appointRelativeGroup : [],  //相关知识


            replaceType : 0 ,
            enterEvent : enterEvent,  //鍵盤事件
            //表格
            addList : addList,  //table 添加列
            editList : editList , //编辑表格
            tableRow : null,   //行
            tableColumn : null,  //刪除用
            tableChange : tableChange  ,//編輯
            tableRemove : tableRemove, //删除行或列
            addRow : addRow,   //添加行
            gorithm : ['NLP'], //语义挖掘
            tableType : "字符串",   //类型
            factorName : null,   //要素名称
            reQuestion : null, //反问

            tableList: "",
            listTableType: "",
            data : "",
            column:"" ,
            tableSaveCheck : tableSaveCheck ,  // 添加的行列是否符合要求

            limitSave : false ,//限制多次打标
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
        };
        //标题
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 时间
            $scope.vm.isTimeTable = (data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd) ;
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            $scope.vm.knowledgeOrigin = data.knowledgeBase.knowledgeOrigin ;
            //扩展问
            $scope.vm.extensions = data.extensionQuestions;
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                $scope.vm.tableList = {
                    data : item.knowledgeContent
                } ;
                $scope.vm.channelIdList = item.channelIdList ;
                $scope.vm.dimensionArr = item.dimensionIdList ;
                $scope.vm.question =item.knowledgeRelatedQuestionOn ;   //显示相关问
                $scope.vm.tip  =  item.knowledgeBeRelatedOn ; //在提示
                $scope.vm.tail = item.knowledgeCommonOn ;   //弹出评价小尾巴
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList!=null?item.knowledgeRelevantContentList : [];  //业务扩展问
            });
        } else if($stateParams.knowledgeTitle){
            console.log("======"+$stateParams.knowledgeTitle);
            $scope.vm.title=$stateParams.knowledgeTitle;
        }else{
            init();
        }
        function init(){
            $scope.vm.tableList = {
                "data": {"listTable" : new Array(new Array("产品名称"))}
            };
            $scope.vm.listTableType = [];
            var newType = {};
            newType.elementName = "产品名称";
            newType.elementType = "字符串";
            newType.technology = null;
            newType.elementAsk = "";
            newType.relatedQuestions = null;
            $scope.vm.listTableType.push(newType);
            $scope.vm.tableList.data.listTableType=$scope.vm.listTableType;
        }
        function tableChange(row, col ,val){
            $scope.vm.tableList.data.listTable[row][col] = val;
        }
        function tableRemove(type){
            switch (type){
                case 1:
                    if($scope.vm.tableRow==0){
                        layer.msg("不可删除第一行")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的行")
                    }else{
                        $scope.vm.tableList.data.listTable.splice($scope.vm.tableRow,1);
                        $scope.vm.tableRow = null
                    }
                    break;
                case 2:
                    if($scope.vm.tableColumn==0){
                        layer.msg("不可删除第一列")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的列")
                    }else{
                        angular.forEach($scope.vm.tableList.data.listTable,function(item,tableRow){
                            angular.forEach(item,function(val,index){
                                if(index == $scope.vm.tableColumn){
                                    $scope.vm.tableList.data.listTable[tableRow].splice(index,1)
                                }
                            })
                        });
                        $scope.vm.tableList.data.listTableType.splice($scope.vm.tableColumn,1) ;
                        $scope.vm.tableColumn = null
                    }
                    break;
            }
        }
        function addRow(){
            var len = $scope.vm.tableList.data.listTable[0].length;
            var arr = new Array(len);
            $scope.vm.tableList.data.listTable.push(arr);
        }
        //检验是否合理保存 ==> 检查要素名称以及反问
        function tableSaveCheck(close){
            if(!$scope.vm.factorName){
                layer.msg("请填写要素名称后保存")
            }else if(!$scope.vm.elementAsk){
                layer.msg("请填写反问后保存")
            }else{
                close(1)
            }
        }
        function addList(row,column,data){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/single_add/factor/column.html","695px",function(){
                angular.forEach($scope.vm.tableList.data.listTable, function (item, index) {
                    if (index == 0) {
                        $scope.vm.tableList.data.listTable[index].push($scope.vm.factorName)
                    } else {
                        $scope.vm.tableList.data.listTable[index].push(null)
                    }
                });
                var newType = {
                    "elementName" : $scope.vm.factorName ,
                    "elementType" : $scope.vm.tableType ,
                    "technology" : $scope.vm.gorithm ,
                    "elementAsk" : $scope.vm.elementAsk ,
                    "relatedQuestions" :null
                };
                $scope.vm.tableList.data.listTableType.push(newType);

            },"",function(){setDialogNew();})
        }

        function editList(row,column){
            $scope.vm.factorName = $scope.vm.tableList.data.listTableType[column].elementName;
            $scope.vm.tableType = $scope.vm.tableList.data.listTableType[column].elementType;
            $scope.vm.gorithm=$scope.vm.tableList.data.listTableType[column].technology;
            $scope.vm.elementAsk = $scope.vm.tableList.data.listTableType[column].elementAsk;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/knowledge_manage/single_add/factor/column.html","695px",function(){
                $scope.vm.tableList.data.listTableType[column].elementName =  $scope.vm.factorName;
                $scope.vm.tableList.data.listTableType[column].elementType = $scope.vm.tableType;
                $scope.vm.tableList.data.listTableType[column].technology =  $scope.vm.gorithm;
                $scope.vm.tableList.data.listTableType[column].elementAsk = $scope.vm.elementAsk;
                $scope.vm.tableList.data.listTable[0][column] = $scope.vm.factorName;
            },"",function(){ setDialogNew();})
        }
        function getTableParams(){
            if(!$scope.vm.tableList.data){
                console.log("请上传表格知识") ;
                return false ;
            }else{
                var tabelData = angular.copy($scope.vm.tableList.data);
                var params = {} ;
                var ask = [] ;
                var items = [];
                // 反问
                angular.forEach(tabelData.listTableType, function (item,index) {
                    if(index>0){
                        var obj = {};
                        obj.name = item.elementName;
                        obj.value = item.elementAsk ;
                        ask.push(obj) ;
                    }
                });
                angular.forEach(tabelData.listTable,function(item,icon){
                    if(icon>0){
                        var row = {} ;
                        row.name = item[0] ;
                        row.slots =[];
                        angular.forEach(tabelData.listTableType, function (val,cur) {
                            if(cur>0){
                                var slot = {} ;
                                slot.name = val.elementName;
                                slot.value = tabelData.listTable[icon][cur];
                                slot.type = val.elementType ;
                                slot.algorithm = val.technology;
                                row.slots.push(slot)
                            }
                        });
                        items.push(row)
                    }
                });
                params.asks = ask;
                params.items = items;
                return JSON.stringify(params)
            }
         }
        function setDialogNew(){
            $scope.vm.factorName = null ;
            $scope.vm.tableType = "字符串";
            $scope.vm.gorithm = ['NLP'];
            $scope.vm.elementAsk = null;
        }
// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10013,
                "index": 0,
                "pageSize":32767
            },function(data){
                //console.log(data);
                if(data.status!=10005){
                    if(data.data.length){
                        $scope.vm.frames = $scope.vm.frames.concat(data.data) ;
                        $scope.$apply();
                    }
                }
            },function(){
                console.log("err or err")
            });
        }
        $scope.$watch("vm.frameCategoryId",function(val,old){
            if(val&&val!=old){
                getFrame( val )
            }
        });

        //replace()
        //  根據框架添加擴展問  --》 替換原來的條件
        $scope.$watch("vm.frameId",function(val,old){
            if(val&&val!=old){
                //if($scope.vm.extensions.length){
                //    //  替換條件
                //    replace(val);
                //}else{
                    // 在未生成扩展问情況
                    getTableListByFrame(val);
                //}
            }
        });

        // 通过frame 获取扩展问
        function getTableListByFrame(id,type){
            //console.log(id);
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameTypeId": 10013,
                "frameId": id,
                "index": 0,
                "pageSize":32767
            },function(data){
                if(data.status==10000){
                    if(data.data[0].elements){
                        $.each(data.data[0].elements,function(index,value){
                            console.log("===="+value.elementContent);
                            var addFlag = true;
                            for(var i=0;i<$scope.vm.tableList.data.listTable[0].length;i++){
                                console.log("==="+$scope.vm.tableList.data.listTable[0][i]);
                                if($scope.vm.tableList.data.listTable[0][i]==value.elementContent){
                                    addFlag=false;
                                }
                            }
                            if(addFlag==true){
                                $scope.vm.tableList.data.listTable[0].push(value.elementContent);
                                var newType = {};
                                newType.elementName = value.elementContent;
                                newType.elementType = switchContentType(value.elementTypeId);
                                var miningTypeArr = [];
                                miningTypeArr.push(switchMiningType(value.elementMiningTypeId));
                                newType.technology = miningTypeArr;
                                newType.elementAsk = value.elementAskContent;
                                newType.relatedQuestions = value.elementRelateConcept;
                                $scope.vm.tableList.data.listTableType.push(newType);
                                $scope.$apply();
                            }
                        });
                    }
                }
            },function(){
                 console.log("获取表格失败") ;
            });
        }

        function switchMiningType(type){
            var returnStr = "NLP";
            //var returnStr = "OEC";                   //nnf-6.21修改
            // switch(type){
            //     case 10017:
            //         returnStr = "OEC";
            //         break;
            //     case 10018:
            //         returnStr = "GATE";
            //         break;
            // }
            return returnStr;
        }

        function switchContentType(type){
            var returnStr = "字符串";
            switch(type){
                case 10014:
                    returnStr = "字符串";
                    break;
                case 10015:
                    returnStr = "日期";
                    break;
                case 10016:
                    returnStr = "范围";
                    break;
            }
            return returnStr;
        }

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
        function replace(id){
                var replace = ngDialog.openConfirm({
                    template:"/static/knowledgeManagement/faq/replace.html",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){     //关闭回掉
                        if(e === 1){    //替换
                            getTableListByFrame( id ,1 )
                        }else if(e === 0){
                            // 添加不替换
                            getTableListByFrame( id ,0 )
                        }
                    }
                });
        }

        //  主页保存 获取参数
        function getParams(){
            console.log(getTableParams()) ;
           var  params =  {
                "applicationId": APPLICATION_ID,
                "knowledgeId": $scope.vm.knowledgeId ,
                "userId" : USER_ID ,
                "sceneId" : SCENE_ID ,
                "knowledgeType": 103,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:null,  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:null,     //结束时间
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME ,  //操作人
                "knowledgeOrigin" : $scope.vm.knowledgeOrigin  
            };
            var obj = {
                knowledgeContent : getTableParams(),
                channelIdList :  $scope.vm.channelIdList,
                dimensionIdList :  $scope.vm.dimensionArr.length?$scope.vm.dimensionArr:$scope.vm.dimensionsCopy.id,
                knowledgeRelatedQuestionOn : $scope.vm.question ,   //显示相关问
                knowledgeBeRelatedOn  :  $scope.vm.tip , //在提示
                knowledgeCommonOn : $scope.vm.tail ,   //弹出评价小尾巴
                knowledgeRelevantContentList : $scope.vm.appointRelativeGroup //业务扩展问
            };
            params.knowledgeContents =  new Array(obj);
            params.extensionQuestions =  $scope.vm.extensions;
            params.classificationAndKnowledgeList = $scope.vm.creatSelectBot;
            return params
        }
        //限制一个知识多次保存
        var limitTimer ;
        function save(api) {
                if (!checkSave()) {
                    return false
                } else {
                    if(!$scope.vm.limitSave){
                        $timeout.cancel(limitTimer) ;
                        $scope.vm.limitSave = true ;
                        limitTimer = $timeout(function(){
                            $scope.vm.limitSave = false ;
                        },180000) ;
                        KnowledgeService[api].save(getParams(),function (data) {
                            if (data.status == 200) {
                                $state.go('knowledgeManagement.custOverview');
                            } else if (data.status == 500) {
                                layer.msg("知识保存失败") ;
                                $timeout.cancel(limitTimer) ;
                                $scope.vm.limitSave = false ;
                                console.log($scope.vm.limitSave)
                            }
                        }, function (err) {
                            $timeout.cancel(limitTimer) ;
                            $scope.vm.limitSave = false ;
                        })
                }
            }
        }
        function scan(api){
            if(!checkSave()){
                return false
            }else{
                $window.knowledgeScan = {
                    api : api ,
                    params : getParams(),
                    editUrl : "knowledgeManagement.factorAdd",
                    knowledgeType : 103
                };
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        }
//        提交 检验参数
        function checkSave(){
            console.log(getParams()) ;
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false;
            }else if(!params.knowledgeContents[0].channelIdList.length){
                layer.msg("渠道不能为空") ;
                return false ;
            }else if($scope.vm.tableList.data.listTable[0].length<=1 || $scope.vm.tableList.data.listTable.length<=1){
                layer.msg("请完善表格知识");
                return false;
            }else{
                return true
            }
        }
        //引导页方法
        function showTip(){
            $('.shadow_div').show();
            $('.step_div').show();
            $('#step_one').show().siblings().hide();

        }
        function hideTip(){
            $('.shadow_div').hide();
            $('.step_div').hide();
        }

        //上一个
        function prevDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().prev()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().prev().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().prev().offset().top-20
                }, 500);
            }else{
                // $(obj).attr('disabled',true);
                return;
            }
        }
        //下一个
        function nextDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().next()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().next().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().next().offset().top-20
                }, 500);
            }else{
                //$(obj).attr('disabled',true);
                return;
            }
        }
        //引导页方法end

    }])};