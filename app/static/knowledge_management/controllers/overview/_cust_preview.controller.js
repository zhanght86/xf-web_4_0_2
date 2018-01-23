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
            $scope.knowledge = {

            } ;
            //修改
            let editUrl,
                params={
                    "id" : $scope.vm.id
                 },
                apiRes;
            switch($scope.vm.type){
                case 100 :
                    editUrl = "KM.faq.edit";
                    apiRes = KnowledgeService.getFaqKnow.get(params);
                    break;
                case 101 :
                    editUrl = "KM.concept.edit" ;
                    apiRes = KnowledgeService.getConceptKnow.get(params);
                    break;
                case 102 :
                    editUrl = "KM.list.edit";
                    apiRes = KnowledgeService.getListKnow.get(params);
                    break;
                case 103 :
                    editUrl = "KM.factor.edit";
                    apiRes = KnowledgeService.getFactorKnow.get(params);
                    break;
            }
            function edit(){
                $state.go(editUrl,{knowledgeId: $scope.vm.id})
            }
           var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
           apiRes.$promise.then(function(response){
               if(response.status == 200 ){
                   $scope.knowledge = response.data;
                   if($scope.vm.type==103){
                       angular.forEach($scope.knowledge.contents,function (item,index) {
                           $scope.knowledge.contents[index].content = JSON.parse(item.content)
                       })
                       let contents = angular.copy($scope.knowledge.contents)
                       $scope.knowledge.contents = {
                           "contents" : contents
                       }
                   }

                   console.log($scope.knowledge.contents)
               }
                layer.close(i) ;
            },function(error){
               console.log(error);
               layer.close(i)
           }) ;
        }
    }
])};