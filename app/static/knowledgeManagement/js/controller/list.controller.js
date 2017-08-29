/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('knowManaListController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader",
    "knowledgeAddServer","$window","$stateParams","$interval","$filter","$animate",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,
              knowledgeAddServer,$window,$stateParams,$interval,$filter,$animate) {
        $scope.vm = {
            knowledgeId : "" ,
            knowledgeOrigin :120 ,
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
            //生成  知识标题 打标生成 BOT
            getBotAndExtensionByTitle : getBotAndExtensionByTitle,
            //creatBot : [],

            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :60,
            getExtension : getExtension,  //獲取擴展問
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
            extensionByTitleTag : [] , //标题打标生成扩展问
            extensionEdit : extensionEdit,

            //展示内容
            scanContent : [],
            save : save ,   //保存
            scan :scan ,   //预览
            //高级选项
            newTitle: "",    //标题
            knowledgeContentNegative : "",
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
            enterEvent : enterEvent,

            dialogExtension : [],
            limitSave : false, //限制多次打标
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
            backupsOfExtension : "" //扩展问 编辑备份
        };

        //獲取渠道
        $scope.MASTER.getDimensions($scope,["dimensions","dimensionsCopy"]) ;
        //获取维度
        $scope.MASTER.getChannels($scope,["channels"]) ;
        //、、、、、、、、、、、、、、、、、、、、、、、   通过预览 编辑 判断   、、、、、、、、、、、、、、、、、、、、、、、、、
        /*

         */
        //組裝數據   擴展問   content
        //BOT路径设置为 选择添加                  再次增加判断重复
        //
        //标题
        if($stateParams.data && angular.fromJson($stateParams.data).knowledgeBase ){
            var data = angular.fromJson($stateParams.data) ;
            //console.log($stateParams.data);
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
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                $scope.vm.newTitle = item.knowledgeContent;
                $scope.vm.knowledgeContentNegative = item.knowledgeContentNegative ;
                //維度，添加預覽效果   以name id 的 形式显示
                               //obj.channelIdList =  item.channelIdList ;
                //obj.dimensionIdList =  item.dimensionIdList ;
                $scope.vm.channel = item.channelIdList ;
                //console.log(item.channelIdList ,$scope.vm.channels )
                $scope.vm.dimensionArr = [] ;
                //异步原因
                var getDimension = $interval(function(){
                    if($scope.vm.dimensions){
                        //console.log(item.dimensionIdList , $scope.vm.dimensions) ;
                        $interval.cancel(getDimension);
                        angular.forEach($scope.vm.dimensions,function(val){
                            if(item.dimensionIdList.inArray(val.dimensionId)){
                                var obj = {};
                                obj.dimensionName = val.dimensionName;
                                obj.dimensionId = val.dimensionId;
                                $scope.vm.dimensionArr.push(obj);
                                //console.log(obj)
                                //console.log( $scope.vm.dimensionArr )
                            }
                        });
                    }
                },100) ;
                $scope.vm.question =item.knowledgeRelatedQuestionOn ;   //显示相关问
                $scope.vm.tip  =  item.knowledgeBeRelatedOn ; //在提示
                $scope.vm.tail = item.knowledgeCommonOn ;   //弹出评价小尾巴
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList ;  //业务扩展问
                //console.log(obj)
            });
            //
        }

        if($stateParams.knowledgeTitle){
            console.log("======"+$stateParams.knowledgeTitle);
            $scope.vm.title=$stateParams.knowledgeTitle;
        }

        //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10012,
                "index": 0,
                "pageSize":999999
            },function(data){
                console.log(data);
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
                //if($scope.vm.extensionsByFrame.length){
                //    //  替換條件gruntwatch
                //    replace(val);
                //}else{
                    // 在未生成扩展问情況
                    getExtensionByFrame(val);
                //}
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
                    //var  extensionQuestionList = [] ,
                    //     frameQuestionTagList = [];
                    var obj = {} ;
                    if(data.data[0].elements){
                        angular.forEach(data.data[0].elements,function(item,index){
                            var  extensionQuestionList = [] ,
                                frameQuestionTagList = [];
                                obj={
                                    "extensionQuestionType": 60 ,  //61
                                    "extensionQuestionTitle": data.data[0].frameTitle
                                } ;
                                extensionQuestionList.push((item.elementContent.substring(0,item.elementContent.indexOf('#'))));
                                frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#')+1).split('；'));
                               checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
                        });
                        //checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
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
                    //添加校验是否添加校验
                    console.log(data) ;
                    var allBot = angular.copy($scope.vm.creatSelectBot.concat($scope.vm.botClassfy)) ,
                        botResult = $scope.MASTER.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                    console.log(botResult) ;
                    $scope.$apply(function(){
                        $scope.vm.knowledgeBotVal = data.categoryFullName;
                        if(botResult != false){
                            //$scope.vm.knowledgeBotVal = data.categoryFullName.split("/");
                            $scope.vm.botFullPath= botResult;
                        }
                    });
                }
            }
        )}
        //生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            //var title = oldWord.extensionQuestionTitle ;
            var title = extensionQuestionList[0] ;
            var weight = oldWord.extensionQuestionType ;
            httpRequestPost("/api/ms/listKnowledge/checkFrameTag",{
                "applicationId": APPLICATION_ID,
                "extensionQuestionList" : extensionQuestionList,
                "frameQuestionTagList" : frameQuestionTagList
            },function(data){
                if(data.status==200){
                    $scope.$apply(function(){
                        var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
                        var result = $scope.MASTER.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                        if(result != false){
                            $scope.vm.extensionTitle = "";
                            $scope.vm.extensionsByFrame.push(result);
                        }
                    }) ;
                }
            });
        }
        //手动添加扩展问
        function getExtension(title,weight,source){
            //source  0 默认  1 标题
            var question = new Array(title);
            var obj = {
                "extensionQuestionTitle" : $scope.vm.extensionTitle,
                "extensionQuestionType" : $scope.vm.extensionWeight
            } ;
            if(!$scope.vm.extensionTitle){
                layer.msg("扩展问不能为空")
            }else if(!checkExtensionByTitle(obj)){
                layer.msg("生成扩展问重复,已阻止添加");
                return false
            } else {
                httpRequestPost("/api/ms/listKnowledge/checkExtensionQuestion", {
                    "applicationId": APPLICATION_ID,
                    "extendQuestionList": question
                }, function (data) {
                    if (data.status == 500) {
                        layer.msg(data.data);
                    } else if(data.status == 10026 ){
                         layer.msg("扩展问添加重复，请重新添加");
                    }else if (data.status == 200) {
                        $scope.$apply(function(){
                            var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
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
                }, function () {

                });
            }
        }
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
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

        //点击bot分类的 加号
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.frameCategoryId = $scope.vm.botFullPath.classificationId;
                $scope.vm.botFullPath = "";
                $scope.vm.knowledgeBotVal = "";
            }
        };
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
//        function replace(id){
//                var replace = ngDialog.openConfirm({
//                    template:"/static/knowledgeManagement/faq/replace.html",
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
                            if(type == 1){
                                $scope.vm.extensionsByFrame[index] = $scope.vm.backupsOfExtension ;
                            }else if(type == 0){
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
        //根據 標題 生成 bot 跟 扩展问
        function getBotAndExtensionByTitle(){
            if($scope.vm.title){
                httpRequestPost("/api/ms/listKnowledge/checkKnowledgeTitleAndGetAutoClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : APPLICATION_ID,
                    "knowledgeId" : $scope.vm.knowledgeId
                },function(data){
                    console.log(data);
                    if(data.status == 500){    //标题打标失败
                        $scope.vm.titleTip = "知识标题重复";
                        $scope.$apply();
                    }else if(data.status == 200){
                        $scope.$apply(function(){
                            //標題打标结果
                            $scope.vm.knowledgeTitleTag = data.data.knowledgeTitleTagList ;
                            $scope.vm.botClassfy = [];   //reset 标题生成bot
                            //添加校验是否添加校验  获取所有bot 验证是否重复
                            var allBot = angular.copy($scope.vm.creatSelectBot) ;
                            //生成bot
                            angular.forEach(data.data.classifyList, function (item) {
                                var botResult = $scope.MASTER.isBotRepeat(item.id,item.fullPath,item.type,allBot) ;
                                if(botResult != false){
                                    $scope.vm.botClassfy.push(botResult);
                                }
                                $scope.vm.frameCategoryId = item.id;
                            });
                        });
                    }
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
                "sceneId" : SCENE_ID ,
                "knowledgeType": 102,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:"",  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:"",     //结束时间
                "knowledgeTitleTag" : $scope.vm.knowledgeTitleTag,    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME , //操作人
                "knowledgeOrigin" : $scope.vm.knowledgeOrigin
           };
            var obj = {};
            obj.knowledgeContent = $scope.vm.newTitle;
            obj.knowledgeContentNegative = $scope.vm.knowledgeContentNegative;
            obj.channelIdList =  $scope.vm.channel;
            if(!$scope.vm.dimensionArr.id.length){
                $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
            };
            obj.dimensionIdList =  $scope.vm.dimensionArr.id.length?$scope.vm.dimensionArr.id:$scope.vm.dimensionsCopy.id;
            obj.knowledgeRelatedQuestionOn = $scope.vm.question;    //显示相关问
            obj.knowledgeBeRelatedOn  =  $scope.vm.tip ; //在提示
            obj.knowledgeCommonOn = $scope.vm.tail ;   //弹出评价小尾巴
            obj.knowledgeRelevantContentList = $scope.vm.appointRelativeGroup;  //业务扩展问
            $scope.vm.scanContent = [] ;
            $scope.vm.scanContent.push(obj);
            params.knowledgeContents =  $scope.vm.scanContent;
            params.extensionQuestions =  $scope.vm.extensions.concat($scope.vm.extensionsByFrame,$scope.vm.extensionByTitleTag) ;
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
                            var params = getParams();
                            var api;
                            if ($scope.vm.knowledgeId) {
                                //编辑
                                api = "/api/ms/listKnowledge/editKnowledge";
                                params.knowledgeId = $scope.vm.knowledgeId;
                            } else {
                                //新增
                                api = "/api/ms/listKnowledge/addListKnowledge"
                            }
                            httpRequestPost(api, params, function (data) {
                                //console.log(getParams());
                                if (data.status == 200) {
                                    console.log(data);
                                    $state.go('knowledgeManagement.custOverview');
                                } else if (data.status == 500) {
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
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                var params = getParams();
                //console.log(params);

                obj.params = params;
                obj.knowledgeType = 102 ;
                obj.knowledgeId = $scope.vm.knowledgeId ;
                if($scope.vm.knowledgeId){
                    //编辑
                    obj.api = "/api/ms/listKnowledge/editKnowledge" ;
                    params.knowledgeId = $scope.vm.knowledgeId ;
                }else{
                    //新增
                    obj.api = "/api/ms/listKnowledge/addKnowledge" ;
                }
                obj.editUrl = "knowledgeManagement.listAdd";
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

        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/ms/listKnowledge/checkDistribute",{
                    "title" : title
                },function(data){
                    console.log(data);
                    return true;
                },function(err){
                    layer.msg("打标失败，请重新打标");
                    return false
                });
            }
        }
        //检验扩展问是否重复
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
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!$scope.MASTER.isTitleHasExt($scope.vm.title,params.extensionQuestions)){
                layer.msg("标题未打标")
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false ;
            }else if(!params.knowledgeContents[0].knowledgeContent || !params.knowledgeContents[0].knowledgeContentNegative){
                layer.msg("知识内容信息不完整，请增填写完整");
                return false ;
            }else if(!params.knowledgeContents[0].channelIdList.length){
                layer.msg("渠道不能为空") ;
                return false ;
            }else{
                return true ;
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
            $scope.vm.appointRelative = "";  //清楚title
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
                    $scope.$apply();
                }else{
                }
                console.log(data);
            },function(err){

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