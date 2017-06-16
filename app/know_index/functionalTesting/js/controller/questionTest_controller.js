/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
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
        console.log($scope.vm.applicationId)
        function test(){

            $scope.vm.comparisonTextArray=$scope.vm.question.split("\n");         //换行;
            console.log($scope.vm.comparisonTextArray);

            if($scope.vm.testTitle==''){
                alert('请输入标准问法！');
                return;
            }
            if($scope.vm.question==''){
                alert('请输入可能问法！');
                return;
            }
            if($scope.vm.question==''&& $scope.vm.testTitle==''){
                alert('请输入标准问法和可能问法！');
                return;
            }

            httpRequestPost("api/application/questionTest/passageway",{
                "applicationId": $scope.vm.applicationId,
                "title": $scope.vm.testTitle,
                "comparisonTextArray": $scope.vm.comparisonTextArray
            },function(data){
                //$scope.vm.botRoot = data.data;
                console.log(data);
                if(data.data.status == 500){
                    layer.msg(data.data.data);
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
        }

        
    }
]);