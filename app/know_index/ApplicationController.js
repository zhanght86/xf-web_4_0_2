/**
 * Created by Administrator on 2016/6/17.
 * describe : 总控制器，处理一些整体参数，提供下游调用方法
 */
knowledge_static_web.controller('ApplicationController',
    ['$scope', '$location', '$anchorScroll', 'AuthService', 'TipService','AUTH_EVENTS','$state','localStorageService','$stateParams','$sce','$window',"HomeService", "PersonalCenterService","KnowDocService",
        function ($scope, $location, $anchorScroll, AuthService, TipService,AUTH_EVENTS,$state,localStorageService,$stateParams,$sce,$window,HomeService,PersonalCenterService,KnowDocService) {
            $scope.currentUser = null;
            $scope.isAuthorized = AuthService.isAuthorized;

            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.tipService = TipService;

            $scope.backTage = $location.url().indexOf("index")>0?false:true;

            $scope.setCurrentUser = function (data) {
                $scope.currentUser = {
                    id: data.id,
                    userName: data.name,
                    realName: data.realName,
                    sex: data.sex,
                    email: data.email,
                    protarit: data.protarit,
                    phone: data.phone,
                    identity: data.identity,
                    birthday: data.birthday,
                    status: data.status,
                    role: data.role,
                    lastLoginTime: data.lastLoginTime,
                    privileges:data.privileges
                };
            };

            $scope.getCurrentUserPrivileges = function () {
                if($scope.currentUser.privileges)  {
                    return $scope.currentUser.privileges
                }else if(localStorageService.get("privileges")){
                    return localStorageService.get("privileges")
                }else{
                    return null;
                }
            };

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

            /**
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

            //添加评论的方法
            $scope.addComment = function(scope,knowItemId,index,userId,successFun){
                var comment = scope.comments[index];
                var flag = false;
                if(comment == null){
                    alert("评论不能为空！")
                }

                if(comment.length>500){
                    alert("评论不能超过500个字！");
                    return;
                }
                if(comment != null){
                    flag = true;
                }
                if(flag) {
                    HomeService.createComment.save({
                        commType: 0,
                        content: comment,
                        knowItemId: knowItemId,
                        targetId:userId
                    }, function () {
                        scope.comments[index] = "";
                        successFun();
                    });
                }
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

            //定义退出登录的方法
            $scope.logout = function () {
                AuthService.logout(function (data) {

                }, function (errMsg) {
                    $scope.errMsg = errMsg;
                });
            };

            $scope.initKnowCheckNoticeView = function(){
                PersonalCenterService.connKnowCheckNoticeCon.get(
                    {
                        flag:1/*,
                     pageNo:$scope.SearchPOJO.currentPage,
                     pageSize:5*/
                    },function(resource){
                        var resultData = resource.data;
                        // $("#knowCheckNotice").css("display","block");
                        $scope.resultCheckNoticeList = resultData.data;
                        $scope.resultCheckNoticeTotal = resultData.total;
                        // console.log($scope.resultCheckNoticeTotal);
                    })
            };
            $scope.initNoCheckTaskView = function(){
                HomeService.queryMyTask.get({page:1,pageSize:10},function(resource){
                    if(resource.status == 200){
                        $scope.taskCount = resource.data.count;
                        // console.log("带蛇和-->>”"+$scope.taskCount);
                    }
                })
            };

            $scope.initAnalyseTaskCount = function(){
                KnowDocService.queryAnalyseTaskCount.get({
                    getCount:true,
                    taskStatus:0
                },function(resource){
                    if(resource.status == 200){
                        $scope.analyseTaskCount = resource.data.data.total;
                    }
                })
            };



            // alert(format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'))
            // $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
            //     $state.go('login');
            // });
            $scope.$on(AUTH_EVENTS.notAuthorized, function (event,data) {
                if(data.fromState.name != null && data.fromState.name!='')
                    //$state.go(data.fromState.name);
                    $state.go($window.location.reload());
            });

            $scope.$on(AUTH_EVENTS.logoutSuccess, function (event,data) {
                $scope.currentUser = null;
            });

            $scope.$on(AUTH_EVENTS.loginSuccess, function (event,data) {
                $scope.initKnowCheckNoticeView();
                $scope.initNoCheckTaskView();
                $scope.initAnalyseTaskCount();
            });

        }]);