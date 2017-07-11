/**
 * Created by mileS on 2017/5/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 * info  控制器嵌套
 */
knowledge_static_web.controller('ApplicationController',
    ['$scope', '$location', '$anchorScroll', 'AuthService', 'TipService','AUTH_EVENTS',
        '$state','localStorageService','$stateParams','$sce','$window',"KnowDocService","knowledgeAddServer","$cookieStore",
        function ($scope, $location, $anchorScroll, AuthService, TipService,AUTH_EVENTS,$state,
                  localStorageService,$stateParams,$sce,$window,KnowDocService,knowledgeAddServer,$cookieStore) {
/***************************************************************  MASTER   **************************************************************************************/
                //Name  master
                //For   下游调用
            $scope.master = {
                //const for Downstream
                    headImage : $cookieStore.get("robotHead") ,
                    applicationName : APPLICATION_NAME,
                //method for Downstream
                    getDimensions : getDimensions ,
                    getChannels : getChannels ,
                    isBotRepeat : isBotRepeat // 验证Bot 是否重复
            } ;
            //獲取纬度
            function getDimensions(){
                var dimensions = [] ;
                knowledgeAddServer.getDimensions({ "applicationId" : APPLICATION_ID},
                    function(data) {
                        if(data.data){
                            dimensions = data.data ;
                            //$scope.vm.dimensions = data.data;
                            //$scope.vm.dimensionsCopy = angular.copy($scope.vm.dimensions);
                        }
                    }, function(error) {
                        console.log(error)
                    });
                return dimensions ;
            }
            //获取渠道
            function getChannels(){
                var  channels = []
                knowledgeAddServer.getChannels({ "applicationId" : APPLICATION_ID},
                    function(data) {
                        if(data.data){
                            channels = data.data
                        }else{
                            return []
                        }
                    }, function(error) {
                        console.log(error) ;
                    });
                return   channels ;
            }


            function isBotRepeat(id,path,type,allBot){
                //className  classificationId  classificationType(不推送)
                //重复 提示   不重复返回bot对象
                // 校验对象  className
                var result = false ;    //返回對象
                var len = allBot.length;  //所有bot 長度
                var obj = {             //定义bot对象
                    "className" : path,
                    "classificationId" : id,
                    "classificationType" : type?type:67
                };

                if(len){                 //需要验证
                    angular.forEach(allBot,function(item){
                        console.log(item.className==path) ;
                        angular.forEach(item.className,function(name,index){
                            if(name !=path[index]){
                                len-=1
                            }
                        })
                    });
                    if(len!=0){   //有重复
                        layer.msg("添加分类重复");
                    }

                }else{   //不需要验证
                    result = obj
                }
                return result;
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
             * 非空判断
             */
            $scope.notEmpty = function (param) {
                if(param!=null && param!=undefined && $.trim(param)!=''){
                    return true;
                }
                return false;
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