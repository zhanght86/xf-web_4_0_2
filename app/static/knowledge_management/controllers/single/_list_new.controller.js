/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  列表知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('ListNewController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"ngDialog","$cookieStore","$timeout","$compile",
    "knowledgeAddServer","$window","$stateParams","$interval","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,$compile,
      knowledgeAddServer,$window,$stateParams,$interval,$filter) =>{
        $scope.vm = {
            ctrName : "list" ,
            apiQueryRelatedQuestion : "queryListRelatedQuestion" , // 相关问 api
            localNameOfExt : "cust_list_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            knowledgeOrigin : 120 , //知识来源
            knowledgeId : "",       // 知识编辑 id

            frames : [],      //业务框架
            frameId : "",
            botRoot : "",      //根节点
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
//时间
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
//bot
            creatSelectBot : [], //手选生成 bot

//扩展问
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成
//展示内容
            save : save ,   //保存
            scan :scan ,   //预览
//高级选项
            newTitle: "",    //标题
            knowledgeContentNegative : "",
            channelIdList : [],     //新添加的 channel
            dimensionArr : [],  //選擇的維度
            question : 1,
            tip : 1,
            tail : 1 ,
            appointRelativeGroup : [],

            replaceType : 0 ,
            enterEvent : enterEvent,

            limitSave : false, //限制多次打标
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
        };

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
            $scope.vm.extensionsByFrame = data.extensionQuestions;
            //内容
            angular.forEach(data.knowledgeContents,function(item){
                $scope.vm.newTitle = item.knowledgeContent;
                $scope.vm.knowledgeContentNegative = item.knowledgeContentNegative ;
                $scope.vm.channelIdList = item.channelIdList ;
                $scope.vm.dimensionArr = item.dimensionIdList ;
                $scope.vm.question =item.knowledgeRelatedQuestionOn ;   //显示相关问
                $scope.vm.tip  =  item.knowledgeBeRelatedOn ; //在提示
                $scope.vm.tail = item.knowledgeCommonOn ;   //弹出评价小尾巴
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList==null?[]:item.knowledgeRelevantContentList;  //业务扩展问
            });
        } else if($stateParams.knowledgeTitle){
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
        //生成扩展问校验
        function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
            //var title = oldWord.extensionQuestionTitle ;
            var title = extensionQuestionList[0] ;
            var weight = oldWord.extensionQuestionType ;
            var isLocalHasExt = addLocalExtension(title)  ;
            if(isLocalHasExt){
                $scope.vm.extensionsByFrame.push(isLocalHasExt);
                return ;
            }
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

        //  主页保存 获取参数
        function getParams(){
           return  {
                "applicationId": APPLICATION_ID,
                "userId" : USER_ID ,
                "sceneId" : SCENE_ID ,
                "knowledgeId" : $scope.vm.knowledgeId ,
                "knowledgeType": 102,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:"",  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:"",     //结束时间
                "knowledgeTitleTag" : "",    //标题打标生成的name
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME , //操作人
                "knowledgeOrigin" : $scope.vm.knowledgeOrigin ,
                "extensionQuestions" : $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ,
                "classificationAndKnowledgeList" : $scope.vm.creatSelectBot ,
                "knowledgeContents" : new Array({
                    knowledgeContent : $scope.vm.newTitle,
                    knowledgeContentNegative : $scope.vm.knowledgeContentNegative,
                    channelIdList :  $scope.vm.channelIdList,
                    dimensionIdList :  $scope.vm.dimensionArr==[]? $scope.$parent.$parent.MASTER.dimensionListIds : $scope.vm.dimensionArr,
                    knowledgeRelatedQuestionOn : $scope.vm.question,    //显示相关问
                    knowledgeBeRelatedOn  :  $scope.vm.tip , //在提示
                    knowledgeCommonOn : $scope.vm.tail ,   //弹出评价小尾巴
                    knowledgeRelevantContentList : $scope.vm.appointRelativeGroup  //业务扩展问
                })
           };
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
                        var params = getParams();
                        KnowledgeService[api].save(params,function (response) {
                            if (response.status == 200) {
                                $state.go('knowledgeManagement.custOverview');
                            } else if (response.status == 500) {
                                layer.msg("知识保存失败") ;
                                $timeout.cancel(limitTimer) ;
                                $scope.vm.limitSave = false ;
                            }
                        }, function (error) {
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
                var obj = {
                    params : getParams(),
                    knowledgeType : 102 ,
                    knowledgeId : $scope.vm.knowledgeId ,
                    api : api
                };
                obj.editUrl = "knowledgeManagement.listAdd";
                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        }
//        提交 检验参数
        function checkSave(){
            var params = getParams();
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
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
])};




