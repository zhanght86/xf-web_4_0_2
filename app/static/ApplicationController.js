/**
 * Created by mileS on 2017/5/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 * info  控制器嵌套
 */  
knowledge_static_web.controller('ApplicationController',
    ['$scope', '$location', '$anchorScroll', 'AuthService', 'TipService','AUTH_EVENTS',"$timeout","ngDialog" ,"$interval" ,
        '$state','localStorageService','$stateParams','$sce','$window',"KnowDocService","knowledgeAddServer","$cookieStore",
        function ($scope, $location, $anchorScroll, AuthService, TipService,AUTH_EVENTS,$timeout ,ngDialog ,$interval ,
                  $state , localStorageService,$stateParams,$sce,$window,KnowDocService,knowledgeAddServer,$cookieStore) {
/***************************************************************  MASTER   **************************************************************************************/
               /**
                * @Name  MASTER
                * @For   下游调用
                * @Info  self === $scope
                * */
               //$rootScope.
            $scope.MASTER = {
                //const for Downstream
                    headImage : $cookieStore.get("robotHead") ,
                    applicationName : APPLICATION_NAME,
                    channelList : "",
                    channelListIds :[],
                    dimensionList : "",
                    dimensionListIds : [] ,
 /*>>>>>=========method for DownStream simple========<<<<<<<<*/
                    queryChannelList : queryChannelList ,  //获取渠道
                    queryDimensionList : queryDimensionList ,  //获取维度
                    slideToggle : slideToggle ,   //滑动控制
                                                  // @params el callBack
                    openNgDialog : openNgDialog ,  //打开弹框
                    setNgTimeOut : setNgTimeOut ,  //延时器
                    setNgInterval : setNgInterval ,//定时器
/*>>>>=========method for Downstream complex========<<<<<<<<*/
                //    getDimensions : getDimensions ,
                //    getChannels : getChannels ,

                    searchBotAutoTag : searchBotAutoTag , //BOT搜索自动补全   For 知识新增bot添加
            /* bot 下拉树的公共方法 */
                   botTreeOperate : botTreeOperate ,
                   //isTitleHasExt : isTitleHasExt
            } ;
            if(APPLICATION_ID){
                queryDimensionList(APPLICATION_ID) ;
                queryChannelList(APPLICATION_ID)
            }
            //滑动
            function slideToggle(el,callBack){
                $timeout(function(){
                    angular.element(el).slideToggle();
                },50)
                if(callBack){
                    callBack()
                }
            }
            function setNgTimeOut(callBack,time){
                $timeout(callBack,time)
            }
            function setNgInterval(callBack,time){
                $interval(callBack,time)
            }
            /**
             * 打开弹框
             * @params ｛self｝  $scope
             * @params ｛tempUrl｝  “”          模板地址
             * @params ｛closeIssue｝   fn        条件关闭
             * @params ｛closeClear｝   fn        无条件关闭
             * @params ｛closeCondition｝ fn      关闭回调
             * @params ｛complex｝  {Booleans}    是否可以打开多个弹框 默认 “false”一个
             * */
            function openNgDialog(self,tempUrl,width,closeIssue,closeClear,closeCondition,complex){
                var diaSize = angular.element(".ngdialog ").length;
                if(complex  && diaSize<complex){
                    open() ;
                }else  if(!complex && diaSize<1){
                    open() ;
                }
                function open(){
                    var dialog = ngDialog.openConfirm({
                        template: tempUrl,
                        width:width?width:"450px",
                        scope: self,
                        closeByDocument: false,
                        closeByEscape: true,
                        showClose: true,
                        backdrop: 'static',
                        preCloseCallback: function (e) {    //关闭回掉
                            if (e === 1) {
                                if(closeIssue){
                                    closeIssue()
                                }
                            } else {
                                if(closeClear){
                                    closeClear()
                                }
                            }
                            if(closeCondition){
                                closeCondition()
                            }
                        }
                    });
                }
            }
            //獲取纬度
            function queryDimensionList(applicationId){
                //var dimensions = [] ;
                return knowledgeAddServer.getDimensions({ "applicationId" : applicationId},
                    function(data) {
                        if(data.data){
                            $scope.MASTER.dimensionListIds = [] ;
                            $scope.MASTER.dimensionList = data.data ;
                            angular.forEach(data.data,function(item,index){
                                $scope.MASTER.dimensionListIds.push(item.dimensionId)
                            })
                        }
                    }, function(error) {
                        console.log(error)
                    });
            };

             function queryChannelList(applicationId){
                //var  channels = [] ;
               return knowledgeAddServer.getChannels({ "applicationId" : applicationId},
                    function(data) {
                        if(data.data){
                            $scope.MASTER.channelListIds = [] ;
                            $scope.MASTER.channelList = data.data ;
                            angular.forEach(data.data,function(item,index){
                                $scope.MASTER.channelListIds.push(item.channelCode)
                            })
                        }
                    }, function(error) {
                        console.log(error) ;
                    });
                //return   channels ;
            }

            //BOT搜索自动补全
            function searchBotAutoTag(el,url,callback){
                $(el).autocomplete({
                    serviceUrl: url,
                    type:'POST',
                    params:{
                        "categoryName":$(el).val(),
                        "categoryAttributeName":"node",
                        "categoryApplicationId":APPLICATION_ID
                    },
                    paramName:'categoryName',
                    dataType:'json',
                    transformResult:function(data){
                        var result = {
                            suggestions : []
                        };
                        if(data.data){
                            angular.forEach(data.data,function(item){
                                result.suggestions.push({
                                    data:item.categoryId,
                                    value:item.categoryName,
                                    type : item.categoryTypeId
                                })
                            }) ;
                        }
                        return result;
                    },
                    onSelect: function(suggestion) {
                        console.log(suggestion) ;
                        callback(suggestion) ;
                    }
                });
            }
            /*bot*/
            function botTreeOperate(self,initUrl,getNodeUrl,selectCall,searchAutoUrl){
                var tree = {
                    init : function(){
                        httpRequestPost(initUrl,{
                            "categoryApplicationId": APPLICATION_ID,
                            "categoryPid": "root"
                        },function(data){
                            self.vm.botRoot = data.data;
                        },function(error){
                            console.log(error)
                        });
                    } ,
                    getChildNode : getChildNode ,
                    selectNode : selectNode ,
                } ;
                function getChildNode(){
                    $(".aside-navs").on("click",'i',function(){
                        var id = $(this).attr("data-option");
                        var that = $(this);
                        if(!that.parent().parent().siblings().length){
                            that.css("backgroundPosition","0% 100%");
                            httpRequestPost(getNodeUrl,{
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
                                        html+=              '<i class="'+typeClass + backImage +'" data-option="'+data.data[i].categoryId+'"></i>' ;
                                        html+=              '<span>'+data.data[i].categoryName+'</span>'+
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
                }
                function selectNode(){
                    $(".aside-navs").on("click","span",function(){
                        //类型节点
                        var pre = $(this).prev() ;
                        angular.element(".icon-jj").css("backgroundPosition","0% 0%");
                        var id = pre.attr("data-option");
                        selectCall(id) ;   //添加bot分類
                        angular.element(".rootClassfy,.menus").slideToggle();
                    });
                }
                tree.init() ;
                $timeout(function(){
                    tree.getChildNode() ;
                    tree.selectNode() ;
                },200)

                //return tree ;
            }


/***********************************************************************************************************************************************************************/



            $scope.currentUser = null;
            $scope.isAuthorized = AuthService.isAuthorized;
            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.tipService = TipService;

            $scope.backTage = $location.url().indexOf("index")>0?false:true;

            //$scope.setCurrentUser = function (data) {
            //    $scope.currentUser = {
            //        id: data.id,
            //        userName: data.name,
            //        realName: data.realName,
            //        sex: data.sex,
            //        email: data.email,
            //        protarit: data.protarit,
            //        phone: data.phone,
            //        identity: data.identity,
            //        birthday: data.birthday,
            //        status: data.status,
            //        role: data.role,
            //        lastLoginTime: data.lastLoginTime,
            //        privileges:data.privileges
            //    };
            //};
            //$scope.getCurrentUserPrivileges = function () {
            //    if($scope.currentUser.privileges)  {
            //        return $scope.currentUser.privileges
            //    }else if(localStorageService.get("privileges")){
            //        return localStorageService.get("privileges")
            //    }else{
            //        return null;
            //    }
            //};

            $scope.getCurrentUserId = function () {
                if($scope.currentUser && $scope.currentUser.id)  {
                    return $scope.currentUser.id;
                }else if(localStorageService.get("SessionId")){
                    return localStorageService.get("SessionId");
                }else{
                    return null;
                }
            };

            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll();
            };

            /**  for  文档加工
             * 处理一些共有方法
             * @returns {{currentPage: *, pageSize: *}}
             */
            $scope.initSearchPOJO = function () {
                if($stateParams.isGo || !localStorageService.get($state.current.name)){
                    //页面正常跳转 或 localStore中没有存储参数  默认初始化即可
                    return {
                        currentPage: $scope.currentPage,
                        pageSize: $scope.pageSize
                    };
                }else{
                    //否则 用localStore中的参数去初始化
                    return localStorageService.get($state.current.name);
                }
            };

            /**
             * 转化成html
             */
            $scope.sceConvertHtml = function (objectList) {
                if($scope.notEmpty(objectList) &&objectList.length>0){
                    objectList.forEach(function (item) {
                        var title = $sce.trustAsHtml(item.title);
                        var content = $sce.trustAsHtml(item.content);
                        item.titleHtml = title;
                        item.contentHtml = content;
                    })
                }
                return objectList;
            };

            //校验特殊字符
            $scope.CheckStr = function (str) {
                var myReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}\"%'+-/_【】‘；：”“'。，、？]");
                if(myReg.test(str)) return true;
                return false;
            };


            /**
             * 格式化时间
             */
                // 格式化时间
            $scope.format = function(time, format){
                var t = new Date(time);
                var tf = function(i){return (i < 10 ? '0' : '') + i};
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                    switch(a){
                        case 'yyyy':
                            return tf(t.getFullYear());
                            break;
                        case 'MM':
                            return tf(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return tf(t.getMinutes());
                            break;
                        case 'dd':
                            return tf(t.getDate());
                            break;
                        case 'HH':
                            return tf(t.getHours());
                            break;
                        case 'ss':
                            return tf(t.getSeconds());
                            break;
                    }
                })
            };

            $scope.changeURLArg = function(url,arg,arg_val){
                var pattern=arg+'=([^&]*)';
                var replaceText=arg+'='+arg_val;
                if(url.match(pattern)){
                    var tmp='/('+ arg+'=)([^&]*)/gi';
                    tmp=url.replace(eval(tmp),replaceText);
                    return tmp;
                }else{
                    if(url.match('[\?]')){
                        return url+'&'+replaceText;
                    }else{
                        return url+'?'+replaceText;
                    }
                }
            };

            $scope.storeParams = function(value){
                var key = $state.current.name;
                //var key = $stateParams.current.name;
                localStorageService.set(key,value);
            };

            $scope.goHistory = function(){
                $window.history.back();
            };



            // alert(format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'))
            // $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
            //     $state.go('login');
            // });
            $scope.$on(AUTH_EVENTS.notAuthorized, function (event,data) {

            });
            $scope.$on(AUTH_EVENTS.logoutSuccess, function (event,data) {

            });
            $scope.$on(AUTH_EVENTS.loginSuccess, function (event,data) {
                $scope.initKnowCheckNoticeView();
                $scope.initNoCheckTaskView();
                $scope.initAnalyseTaskCount();
            });

        }]);