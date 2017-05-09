/**
 * Created by 41212 on 2017/3/21.
 */
angular.module('homePage').controller('homePageNavController', [
    '$scope', '$location', 'localStorageService', 'AuthService',"$timeout", "$cookieStore","$state",
    function ($scope, $location, localStorageService, AuthService,$timeout,$cookieStore,$state) {
        $scope.url = $location.url();
        $scope.urls=$state.current.name;
        console.log($scope.urls);

        $scope.vm = {
                applicationId : $cookieStore.get('applicationId'),
                sceneId : $cookieStore.get('sceneId'),
                loginout : loginout,
                userName : $cookieStore.get('userName'),
                logApplication : logApplication,
                jump: jump

            };
        $scope.setting ={


        }
        if(!$cookieStore.get('userId')){
            $state.go("login")
        }
        function logApplication(){
            if($scope.vm.sceneId){
                $state.go("setting.Infor")
            }else{
                return false
            }
        }
        function loginout(){
            $cookieStore.remove('applicationId');
            $cookieStore.remove('sceneId');
            $cookieStore.remove('userId');
            $cookieStore.remove('userName');
            $state.go("login");
            localStorage.removeItem('history');
        }
        
        function jump() {
            window.open('http://'+window.location.host+':7003/index.html');
        }
        $scope.checkShowCrumbs=function(){
            if(!$scope.url.toString().indexOf("/homePage/define") > 0 ){
                return false;
            }
            else if( !$scope.url.toString().indexOf("/admin/manage") > 0){
                return false;
            }
            else{
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
                if(aa.use.length>=9){
                    aa.use.splice(0,1);
                }
                for(var i=0;i<aa.use.length;i++){
                    if(aa.use[i].name == $scope.getUrlName($scope.urls)){
                        aa.use.splice(i, 1);
                    }
                }
                if($scope.getUrlName($scope.urls)!=0){
                    aa.use.push(new ObjStory($scope.urls,$scope.getUrlName($scope.urls)));
                }
                window.localStorage.history=JSON.stringify(aa);
                //$scope.crumbs=aa.use.slice(0,-1);
                $scope.crumbs=aa.use;
            }
            else {
                var obj={
                    use:[new ObjStory($scope.urls,$scope.getUrlName($scope.urls))]
                }
                window.localStorage.history=JSON.stringify(obj);
            }
        }
        $scope.getUrlName = function(url){
            switch (url)
            {
                case 'homePage.define':
                    return '首页';
                case 'relationalCatalog.manage':
                    return 'BOT';
                case 'frameworkLibrary.manage':
                    return '框架库';
                case (url.match(/^conceptManage/) || {}).input:
                    return '概念管理';
                case (url.match(/^setting/) || {}).input:
                    return '我的应用';
                case (url.match(/^custServScenaOverview/) || {}).input:
                    return '知识管理';
                case 'functionalTest.questionTest':
                    return '问法测试';
                case 'functionalTest.sessionTest':
                    return '会话测试';
                case 'knowledgeManagement.faqAdd':
                    return 'FAQ知识新增';
                case 'knowledgeManagement.singleAddConcept':
                    return '概念知识新增';
                case 'knowledgeManagement.listAdd':
                    return '列表知识新增';
                case 'knowledgeManagement.factorAdd':
                    return '要素知识新增';
                case (url.match(/^gateway/) || {}).input:
                    return '文档加工新增';
                case 'applAnalysis.sessionDetails':
                    return '会话明细统计';
                case 'applAnalysis.satisfactionDegree':
                    return '满意率统计';
                case 'materialManagement.chatKnowledgeBase':
                    return '聊天知识库';
                case 'admin.manage':
                    return '应用切换';
                default:
                    return 0;
            }
        }
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
    }
]);