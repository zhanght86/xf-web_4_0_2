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
            //questionList : questionList,
            emptyInput : emptyInput,
            addArr : addArr,
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
            //不点回车判断
            if($scope.vm.comparisonTextArray.length==0){
                $scope.vm.comparisonTextArray.push($scope.vm.question.substring(0));
                //alert($scope.vm.comparisonTextArray);
            }

            httpRequestPost("api/application/questionTest/passageway",{
                "applicationId": $scope.vm.applicationId,
                "title": $scope.vm.testTitle,
                "comparisonTextArray": $scope.vm.comparisonTextArray
            },function(data){
                //$scope.vm.botRoot = data.data;

                console.log(data);
                $scope.vm.answerRes=data.data.data;
                $scope.$apply();

            },function(){
                //layer.msg("err or err")
            });
        }
        // 添加问法
        function addArr(e){
            var  srcObj = e.srcElement ? e.srcElement : e.target;           //输入文字问题；
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                srcObj.blur();                                              //
               //console.log( $scope.vm.question.substring($scope.vm.asklength+1));
                $scope.vm.comparisonTextArray.push($scope.vm.question.substring($scope.vm.asklength+1));
                $scope.vm.asklength = $scope.vm.question.length ;

                console.log($scope.vm.comparisonTextArray);
                srcObj.focus();                                            //
            }


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