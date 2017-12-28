/**
 * Created by mileS on 2017/5/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 * info  控制器嵌套
 */
module.exports = ngModule =>
    ngModule.controller('appController',
    ['$scope', '$location',"$timeout","ngDialog" ,"$interval" ,
        '$state','localStorageService','$stateParams','$sce','$window',"$cookieStore",
       ($scope, $location,$timeout ,ngDialog ,$interval ,
       $state , localStorageService,$stateParams,$sce,$window,$cookieStore)=> {
            /***************************************************************  MASTER   **************************************************************************************/
            /**
             * @Name  MASTER
             * @For   下游调用
             * @Info  self === $scope
             * */
            //$rootScope.
            $scope.MASTER = {
                //const for Downstream
                robotName : getCookie("robotName") , //机器人名字
                avatarUrl : getCookie("avatarUrl") , // 头像 url
                avatarId :  getCookie("avatarId") ,  // 头像id
                applicationName : APPLICATION_NAME,
                channelList : "",
                channelListIds :[],
                /*>>>>>=========method for DownStream simple========<<<<<<<<*/
                queryChannelList : queryChannelList ,  //获取渠道
                slideToggle : slideToggle ,   //滑动控制
                                              // @params el callBack
                openNgDialog : openNgDialog ,  //打开弹框
                setNgTimeOut : setNgTimeOut ,  //延时器
                setNgInterval : setNgInterval ,//定时器
                initPageTimer : initPageTimer , // 分页监听变化
                /*>>>>=========method for Downstream complex========<<<<<<<<*/
                searchBotAutoTag : searchBotAutoTag , //BOT搜索自动补全   For 知识新增bot添加
                /* bot 下拉树的公共方法 */
                botTreeOperate : botTreeOperate ,
                //isTitleHasExt : isTitleHasExt
                selectAll : selectAll
            } ;
            if(APPLICATION_ID){
                queryChannelList(APPLICATION_ID)
            }
            //滑动
            function slideToggle(el,callBack){
                $timeout(function(){
                    angular.element(el).slideToggle();
                },50);
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
            function initPageTimer(scope,timerName,target,call,...timeout){
                scope.$watch(target, function(current){
                    if(current){
                        if (timerName) {
                            $timeout.cancel(timerName)
                        }
                        timerName = $timeout(function () {
                            call(current);
                        }, timeout?timeout:100)
                    }
                },true);
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
                        plain: true ,
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
            function queryChannelList(applicationId){
                //var  channels = [] ;
                // return knowledgeAddServer.getChannels({ "applicationId" : applicationId},
                //     function(data) {
                //         if(data.data){
                //             $scope.MASTER.channelListIds = [] ;
                //             $scope.MASTER.channelList = data.data ;
                //             angular.forEach(data.data,function(item,index){
                //                 $scope.MASTER.channelListIds.push(item.channelCode)
                //             })
                //         }
                //     }, function(error) {
                //         console.log(error) ;
                //     });
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
                },200) ;
                //return tree ;
            }
           //  权限 数组
           function selectAll(arr,type,...listKey) {
               let newArr = [] ;
               let lenKey = listKey.length ;
               if(!lenKey){
                   newArr = arr.map(item=>(item))

               }else{
                   if(type == 0 && lenKey==1){
                       newArr = arr.map(function(item,index){
                           return item[listKey[0]] ;
                       })
                   }else if (type != 0 && lenKey>1){
                       newArr = arr.map(function(item){
                           let result = {} ;
                           listKey.forEach(function (key) {
                               result[key] = item[key]
                           }) ;
                           return result ;
                       })
                   }else{
                       console.log("输入条件不合法")
                   }
               }
               return newArr ;
           }
/***********************************************************************************************************************************************************************/
            $scope.currentUser = null;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.backTage = $location.url().indexOf("index")>0?false:true;
            $scope.getCurrentUserId = function () {
                if($scope.currentUser && $scope.currentUser.id)  {
                    return $scope.currentUser.id;
                }else if(localStorageService.get("SessionId")){
                    return localStorageService.get("SessionId");
                }else{
                    return null;
                }
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
            //校验特殊字符
            $scope.CheckStr = function (str) {
                var myReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}\"%'+-/_【】‘；：”“'。，、？]");
                if(myReg.test(str)) return true;
                return false;
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
        }]);