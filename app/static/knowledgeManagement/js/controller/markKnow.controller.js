/**
 * Created by mileS on 2017/3/28.
 */
angular.module('knowledgeManagementModule').controller('markKnowController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","$stateParams",
    "knowledgeAddServer","$window","$rootScope","$filter","myService","$location","$interval","$parse","$sce",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,$stateParams,
              knowledgeAddServer,$window,$rootScope,$filter,myService,$location,$interval,$parse,$sce) {
        $scope.vm = {
            knowledgeId : "" ,
            frames : [],      //业务框架
            frameId : "",
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
            emotionText: "",    //标题
            channel : [],     //新添加的 channel
            channels : [],     //所有渠道
            selectChannel : selectChannel , //獲取渠道
            dimension  : "",
            dimensions : []
            ,  //所有维度
            dimensionArr : [],  //選擇的維度
            dimensionsCopy :[],
            //extensionsArr:[],//校验页面扩展是否重复集合A

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
            contentType : 111 ,  //新增内容类型
            imgPaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10,//分页框数量
            },
            voicePaginationConf : {
                pageSize: 8,//第页条目数
                pagesLength: 10,//分页框数量
            } ,
            getPicList : getPicList ,   //获得所有图片
            selectMultimedia : selectMultimedia,   //图片选择弹出框
            imageList : [] ,     //所有图片文件
            addMultimedia : addMultimedia , //选择图片
            imgSelected : "",    // 已选图片
            //getEmotion : getEmotion ,
            voiceList : "",                //所有声音文件
            getVoiceList : getVoiceList,  //获取素有声音文件
            voiceSelected : "" ,    //以选择声音文件

            qqFaceText : "" ,

//*******************2017/7/14*******************//
            //引到页
            showTip : showTip,
            hideTip : hideTip,
            prevDiv : prevDiv,
            nextDiv : nextDiv,
            //引到页end
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
                            }
                        });
                    }
                },100) ;
                //維度，添加預覽效果   以name id 的 形式显示
                $scope.vm.channel = item.channelIdList ;
                //$scope.vm.dimensionIdList = item.channelIdList ;
                $scope.vm.contentType = item.knowledgeContentNegative ;
                $scope.vm.dimensionArr.id = item.dimensionIdList ;
                $scope.vm.question = item.knowledgeRelatedQuestionOn ;
                $scope.vm.tip = item.knowledgeBeRelatedOn ;
                $scope.vm.tail = item.knowledgeCommonOn ;
                $scope.vm.appointRelativeGroup = item.knowledgeRelevantContentList ;
                $scope.vm.contentType = parseInt(item.knowledgeContentNegative) ;
                if(item.knowledgeContentNegative==111){
                    $scope.vm.imgSelected={
                        "url" :  item.knowledgeContent ,
                        "name" : item.knowledgeContent
                    }
                }else if(item.knowledgeContentNegative==112){
                    $scope.vm.voiceSelected = {
                        "url" :  item.knowledgeContent,
                        "name" : item.knowledgeContent
                    }
                }else if(item.knowledgeContentNegative==113){
                    var html = item.knowledgeContent ;
                    $("#emotion-container").html($filter("emotion")(html)) ;
                }
            });
        }else if($stateParams.knowledgeTitle){
            //console.log("======"+$stateParams.knowledgeTitle);
            $scope.vm.title=$stateParams.knowledgeTitle;
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
        //打开知识内容对话框
        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }

        //生成 bot
        function getCreatBot(){
            if($scope.vm.title){
                httpRequestPost("api/ms/marketingKnowledge/findClasssByKnowledgeTitle",{
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
                "knowledgeUpdater": USER_LOGIN_NAME, //操作人
                "knowledgeCreator": USER_LOGIN_NAME, //操作人
                "knowledgeType": 105  //知识类型
            };
            var knowledgeContent ;
            if($scope.vm.contentType==111){
                knowledgeContent = $scope.vm.imgSelected.url
            }else if($scope.vm.contentType==112){
                knowledgeContent = $scope.vm.voiceSelected.url
            }else if($scope.vm.contentType==113){
                //faceToString
                var html = $("#emotion-container").html() ;
                knowledgeContent = $filter("faceToString")(html).replace(/<div>/,"\n").replace(/<div>/g,"").replace(/<\/div>/g,'\n').replace(/<br>/g,'\n') ;
            }
            if(!$scope.vm.dimensionArr.id.length){
                $scope.vm.dimensionArr=angular.copy($scope.vm.dimensionsCopy)
            };
            params.knowledgeContents =  new Array({
                "knowledgeContent" : knowledgeContent ,
                "channelIdList":$scope.vm.channel ,
                "knowledgeContentNegative": $scope.vm.contentType.toString() ,
                "dimensionIdList" : $scope.vm.dimensionArr.id.length?$scope.vm.dimensionArr.id:$scope.vm.dimensionsCopy.id,
                "knowledgeRelatedQuestionOn" :$scope.vm.question,    //显示相关问
                "knowledgeBeRelatedOn": $scope.vm.tip , //在提示
                "knowledgeCommonOn" : $scope.vm.tail ,   //弹出评价小尾巴
                "knowledgeRelevantContentList" :  $scope.vm.appointRelativeGroup  //业务扩展问
            });
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
                    var api = $scope.vm.knowledgeId?"api/ms/marketingKnowledge/editKnowledge":"api/ms/marketingKnowledge/addKnowledge";
                    httpRequestPost(api, getParams(), function (data) {
                        if (data.status == 200) {
                            $state.go('knowledgeManagement.custOverview');
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

        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                var params = getParams();
                obj.params = params;
                obj.editUrl = "knowledgeManagement.markKnow";
                obj.api = $scope.vm.knowledgeId?"api/ms/marketingKnowledge/editKnowledge":"api/ms/marketingKnowledge/addKnowledge" ;
                obj.knowledgeType = 105 ;
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

        //选择渠道
        function selectChannel(channelId,e){
            //var  srcObj = e.srcElement ? e.srcElement : e.target;
            if($scope.vm.channel.inArray(channelId)){
                $scope.vm.channel.remove(channelId);
            }else{
                $scope.vm.channel.push(channelId);
            }
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
//*******************2017/7/14*******************//
        $('.emotion').qqFace({
            id : 'facebox',
            //assign:'emotion-container',       //赋值对象
            assign:'emotinon-backup',       //赋值对象
            path:'/libs/qqFace/arclist/'	//表情存放的路径
        });
        $interval(function(){
          var val = $("#emotinon-backup").val() ;
            if(val){
                var html = $("#emotion-container").html()+$filter('emotion')(val);
                $("#emotion-container").html(html) ;
                $("#emotinon-backup").val("") ;
                console.log($filter("faceToString")(html))
            }
        },500) ;
        //弹出选择图片声音对话框
        function selectMultimedia(){
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/public-html/selectImage.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
        function addMultimedia(item){
            if($scope.vm.contentType==111){
                $scope.vm.imgSelected = {
                    "url" : item.pictureUrl ,
                    "id" : item.pictureId,
                    "name" : item.pictureName
                } ;
            }else if($scope.vm.contentType==112){
                $scope.vm.voiceSelected = {
                    "url" : item.voiceUrl ,
                    "id" : item.voiceId ,
                    "name" : item.voiceName
                } ;
            }
            ngDialog.closeAll() ;
        }
        getPicList(1) ;
        //获取所有图片
        function getPicList(index){
            httpRequestPost("/api/ms/picture/queryPicture",{
                "index": (index-1)*$scope.vm.imgPaginationConf.pageSize,
                "pageSize": $scope.vm.imgPaginationConf.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.imageList = data.data.objs ;
                        $scope.vm.imgPaginationConf.currentPage =index ;
                        $scope.vm.imgPaginationConf.totalItems =data.data.total ;
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }
        getVoiceList(1) ;
        function getVoiceList(index){
            httpRequestPost("/api/ms/voiceManage/queryVioce ",{
                "index": (index-1)*$scope.vm.voicePaginationConf.pageSize,
                "pageSize": $scope.vm.voicePaginationConf.pageSize
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.voiceList = data.data.objs ;
                        $scope.vm.voicePaginationConf.currentPage =index ;
                        $scope.vm.voicePaginationConf.totalItems =data.data.total ;
                        console.log($scope.vm.voicePaginationConf)
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }
        var picTimer ;
        $scope.$watch('vm.imgPaginationConf.currentPage', function(current){
            if(current){
                if (picTimer) {
                    $timeout.cancel(picTimer)
                }
                picTimer = $timeout(function () {
                    getPicList(current);
                }, 100)

            }
        },true);
        var voiceTimer ;
        $scope.$watch('vm.voicePaginationConf.currentPage', function(current){
            if(current){
                if (voiceTimer) {
                    $timeout.cancel(voiceTimer)
                }
                voiceTimer = $timeout(function () {
                    getVoiceList(current);
                }, 100)
            }
        },true);
//*******************2017/7/14*******************//

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