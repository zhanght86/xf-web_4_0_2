/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  客服知识查看
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('CustPreviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","$cookieStore","KnowledgeService",
     ($scope,localStorageService, $state,$stateParams,$cookieStore,KnowledgeService)=> {
        if(!$stateParams.id || !$stateParams.type){
            $state.go("KM.overview");
        }else{
            $state.go("KM.preview");
            $scope.vm = {
                id : $stateParams.id,        //del
                type : parseInt($stateParams.type),
                listData : null,
                edit :  edit
            };
            //修改
            let editUrl,
                params={
                    "id" : $scope.vm.id
                 },
                apiRes;
            switch($scope.vm.type){
                case 100 :
                    editUrl = "KM.faq";
                    apiRes = KnowledgeService.getFaqKnow.get(params);
                    break;
                case 101 :
                    editUrl = "KM.concept" ;
                    apiRes = KnowledgeService.getConceptKnow.get(params);
                    break;
                case 102 :
                    editUrl = "KM.listAdd";
                    apiRes = KnowledgeService.getListKnow.get(params);
                    break;
                case 103 :
                    editUrl = "KM.factor";
                    apiRes = KnowledgeService.getFactorKnow.get(params);
                    break;
            }
            function edit(){
                // $state.go(editUrl,{data:angular.toJson($scope.vm.listData)})
            }
           var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
           apiRes.$promise.then(function(response){
                layer.close(i) ;

            },function(error){
               console.log(error);
               layer.close(i)
           }) ;
        }
    }
])};