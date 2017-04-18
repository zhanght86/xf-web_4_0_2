/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('knowManaFaqController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout) {
        $cookieStore.put("userName","admin1");
        $cookieStore.put("applicationId","360619411498860544")
        $scope.vm = {
//主页
            applicationId : $cookieStore.get("applicationId"),
            userName :  $cookieStore.get("userName"),
            frames : [],      //业务框架
            frameId : "",
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            KnowledgeEdit: KnowledgeEdit,  //
            botRoot : "",     //根节点
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

            //生成  BOT
            getCreatBot : getCreatBot,
            creatBot : [],

            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :1,
            getExtension : getExtension,
            extensions : [],


            //展示内容
            scanContent : [],
            saveContent : [],
            //title : "",
            //channels : "",
            //dimensions : "",
            save : save ,
            scan :scan ,
            //弹框相关
            newTitle: "",
            channel : "",
            channels : "",     //渠道
            dimension  : "",
            dimensions : ""  ,  //维度
            dimensionArr : [],
            channelArr : [] ,

            checkChannelDimension : checkChannelDimension ,
            //高级选项内容
            slideDown : slideDown,
            slideFlag : false,

            question : 1,
            tip : 1,
            tail : 1 ,

            appointRelative : "",
            appointRelativeList :[],
            addAppoint  : addAppoint,
            //vm.appointRelativeGroup.push(item)
            appointRelativeGroup : [],
            removeAppointRelative : removeAppointRelative,

            source : ['Apple', 'Banana', 'Orange'],
        };
        $scope.name = true;

        $cookieStore.put("categoryApplicationId","360619411498860544");

        var applicationId = $cookieStore.get("categoryApplicationId");

        function getFrame(){
            //angular.forEach($scope.vm.knoledgeBotVal,function(item){
            //
            //});
            httpRequestPost("/api/modeling/frame/listbyattribute",{
                "frameCategoryId": $scope.vm.frameCategoryId,
                "frameEnableStatusId": 1,
                "frameTypeId":10012,
                "index": 0,
                "pageSize":999999
            },function(data){
                if(data.status!=10005){
                    $scope.vm.frames = data.data;
                    $scope.vm.frameId=$scope.vm.frames[0].frameId;
                    $scope.$apply();
                }
            },function(){
                alert("err or err")
            });
        }
        $scope.$watch("vm.frameCategoryId",function(val,old){
            if(val&&val!=old){
                getFrame()
            }
        });

        function getExtension(title,weight){
            var obj = {};
            obj.extensionQuestionTitle = title;
            obj.extensionQuestionType = weight;
            $scope.vm.extensions.push(obj);
            httpRequestPost("/api/faqKnowledge/checkExtensionQuestion",{
                title : title
            },function(data){
                if(data.data = 10008){
                    layer.msg("扩展问重复")
                }else{
                    var obj = {};
                    obj.extensionQuestionTitle = title;
                    obj.extensionQuestionType = weight;
                    $scope.vm.extensions.push(obj);
                    console.log(data);
                }
            },function(){
                alert("err or err")
            });
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
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": applicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data;
                //console.log( $scope.vm.applicationId);
            },function(){
                alert("err or err")
            });
        }
        //点击更改bot value
        $(".aside-navs").on("click","span",function(){
            var value = $(this).html();
            $scope.vm.frameCategoryId = $(this).prev().attr("data-option");
            $scope.vm.creatSelectBot.push(value);
            //$scope.vm.knowledgeBotVal = value;
            $scope.$apply();
            //}
        });
        //点击bot分类的 加号
        function botSelectAdd(){
            $scope.vm.knowledgeBotVa = "";
        };
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":applicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var  html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li>' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span>'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>'
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown()
                    }
                },function(err){
                    alert(err)
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

        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
        });
        function KnowledgeEdit(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/concept/knowledgeAddSingleConceptDialog2.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
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
        function KnowledgeAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/knowledgeManagement/faq/knowManaFaqDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        saveAddNew()
                    }
                }
            });

            $timeout(function(){
                //var dimensions = angular.copy($scope.vm.dimensions);
                //var source = [];
                //angular.forEach(srouce,function(item){
                //    source.push(item.dimensionName)
                //});
                // console.log(source);
                //var widget = new AutoComplete('search_bar', ['Apple', 'Banana', 'Orange']);
            },500);
            //}
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }

        //生成 bot
        function getCreatBot(){
            if($scope.vm.title){
                httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : "100"
                },function(data){
                    if(data.status == 500){
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    }else{
                        angular.forEach(data.data,function(item){
                            $scope.vm.frameCategoryId = item.id
                        });
                        $scope.vm.creatBot = data.data;
                        $scope.$apply()
                    }
                    //console.log(data);
                },function(err){
                    layer.msg("打标失败，请重新打标")
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }

        }




//            "data": {
//            "knowledgeBase": {
//                "applicationId": "360619411498860544",
//                "knowledgeTitle": "可是2222",  知识标题
//                 knowledgeExpDateStart：  开始时间
//                "knowledgeExpDateStart": 1492073292000, 结束时间
//                "knowledgeCreateTime": 1492053301000,
//                 "knowledgeModifyTime": 1492073233000,
//                 "knowledgeCreator": "wangzhangjia", 创建人
//                 "knowledgeUpdater": "wangzhangjia", 操作人
//                "knowledgeType": 100  知识类型
//            },
//            "knowledgeContents": [
//                {
//                    "knowledgeContent": "可是", 答案内容
//                    "knowledgeContentType": 0, 答案类型
//                   "channelId": "123,456",  维度
//                   "dimensionId": "123,345", 渠道
//                   "knowledgeRelatedQuestionOn": 0,   显示相关问
//                  "knowledgeBeRelatedOn": 0,   在相关问显示
//                 "knowledgeCommonOn": 0,    弹出评价小尾巴
//                    "knowledgeRelevantContent": ""  业务扩展问
//        }
//        ],
//            "extensionQuestions": [
//            {
//
//                "extensionQuestionTitle": "gdgdf",  扩展问标题
//                "extensionQuestionType": 0,  扩展问类型
//
//        }
//        ],
//        "classificationAndKnowledge": [
//            {
//                "classificationId": "123",
//                "classificationType": 0,  类目类型
//                "classificationName": "类目"  类目名称
//              }
//        ]
//  }



        //  主页保存 获取参数
        function getParams(){
            var params = {};
            params.knowledgeBase =  {
                "applicationId": $scope.vm.applicationId,
                "knowledgeTitle": $scope.vm.title,      //知识标题
                "knowledgeExpDateStart" : $scope.vm.isTimeTable?$scope.vm.timeStart:null,  //开始时间
                "knowledgeExpDateEnd": $scope.vm.isTimeTable?$scope.vm.timeEnd:null,     //结束时间
                "knowledgeCreator": $scope.vm.userName, //创建人
                "knowledgeUpdater": $scope.vm.userName, //操作人
                "knowledgeType": 100  //知识类型
            };
            params.knowledgeContents =  $scope.vm.scanContent;
            params.extensionQuestions =  $scope.vm.extensions ;
            params.classificationAndKnowledge = $scope.vm.botClassfy;
            return params
        }

        function save(){
            httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",
                getParams(),
            function(data){
                console.log(data)
            },function(err){
                layer.msg("保存失败")
            });
        }
        function scan(){

        };
        /* ****************************************** //
         *
         *               弹框相关
         *
         */ // ****************************************** //

        function removeAppointRelative(item){
            $scope.vm.appointRelativeGroup.remove(item);
        }


        function saveAddNew(){
            if($scope.vm.newTitle){
                var obj = {};
                obj.knowledgeContent = $scope.vm.newTitle;
                obj.knowledgeContentType = 0,  // 答案类型
                obj.channelId =  $scope.vm.channel;
                obj.dimensionId =  $scope.vm.dimension;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question,    //显示相关问
                obj.knowledgeCommonOn =  $scope.vm.tip,    //在提示
                obj.knowledgeRelatedQuestionOn  = $scope.vm.tail,    //弹出评价小尾巴
                obj.knowledgeRelevantContent = $scope.vm.appointRelativeGroup  //业务扩展问
                //高級 選項
                $scope.vm.scanContent.push(obj);
            }
        }
        // 检验标题是否符合
        function checkTitle(title,type){
            if(!title){
                layer.msg("标题不能为空");
                return false
            }else{
                httpRequestPost("/api/conceptKnowledge/checkDistribute",{
                    "title" : title
                },function(data){
                    console.log(data);
                    return true;
                    //if(data.status == 500){
                    //    alert();
                    //    $scope.vm.titleTip = data.info;
                    //    $scope.$apply()
                    //}else{
                    //    $scope.vm.creatBot = data.data[0].knowledgeTitleTag;
                    //    $scope.$apply()
                    //}
                },function(err){
                    layer.msg("打标失败，请重新打标");
                    return false
                });
            }

        }
//***************************    save check**********************************************
        //checkChannelDimension(['d','b','c']);
        function checkChannelDimension(channel,dimension){
            var obj = {};
            obj.channels = ['d','b'];
            $scope.vm.scanContent.push(obj);

            var repeatItem = null ;
            //console.log()
        //    新增的 channel = []  dimension = [] ,
        //   页面以添加 scanContent.dimensions   scanContent.channels
            if(!channel.length){     //渠道不能为空
                layer.msg("请填写渠道");
                return false
            }else{               //渠道非空
                var temp = []; //临时数组1
                var temparray = [];//临时数组2
                var lenChannel = channel.length;
                angular.forEach($scope.vm.scanContent,function(val){

                    angular.forEach(val.channels,function(item){
                        var  repeat =  0 ;
                        temp[item] = true;
                        var lenSource = val.channels.length;
                        angular.forEach(channel,function(item) {
                            if(!temp[item]){  // repeat
                                lenSource-=1
                            }
                        });
                        if(lenSource = 0){
                            repeat+=1
                        }
                        console.log(repeat);
                        if(repeat = 0){    //没有相同项
                            //添加成功
                        }else if(repeat = lenChannel){   //全部相同  比较维度 不能有重复

                        }else{

                        }
                    });
                });



                //    首先比较渠道
                //    维度比较
                //
            }
        }
        // 添加时候 存储对象
        function saveScan(){

        }
//*************************************************************************



        //function termSpliterTagEditor() {
        //    console.log("termSpliterTagEditor");
        //    var term = $scope.vm.term;
        //    if(term==""){
        //        $("#term").tagEditor({
        //            autocomplete: {delay: 0, position: {collision: 'flip'}},
        //            forceLowercase: false
        //        });
        //        console.log("789456");
        //    }else{
        //        var terms = term.split($scope.vm.termSpliter);
        //        console.log(terms);
        //        $("#term").tagEditor({
        //            initialTags:terms,
        //            autocomplete: {delay: 0, position: {collision: 'flip'}, source: terms},
        //            forceLowercase: false
        //        });
        //        console.log("123456");
        //    }
        //}
        function addAppoint(item,arr){
            if(arr.indexOf(item)==-1){
                arr.push(item)
            }
            $scope.vm.appointRelative = null;  //清楚title
            $scope.vm.appointRelativeList = [];  //清除 列表

        }
        // 動態加載 title
        $scope.$watch("vm.appointRelative",function(title){
            console.log(title);
            if(title){
                getAppointRelative(title)
            }
        });

        function getAppointRelative(title){
            httpRequestPost("/api/conceptKnowledge/getKnowledgeTitle",{
                "title" : title
            },function(data){
                if(data.status == 200){
                    $scope.vm.appointRelativeList = data.data;
                    $scope.$apply()
                }else{
                }
                console.log(data);
            },function(err){
                layer.msg("获取指定相关知识失败")
            });
        }
        //初始化頁面數據
        init();
        function  init(){
            getDimensions();
            getChannel();
        }
        //維度
        function  getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    console.log(data)
                }
                console.log(data)
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });
        }
        //渠道
        function  getChannel(){
            httpRequestPost("/api/application/channel/listChannels",{
                //"applicationId": "360619411498860544"
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    console.log(data)
                    $scope.vm.channels = data.data
                }
                console.log(data)
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }



    }
]);