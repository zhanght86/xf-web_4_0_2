/**
 * @Author : MILES .
 * @Create : 2017/11/20.
 * @Module :  公用导航
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule.controller('NavController',
    ['$scope','localStorageService','HomePageServer','$state','$timeout','$stateParams','ngDialog','$location',
    function ($scope,localStorageService,HomePageServer,$state,$timeout,$stateParams,ngDialog,$location) {        
                $scope.url = $location.url();
                $scope.urls=$state.current.name;
                $scope.map = [] ; // 定义导航
                $scope.applicationId = APPLICATION_ID;
                $scope.vm = {
                        applicationId : APPLICATION_ID,
                        loginout : loginout,
                        // userName : USER_NAME,
                        userName : getCookie("userName"),
                        logApplication : logApplication,
                        jump: jump,
                        openServiceConfirm : openServiceConfirm,
                        queryServiceList: queryServiceList,
                        serviceUrl: "",
                        serviceUrlList: "",
                        serviceArray:""

                    };
                $scope.permission = getCookie("permissionTree") || "";
                if($scope.url == "/HP/define"){
                    document.getElementsByTagName("body")[0].style.cssText = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/index-bg.jpg',sizingMethod='scale');background: url(../../images/images/index-bg.jpg) no-repeat;background-size:100%";
                    //document.getElementsByClassName("bodyBg")[0].src = "../../images/images/index-bg.jpg";
                }else if($scope.url == "/login"){
                    document.getElementsByTagName("body")[0].style.cssText = "background: url(../../images/images/log-bg.jpg) no-repeat;background-size:100%;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../images/images/log-bg.jpg',sizingMethod='scale');";
                }else{
                    document.getElementsByTagName("body")[0].style.cssText = "background: #f8f8f8";
                }
                //if(!$cookieStore.get('userId')){
                //    $state.go("login")
                //}
                function logApplication(){
                    // if($scope.vm.sceneId){
                        $state.go("AM.info");
                    // }else{
                    //     return false
                    // }
                }
                function loginout(){
                    localStorage.removeItem('history');
                    USER_LOGIN_NAME = "" ;
                    USER_ID = "" ;
                    APPLICATION_ID : ""
                    // 清除所有cookie
                    clearCookie();

                    // HomePageServer.logout.save({
                    //     "id" : USER_ID ,
                    //     "account" : USER_LOGIN_NAME
                    // },function(){
                        $state.go("login");
                    // })
                }
                //初始化分页配置
                self.initSearch = function (column) {
                    if (!$scope.SearchPOJO) {
                        $scope.SearchPOJO = $scope.initSearchPOJO();
                    }
                    /**
                     * 加载分页条
                     * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
                     */
                    $scope.paginationConf = {
                        currentPage: $scope.SearchPOJO.currentPage,//当前页
                        totalItems: 0, //总条数
                        pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                        pagesLength: 6,//分页框数量
                    };
                }
                self.initSearch();

                function queryServiceList(){
                     let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
                    //服务列表请求
                    HomePageServer.getUrl.get({
                        applicationId:APPLICATION_ID
                    },function(data){
                         layer.close(i) ;
                        if(data.status==200){
                           $scope.vm.serviceArray = data.data;
                           $scope.vm.serviceUrl = data.data[0].url;//设置默认选择
                           $scope.vm.openServiceConfirm();
                        }else{
                            layer.info(data.info)
                        }
                    },function(){
                         layer.close(i) ;
                        layer.msg("无法加载服务列表",{time:1000});
                    })
                }
                //引擎跳转方法
                function openServiceConfirm(){
                    //对话框打开方法
                    var dialog = ngDialog.openConfirm({
                        template: "/static/index/views/home_page/qa_system.html",
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: true,
                        showClose: true,
                        backdrop: 'static',
                        preCloseCallback: function (e) {    //关闭回掉
                            if (e === 1) {
                                $scope.vm.jump($scope.vm.serviceUrl);
                            }
                        }
                    });
                }
                //打开引擎访问界面
                function jump(url) {
                    window.open('http://'+url+'/index.html');
                }
                $scope.checkShowCrumbs=function(){
                    if(!$scope.url.toString().indexOf("/HP/define") > 0 || !$scope.url.toString().indexOf("/HP/permission") > 0 || !$scope.url.toString().indexOf("/HP/management") > 0){
                        return false;
                    }
                    else{
                        return true;
                    }
                } ;
                $scope.checkShowClose=function(url){
                    if(url == 'HP.define'){
                        return true;
                    }
                }

                function  ObjStory(url,name){
                    this.url = url;
                    this.name = name;
                }
                $scope.getParamList = function(){
                    if (localStorage.history){
                        var aa = JSON.parse(window.localStorage.history);
                        if(aa.use.length>=8){
                            aa.use.splice(1,1);
                        }
                        for(var i=0;i<aa.use.length;i++){
                            if(aa.use[i].name == $scope.getUrlName($scope.urls)){
                                aa.use.splice(i, 1);
                            }
                        }
                        if($scope.getUrlName($scope.urls)!='0'){
                            aa.use.push(new ObjStory($scope.urls,$scope.getUrlName($scope.urls)));
                        }
                        window.localStorage.history=JSON.stringify(aa);
                        // $scope.crumbs=aa.use.slice(0,-1);
                        $scope.crumbs=aa.use;
                    }
                    else {
                        var obj={
                            use:[{"url":"HP.define","name":"首页"}]
                        }
                        window.localStorage.history=JSON.stringify(obj);
                    }
                }
                $scope.getUrlName = function(url){
                    switch (url)
                    {
                        /*case 'homePage.define':
                            return 0;*/
                        case 'BM.bot':
                            return 'BOT';
                        case 'BM.frame':
                            return '框架库';
                        case 'BM.concept.synonym':
                            return '概念管理';    
                        case 'AM.info':
                            return '应用信息';
                        case 'AM.restore':
                            return '备份还原';
                        case 'AM.robot':
                            return '机器人设置';
                        // case 'AM.info':
                        //     return '应用信息';
                        case (url.match(/^custServScenaOverview/) || {}).input:
                            return '知识管理';
                        case 'functionalTest.questionTest':
                            return '问法测试';
                        case 'functionalTest.sessionTest':
                            return '会话测试';
                        case 'functionalTest.batchTest':
                            return '批量测试';
                        case 'functionalTest.participle':
                            return '分词应用';
                        case 'functionalTest.participleResult':
                            return '分词测试结果';
                        case 'KM.overview':
                            return '知识总览';
                        case 'KM.concept':
                            return '概念知识新增';
                        case 'KM.faq':
                            return 'FAQ知识新增';
                        case 'KM.list':
                            return '列表知识新增';
                        case 'KM.factor':
                            return '任务知识新增';
                        case 'KM.batch':
                            return '知识批量新增';
                       // case (url.match(/^gateway/) || {}).input:
                        case 'back.gateway':
                            return '文档加工新增';
                        case 'KM.history':
                            return '历史查看';
                        case 'ANM.accessStatistics':
                            return '访问统计';
                        case 'ANM.knowledgeRanking':
                            return '未匹配问题统计';
                        case 'ANM.sessionDetails':
                            return '会话明细统计';
                        case 'ANM.satisfactionDegree':
                            return '满意率统计';
                        case 'ANM.resolutionStatistics':
                            return '解决率统计';
                        case 'ANM.reinforcementLearn':
                            return '智能学习';
                        case 'ANM.newKnowledgeDiscoveryLearn':
                            return '未匹配问题聚类';
                        case 'ANM.operationLog':
                            return '操作日志';
                        case 'ANM.sessionLog':
                            return '会话日志';
                        case 'MM.chat':
                            return '聊天知识库';
                        case 'MM.pic':
                            return '图片库';
                        case 'MM.voice':
                            return '语音库';
                        case 'MM.doc':
                            return '文档库';
                        case 'MM.teletext':
                            return '图文消息库';
                        case 'deepLearning.deeplearnConfig':
                            return '模型构建';
                        case 'deepLearning.deepLearningCon':
                            return '模型训练';
                        case 'deepLearning.similarityCalculation':
                            return '模型测试';
                        case 'deepLearning.dataAcquisition':
                            return '自动导入更新';
                        case 'admin.manage':
                            return '应用切换';
                        case 'SisM.operationLog':
                            return '操作日志';
                        case 'SisM.resource':
                            return '资源监控';
                        case 'SisM.service':
                            return '服务监控';
                        case 'HC.problem':
                            return '常见问题';
                        default:
                            return 0;
                    }
                } ;
                $scope.getParamList();
                $scope.closeCrumb = function(index){
                    $scope.crumbs.splice(index, 1);
                    if($scope.crumbs.length!=0){
                        var obj={
                            use:$scope.crumbs
                        }
                        window.localStorage.history=JSON.stringify(obj);
                    }
                    else{
                        localStorage.removeItem('history');
                    }
                }
                window.onbeforeunload = function () {
                    localStorage.removeItem('history');
                }
    }])};