/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  知识预览
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .controller('KnowledgeScanController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","$location","$rootScope","$window","KnowledgeService",
    ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,$location,$rootScope,$window,KnowledgeService)=> {
        $state.go("KM.scan");
        var knowledge =  $window.opener.knowledge;

        $scope.vm = {
            knowledge : knowledge.params ,
            knowledgeType : knowledge.type ,
            back : knowledge.back ,
            save :save,
            tableData : []
        };
        function save() {
            let params = angular.copy($scope.vm.knowledge),
                apiRes;
            if(!$scope.vm.knowledge.id){
                params.classifyList = params.classifyList.map(item=>item.classifyId) ;
                params.extensionQuestionList = params.extensionQuestionList.map((item)=>(item.title)) ;
                params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!="")) ;
             }else{
                params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item.title!=""))
            }
            switch($scope.vm.knowledgeType){
                case 100 :
                    if($scope.vm.knowledge.id){
                        apiRes = KnowledgeService.updateFaqKnow.save(params) ;
                    }else{
                        apiRes = KnowledgeService.storeFaqKnow.save(params)
                    }
                    break;
                case 101 :
                    if($scope.vm.knowledge.id){
                        apiRes = KnowledgeService.updateConceptKnow.save(params) ;
                    }else{
                        apiRes = KnowledgeService.storeConceptKnow.save(params)
                    }
                    break;
                case 102 :
                    if($scope.vm.knowledge.id){
                        apiRes = KnowledgeService.updateListKnow.save(params) ;
                    }else{
                        apiRes = KnowledgeService.storeListKnow.save(params)
                    }
                    break;
                case 103 :
                    if($scope.vm.knowledge.id){
                        apiRes = KnowledgeService.updateFactorKnow.save(params) ;
                    }else{
                        apiRes = KnowledgeService.storeFactorKnow.save(params)
                    }
                    //  转换字符串
                    angular.forEach(params.contents,function (item,index) {
                        params.contents[index].content =JSON.stringify(item.content)
                    });
                    break;
            }
            apiRes.$promise.then(function (response) {
                if (response.status == 200) {
                    layer.confirm('是前往总览页面查看？', {
                        btn: ['是','继续添加'] //按钮
                    }, function(){
                        $state.go("KM.overview")
                    },function(){
                        $state.go($scope.vm.back)
                    });
                }else{
                    layer.msg(response.info) ;
                }
            }, function (error) {
            })
        }

        console.log(knowledge) ;

        //保存方法  根据url  获取 保存路径

    }
])};