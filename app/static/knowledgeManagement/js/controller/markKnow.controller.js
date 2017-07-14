/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('markKnowController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","$stateParams",
    "knowledgeAddServer","$window","$rootScope","$filter","myService","$location",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,$stateParams,
              knowledgeAddServer,$window,$rootScope,$filter,myService,$location) {
        $scope.vm = {
            knowledgeId : "" ,
            frames : [],      //业务框架
            frameId : "",
            knowledgeAdd: knowledgeAdd,  //新增点击事件
            knowledgeClassifyCall: knowledgeClassifyCall, //知识分类的回调方法
            openContentConfirm: openContentConfirm, //打开内容对话框
            botRoot : "",      //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botFullPath: null ,
            botSelectAdd : botSelectAdd,
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            isTitleRepeat : true ,
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            //生成  BOT
            getCreatBot : getCreatBot,
            //creatBot : [],
            //失去焦点
            //blur:blur,
            botClassfy : [],   //标题生成bot
            creatSelectBot : [] ,//点击bot类目数生成
            //扩展问
            getExtension : getExtension , //获取扩展问
            extensionTitle : "",
            extensionWeight :60,
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成


            //展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,    //预览
            //弹框相关
            newTitle: "",    //标题
            channel : [],     //新添加的 channel
            channels : [],     //所有渠道
            selectChannel : selectChannel , //獲取渠道
            dimension  : "",
            dimensions : []
            ,  //所有维度
            dimensionArr : [],  //選擇的維度
            dimensionsCopy :[],
            //extensionsArr:[],//校验页面扩展是否重复集合A


            checkChannelDimension : checkChannelDimension ,
            //高级选项内容
            slideDown : slideDown ,
            slideFlag : false,

            question : 1,
            tip : 1,
            tail : 1 ,
            appointRelative : "",
            appointRelativeList :[],
            appointRelativeGroup : [],
            addAppoint  : addAppoint,
            removeAppointRelative : removeAppointRelative,
            replaceType : 0,

            enterEvent : enterEvent ,
            //selectEvent : selectEvent
            limitSave : false , //限制多次打标
            isEditIndex : -1,   // 知识内容 弹框
                                // -1 为内容新增
                                // index 为知识的编辑索引

//*******************2017/7/14*******************//
            contentType : 0 ,  //新增内容类型
//*******************2017/7/14*******************//
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
            increaseCheck  : increaseCheck , //知识新增弹框保存按钮
            isChannelSelect : true       // 渠道维度添加是 的 判断 删除哪个

        };

        //獲取纬度
        knowledgeAddServer.getDimensions({ "applicationId" : APPLICATION_ID},
            function(data) {
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);
                }
            }, function(error) {console.log(error) });
        //获取渠道
        knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
            function(data) {
                if(data.data){
                    $scope.vm.channels = data.data
                }
            }, function(error) {console.log(error)});
        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        //if(!$stateParams.data!=null && $stateParams.data.knowledgeBase){
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase){
            var data = angular.fromJson($stateParams.data);
            //标题
            $scope.vm.title =  data.knowledgeBase.knowledgeTitle ;
            // 时间
            if(data.knowledgeBase.knowledgeExpDateStart || data.knowledgeBase.knowledgeExpDateEnd){
                $scope.vm.isTimeTable = true
            }
            $scope.vm.timeStart  =  $filter("date")(data.knowledgeBase.knowledgeExpDateStart,"yyyy-MM-dd") ;
            $scope.vm.timeEnd  = $filter("date")(data.knowledgeBase.knowledgeExpDateEnd,"yyyy-MM-dd") ;
            // bot 路径 s
            $scope.vm.creatSelectBot = data.knowledgeBase.classificationAndKnowledgeList ;

            //knowledgeId
            $scope.vm.knowledgeId = data.knowledgeBase.knowledgeId ;
            //扩展问
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            //内容
            //$scope.vm.scanContent = data.knowledgeContents ;
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
                $scope.vm.scanContent.push(obj) ;
                console.log(obj)
            });
            //
        }else if($stateParams.data && angular.fromJson($stateParams.data).docmentation){
            $scope.vm.docmentation = angular.fromJson($stateParams.data).docmentation;
            $scope.vm.title = $scope.vm.docmentation.documentationTitle;
            $scope.vm.newTitle = $scope.vm.docmentation.documentationContext; //填充新的知识内容
            $timeout(function(){$scope.vm.openContentConfirm(saveAddNew);},0) ;
             //知识内容弹出框
        }
        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10011,
                "index": 0,
                "pageSize":999999
            },function(data){
                //console.log(data);
                if(data.status!=10005){
                    if(data.data.length){
                        $scope.vm.frames = $scope.vm.frames.concat(data.data);
                        $scope.$apply();
                    }
                }
            },function(){
                //layer.msg("err or err")
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
                   var frame ;
                    angular.forEach($scope.vm.frames,function(item){
                        if(item.frameId == val ){
                            frame = item.frameTitle ;
                            return true ;
                        }
                    }) ;
                    //console.log(frame)  ;
                    if(frame == $scope.vm.extensionsByFrame[0].source){
                        return false
                    }else{
                        replace(val);//  替換條件
                    }
                }else{
                    // 在未生成扩展问情況
                    getExtensionByFrame(val);
                }

            }
        });

        // 通过frame 获取扩展问
        function getExtensionByFrame(id,type){
            //console.log(id);
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameTypeId": 10011,
                "frameId": id,
                "index": 0,
                "pageSize":999999
            },function(data){
                if(data.status==10000){
                    //console.log(data);
                    if(data.data[0].elements){
                        angular.forEach(data.data[0].elements,function(item){
                            var obj = {} ;
                            obj.extensionQuestionTitle  = item.elementContent;
                            obj.extensionQuestionType = 60;
                            obj.source = data.data[0].frameTitle;
                            if(type){
                                $scope.vm.extensionsByFrame.pop();
                                $scope.vm.extensionsByFrame.push(obj)
                            }else{
                                $scope.vm.extensionsByFrame.push(obj)
                            }
                        });
                    }
                    $scope.$apply();
                }
            });
        }
        // 获取Bot全路径
        function getBotFullPath(id){
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                if(data.status = 10000){
                    var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)) ,
                        botResult = $scope.master.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                    $scope.$apply(function(){
                        $scope.vm.knowledgeBotVal = data.categoryFullName;
                        if(botResult != false){
                            $scope.vm.botFullPath= botResult;
                        }
                    });
                }
            },function(error){console.log(error)});
        }
        //添加扩展问
        function getExtension(title,weight){
            var obj = {
                "extensionQuestionTitle" : title ,
                "extensionQuestionType" : weight
             } ;
            if(!title){
                layer.msg("扩展问不能为空")
            }else if(title == $scope.vm.title){
                return layer.msg("扩展问题不能与标题相同,请返回修改") ;
            }else if(!checkExtension(obj ,  $scope.vm.extensions)){
                layer.msg('根据"'+title+'"生成扩展问重复,已阻止添加');
                return false
            }else{
                httpRequestPost("/api/ms/faqKnowledge/checkExtensionQuestion",{
                    title : title
                },function(data){
                    if(data.status == 500){
                        layer.msg('根据"'+title+'"生成扩展问重复') ;
                        $scope.vm.extensionTitle = "" ;
                    }else if(data.status==200){
                        $scope.vm.extensionTitle = "" ;
                        $scope.vm.extensions.push(obj);
                        $scope.$apply()
                    }
                    //console.log(data);
                },function(error){console.log(error)});
            }
        }
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        //点击 root 的下拉效果
        function  knowledgeBot(){
            $timeout(function(){
                angular.element(".rootClassfy").slideToggle();
            },50)
        }
        //获取root 数据
        void function(){
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": APPLICATION_ID,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data;
            },function(){
               console.log("获取bot类目失败")
            });
        }() ;
        //BOT搜索自动补全
        $scope.master.searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
            $scope.$apply(function(){
                var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)) ,
                    botResult = $scope.master.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                    $scope.vm.knowledgeBotVal = suggestion.value;
                    if(botResult != false){
                        $scope.vm.botFullPath= botResult;
                    }
            })
        });

        //点击更改bot value
        $(".aside-navs").on("click","span",function(){
            //类型节点
            var pre = $(this).prev() ;
                angular.element(".icon-jj").css("backgroundPosition","0% 0%");
                var id = pre.attr("data-option");
                getBotFullPath(id);    //添加bot分類
                angular.element(".rootClassfy,.menus").slideToggle();
                $scope.$apply();
            //}
        });
        //添加bot分类的
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = null;
                $scope.vm.knowledgeBotVal = ""
            }

        }
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
////////////////////////////////////////         Bot     //////////////////////////////////////////////////////
        function replace(id){
            var dia = angular.element(".ngdialog");
            if(dia.length==0) {
                var replace = ngDialog.openConfirm({
                    template: "/static/knowledgeManagement/faq/replace.html",
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: true,
                    showClose: true,
                    backdrop: 'static',
                    preCloseCallback: function (e) {     //关闭回掉
                        if (e === 1) {    //替换
                            getExtensionByFrame(id, 1)
                        } else if (e === 0) {
                            // 添加不替换
                            getExtensionByFrame(id, 0)
                        }
                    }
                });
            }
        }
        function knowledgeAdd(data,index){
            var dia = angular.element(".ngdialog ");
            if(data){    //编辑知识内容
                $scope.vm.isEditIndex = index ;
                $scope.vm.newTitle = data.knowledgeContent;
                $scope.vm.channel = data.channelIdList;
                angular.forEach($scope.vm.dimensions,function(item){
                    if(data.dimensionIdList.inArray(item.dimensionId)){
                        var obj = {
                            "dimensionId" : item.dimensionId ,
                            "dimensionName" : item.dimensionName
                        } ;
                        $scope.vm.dimensionArr.push(obj) ;
                    }
                }) ;
                $scope.vm.tip  = data.knowledgeBeRelatedOn; //在提示
                $scope.vm.question = data.knowledgeRelatedQuestionOn;
                $scope.vm.tail = data.knowledgeCommonOn;
                $scope.vm.appointRelativeGroup = data.knowledgeRelevantContentList == null ? [] : data.knowledgeRelevantContentList;
                var callback = function(){
                    var obj = {};
                    obj.knowledgeContent = $scope.vm.newTitle;
                    obj.knowledgeContentType = 0;  // 答案类型
                    obj.channelIdList =  $scope.vm.channel;
                    obj.dimensionIdList =  $scope.vm.dimensionArr.id;
                    obj.knowledgeRelatedQuestionOn = $scope.vm.question;   //显示相关问
                    obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                    obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
                    obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup ; //业务扩展问
                    $scope.vm.scanContent[index] = obj;
                    $scope.vm.isEditIndex = -1  ;
                    setDialog();
                }
            }else{
                //新增知识内容
                var  callback = saveAddNew ;
            }
            if(dia.length==0) {
                $scope.vm.openContentConfirm(callback);
            }
        }
        //打开知识内容对话框
        function openContentConfirm(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/knowledgeManagement/public-html/markKnow_increase.html",
                width:"650px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                        callback();
                    } else {
                        $scope.vm.isEditIndex = -1  ;
                        setDialog();//清空内容对话框
                    }
                }
            });
        }
        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }

        //生成 bot
        function getCreatBot(){
            if($scope.vm.title){
                httpRequestPost("/api/ms/faqKnowledge/findClasssByKnowledgeTitle",{
                    "title" :  $scope.vm.title,
                    "applicationId" : APPLICATION_ID,
                    "knowledgeId" : $scope.vm.knowledgeId
                },function(data){
                    if(data.status == 500){
                         $scope.vm.titleTip = "知识标题重复";
                         $scope.title = ""  ;
                        $scope.$apply()
                    }else{
                        $scope.$apply(function(){
                            $scope.vm.botClassfy = [];   //reset 标题生成bot
                            //添加校验是否添加校验  获取所有bot 验证是否重复
                            var allBot = angular.copy($scope.vm.creatSelectBot) ;
                            angular.forEach(data.data, function (item) {
                                var botResult = $scope.master.isBotRepeat(item.id,item.fullPath,item.type,allBot) ;
                                if(botResult != false){
                                    $scope.vm.botClassfy.push(botResult);
                                }
                                $scope.vm.frameCategoryId = item.id;
                            });
                        });
                    }
                },function(err){
                   console.log(err)
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }
        }
        //  主页保存 获取参数
        function getParams(){
          var  params =  {
                "applicationId": APPLICATION_ID,
                "knowledgeId" : $scope.vm.knowledgeId ,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:null,  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:null,     //结束时间
                //"knowledgeCreator": $scope.vm.userId, //创建人
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME, //操作人
                "knowledgeType": 100  //知识类型
            };
            params.knowledgeContents =  $scope.vm.scanContent;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
            params.classificationAndKnowledgeList = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot));
            return params
        }
        var limitTimer ;
        function save(){
                if (!checkSave()) {
                    return false
                } else {
                    if(!$scope.vm.limitSave) {
                        $timeout.cancel(limitTimer) ;
                        $scope.vm.limitSave = true ;
                        limitTimer = $timeout(function(){
                            $scope.vm.limitSave = false ;
                        },180000) ;
                        $scope.vm.data = getParams();
                        var api = $scope.vm.knowledgeId?"/api/ms/faqKnowledge/editFAQKnowledge":"/api/ms/faqKnowledge/addFAQKnowledge";
                        httpRequestPost(api, getParams(), function (data) {
                            if (data.status == 200) {
                                if ($scope.vm.docmentation) {
                                    //文档知识分类状态回掉
                                    $scope.vm.knowledgeClassifyCall()
                                } else {
                                    $state.go('knowledgeManagement.custOverview');
                                }

                            }else if (data.status == 500) {
                                layer.msg("知识保存失败") ;
                                $timeout.cancel(limitTimer) ;
                                $scope.$apply(function(){
                                    $scope.vm.limitSave = false ;
                                });
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
        // 知识文档分类回调
        function knowledgeClassifyCall(){
            httpRequestPost("/api/ms/knowledgeDocumentation/documentationKnowledgeClassify",
                {
                    knowledgeId: $scope.vm.docmentation.knowledgeId,
                    knowledgeStatus: 2
                },
                function(data){
                    if(data && data.status == 200) {
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
        };
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                var params = getParams();
                console.log(params);
                obj.params = params;
                obj.editUrl = "knowledgeManagement.faqAdd";
                obj.api = "/api/ms/faqKnowledge/addFAQKnowledge" ;
                obj.knowledgeType = 101 ;
                obj.knowledgeId = $scope.vm.knowledgeId ;
                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        };
        /* ****************************************** //
         *
         *               弹框相关
         *
         */ // ****************************************** //

        function removeAppointRelative(item){
            $scope.vm.appointRelativeGroup.remove(item);
        }
//重置参数
        function setDialog(){
             $scope.vm.newTitle = "";
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

        function saveAddNew(){
            if($scope.vm.newTitle){
                var obj = {};
                obj.knowledgeContent = $scope.vm.newTitle;
                obj.knowledgeContentType = 0;  // 答案类型
                obj.channelIdList =  $scope.vm.channel;
                obj.dimensionIdList =  $scope.vm.dimensionArr.id;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
                obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
                obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
                obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup  ;//业务扩展问
                //高級 選項
                $scope.vm.scanContent.push(obj);
                setDialog()
            }else{
                setDialog()
            }
        }
        // 检验标题是否符合
        //function checkTitle(title,type){
        //    if(!title){
        //        layer.msg("标题不能为空");
        //        return false
        //    }else{
        //        httpRequestPost("/api/conceptKnowledge/checkDistribute",{
        //            "title" : title
        //        },function(data){
        //            console.log(data);
        //            return true;
        //        },function(err){
        //            layer.msg("打标失败，请重新打标");
        //            return false
        //        });
        //    }
        //}
        //检验扩展问是否重复
        function checkExtension(item,arr){
            if(arr.length==0){
                return true ;
            }else{
                var len = arr.length ;
                angular.forEach(arr,function(val){
                    if((val.extensionQuestionTitle == item.extensionQuestionTitle)&&(val.extensionQuestionType == item.extensionQuestionType)){
                        len-=1 ;
                    }
                }) ;
                if(len<arr.length){
                    return false
                }else{
                    return true
                }
            }
        }
//        提交 检验参数
        function checkSave(){
            var params = getParams();
            if($scope.vm.titleTip!=""){
                layer.msg($scope.vm.titleTip);
                return false;
            }
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false
            }else if(!params.knowledgeContents.length){
                layer.msg("知识内容不能为空，请点击新增填写");
                return false
            }else{
                return true
            }
        }
//***************************    save check channel dimension  **********************************************
        function increaseCheck(){
            //判斷维度是否为空 0 不变 1 全维度
            if(!$scope.vm.dimensionArr.id.length){
                $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
            };
            if(!$scope.vm.newTitle && !$scope.vm.channel.length){
                layer.msg("请填写知识内容,并选择渠道后保存")
            }else if(!$scope.vm.newTitle){
                layer.msg("请填写知识内容后保存")
            }else if(!$scope.vm.channel.length){
                layer.msg("请选择渠道后保存")
            }else if(checkChannelDimension($scope.vm.channel,$scope.vm.dimensionArr.id)){
                //存在重复条件
            }else{
                ngDialog.closeAll(1) ;
            }
        }
        //选择渠道
        function selectChannel(channelId,e){
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            //$scope.vm.isChannelSelect = false ;
            //checkChannelDimension($scope.vm.channel,val.id) ;
            //if(checkChannelDimension($scope.vm.channel,$scope.vm.dimensionArr.id,type)){
            //    $(srcObj).attr("checked","false")
            //}
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
        }
        //$scope.$watch("vm.dimensionArr",function(val,old){
        //    if(val.id && $scope.vm.channel && (!$scope.vm.isEditIndex)){
        //        $scope.vm.isChannelSelect = false ;
        //        checkChannelDimension($scope.vm.channel,val.id)
        //    }
        //},true);
        //$scope.$watch("vm.channel",function(val,old){
        //    if(val.length && $scope.vm.dimensionArr.id && (!$scope.vm.isEdit)){
        //        $scope.vm.isChannelSelect = true  ;
        //        $scope.vm.dimensionsCopy = {id:[],name:[]} ;
        //        angular.forEach($scope.vm.dimensions,function(item){
        //            if(!$scope.vm.dimensionArr.id.inArray(item.dimensionId)){
        //                $scope.vm.dimensionsCopy.name.push(item.dimensionName);
        //                $scope.vm.dimensionsCopy.id.push(item.dimensionId);
        //            }
        //        }) ;
        //        checkChannelDimension(val,$scope.vm.dimensionArr.id) ;
        //    }
        //},true);
        // true  重复  false 不重复通过可以保存
        function checkChannelDimension(channel,dimension){
            var isRepeat  = false;
            //    新增的 channel = []  dimension = [] ,
            //   页面以添加 scanContent.dimensions   scanContent.channels
            //if(!channel.length){     //渠道不能为空
                //layer.msg("请填写渠道");
                //return false
            //}else{               //渠道非空 channel   == code dimenssion   == id
                angular.forEach($scope.vm.scanContent,function(item,contentIndex){
                    if($scope.vm.isEditIndex != contentIndex){
                        angular.forEach(item.channelIdList,function(v){
                        angular.forEach(channel,function(val,indexChannel) {
                            if(val == v){
                                angular.forEach(item.dimensionIdList,function(value){
                                    angular.forEach(dimension,function(key,indexDimension){
                                        if(key==value){
                                            var channelTip;
                                            angular.forEach($scope.vm.channels,function(all){
                                                if(all.channelCode==v){
                                                    channelTip = all.channelName
                                                }
                                            });
                                            layer.msg("重复添加"+"渠道 "+channelTip+" 维度 "+$scope.vm.dimensionArr.name[indexDimension]);
                                            //if( $scope.vm.isChannelSelect ){
                                            //    $scope.vm.channel.splice(indexChannel,1) ;
                                            //}else{
                                            //    $scope.vm.dimensionArr.id.remove(key);
                                            //    $scope.vm.dimensionArr.name.splice(indexDimension,1);
                                            //}
                                            isRepeat = true
                                        }
                                    })
                                })
                            }
                        });
                    });
                    }
                });
            //}
            return isRepeat
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