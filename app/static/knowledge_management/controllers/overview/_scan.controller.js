/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  知识预览
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .controller('KnowledgeScanController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$cookieStore","$location","$rootScope","knowledgeAddServer","$window",
    ($scope,localStorageService, $state,$stateParams,ngDialog,$cookieStore,$location,$rootScope,knowledgeAddServer,$window)=> {
        var knowledgeScan =  $window.opener.knowledgeScan;
        $scope.vm = {
            knowledgeType : knowledgeScan.params.knowledgeType,
            listData : null,
            knowledgeData : knowledgeScan.params ,
            editUrl : knowledgeScan.editUrl,
            save :save,
            tableData : knowledgeScan.knowledgeType==103?JSON.parse(knowledgeScan.params.knowledgeContents[0].knowledgeContent):""
        };
        console.log(knowledgeScan) ;
        //保存方法  根据url  获取 保存路径
        function save(){
            httpRequestPost(knowledgeScan.api,$scope.vm.knowledgeData,function(data){
                console.log(data) ;
                if(data.status == 200){
                    $state.go('knowledgeManagement.custOverview');
                }else if(data.status == 10002){
                    layer.msg(" 添加知识标题重复,请返回修改 ")
                }
            },function(err){
                console.log(err)
            });
        }
    }
])};