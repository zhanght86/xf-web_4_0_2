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
     $window,$stateParams,$interval,$filter) =>{$state.go("KM.list");
        $scope.parameter = {
            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [{"title":""}], //扩展问集合
            "contents"              : [
                {
                    "type": 1010,
                    "content":""
                },{
                    "type": 1011,
                    "content":""
             }]
        //内容集合
        } ;
        $scope.vm = {
            localNameOfExt : "cust_list_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            titleTip :  "",
            isTimeTable : false,  //时间表隐藏
            skipNewLine : skipNewLine ,
            save : save ,   //保存
            scan :scan ,   //预览
            enterEvent : enterEvent,
            saveLimitTimer : true, //限制多次打标
            showFrame : showFrame //选择业务框架
        };
        function showFrame(scope){
            if(!$scope.parameter.classifyList.length){
                return layer.msg("请先选择添加类目")
            }
            let html = "<div frame='102'></div>";
            $scope.$parent.$parent.MASTER.openNgDialog($scope,html,"650px",function(){

            },"",function(){

            });

        }
        let  limitTimer;
        //限制一个知识多次保存
        function save() {
            let resultParams = checkSave();
            if (!resultParams||!$scope.vm.saveLimitTimer) {
                return false
            }
            $timeout.cancel(limitTimer);
            $scope.vm.saveLimitTimer = false;
            limitTimer = $timeout(function () {
                $scope.vm.saveLimitTimer = true;
            }, 180000);
            let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            KnowledgeService.storeListKnow.save(resultParams,function (response) {
                layer.close(i);
                if(response.status == 200){
                    layer.confirm('是前往总览页面查看？', {
                        btn: ['是','继续添加'] //按钮
                    }, function(){
                        $state.go("KM.overview")
                    },function(){
                        $state.reload("KM.list")
                    });
                }else{
                    $scope.vm.saveLimitTimer = true;
                    layer.msg(response.info)
                }
            },function(error){console.log(error);$scope.vm.saveLimitTimer = true;});
        }
        function scan(api){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                obj.params = $scope.parameter;
                obj.type = 102;
                obj.back = "KM.list" ;
                $window.knowledge = obj;
                var url = $state.href('KM.scan');
                $window.open(url,'_blank');
            }
        }
//        提交 检验参数
        function checkSave() {
            let result = false ;
            let params = angular.copy($scope.parameter);
            params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
            params.extensionQuestionList = params.extensionQuestionList.map((item)=>(item.title)) ;
            params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!=""&&item!=null)) ;
            angular.forEach(params.contents,function(item,index){
              if(item.type==1010 && !item.content){
                  layer.msg("请填写肯定回答");
                  return ;
              } else if(item.type==1011 && !item.content){
                  layer.msg("请填写否定回答") ;
                  return  ;
                }
            });
            console.log(params);
            if (!params.title) {
                layer.msg("知识标题不能为空，请填写");
            } else if (!nullCheck(params.classifyList)) {
                layer.msg("知识类目不能为空，请选择分类");
            } else {
                result = params
            }
            return result
        }
        function skipNewLine(e) {
            let len = $scope.parameter.extensionQuestionList.length ;
            e = e || window.event ;
            // if((e!="blur" && (e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])) || e=="blur"&& nullCheck($scope.parameter.extensionQuestionList[len-1])){
            //     $scope.parameter.extensionQuestionList.push("") ;
            // }
            if((e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])){
                $scope.parameter.extensionQuestionList.push({
                    "title":""
                }) ;
                $timeout(function(){
                    $(e.target).parent().parent().children().last().find("input").focus();
                })
            }
        }
    }
])};




