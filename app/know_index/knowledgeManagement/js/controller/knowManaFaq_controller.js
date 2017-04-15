/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('knowManaFaqController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout) {
        $scope.vm = {
//主页
            applicationId : $cookieStore.get("applicationId"),
            frames : [],      //业务框架
            frameId : "",
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            KnowledgeEdit: KnowledgeEdit,  //
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            frameCategoryId : "",
            title : "",   //标题
            titleTip :  "",
            hideTip : hideTip,
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",

            //生成  BOT
            getCreatBot : getCreatBot,
            creatBot : [],

            //扩展问
            extensionTitle : [],
            extensionWeight :"",
            getExtension : getExtension,
            extensions : [],


            //展示内容
            scanContent : [],
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
            //高级选项内容
            slideDown : slideDown,
            slideFlag : false,

            question : "",
            tip : "",
            tail : "" ,

            appointRelative : "",
            appointRelativeList :[],
            addAppoint  : addAppoint,
            //vm.appointRelativeGroup.push(item)
            appointRelativeGroup : [],
            removeAppointRelative : removeAppointRelative,
        };

        $cookieStore.put("categoryApplicationId","360619411498860544");
        //setCookie("categoryModifierId","1");
        //setCookie("categorySceneId","10023");
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
            //console.log(val);
            if(val&&val!=old){
                getFrame()
            }
        });

        function getExtension(title,weight){
            $scope.vm.extensionTitle = [];
            $scope.vm.extensionTitle.push(title);
            console.log($scope.vm.extensionTitle);
            httpRequestPost("/api/conceptKnowledge/checkDistribute",{
                extendQuestionList : $scope.vm.extensionTitle,
                applicationId : 100
            },function(data){
                console.log(data);
                if(data.status!=200){

                    $scope.$apply();
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
            $scope.vm.knowledgeBotVal = value;
            //if($scope.vm.knowledgeBotVal.indexOf(value)){
            //    $scope.vm.knowledgeBotVal.push($(this).html());
            $scope.$apply();
            //}
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%")
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
                template:"/know_index/knowledgeManagement/concept/knowledgeAddSingleConceptDialog.html",
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
                var widget = new AutoComplete('search_bar', ['Apple', 'Banana', 'Orange']);
            },500);
            //}
        }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }

        function getCreatBot(){
            if($scope.vm.title){
                httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                    "title" :  $scope.vm.title,
                    "applicationId" : "100"
                },function(data){
                    //if(data.status == 500){
                    //    alert();
                    //    $scope.vm.titleTip = data.info;
                    //    $scope.$apply()
                    //}else{
                    //    $scope.vm.creatBot = data.data[0].knowledgeTitleTag;
                    //    $scope.$apply()
                    //}
                    console.log(data);
                },function(err){
                    layer.msg("打标失败，请重新打标")
                });
            }else{
                $scope.vm.titleTip = "知识标题不能为空"
            }

        }

        function hideTip(){
            $scope.vm.titleTip = ""
        }

        function save(){
            //httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
            //    "title" : $scope.vm.title,
            //    "applicationId" : $scope.vm.applicationId
            //},function(data){
            //    console.log(data)
            //},function(err){
            //    layer.msg("数据请求失败")
            //});
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
            if(checkTitle($scope.vm.newTitle,type)){
                var obj = {};
                obj.title = $scope.vm.newTitle;
                obj.channel =  $scope.vm.channel;
                obj.channel =  $scope.vm.dimension;
                $scope.vm.scanContent.push(obj);
            }
        }

        // 检验标题是否符合
        function checkTitle(title){
            if(!title){
                layer.msg("标题不能为空")
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
        }
        // 動態加載 title
        $scope.$watch("vm.appointRelative",function(title){
            console.log(title);
            if(title){
                getAppointRelative(title)
            }
        });

        function getAppointRelative(title){
            httpRequestPost("/api/conceptKnowledge/get_knowledge_title",{
                "title" : title
            },function(data){
                if(data.status == 500){
                    //$scope.vm.titleTip = data.info;
                    //$scope.$apply()
                }else{
                    //$scope.vm.appointRelativeGroup = data.data[0].knowledgeTitleTag;
                    //$scope.$apply()
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
                    $scope.vm.dimensions = data.data
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
                    $scope.vm.channels = data.data
                }
                console.log(data)
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }

    }
]);