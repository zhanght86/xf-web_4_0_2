/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  列表知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('ListNewController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"ngDialog","$cookieStore","$timeout","$compile",
    "$window","$stateParams","$interval","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,$compile,
     $window,$stateParams,$interval,$filter) =>{
        $scope.parameter = {
            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [""], //扩展问集合
            "contents"           : []    //内容集合
        } ;
        $scope.vm = {
            localNameOfExt : "cust_list_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            knowledgeOrigin : 120 , //知识来源

            titleTip :  "",
            isTimeTable : false,  //时间表隐藏
            save : save ,   //保存
            scan :scan ,   //预览
            enterEvent : enterEvent,
            limitSave : false, //限制多次打标
        };

        //限制一个知识多次保存
        var limitTimer ;
        function save(api) {
                if (!checkSave()) {
                    return false
                } else {
                    if(!$scope.vm.limitSave){
                        $timeout.cancel(limitTimer) ;
                        $scope.vm.limitSave = true ;
                        limitTimer = $timeout(function(){
                            $scope.vm.limitSave = false ;
                        },180000) ;
                        var params;
                        KnowledgeService[api].save(params,function (response) {
                            if (response.status == 200) {
                                $state.go('knowledgeManagement.custOverview');
                            } else if (response.status == 500) {
                                layer.msg("知识保存失败") ;
                                $timeout.cancel(limitTimer) ;
                                $scope.vm.limitSave = false ;
                            }
                        }, function (error) {
                            $timeout.cancel(limitTimer) ;
                            $scope.vm.limitSave = false ;
                        })
                    }
            }
        }
        function scan(api){
            if(!checkSave()){
                return false
            }else{
                var obj = {
                    params : "",
                    knowledgeType : 102 ,
                    knowledgeId : $scope.vm.knowledgeId ,
                    api : api
                };
                obj.editUrl = "knowledgeManagement.listAdd";
                $window.knowledgeScan = obj;
                var url = $state.href('knowledgeManagement.knowledgeScan');
                $window.open(url,'_blank');
            }
        }
//        提交 检验参数
        function checkSave(){
            var params;
            if(!params.knowledgeTitle){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!params.classificationAndKnowledgeList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false ;
            }else if(!params.knowledgeContents[0].knowledgeContent || !params.knowledgeContents[0].knowledgeContentNegative){
                layer.msg("知识内容信息不完整，请增填写完整");
                return false ;
            }else if(!params.knowledgeContents[0].channelIdList.length){
                layer.msg("渠道不能为空") ;
                return false ;
            }else{
                return true ;
            }
        }
    }
])};




