/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('functionalTestModule').controller('questionTestController', [
    '$scope',"localStorageService","$state","$timeout","$stateParams","ngDialog","$cookieStore",
    function ($scope,localStorageService,$state, $timeout,$stateParams,ngDialog,$cookieStore) {
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
        //比较测试回答有没有重的词；
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
        //问法测试
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

            httpRequestPost("api/application/questionTest/passageway",{
                "applicationId": $scope.vm.applicationId,
                "title": $scope.vm.testTitle,
                "comparisonTextArray": $scope.vm.comparisonTextArray
            },function(data){
                $scope.vm.show_tit=true;
                //$scope.vm.botRoot = data.data;
                console.log(data);
                if(data.data.status == 500){
                    layer.msg(data.data.data,{time:1000});
                }
                $scope.vm.answerRes=data.data.data;
                $scope.$apply();

            },function(){
                //layer.msg("err or err")
            });
        }
        //清空问法；
        function emptyInput(){
            $scope.vm.testTitle='';
            $scope.vm.question='';
            $scope.vm.comparisonTextArray=[];
            $scope.vm.answerRes="";
            $scope.vm.show_tit=false;

        }
    }
]);