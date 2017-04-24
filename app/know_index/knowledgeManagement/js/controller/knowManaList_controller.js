/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('knowManaListController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","$stateParams","knowledgeAddServer",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,$stateParams,knowledgeAddServer) {
        $cookieStore.put("userName","admin1");
        $cookieStore.put("applicationId","360619411498860544");
        $cookieStore.put("categoryApplicationId","360619411498860544");
        var applicationId = $cookieStore.get("categoryApplicationId");
        console.log($stateParams.data);
        $scope.vm = {
//主页
            applicationId : $cookieStore.get("applicationId"),
            userName :  $cookieStore.get("userName"),
            frames : [],      //业务框架
            frameId : "",
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
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

            //生成  BOT
            getCreatBot : getCreatBot,
            //creatBot : [],

            botClassfy : [],   //类目
            //creatSelectBot : [], //手选生成 bot

            //扩展问
            extensionTitle : "",
            extensionWeight :1,
            getExtension : getExtension,  //獲取擴展問
            extensions : [],      //手動生成
            extensionsByFrame : [],  //業務框架生成


            //展示内容
            scanContent : [],
            saveContent : [],

            save : save ,   //保存
            scan :scan ,    //预览
            //弹框相关
            newTitle: "",    //标题
            channel : [],     //新添加的 channel
            channels : [{"requestId":"372211926127607808","channelId":"361738105134252034","applicationId":"360619411498860544","channelName":"QQ","channelUpdateTime":1490099521000,"channelUpdateId":"359873057331875840","statusId":50002},{"requestId":"372211926131802112","channelId":"367856312874172416","applicationId":"360619411498860544","channelName":"微信","channelUpdateTime":1491558301000,"channelUpdateId":"359873057331875840","statusId":50001},{"requestId":"372211926131802113","channelId":"367859239487537152","applicationId":"360619411498860544","channelName":"PC","channelUpdateTime":1491558999000,"channelUpdateId":"359873057331875840","statusId":50002},{"requestId":"372211926131802114","channelId":"367863798171697152","applicationId":"360619411498860544","channelName":"PC端","channelUpdateTime":1491560086000,"channelUpdateId":"359873057331875840","statusId":50002}],     //所有渠道
            channelArr : [] ,
            selectChannel : selectChannel , //獲取渠道
            dimension  : "",
            dimensions : []
            ,  //所有维度
            dimensionArr :  [{"dimensionId": 369243445367144448,"dimensionName":"国家_中国"}],  //選擇的維度
            dimensionsCopy :[]
            ,

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

            replaceType : 0
        };

// 通过类目id 获取框架
        function getFrame(id){
            httpRequestPost("/api/modeling/frame/listbyattribute",{
                "frameCategoryId": id,
                "frameEnableStatusId": 1,
                "frameTypeId":10011,
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
                layer.msg("err or err")
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
            console.log(id);
            httpRequestPost("/api/modeling/frame/listbyattribute",{
                "frameTypeId": 10011,
                "frameId": id,
                "index": 0,
                "pageSize":999999
            },function(data){
                if(data.status==10000){
                    console.log(data);
                    if(data.data[0].elements){
                        angular.forEach(data.data[0].elements,function(item){
                            var obj = {} ;
                            obj.extensionQuestionTitle  = item.elementContent;
                            obj.extensionQuestionType = 1;
                            obj.source = data.data[0].frameTitle;
                            if(type){
                                $scope.vm.extensionsByFrame.pop();
                                $scope.vm.extensionsByFrame.push(obj)
                            }else{
                                $scope.vm.extensionsByFrame.push(obj)
                            }
                        });
                        //console.log($scope.vm.extensionsByFrame)
                    }
                    $scope.$apply();
                }
            },function(){
                alert("err or err")
            });
        }
        // 获取Bot全路径
        function getBotFullPath(id){
            httpRequestPost("/api/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                if(data.status = 10000){
                    var len = $scope.vm.botClassfy.length;
                    if(len){
                        angular.forEach($scope.vm.botClassfy,function(item){
                            if(item.classificationId!=id){
                                len-=1
                            }
                        });
                        if(len==0){
                            var obj = {};
                            obj.classificationName = data.categoryFullName.split("/");
                            obj.classificationId = id ;
                            obj.classificationType = 1;
                            $scope.vm.botClassfy.push(obj);
                            $scope.$apply()
                        }else{
                            layer.msg("添加分类重复")
                        }
                    }else{
                        var obj = {};
                        obj.classificationName = data.categoryFullName.split("/");
                        obj.classificationId = id ;
                        obj.classificationType = 1;
                        $scope.vm.botClassfy.push(obj);
                        $scope.$apply()
                    }
                }
            },function(){
                layer.msg("添加扩展问失败")
            });
        }
        //添加扩展问
        function getExtension(title,weight){
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
                console.log(data);
            },function(){
                layer.msg("添加扩展问失败")
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
        function  knowledgeBot(){
            $timeout(function(){
                angular.element(".rootClassfy").slideToggle();
                //angular.element(".menus").slideUp()
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
            //var value = $(this).html();
            var id = $(this).prev().attr("data-option");
            getBotFullPath(id);    //添加bot分類
            $scope.vm.frameCategoryId = id;
            angular.element(".rootClassfy,.menus").slideToggle();
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
                        //return;
                        saveAddNew()
                    }else{
                        setDialog()
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
                httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : "100"
                },function(data){
                    console.log(data);
                    if(data.status == 500){
                        $scope.vm.titleTip = data.info;
                        $scope.$apply()
                    }else{
                        $scope.vm.botClassfy = [] ;
                        angular.forEach(data.data,function(item){
                            var obj = {};
                            obj.classificationName = item.fullPath;
                            obj.classificationId = item.id ;
                            obj.classificationType = 0;
                            $scope.vm.botClassfy.push(obj);
                            $scope.vm.frameCategoryId = item.id
                        });
                        //$scope.vm.creatBot = data.data;
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
            console.log(getParams());
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
//重置参数
        function setDialog(){
            $scope.vm.newTitle = "";
            $scope.vm.channel = [];
            $scope.vm.dimension = [];
            $scope.vm.question = 1,    //显示相关问
                $scope.vm.tip = 1,    //在提示
                $scope.vm.tail =1,    //弹出评价小尾巴
                $scope.vm.appointRelativeGroup = [] ;//业务扩展问
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
                var obj = {};
                obj.knowledgeContent = $scope.vm.newTitle;
                obj.knowledgeContentType = 0,  // 答案类型
                    obj.channelId =  $scope.vm.channel;
                obj.dimensionId =  $scope.vm.dimensionArr.id;
                obj.knowledgeRelatedQuestionOn = $scope.vm.question,    //显示相关问
                    obj.knowledgeCommonOn =  $scope.vm.tip,    //在提示
                    obj.knowledgeRelatedQuestionOn  = $scope.vm.tail,    //弹出评价小尾巴
                    obj.knowledgeRelevantContent = $scope.vm.appointRelativeGroup  //业务扩展问
                //高級 選項
                $scope.vm.scanContent.push(obj);
                setDialog()
            }else{
                setDialog()
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
                },function(err){
                    layer.msg("打标失败，请重新打标");
                    return false
                });
            }

        }
//***************************    save check channel dimension  **********************************************
        $scope.$watch("vm.dimensionArr",function(val,old){
            if(val.id && $scope.vm.channel.length){
                checkChannelDimension($scope.vm.channel,val.id)
            }
        },true);
        $scope.$watch("vm.channel",function(val,old){
            if(val.length && $scope.vm.dimensionArr.id.length){
                checkChannelDimension(val,$scope.vm.dimensionArr.id)
            }
        },true);
        function checkChannelDimension(channel,dimension){
            console.log(channel,dimension);
            //    新增的 channel = []  dimension = [] ,
            //   页面以添加 scanContent.dimensions   scanContent.channels
            if(!channel.length){     //渠道不能为空
                layer.msg("请填写渠道");
                return false
            }else{               //渠道非空
                                 //channel   == id
                                 //dimenssion   == id
                angular.forEach($scope.vm.scanContent,function(item){
                    angular.forEach(item.channelId,function(v){
                        angular.forEach(channel,function(val,indexChannel) {
                            if(val == v){
                                angular.forEach(item.dimensionId,function(value){
                                    angular.forEach(dimension,function(key,indexDimension){
                                        if(key==value){
                                            var channelTip;
                                            angular.forEach($scope.vm.channels,function(all){
                                                if(all.channelId==v){
                                                    channelTip = all.channelName
                                                };
                                            });
                                            layer.msg("重复添加"+"渠道 "+channelTip+" 维度 "+$scope.vm.dimensionArr.name[indexDimension]);
                                            $scope.vm.dimensionArr.id.remove(key);
                                            $scope.vm.dimensionArr.name.splice(indexDimension,1);
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
        //knowledgeAddServer.getDimension
        function  getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data;
                    $scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions)
                    $scope.$apply()
                }
                //console.log(data)
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
                    $scope.vm.channels = data.data
                }
                //console.log(data)
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }
      

    }
]);