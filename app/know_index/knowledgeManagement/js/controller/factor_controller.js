/**
 * Created by 41212 on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('knowledgeEssentialController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","$interval","$rootScope",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,$interval,$rootScope) {
        $scope.vm = {
//主页
            applicationId : $cookieStore.get("applicationId"),
            knowledgeId : "" ,
            userName :  $cookieStore.get("userName"),
            userId : $cookieStore.get("userId") ,
            sceneId :  $cookieStore.get("sceneId") ,
            frames : [],      //业务框架
            frameId : "",
            botRoot : "",      //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botSelectAdd : botSelectAdd,
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            //生成  知识标题 打标生成 BOT
            getBotByTitle : getBotByTitle,
            //creatBot : [],

            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :60,
            getExtension : getExtension,  //獲取擴展問
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
            extensionEdit : extensionEdit,
            botFullPath : "",

            //展示内容
            scanContent : [],
            saveContent : [],

            save : save ,   //保存
            scan :scan ,   //预览
            //高级选项
            newTitle: "",    //标题
            channel : [],     //新添加的 channel
            channels : [],     //所有渠道
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
            gorithm : [], //语义挖掘
            tableType : null,   //类型
            factorName : null,   //要素名称
            reQuestion : null, //反问

            tableList: "",
            listTableType: "",
            data : "",
            column:"" ,

            limitSave : false //限制多次打标
        };
        //獲取渠道
        knowledgeAddServer.getDimensions({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                console.log( $scope.vm.applicationId) ;
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);

                }
            }, function(error) {
                layer.msg("获取维度失败，请刷新页面")
            });
        //获取维度
        knowledgeAddServer.getChannels({ "applicationId" : $scope.vm.applicationId},
            function(data) {
                if(data.data){
                    $scope.vm.channels = data.data
                }
            }, function(error) {
                layer.msg("获取渠道失败，请刷新页面")
            });
        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        if($stateParams.data!=null){

            var data = $stateParams.data ;
            console.log($stateParams.data);
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 标题打标结果
            $scope.vm.knowledgeTitleTag = data.knowledgeBase.knowledgeTitleTag ;
            // 时间
            $scope.vm.knowledgeExpDateStart  =  data.knowledgeBase.knowledgeExpDateStart ;
            $scope.vm.knowledgeExpDateEnd  =  data.knowledgeBase.knowledgeExpDateEnd ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
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
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList ;  //业务扩展问
            });
        }else{
            init();
        }
        function init(){
            $scope.vm.tableList = {};
            var column = [];
            var innerColumn = [];
            innerColumn.push("产品名称");
            column.push(innerColumn);
            var listTable = {
                "listTable":column
            }
            $scope.vm.tableList.data = listTable;
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
        function addList(row,column){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0) {
                var dialog = ngDialog.openConfirm({
                    template: "/know_index/knowledgeManagement/factor/factorDialog.html",
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
                            var newType = {};
                            newType.elementName = $scope.vm.factorName;
                            newType.elementType = $scope.vm.tableType;
                            newType.technology = $scope.vm.gorithm;
                            newType.elementAsk = $scope.vm.elementAsk;
                            newType.relatedQuestions = null;
                            $scope.vm.tableList.data.listTableType.push(newType);
                            //$scope.$apply();
                            setDialogNew();
                        }
                    }
                });
            }
        }

        function editList(row,column){
            console.log("editList");
            $scope.vm.factorName = $scope.vm.tableList.data.listTableType[column].elementName;
            $scope.vm.tableType = $scope.vm.tableList.data.listTableType[column].elementType;
            $scope.vm.gorithm=$scope.vm.tableList.data.listTableType[column].technology;
            $scope.vm.elementAsk = $scope.vm.tableList.data.listTableType[column].elementAsk;
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/factor/factorDialog.html",
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
                                //console.log(tabelData.listTable[icon][cur]);
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
            $scope.vm.tableType = null;
            $scope.vm.gorithm = [];
            $scope.vm.elementAsk = null;
        }
// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/modeling/frame/listbyattribute",{
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
                if($scope.vm.extensionsByFrame.length){
                    //  替換條件
                    replace(val);
                }else{
                    // 在未生成扩展问情況
                    getExtensionByFrame(val);
                }
            }
        });
        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
        });
        // 通过frame 获取扩展问
        function getExtensionByFrame(id,type){
            //console.log(id);
            httpRequestPost("/api/modeling/frame/listbyattribute",{
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
            var returnStr = "OEC";
            switch(type){
                case 10017:
                    returnStr = "OEC";
                    break;
                case 10018:
                    returnStr = "GATE";
                    break;
            }
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
            httpRequestPost("/api/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                console.log(data) ;
                if(data.status = 10000){
                    var len = $scope.vm.botClassfy.length;
                    var obj = {};
                    if(len){
                        angular.forEach($scope.vm.botClassfy,function(item){
                            if(item.classificationId!=id){
                                len-=1
                            }
                        });
                        if(len==0){
                            obj.className = data.categoryFullName.split("/");
                            obj.classificationId = id ;
                            obj.classificationType = 1;
                        }else{
                            layer.msg("添加分类重复");
                            return false
                        }
                    }else{
                        obj.className = data.categoryFullName.split("/");
                        obj.classificationId = id ;
                        //obj.classificationType = 1;
                    }
                    $scope.vm.knowledgeBotVal = obj.className.join("/");
                    $scope.vm.botFullPath=obj;
                    $scope.$apply();
                }
            },function(){
                //console.log("添加扩展问失败")
            });
        }

        //手动添加扩展问
        function getExtension(title,weight){
            var question = [];
            question.push(title);
            var obj = {} ;
            obj.extensionQuestionTitle = $scope.vm.extensionTitle;
            obj.extensionQuestionType = $scope.vm.extensionWeight;
            if(!chackTitleAndextEnsionQuestion( $scope.vm.title,$scope.vm.extensionTitle)){
                layer.msg("扩展问和标题重复请重新输入扩展问")
                return;
            }
            if(!$scope.vm.extensionTitle){
                layer.msg("扩展问不能为空")
            }else if(!checkExtension(obj , $scope.vm.extensions)){
                layer.msg("扩展问重复");
                return false
            }else{
                httpRequestPost("/api/elementKnowledgeAdd/checkDistribute",{
                    "applicationId": $scope.vm.applicationId,
                    "extendQuestionList" : question
                },function(data){
                    console.log(data);
                    if(data.status == 500){
                        layer.msg("扩展问重复") ;
                        $scope.vm.extensionTitle = "" ;
                        $scope.$apply();
                    }else if(data.status==200){
                        console.log(data);
                        var enten = {}  ;
                        enten.extensionQuestionTitle = title;
                        enten.extensionQuestionType = weight ;
                        var listArr = [];
                        var listObj = {};
                        listObj.wholeDecorateTagName="";
                        listObj.wholeDecorateTagType="";
                        listArr.push(listObj);
                        enten.wholeDecorateTagList = listArr;
                        enten.extensionQuestionTagList = [] ;
                        angular.forEach(data.data,function(tagList){
                            //var tag = [] ;
                            angular.forEach(tagList.extensionQuestionTagList,function(item){
                                var tagTem = {};
                                tagTem.exist = item.exist ;
                                tagTem.tagClass= item.tagClass;
                                tagTem.tagName= item.tagName;
                                tagTem.tagTypeList= [] ;
                                tagTem.tagTypeList.push(item.tagType);
                                //tag.push(tagTem)
                                enten.extensionQuestionTagList.push(tagTem) ;
                            });
                        });
                        $scope.vm.extensions.push(enten);
                        console.log($scope.vm.extensions);
                        $scope.vm.extensionTitle = "" ;
                        $scope.$apply();
                    }
                },function(){
                    layer.msg("添加扩展问失败")
                });
            }
        }
////////////////////////////////////// ///         Bot     /////////////////////////////////////////////////////
        //{
        //    "categoryApplicationId": "360619411498860544",
        //    "categoryPid": "root"
        //}
        getBotRoot();
        //    getDimensions();
        //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            //console.log(1) ;
            $timeout(function(){
                angular.element(".rootClassfy").slideToggle();
            },50)
        }
        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": $scope.vm.applicationId,
                "categoryPid": "root"
            },function(data){
                //console.log(data);
                $scope.vm.botRoot = data.data;
                //console.log( $scope.vm.applicationId);
            },function(){
                 console.log("err or err")
            });
        }
        //点击更改bot value
        $(".aside-navs").on("click","span",function(){
            var id = $(this).prev().attr("data-option");
            getBotFullPath(id);    //添加bot分類
            angular.element(".rootClassfy,.menus").slideToggle();
            $scope.$apply();
        });
        //添加BOT 分类  ==== 点击bot分类的 加号
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = null;
                $scope.vm.knowledgeBotVal = "";
            }
        }
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":$scope.vm.applicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var  html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            if(data.data[i].categoryLeaf){
                                html+= '<li>' +
                                    '<div class="slide-a">'+
                                    ' <a class="ellipsis" href="javascript:;">'+
                                    '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                    '<span>'+data.data[i].categoryName+'</span>'+
                                    '</a>' +
                                    '</div>' +
                                    '</li>'
                            }else{
                                html+= '<li>' +
                                    '<div class="slide-a">'+
                                    ' <a class="ellipsis" href="javascript:;">'+
                                    '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"style="background-position:0% 100%"></i>'+
                                    '<span>'+data.data[i].categoryName+'</span>'+
                                    '</a>' +
                                    '</div>' +
                                    '</li>'
                            }
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown()
                    }
                },function(err){
                     console.log(err)
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%");
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
        function replace(id){
                var replace = ngDialog.openConfirm({
                    template:"/know_index/knowledgeManagement/faq/replace.html",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){     //关闭回掉
                        if(e === 1){    //替换
                            getExtensionByFrame( id ,1 )
                        }else if(e === 0){
                            // 添加不替换
                            getExtensionByFrame( id ,0 )
                        }
                    }
                });
        }

        function extensionEdit(){
            var extensionEdit = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/concept/knowledgeAddSingleConceptDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){     //关闭回掉
                    if(e === 1){
                        //getExtensionByFrame( id ,1 )
                    }else if(e === 0){
                        //getExtensionByFrame( id ,0 )
                    }
                }
            });
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
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


        //根據 標題 生成 bot
        function getBotByTitle(){
           /* console.log(chackTitleAndextEnsionQuestion( $scope.vm.title,$scope.vm.extensionTitle));
            if(chackTitleAndextEnsionQuestion( $scope.vm.title,$scope.vm.extensionTitle)){
                layer.msg("标题和扩展问重复请重新输入标题")
                return;
            }*/
            if($scope.vm.title){
                httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId": $scope.vm.applicationId,
                },function(data){
                    console.log(data);
                    if(data.status == 500){    //标题打标失败
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    }else if(data.status == 10002){
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    } else if(data.status == 200){
                        console.log(data);
                        $scope.vm.botClassfy = [];   //防止 多次打标,添加类目
                        $scope.vm.knowledgeTitleTag = [];
                        $scope.vm.knowledgeTitleTag = data.data.knowledgeTitleTagList;
                        angular.forEach(data.data.classifyList, function (item) {
                            var obj = {};
                            obj.className = item.fullPath;
                            obj.classificationId = item.id;
                            obj.classificationType = item.type;
                            $scope.vm.botClassfy.push(obj);
                            $scope.vm.frameCategoryId = item.id;
                            $scope.$apply()
                        });
                    }
                },function(err){
                    layer.msg("标题打标失败，请重新打标")
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }
        }

        //  主页保存 获取参数
        function getParams(){
            var params = {};
            params =  {
                "applicationId": $scope.vm.applicationId,
                 knowledgeId : $scope.vm.knowledgeId ,
                "knowledgeUpdater": $scope.vm.userName, //操作人
                "knowledgeCreator": $scope.vm.userName, //操作人
                "userId" : $scope.vm.userId ,
                "sceneId" : $scope.vm.sceneId ,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:null,  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:null,     //结束时间
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
            };

                var title = angular.copy($scope.vm.newTitle);
                //scanCotentByTitle(title) ;
                var obj = {};
                obj.knowledgeContent = getTableParams();
                obj.channelIdList =  $scope.vm.channel;
                obj.dimensionIdList =  $scope.vm.dimensionArr.id;

                obj.knowledgeRelatedQuestionOn = $scope.vm.question,    //显示相关问
                obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴

            obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup;  //业务扩展问
            $scope.vm.scanContent=[];
            $scope.vm.scanContent.push(obj);
            params.knowledgeContents =  $scope.vm.scanContent;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
            console.log(params);
            return params
        }

        function save() {
                if (!checkSave()) {
                    return false
                } else {
                    if(!$scope.vm.limitSave){
                        $scope.vm.limitSave = true ;
                        $timeout(function(){
                            $scope.vm.limitSave = false ;
                        },180000) ;
                        $scope.vm.data = getParams();
                        httpRequestPost("/api/elementKnowledgeAdd/addElementKnowledge", getParams(), function (data) {
                            //console.log(data);
                            if (data.status == 200) {
                                var url = $state.go('custServScenaOverview.manage');
                                //window.open(url, '_blank');
                            } else if (data.status == 500) {
                                layer.msg("保存失败")
                            }
                        }, function (err) {
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
                obj.api = "/api/elementKnowledgeAdd/addElementKnowledge" ;

                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');

                //$state.go('knowledgeManagement.knowledgeScan',{knowledgeScan: 111},{reload:true},{blank:true});
            }
        };

        /* *********************              高级选项           **************************/ //
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

        //选择渠道
        function selectChannel(channelId){
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
        }

        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" : title
                },function(data){
                    //console.log(data);
                    return true;
                },function(err){
                    layer.msg("打标失败，请重新打标");
                    return false
                });
            }
        }
        //检验扩展问是否重复    
        function checkExtension(item,arr){
            return true ;
            //    return true ;
            //}else{
            //    angular.forEach(arr,function(val){
            //
            //        if(val.extensionQuestionTitle == item.extensionQuestionTitle && val.extensionQuestionType == item.extensionQuestionType){
            //            //console.log(val.extensionQuestionTitle == item.extensionQuestionTitle);
            //            return false
            //        }
            //    })
            //}
        }
//        提交 检验参数
        function checkSave(){
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false;
            }else if(!params.knowledgeContents.length){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false;
            }else if(!params.knowledgeTitleTag.length){
                return true
                //layer.msg("知识标题未打标");
                //return false;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("分类知识Bot不能为空");
                return false;
            }else if(!$scope.vm.tableList.data){
                layer.msg("请上传表格知识");
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
            httpRequestPost("/api/listKnowledge/getKnowledgeTitle",{
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

    }
]);