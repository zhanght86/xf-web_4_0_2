/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('knowledgeEssentialController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","$interval","$rootScope","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,$interval,$rootScope,$filter) {
        $scope.vm = {
            knowledgeId : "" ,
            knowledgeOrigin : 120 ,
            frames : [],      //业务框架
            frameId : "",
            botRoot : "",      //根节点
            knowledgeBotVal : "",  //bot 内容
            botSelectAdd : botSelectAdd,
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            //生成  知识标题 打标生成 BOT 扩展问
            getBotAndExtensionByTitle : getBotAndExtensionByTitle,
            //creatBot : [],

            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :60,
            getExtension : getExtension,  //獲取擴展問
            extensions : [],      //手動生成
            extensionByTitleTag : [] , //标题打标生成扩展问
            extensionEdit : extensionEdit,
            botFullPath : "",

            //展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览
            //高级选项
            newTitle: "",    //标题
            channel : [],     //新添加的 channel
            channelArr : [] ,
            selectChannel : selectChannel , //獲取渠道
            dimension  : "",
            dimensions : []
            ,  //所有维度
            dimensionArr : [],  //選擇的維度
            dimensionsCopy :[]
            ,

            //高级选项内容
            slideDown : slideDown,
            slideFlag : false,

            question : 1,
            tip : 1,
            tail : 1 ,

            knowledgeTitleTag : [],

            appointRelative : "",
            appointRelativeList :[],
            addAppoint  : addAppoint,

            appointRelativeGroup : [],
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
//*******************2017/8/3  BEGIN   删除扩展问本地备份 *******************//
            rmExtensionBackup : [] ,
//*******************2017/8/3  END   删除扩展问本地备份   *******************//
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
            isDecorateSimple : false  ,// true 单独修饰  false  整体修饰
            backupsOfExtension : "" ,//扩展问 编辑备份
            backUpExt: backUpExt , // 扩展问 假删除
            extensionDeleted : []
        };
        //獲取渠道
        $scope.$parent.$parent.MASTER.getDimensions($scope,["dimensions","dimensionsCopy"]) ;

        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 标题打标结果
            $scope.vm.knowledgeTitleTag = data.knowledgeBase.knowledgeTitleTag ;
            // 时间
            if(data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd){
                $scope.vm.isTimeTable = true
            }
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
                var obj = {} ;
                //obj.knowledgeContent = item.knowledgeContent;
                $scope.vm.tableList = {} ;
                $scope.vm.tableList.data = item.knowledgeContent ;
                //維度，添加預覽效果   以name id 的 形式显示
                obj.channelIdList =  item.channelIdList ;
                obj.dimensionIdList =  item.dimensionIdList ;

                $scope.vm.channel = item.channelIdList ;
                $scope.vm.dimensionArr = [] ;
                    //异步原因
                var getDimension = $interval(function(){
                        if($scope.vm.dimensions){
                            $interval.cancel(getDimension);
                            angular.forEach($scope.vm.dimensions,function(val){
                                if(item.dimensionIdList.inArray(val.dimensionId)){
                                    var obj = {};
                                    obj.dimensionName = val.dimensionName;
                                    obj.dimensionId = val.dimensionId;
                                    $scope.vm.dimensionArr.push(obj);
                                    console.log( $scope.vm.dimensionArr )
                                }
                            });
                        }
                    },100) ;
                $scope.vm.question =item.knowledgeRelatedQuestionOn ;   //显示相关问
                $scope.vm.tip  =  item.knowledgeBeRelatedOn ; //在提示
                $scope.vm.tail = item.knowledgeCommonOn ;   //弹出评价小尾巴
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList!=null?item.knowledgeRelevantContentList : [];  //业务扩展问
            });
        }else{
            init();
        }
        if($stateParams.knowledgeTitle){
            console.log("======"+$stateParams.knowledgeTitle);
            $scope.vm.title=$stateParams.knowledgeTitle;
        }
        function init(){
            $scope.vm.tableList = {
                "data": {"listTable" : new Array(new Array("产品名称"))}
            };
            //var column = [];
            //var innerColumn = [];
            //innerColumn.push("产品名称");
            //column.push(innerColumn);
            //var listTable = {
            //    "listTable":column
            //} ;
            //$scope.vm.tableList.data =  listTable;
            $scope.vm.listTableType = [];
            var newType = {};
            newType.elementName = "产品名称";
            newType.elementType = "字符串";
            newType.technology = null;
            newType.elementAsk = "";
            newType.relatedQuestions = null;
            $scope.vm.listTableType.push(newType);
            $scope.vm.tableList.data.listTableType=$scope.vm.listTableType;
            //$scope.$apply();
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
        function tableSaveCheck(){
            if(!$scope.vm.factorName){
                layer.msg("请填写要素名称后保存")
            }else if(!$scope.vm.elementAsk){
                layer.msg("请填写反问后保存")
            }else{
                ngDialog.closeAll(1)
            }
        }
        function addList(row,column){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/static/knowledgeManagement/factor/factorDialog.html",
                    width:"695px",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {    //关闭回掉
                        if (e === 1) {
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
                            setDialogNew();
                        }else{
                            setDialogNew();
                        }
                    }
                });
            }
        }

        function editList(row,column){
            $scope.vm.factorName = $scope.vm.tableList.data.listTableType[column].elementName;
            $scope.vm.tableType = $scope.vm.tableList.data.listTableType[column].elementType;
            $scope.vm.gorithm=$scope.vm.tableList.data.listTableType[column].technology;
            $scope.vm.elementAsk = $scope.vm.tableList.data.listTableType[column].elementAsk;
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/factor/factorDialog.html",
                width:'695px',
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        $scope.vm.tableList.data.listTableType[column].elementName =  $scope.vm.factorName;
                        $scope.vm.tableList.data.listTableType[column].elementType = $scope.vm.tableType;
                        $scope.vm.tableList.data.listTableType[column].technology =  $scope.vm.gorithm;
                        $scope.vm.tableList.data.listTableType[column].elementAsk = $scope.vm.elementAsk;
                        $scope.vm.tableList.data.listTable[0][column] = $scope.vm.factorName;
                        setDialogNew();
                    }else{
                        setDialogNew();
                    }
                }
            });
        }
        function getTableParams(){
            if(!$scope.vm.tableList.data){
                console.log("请上传表格知识") ;
                return false ;
            }else{
                //console.log()
                var tabelData = angular.copy($scope.vm.tableList.data);
                //console.log(tabelData) ;
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
                        //console.log(ask);
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

        // 获取Bot全路径
        function getBotFullPath(id){
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                console.log(data) ;
                if(data.status = 10000){
                    var allBot = angular.copy($scope.vm.creatSelectBot.concat($scope.vm.botClassfy)) ,
                        botResult = $scope.MASTER.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                    $scope.$apply(function(){
                        console.log(data) ;
                        $scope.vm.knowledgeBotVal = data.categoryFullName;
                        if(botResult != false){
                            //$scope.vm.knowledgeBotVal = data.categoryFullName.split("/");
                            $scope.vm.botFullPath= botResult;
                        }
                    });
                    //var len = $scope.vm.creatSelectBot.length;
                    //var obj = {};
                    //if(len){
                    //    angular.forEach($scope.vm.creatSelectBot,function(item){
                    //        if(item.classificationId!=id){
                    //            len-=1
                    //        }
                    //    });
                    //    if(len==0){
                    //        obj.className = data.categoryFullName.split("/");
                    //        obj.classificationId = id ;
                    //        obj.classificationType = 1;
                    //    }else{
                    //        layer.msg("添加分类重复");
                    //        return false
                    //    }
                    //}else{
                    //    obj.className = data.categoryFullName.split("/");
                    //    obj.classificationId = id ;
                    //    //obj.classificationType = 1;
                    //}
                    //$scope.vm.knowledgeBotVal = obj.className;
                    //$scope.vm.botFullPath=obj;
                    //$scope.$apply();
                }
            },function(){
                //console.log("添加扩展问失败")
            });
        }

        //手动添加扩展问
        function getExtension(title,weight,source){
            //source  0 默认  1 标题;
            var isLocalHasExt = addLocalExtension(title)  ;
            if(isLocalHasExt){
                if(!source){
                    $scope.vm.extensions.push(isLocalHasExt);
                }else{
                    $scope.vm.extensionByTitleTag = new Array(isLocalHasExt)
                }
                return ;
            }
            var question = new Array(title);
            var obj = {
                "extensionQuestionTitle" : $scope.vm.extensionTitle,
                "extensionQuestionType" : $scope.vm.extensionWeight
            } ;
            if(!$scope.vm.extensionTitle && !source){
                layer.msg("扩展问不能为空")
            }else if(!chackTitleAndextEnsionQuestion($scope.vm.title,$scope.vm.extensionTitle)){
                layer.msg("扩展问和标题重复请重新输入扩展问") ;
                return ;
            }else if(!checkExtensionByTitle(obj)){
                layer.msg("扩展问重复,,已阻止添加");
                return false
            }else{
                httpRequestPost("/api/ms/elementKnowledgeAdd/checkDistribute",{
                    "applicationId": APPLICATION_ID,
                    "extendQuestionList" : question
                },function(data){
                    if(data.status == 500){
                        layer.msg(data.data);
                    }else if(data.status == 10026 ){
                        layer.msg("扩展问添加重复，请重新添加")
                    }else if(data.status==200){
                        $scope.$apply(function(){
                            var allExtension = $scope.vm.extensions ;
                            var result = $scope.MASTER.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                            if(result != false){
                                $scope.vm.extensionTitle = "";
                                if(!source){
                                    $scope.vm.extensions.push(result);
                                }else{
                                    $scope.vm.extensionByTitleTag = new Array(result)
                                }
                            }
                        })
                    }
                },function(error){
                    console.log(error)
                });
            }
        }
////////////////////////////////////// ///         Bot     /////////////////////////////////////////////////////
        $scope.MASTER.botTreeOperate($scope,"/api/ms/modeling/category/listbycategorypid","/api/ms/modeling/category/listbycategorypid",getBotFullPath
            //"/api/ms/modeling/category/searchbycategoryname"
        ) ;
        //BOT搜索自动补全
        $scope.MASTER.searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
            $scope.$apply(function(){
                var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)) ,
                    botResult = $scope.MASTER.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                $scope.vm.knowledgeBotVal = suggestion.value;
                if(botResult != false){
                    $scope.vm.botFullPath= botResult;
                }
            })
        });

        //添加BOT 分类  ==== 点击bot分类的 加号
        function botSelectAdd(){
            console.log($scope.vm.botFullPath);
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = null;
                $scope.vm.knowledgeBotVal = "";
                $(".icon-jj").eq(0).css("backgroundPosition","0% 0%");
            }
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

        function extensionEdit(type,item,index){
            //type  1 框架生成  0 手动添加
            $scope.vm.backupsOfExtension = angular.copy(item) ;
            console.log($scope.vm.backupsOfExtension) ;
            var dia = angular.element(".ngdialog ");
            if(dia.length==0){
                var extensionEdit = ngDialog.openConfirm({
                    template:"/static/knowledgeManagement/public-html/extension_edit.html",
                    width:"500px",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){     //关闭回掉
                        if(e === 1){
                           if(type == 0){
                                $scope.vm.extensions[index] = $scope.vm.backupsOfExtension ;
                            }else if(type == 2){
                                $scope.vm.extensionByTitleTag[index] = $scope.vm.backupsOfExtension ;
                            }
                        }else{$scope.vm.backupsOfExtension = ""; }
                    }
                });
            }
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
            if($scope.vm.slideFlag){
                $(".senior_div").css('overflow','visible');
            }
        }

/**
 * 校验标题和扩展问重复
 */
        function  chackTitleAndextEnsionQuestion(title,ensionQuestionTitle){
            console.log(title);
            console.log(ensionQuestionTitle);
            if(title!=""){
                if(title==ensionQuestionTitle){
                    return false;
                }else{
                    return true;
                }
            }
            if(ensionQuestionTitle!=""){
                if(ensionQuestionTitle==title){
                    return false;
                }else{
                    return true;
                }
                return false;
            }
        }

        //根據 標題 生成 bot 跟 扩展问
        function getBotAndExtensionByTitle(){
            if($scope.vm.title){
                httpRequestPost("/api/ms/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId": APPLICATION_ID ,
                    "knowledgeId" : $scope.vm.knowledgeId
                },function(data){
                    console.log(data);
                    if(data.status == 500){    //标题打标失败
                        $scope.vm.titleTip = "知识标题重复";
                        $scope.$apply()
                    }else if(data.status == 10002){
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    } else if(data.status == 200){
                        getExtension($scope.vm.title,"60",1) ; //生成扩展问
                        $scope.$apply(function(){
                            //標題打标结果
                            $scope.vm.knowledgeTitleTag = data.data.knowledgeTitleTagList ;
                            $scope.vm.botClassfy = [];   //reset 标题生成bot
                            //添加校验是否添加校验  获取所有bot 验证是否重复
                            var allBot = angular.copy($scope.vm.creatSelectBot) ;
                            angular.forEach(data.data.classifyList, function (item) {
                                var botResult = $scope.MASTER.isBotRepeat(item.id,item.fullPath,item.type,allBot) ;
                                if(botResult != false){
                                    $scope.vm.botClassfy.push(botResult);
                                }
                                $scope.vm.frameCategoryId = item.id;
                            });
                        });
                    }
                },function(error){
                    console.log(error)
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }
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
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME ,  //操作人
                "knowledgeOrigin" : $scope.vm.knowledgeOrigin
            };
                var title = angular.copy($scope.vm.newTitle);
                var obj = {};
                obj.knowledgeContent = getTableParams();
                obj.channelIdList =  $scope.vm.channel;
                if(!$scope.vm.dimensionArr.id.length){
                    $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
                };
                obj.dimensionIdList =  $scope.vm.dimensionArr.id.length?$scope.vm.dimensionArr.id:$scope.vm.dimensionsCopy.id;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question ;   //显示相关问
                obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
            obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup;  //业务扩展问
            $scope.vm.scanContent=new Array(obj);
            params.knowledgeContents =  angular.copy($scope.vm.scanContent) ;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionByTitleTag) ;
            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
            return params
        }
        //限制一个知识多次保存
        var limitTimer ;
        function save() {
                if (!checkSave()) {
                    return false
                } else {
                    if(!$scope.vm.limitSave){
                        $timeout.cancel(limitTimer) ;
                        $scope.vm.limitSave = true ;
                        limitTimer = $timeout(function(){
                            $scope.vm.limitSave = false ;
                        },180000) ;
                        $scope.vm.data = getParams(); 
                        var api = $scope.vm.knowledgeId?"/api/ms/elementKnowledgeAdd/editElementKnowledge":"/api/ms/elementKnowledgeAdd/addElementKnowledge";
                        httpRequestPost(api, getParams(), function (data) {
                            //console.log(data);
                            if (data.status == 200) {
                                $state.go('knowledgeManagement.custOverview');
                            } else if (data.status == 500) {
                                layer.msg("知识保存失败") ;
                                $timeout.cancel(limitTimer) ;
                                $scope.$apply(function(){
                                    $scope.vm.limitSave = false ;
                                });
                                console.log($scope.vm.limitSave)
                            }
                        }, function (err) {
                            $timeout.cancel(limitTimer) ;
                            $scope.$apply(function(){
                                $scope.vm.limitSave = false ;
                            });
                        });
                }
            }
        }
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                var params = getParams();
                //console.log(params);
                obj.params = params;
                obj.editUrl = "knowledgeManagement.factorAdd";
                obj.knowledgeType = 103 ;
                obj.knowledgeId = $scope.vm.knowledgeId ;
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/elementKnowledgeAdd/editElementKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api =  "/api/ms/elementKnowledgeAdd/addElementKnowledge"
                }
                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        };

        /* *********************              高级选项           **************************/ //

        //选择渠道
        function selectChannel(channelId){
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
        }
        //检验扩展问 (标题 类型)是否重复
        function checkExtensionByTitle(item){
            var result ;
            //所有标题以及手动打标生成的扩展问
            var arr = $scope.vm.extensionByTitleTag.concat($scope.vm.extensions);
            if(!arr.length){
                result = true ;
            }else{
                var len = arr.length;
                angular.forEach(arr,function(val){
                    if(val.extensionQuestionTitle == item.extensionQuestionTitle && val.extensionQuestionType == item.extensionQuestionType){
                        len-=1 ;
                        //console.log(val.extensionQuestionTitle == item.extensionQuestionTitle);
                        result = false ;
                    }
                    if(len==arr.length){
                        result = true ;
                    }
                })
            }
            return  result ;
        }
//        提交 检验参数
        function checkSave(){
            console.log(getParams()) ;
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!$scope.MASTER.isTitleHasExt($scope.vm.title,params.extensionQuestions)){
                layer.msg("标题未打标")
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
        // 添加时候 存储对象
        //function saveScan(){
        //    var url = $state.go('custServScenaOverview.manage',{scanData:getParams()});
        //    window.open(url, '_blank');
        //}
//*************************************************************************
        function addAppoint(item,arr){
            if(arr.indexOf(item)==-1){
                arr.push(item)
            }
            $scope.vm.appointRelative = null;  //清楚title
            $scope.vm.appointRelativeList = [];  //清除 列表

        }
        // 動態加載 title
        $scope.$watch("vm.appointRelative",function(title){
            //console.log(title);
            if(title){
                $timeout(getAppointRelative(title),300)
            }
        });

        function getAppointRelative(title){
            httpRequestPost("/api/ms/listKnowledge/getKnowledgeTitle",{
                "title" : title
            },function(data){
                if(data.status == 200){
                    $scope.vm.appointRelativeList = data.data;
                    $scope.$apply()
                }else{
                }
                //console.log(data);
            },function(err){
                console.log("获取指定相关知识失败")
            });
        }
        //********************************  2017/9/1 扩展问删除备份  BEGIN ***********************************************
        // 假删除本地备份
        function backUpExt(item){
            if(!$scope.vm.extensionDeleted.inArray(item)){
                $scope.vm.extensionDeleted.push(item)
            }
        }
        function addLocalExtension(title){
            var result = false ;
            if($scope.vm.extensionDeleted){
                angular.forEach($scope.vm.extensionDeleted,function(item,index){
                    if(title == item.extensionQuestionTitle){
                        result = item ;
                        $scope.vm.extensionDeleted.splice(index,1)
                    }
                })
            }
            return result ;
        }
//********************************  2017/9/1 扩展问删除备份  EDN ***********************************************
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

    }
    //重置参数
//        function setDialog(){
//            $scope.vm.newTitle = "";
//            $scope.vm.knowledgeContentNegative = "";
//            $scope.vm.channel = [];
//            $scope.vm.dimension = [];
//            $scope.vm.question = 1,    //显示相关问
//            $scope.vm.tip = 1,    //在提示
//            $scope.vm.tail =1,    //弹出评价小尾巴
//            $scope.vm.appointRelativeGroup = [] ;//业务扩展问
//            $scope.vm.appointRelative = ""
//            $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);
//            $scope.vm.dimensionArr = []
//        }

]);