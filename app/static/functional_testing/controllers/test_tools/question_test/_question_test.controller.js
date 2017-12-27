/**
 * Created by 41212 on 2017/3/23.
 */
module.exports=functionalTestModule => {
    functionalTestModule
    .controller('QuestionTestController', [
    '$scope',"localStorageService","$log","FunctionServer","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    ($scope,localStorageService,$log,FunctionServer,$state, $timeout,$stateParams,ngDialog,$cookieStore)=>{
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            testTitle : '',
            question : '',
            applicationId : $cookieStore.get('applicationId'),
            comparisonTextArray:[],
            asklength :0,
            answerRes : '',
            emptyInput : emptyInput,
            //addArr : addArr,
            test : test,
            check : check,
            show_tit:false

        };
        /*****************
            * //比较测试回答有没有重的词；
        * *****************/
        function check(val,matchedWordTagResults){
            var allLen = matchedWordTagResults.length ;
            angular.forEach(matchedWordTagResults,function (tag) {
                var len = tag.tagList.length ;
                angular.forEach(tag.tagList,function (value) {
                    if(value == val){
                        len-=1 ;
                    }
                }) ;
                if(len != tag.tagList.length){
                    allLen-=1 ;
                }
            }) ;

            if(allLen==matchedWordTagResults.length){
                return false ;
            }else{
                return true ;
            }
        }

        /*****************
         * //开始测试
         * *****************/
        function test(){
            $scope.vm.comparisonTextArray=$scope.vm.question.split("\n");         //换行;
            console.log($scope.vm.comparisonTextArray);

            if($scope.vm.testTitle==''){
                layer.msg('请输入标准问法！');
                return;
            }
            if($scope.vm.question==''){
                layer.msg('请输入测试问法！');
                return;
            }
            if($scope.vm.question==''&& $scope.vm.testTitle==''){
                layer.msg('请输入标准问法和测试问法！');
                return;
            }
            var i = layer.msg("资源加载中...",{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            FunctionServer.testQuestion.save({
                "applicationId": $scope.vm.applicationId,
                "title": $scope.vm.testTitle,
                "comparisonTextArray": $scope.vm.comparisonTextArray
            },function(data){
                layer.close(i);
                $scope.vm.show_tit=true;
                //$scope.vm.botRoot = data.data;
                console.log(data);
                if(data.data.status == 500){
                    layer.msg(data.data.data,{time:1000});
                }
                $scope.vm.answerRes=data.data.data;

            },function(err){
                layer.close(i);
                console.log(err);
            });

        }

        /*****************
         * //清空问法；
         * *****************/
        function emptyInput(){
            $scope.vm.testTitle='';
            $scope.vm.question='';
            $scope.vm.comparisonTextArray=[];
            $scope.vm.answerRes="";
            $scope.vm.show_tit=false;

        }
    }
    ])};