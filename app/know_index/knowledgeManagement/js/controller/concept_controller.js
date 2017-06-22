/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('conceptController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","$interval","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,$interval,$filter) {
        //console.log($stateParams.data);
        $scope.vm = {
            frames: [],      //业务框架
            frameId: "",
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            botRoot : "",      //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeClassifyCall: knowledgeClassifyCall, //知识分类的回调方法
            openContentConfirm: openContentConfirm, //打开内容对话框
            knowledgeBotVal : "",  //bot 内容
            botSelectAdd : botSelectAdd,
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏

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

            //展示内容
            scanContent : [],
            saveContent : [],

            save : save ,   //保存
            scan :scan ,   //预览
            //弹框相关
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

            checkChannelDimension : checkChannelDimension ,
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
            //vm.appointRelativeGroup.push(item)
            appointRelativeGroup : [],
            replaceType : 0 ,
            enterEvent : enterEvent,
            dialogExtension : [],
            knowledgeId : "",

            limitSave : false ,
            isEdit : false,  // 知识内容 弹框 编辑  不验证渠道维度重复

            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end

        };
        //獲取渠道
        knowledgeAddServer.getDimensions({ "applicationId" : APPLICATION_ID},
            function(data) {
                //console.log( APPLICATION_ID) ;
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);

                }
            }, function(error) {
                console.log(error)
            });
        //获取维度
        knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
            function(data) {
                if(data.data){
                    $scope.vm.channels = data.data
                }
            }, function(error) {
                console.log(error)
            });
        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data) ;
            //console.log($stateParams.data);
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 标题打标结果
            $scope.vm.knowledgeTitleTag = data.knowledgeBase.knowledgeTitleTag ;
            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            // 时间
            if(data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd){
                $scope.vm.isTimeTable = true
            }
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            //bot路径
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            angular.forEach(data.extensionQuestions,function(item){
            });
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                var obj = {} ;
                obj.knowledgeContent = item.knowledgeContent;
                //維度，添加預覽效果   以name id 的 形式显示
                obj.channelIdList =  item.channelIdList ;
                obj.dimensionIdList =  item.dimensionIdList ;
                obj.knowledgeRelatedQuestionOn =item.knowledgeRelatedQuestionOn ;   //显示相关问
                obj.knowledgeBeRelatedOn  =  item.knowledgeBeRelatedOn ; //在提示
                obj.knowledgeCommonOn = item.knowledgeCommonOn ;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = item.knowledgeRelevantContentList ;  //业务扩展问
                $scope.vm.scanContent.push(obj);
            });
        } else if ($stateParams.data  && angular.fromJson($stateParams.data).docmentation) {
            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
            $scope.vm.openContentConfirm(saveAddNew); //知识内容弹出框
        }


// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10012,
                "index": 0,
                "pageSize":999999
            },function(data){
                //console.log(data);
                if(data.status!=10005){
                    if(data.data.length){
                        $scope.vm.frames = $scope.vm.frames.concat(data.data) ;
                        $scope.$apply();
                    }
                }
            },function(){
                // layer.msg("err or err")
            });
        }
        $scope.$watch("vm.frameCategoryId",function(val,old){
            if(val&&val!=old){
                getFrame( val )
            }
        });
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

        // 通过frame 获取扩展问
        function getExtensionByFrame(id,type){
            console.log(id);
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameTypeId": 10012,
                "frameId": id,
                "index": 0,
                "pageSize":999999
            },function(data){
                if(data.status==10000){
                    //console.log(data);
                    var extensionQuestionList = [],
                        frameQuestionTagList = [];
                    var obj = {};
                    if (data.data[0].elements) {
                        angular.forEach(data.data[0].elements, function (item, index) {
                            if (index > 0) {
                                obj.extensionQuestionType = 60;   //61
                                obj.extensionQuestionTitle = data.data[0].frameTitle;
                                extensionQuestionList.push((item.elementContent.substring(0,item.elementContent.indexOf('#'))));
                                frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#')+1).split('；'));
                            }
                        });
                        checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
                    }
                    $scope.$apply();
                }
            }, function (error) {
                console.log(error)
            });
        }

        // 获取Bot全路径
        function getBotFullPath(id){
            //console.log(id ,$scope.vm.creatSelectBot) ;
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                //console.log(data) ;
                if(data.status = 10000){
                    var len = $scope.vm.creatSelectBot.length;
                    var obj = {};
                    if(len){
                        angular.forEach($scope.vm.creatSelectBot,function(item){
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
                    $scope.vm.botFullPath=obj ;
                    $scope.$apply()
                }
            },function(error){
                console.log(error)
            });
        }
        // 知识文档分类回调
        function knowledgeClassifyCall() {
            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify",
                {
                    knowledgeId: $scope.vm.docmentation.knowledgeId,
                    knowledgeStatus: 3
                },
                function (data) {
                    if (data && data.status == 200) {
                        $state.go("back.doc_results_view",
                            {
                                knowDocId: $scope.vm.docmentation.documentationId,
                                knowDocCreateTime: $scope.vm.docmentation.knowDocCreateTime,
                                knowDocUserName: $scope.vm.docmentation.knowDocUserName
                            }
                        );
                    }
                }
            );
        }
        //打开知识内容对话框
        function openContentConfirm(callback) {
            var dialog = ngDialog.openConfirm({
                template: "/know_index/knowledgeManagement/public-html/knowledge_increase.html",
                width:"650px",
                scope: $scope,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                backdrop: 'static',
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        callback();
                    } else {
                        setDialog();//清空内容对话框
                    }
                }
            });
        }
        //生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            var title = oldWord.extensionQuestionTitle ;
            var weight = oldWord.extensionQuestionType ;
            //console.log(oldWord);
            httpRequestPost("/api/ms/conceptKnowledge/checkFrameTag",{
                "applicationId": APPLICATION_ID,
                "extensionQuestionList" : extensionQuestionList,
                "frameQuestionTagList" : frameQuestionTagList
            },function(data){
                console.log(data);
                if(data.status==200){
                    var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
                    if(isTagRepeat(data.data,allExtension)){
                        $scope.vm.extensionTitle = "" ;  //重复
                    }else{
                        var enten = {}  ;
                        enten.extensionQuestionTitle = title;
                        enten.extensionQuestionType = weight ;
                        enten.wholeDecorateTagList = new Array({"wholeDecorateTagName":"","wholeDecorateTagType":""});
                        enten.extensionQuestionTagList = [] ;
                        angular.forEach(data.data,function(tagList){
                            angular.forEach(tagList.extensionQuestionTagList,function(item){
                                var tagTem = {
                                    "exist" : item.exist ,
                                    "tagClass" : item.tagClass ,
                                    "tagName" : item.tagName ,
                                    "tagTypeList" : new Array(item.tagType)
                                };
                                enten.extensionQuestionTagList.push(tagTem) ;
                            });
                        });
                        $scope.vm.extensionsByFrame.push(enten);
                        $scope.$apply();
                    }
                }
            }, function () {
                //layer.msg("err or err")
            });
        }

        function scanCotentByTitle(title,index){
            //console.log(1) ;
            var answerContentList = [];
            answerContentList.push(title);
            httpRequestPost("/api/ms/conceptKnowledge/productExtensionQuestion", {
                "applicationId": APPLICATION_ID,
                "title": $scope.vm.title,
                "answerContentList": answerContentList
            }, function (data) {
                console.log(data) ;
                if (data.status == 200) {
                    //console.log(data.data);
                    //console.log(index) ;
                    $scope.vm.scanContent[index].extensionByContentByTitle = data.data;
                    $scope.$apply()
                } else if (data.status == 500) {
                    layer.msg(data.info);
                }
            }, function () {
                //layer.msg("打标失败");
            });
        }
        //手动添加扩展问
        function getExtension(title,weight){
            var question = [];
            question.push(title);
            var obj = {} ;
            obj.extensionQuestionTitle = title;
            obj.extensionQuestionType = weight;
            if(!title){
                layer.msg("扩展问不能为空")
            }else if(!checkExtension(obj , $scope.vm.extensions)){
                layer.msg("扩展问重复");
                return false
            } else {
                httpRequestPost("/api/ms/conceptKnowledge/checkExtensionQuestion", {
                    "applicationId": APPLICATION_ID,
                    "extendQuestionList": question
                }, function (data) {
                    if (data.status == 500) {
                        layer.msg("改成概念扩展打标失败，请检查服务，重新打标");
                        $scope.vm.extensionTitle = "";
                        $scope.$apply();
                    } else if (data.status == 200) {
                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
                        if(isTagRepeat(data.data,allExtension)){
                            $scope.vm.extensionTitle = "" ;  //重复
                        }else{
                            var enten = {}  ;
                            enten.extensionQuestionTitle = title;
                            enten.extensionQuestionType = weight ;
                            enten.wholeDecorateTagList = new Array({"wholeDecorateTagName":"","wholeDecorateTagType":""});
                            enten.extensionQuestionTagList = [] ;
                            angular.forEach(data.data,function(tagList){
                                angular.forEach(tagList.extensionQuestionTagList,function(item){
                                    var tagTem = {
                                        "exist" : item.exist ,
                                        "tagClass" : item.tagClass ,
                                        "tagName" : item.tagName ,
                                        "tagTypeList" : new Array(item.tagType)
                                    };
                                    enten.extensionQuestionTagList.push(tagTem) ;
                                });
                            });
                            $scope.vm.extensions.push(enten);
                        }
                        $scope.vm.extensionTitle = "" ;
                        $scope.$apply();
                    }
                }, function (error) {
                    console.log(error)
                });
            }
        }
        //判断扩展问标签是否重复
        //data.data
        function isTagRepeat(current,allExtension){
            var isRepeat = false ;
            var tag = [] ;
            angular.forEach(current,function(tagList){
                angular.forEach(tagList.extensionQuestionTagList,function(item){
                    if(!item.exist){   //标签存在情况下
                        tag.push(item.tagName);
                    }
                });
            });
            angular.forEach(allExtension,function(extension){
                var tagLen = 0 ;
                var itemTag = [] ;
                angular.forEach(extension.extensionQuestionTagList,function(item){
                    if(!tag.exist){   //存在标签
                        itemTag.push(item.tagName);
                    }
                    if(tag.inArray(item.tagName) && !tag.exist){   //标签重复数量
                        tagLen += 1;
                    }
                }) ;
                if(tagLen == itemTag.length && tag.length == itemTag.length){
                    layer.msg("根据"+ current[0].extensionQuestionTitle+ "生成扩展问重复,已阻止添加") ;
                    return   isRepeat = true ;
                }
            }) ;
            return isRepeat
        }

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
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
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": APPLICATION_ID,
                "categoryPid": "root"
            },function(data){
                console.log(data);
                $scope.vm.botRoot = data.data;
                //console.log( APPLICATION_ID);
            },function(error){
                console.log(error)
            });
        }
        //点击更改bot value
        $(".aside-navs").on("click","span",function(){
            //类型节点
            var pre = $(this).prev() ;
            //if(pre.hasClass("bot-edge")){
            //    layer.msg("请可用选择节点") ;
            //    return ;
            //}else{
                angular.element(".icon-jj").css("backgroundPosition","0% 0%");
                var id = pre.attr("data-option");
                getBotFullPath(id);    //添加bot分類
                angular.element(".rootClassfy,.menus").slideToggle();
                $scope.$apply();
            //}
        });
        //点击bot分类的 加号
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = null;
                $scope.vm.knowledgeBotVal = "";
            }
        };
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'i',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                    "categoryApplicationId":APPLICATION_ID,
                    "categoryPid": id
                },function(data){
                    console.log(data) ;
                    if(data.data){
                        var  html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            var typeClass ;
                            // 叶子节点 node
                            if((data.data[i].categoryLeaf == 0)){
                                typeClass = "bot-leaf"　;
                            }else if((data.data[i].categoryLeaf != 0) && (data.data[i].categoryAttributeName == "edge" )){
                                typeClass = "bot-edge"　;
                            }else if((data.data[i].categoryLeaf != 0) && (data.data[i].categoryAttributeName == "node" )){
                                typeClass = "icon-jj"
                            }
                            var  backImage ;
                            switch(data.data[i].categoryTypeId){
                                case 160 :
                                    backImage = " bot-divide" ;
                                    break  ;
                                case 161 :
                                    backImage = " bot-process";
                                    break  ;
                                case 162 :
                                    backImage = " bot-attr" ;
                                    break  ;
                                case 163 :
                                    backImage = " bot-default" ;
                                    break  ;
                            }
                            html+= '<li>' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">' ;

                            html+=            '<i class="'+typeClass + backImage +'" data-option="'+data.data[i].categoryId+'"></i>' ;

                            html+=             '<span>'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>'
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown()
                    }
                },function(err){
                    //layer.msg(err)
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
        //自动转换图标类型
        function styleSwitch(type,leaf,attrType){
            var styleHidden = "display: inline-block;";
            if(leaf==0){
                styleHidden="display:none;";
            }
            if(attrType=="node"){
                return "style='"+styleHidden+"position: relative;top: -1px;margin-right: 2px;width: 15px;height: 15px;vertical-align: middle;background-position: left top;background-repeat: no-repeat;background-image: url(../../images/images/aside-nav-icon.png);'";
            }
            var style ='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
            switch (type){
                case 161:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
                case 160:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
                case 162:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
            }
            return style;
        }
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
//        function replace(id){
//                var replace = ngDialog.openConfirm({
//                    template:"/know_index/knowledgeManagement/faq/replace.html",
//                    scope: $scope,
//                    closeByDocument:false,
//                    closeByEscape: true,
//                    showClose : true,
//                    backdrop : 'static',
//                    preCloseCallback:function(e){     //关闭回掉
//                        if(e === 1){    //替换
//                            getExtensionByFrame( id ,1 )
//                        }else if(e === 0){
//                            // 添加不替换
//                            getExtensionByFrame( id ,0 )
//                        }
//                    }
//                });
//        }
        function knowledgeAdd(data, index) {
            if(!$scope.vm.title){
                layer.msg("请先输入知识标题")
                return false ;
            }else{
                var dia = angular.element(".ngdialog ");
                if(data){    //增加
                    $scope.vm.isEdit = true ;
                    $scope.vm.newTitle = data.knowledgeContent;
                    $scope.vm.channel = data.channelIdList;
                    //$scope.vm.dimensionArr.id = data.dimensionIdList;
                    angular.forEach($scope.vm.dimensions,function(item){
                        if(data.dimensionIdList.inArray(item.dimensionId)){
                            var obj = {} ;
                            obj.dimensionId = item.dimensionId ;
                            obj.dimensionName = item.dimensionName ;
                            $scope.vm.dimensionArr.push(obj) ;
                        }
                    }) ;
                    $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                    $scope.vm.question = data.knowledgeRelatedQuestionOn;
                    $scope.vm.tail = data.knowledgeCommonOn;
                    $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList;
                    var callback = function(){
                        var obj = {};
                        obj.knowledgeContent = $scope.vm.newTitle;
                        obj.knowledgeContentType = 0;  // 答案类型
                        obj.channelIdList =  $scope.vm.channel;
                        obj.dimensionIdList =  $scope.vm.dimensionArr.id;
                        obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
                        obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                        obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
                        obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup ; //业务扩展问
                        $scope.vm.scanContent[index] = obj;
                        $scope.vm.isEdit = false ;
                        setDialog() ;
                    }
                } else {
                    var callback = saveAddNew;
                }
                if(dia.length==0) {
                    var dialog = ngDialog.openConfirm({
                        template: "/know_index/knowledgeManagement/public-html/knowledge_increase.html",
                        width:"650px",
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: true,
                        showClose: true,
                        backdrop: 'static',
                        preCloseCallback: function (e) {    //关闭回掉
                            if (e === 1) {
                                callback()
                            } else {
                                $scope.vm.isEdit = false  ;
                                setDialog()
                            }
                        }
                    });
                }
            }
        }
        function extensionEdit(){
            var dia = angular.element(".ngdialog ");
            if(dia.length==0){
                 var extensionEdit = ngDialog.openConfirm({
                     template:"/know_index/knowledgeManagement/public-html/extension_edit.html",
                width:"520px",
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
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }
        //$scope.down =onput() ;
        //$scope.updata = function(){
        //     $scope.$apply(function(){
        //        $scope.vm = angular.element(self).val();
        //    })
        //} ;
        //    function(e){
        //    var  self = e.srcElement ? e.srcElement : e.target;
        //    var keycode = window.event?e.keyCode:e.which;
        //    angular.element(self).on({
        //        compositionend:function(val){
        //            console.log( angular.element(self).val())
        //        }
        //    }) ;
        //} ;
        //根據 標題 生成 bot
        function getBotByTitle(){
            if($scope.vm.title){
                httpRequestPost("/api/ms/conceptKnowledge/checkKnowledgeTitleAndGetAutoClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : APPLICATION_ID
                },function(data){
                    //console.log(data);
                    if(data.status == 500){    //标题打标失败
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    }else if(data.status == 200){
                        //console.log(data);
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
                },function(error){
                    console.log(error)
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }
        }

        //  主页保存 获取参数
        function getParams(){
           var params =  {
                "applicationId": APPLICATION_ID,
                "userId" : USER_ID ,
                "sceneId" :SCENE_ID ,
                "knowledgeTitle": $scope.vm.title,//
                 "knowledgeType": 101,
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:null,  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:null,     //结束时间
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME  //操作人
            };
            params.knowledgeContents =  $scope.vm.scanContent;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
            params.classificationAndKnowledgeList = $scope.vm.botClassfy.concat($scope.vm.creatSelectBot);
            return params
        }

        function save() {
            if (!checkSave()) {
                return false
            } else {
                if(!$scope.vm.limitSave) {
                    $scope.vm.limitSave = true;
                    $timeout(function(){
                        $scope.vm.limitSave = false ;
                    },180000) ;
                    var params = getParams();   // 保存參數
                    var api;                    // 返回編輯的 url
                    if ($scope.vm.knowledgeId) {
                        //编辑
                        api = "/api/ms/conceptKnowledge/editKnowledge";
                        params.knowledgeId = $scope.vm.knowledgeId;
                    } else {
                        //新增
                        api = "/api/ms/conceptKnowledge/addConceptKnowledge"
                    }
                    httpRequestPost(api, params, function (data) {
                        console.log(getParams());
                        if (data.status == 200) {
                            if ($scope.vm.docmentation) {
                                $scope.vm.knowledgeClassifyCall();
                            }
                            else
                                $state.go('custServScenaOverview.manage');
                        } else if (data.status == 500) {
                            layer.msg("保存失败")
                        }
                    }, function (err) {
                        console.log(err)
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
                console.log(params);
                obj.params = params;
                obj.editUrl = "knowledgeManagement.singleAddConcept";
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/conceptKnowledge/editKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api = "/api/ms/conceptKnowledge/addConceptKnowledge"
                }
                obj.params = params;
                obj.knowledgeType = 101;
                $window.knowledgeScan = obj;
                //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');


            }
        };

 /* *********************              弹框相关           **************************/ //
//重置参数
        function setDialog() {
            $scope.vm.newTitle = "";
            $scope.vm.slideFlag = false
            $scope.vm.channel = [];
            $scope.vm.dimension = [];
            $scope.vm.question = 1,    //显示相关问
            $scope.vm.tip = 1,    //在提示
            $scope.vm.tail =1,    //弹出评价小尾巴
            $scope.vm.appointRelativeGroup = [] ;//业务扩展问
            $scope.vm.appointRelative = ""
            $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);
            $scope.vm.dimensionArr = []
        }

        //选择渠道
        function selectChannel(channelId){
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
        }
        function saveAddNew(){
            if($scope.vm.newTitle){
                var index = $scope.vm.scanContent.length ;
                var title = angular.copy($scope.vm.newTitle);
                scanCotentByTitle(title,index) ;
                var obj = {};
                obj.knowledgeContent = $scope.vm.newTitle;
                //obj.knowledgeContentType = 0,  // 答案类型
                obj.channelIdList =  $scope.vm.channel;
                obj.dimensionIdList =  $scope.vm.dimensionArr.id.length?$scope.vm.dimensionArr.id:$scope.vm.dimensionsCopy.id;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
                obj.knowledgeBeRelatedOn = $scope.vm.tip; //在提示
                obj.knowledgeCommonOn = $scope.vm.tail;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup;  //业务扩展问
                // 生成扩展问题+

                //高級 選項
                $scope.vm.scanContent.push(obj);
                setDialog()
            } else {
                setDialog()
            }
        }
        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/ms/conceptKnowledge/checkDistribute",{
                    "title" : title
                },function(data){
                    console.log(data);
                    return true;
                },function(error){
                    console.log(error) ;
                    return false
                });
            }
        }
        //检验扩展问是否重复
        function checkExtension(item,arr){
            return true  ;
            //if(!arr.length){
            //    return true ;
            //}else{
            //    var len = arr.length;
            //    angular.forEach(arr,function(val){
            //        if(val.extensionQuestionTitle == item.extensionQuestionTitle && val.extensionQuestionType == item.extensionQuestionType){
            //            len-=1 ;
            //            console.log(val.extensionQuestionTitle == item.extensionQuestionTitle);
            //            return false
            //        }
            //        if(len==0){
            //            return true
            //        }
            //    })
            //}
        }
        // 擴展問深层检验
        //function checkHeighExtension(item,arr){
        //    console.log(item) ;
        //    var extenFrame = angular.copy($scope.vm.extensionsByFrame) ;
        //    var extenNew = angular.copy($scope.vm.extensions) ;
        //    var extension = extenFrame.concat(extenNew);
        //    if(!extension.length){
        //        return false
        //    }else{
        //        //获取长度
        //        var valItem = [] ;   //获取所有标签
        //        angular.forEach(item,function(val){
        //            angular.forEach(val.extensionQuestionTagList,function(tag){
        //                if(!tag.exist){   //标签存在情况下
        //                    valItem.push(tag.tagName);
        //                }
        //            })
        //        });
        //
        //
        //        var lenExtension = extension.length ;  //已有扩展问获取长度
        //        angular.forEach(extension,function(item){
        //            var lenItem = 0 ;
        //            angular.forEach(item.extensionQuestionTagList,function(tag){
        //                if((!tag.exist) && (valItem.inArray(tag.tagName))){   //标签存在情况下
        //                    lenItem+=1 ;
        //                }
        //            }) ;
        //            if(lenItem == valItem.length){    //重複
        //                return true ;
        //            }else{
        //                lenExtension-=1 ;
        //            }
        //        }) ;
        //
        //        //var lenExtension = extension.length ;  //已有扩展问获取长度
        //        //angular.forEach(extension,function(item){
        //        //    var lenItem = 0 ;
        //        //    angular.forEach(item.extensionQuestionTagList,function(tag){
        //        //        if((!tag.exist) && (valItem.inArray(tag.tagName))){   //标签存在情况下
        //        //            lenItem+=1 ;
        //        //        }
        //        //    }) ;
        //        //    if(lenItem == valItem.length){    //重複
        //        //        return true ;
        //        //    }else{
        //        //        lenExtension-=1 ;
        //        //    }
        //        //}) ;
        //
        //
        //        if(lenExtension != extension.length){
        //            console.log("use --- success") ;
        //            return false
        //        }else{
        //            return true
        //        }
        //    }
        //}
//        提交 检验参数
        function checkSave(){
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false ;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!params.knowledgeContents.length){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false ;
            //    else if(!params.knowledgeTitleTag.length){
            //    layer.msg("知识标题未打标")
            //} 
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("分类知识Bot不能为空")
            }else{
                return true
            }
        }
//***************************    save check channel dimension  **********************************************
        $scope.$watch("vm.dimensionArr",function(val,old){
            if(val.id && $scope.vm.channel && (!$scope.vm.isEdit)){
                checkChannelDimension($scope.vm.channel,val.id)
            }
        },true);
        $scope.$watch("vm.channel",function(val,old){
            if(val.length && $scope.vm.dimensionArr.id && (!$scope.vm.isEdit)){
                checkChannelDimension(val,$scope.vm.dimensionArr.id)
            }
        }, true);
        function checkChannelDimension(channel, dimension) {
            console.log(channel, dimension);
            //    新增的 channel = []  dimension = [] ,
            //   页面以添加 scanContent.dimensions   scanContent.channels
            if (!channel.length) {     //渠道不能为空
                //layer.msg("请填写渠道");
                return false
            } else {               //渠道非空
                //channel   == id
                //dimenssion   == id
                angular.forEach($scope.vm.scanContent, function (item) {
                    angular.forEach(item.channelIdList, function (v) {
                        angular.forEach(channel, function (val, indexChannel) {
                            if (val == v) {
                                angular.forEach(item.dimensionIdList, function (value) {
                                    angular.forEach(dimension, function (key, indexDimension) {
                                        if (key == value) {
                                            var channelTip;
                                            angular.forEach($scope.vm.channels, function (all) {
                                                if (all.channelCode == v) {
                                                    channelTip = all.channelName
                                                }

                                            });
                                            layer.msg("重复添加" + "渠道 " + channelTip + " 维度 " + $scope.vm.dimensionArr.name[indexDimension]);
                                            $scope.vm.dimensionArr.id.remove(key);
                                            $scope.vm.dimensionArr.name.splice(indexDimension, 1);
                                        }
                                    })
                                })
                            }
                        });
                    });
                });
            }
        }
        // 添加时候 存储对象
        function saveScan(){

        }
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
            httpRequestPost("/api/ms/conceptKnowledge/getKnowledgeTitle",{
                "title" : title
            },function(data){
                if(data.status == 200){
                    $scope.vm.appointRelativeList = data.data;
                    $scope.$apply()
                }else{
                }
                console.log(data);
            },function(error){
                console.log(error)
            });
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

    }
]);