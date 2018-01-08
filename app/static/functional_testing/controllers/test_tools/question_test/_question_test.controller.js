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
            comparisonTextArray:[],
            asklength :0,
            emptyInput : emptyInput,
            //addArr : addArr,
            test : test,
            check : check,
            show_tit:false,
            listData : [],

        };
        /*****************
            * //比较测试回答有没有重的词；
        * *****************/
        function check(val,askDebugInfo){
            var allLen = askDebugInfo.length;
            angular.forEach(askDebugInfo,function (tag) {
                var len = tag.content.split(' ').length ;
                angular.forEach(tag.content.split(' '),function (value) {
                    if(value == val){
                        len-=1 ;
                    }
                }) ;
                if(len != tag.content.split(' ').length){
                    allLen-=1 ;
                }
            }) ;
            if(allLen==askDebugInfo.length){
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
                //"applicationId": APPLICATION_ID,
                "title": $scope.vm.testTitle,
                "comparisonTextArray": $scope.vm.comparisonTextArray
            },function(data){
                layer.close(i);
                console.log(data);
                if(data.data.status==200){
                    $scope.vm.show_tit=true;
                    $scope.vm.listData = data.data.data;
                }

                if(data.data.status == 500){
                    layer.msg(data.data.info,{time:1000});
                }


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
            $scope.vm.listData=[];
            $scope.vm.show_tit=false;

        }
    }
    ])};