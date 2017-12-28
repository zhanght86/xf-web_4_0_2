/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('KnowAddController', [
    '$scope',"$state","MaterialServer","ngDialog", "$cookieStore","$stateParams",
    ($scope,$state,MaterialServer,ngDialog,$cookieStore,$stateParams)=> {
        $state.go("MM.chatAdd");

        $scope.vm = {
            standardQuestion :  '',   //标准问
            editStandardQuestion :'',    //编辑标准问
            extendedQuestion : "",         //扩展问
            extendedQuestionArr : [],     //扩展问数组
            addExtension : addExtension ,  //添加扩展
            remove : remove ,

            contentVal : "",                  //知识内容
            contentArr : [] ,                 //知识内容数组
            addContent : addContent,         //添加知识内容
            removeCon : removeCon,

            chatKnowledgeId : '',
            save : save ,
            checkTitle : checkTitle ,          //标题

        };

        //添加扩展问 (先在前台校验重复，再校验后台与数据库的是否重复---点完保存后数据才能添加到数据库)
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空",{time:1000});
            }else if(checkRepeat($scope.vm.extendedQuestion,$scope.vm.extendedQuestionArr,"content")){
                layer.msg("扩展问题重复，请重新输入",{time:1000});
            }else{
                //console.log($scope.vm.extendedQuestionArr);   //[]
                MaterialServer.addExtension.get({
                    //"applicationId" : APPLICATION_ID,
                    "questionContent" : $scope.vm.extendedQuestion
                },function(data){
                    console.log(data);
                    if(data.status == 200){
                        var obj = {};
                        obj.content = angular.copy($scope.vm.extendedQuestion);
                        obj.type = 60;
                        $scope.vm.extendedQuestionArr.push(obj);
                        $scope.vm.extendedQuestion='';
                        console.log($scope.vm.extendedQuestionArr);
                    }else if(data.status == 500){
                        layer.msg("扩展问重复",{time:1000});

                    }
                },function(err){
                    console.log(err);
                });

            }

        }
        //刪除
        function remove(item,arr){
            arr.remove(item);
        }
        //添加知识内容
        function addContent(){
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("知识内容不能为空",{time:1000});
            }else if(checkRepeat($scope.vm.contentVal,$scope.vm.contentArr,"content")){
                layer.msg("知识内容重复，请重新输入",{time:1000});
            }else{
                MaterialServer.addContentArr.get({
                    //"applicationId":APPLICATION_ID,
                    "content" : $scope.vm.contentVal
                },function(data){
                    console.log(data);
                    if(data.status == 200){
                        var obj = {};
                        obj.content = angular.copy($scope.vm.contentVal);
                        $scope.vm.contentArr.push(obj);
                        $scope.vm.contentVal='';
                        console.log($scope.vm.contentArr);
                    }else if(data.status == 500){
                        layer.msg("知识内容重复",{time:1000});
                    }
                },function(err){
                    console.log(err);
                });
            }
        }
        //刪除知识内容
        function removeCon(item,arr){
            arr.remove(item);
        }
        //保存
        function save(){
            if(check()){
                //alert("新增知识");
                MaterialServer.faqSave.save({
                    //"applicationId":APPLICATION_ID,
                    "chatKnowledgeQuestionList":$scope.vm.extendedQuestionArr,
                    "chatKnowledgeContentList":$scope.vm.contentArr,
                    "modifierId":USER_ID,
                    "origin":0,
                    "topic":$scope.vm.standardQuestion,
                },function(data){
                    if(data.status==500){
                        layer.msg("保存失败");
                    }else if(data.status==200){
                        //console.log();
                        layer.msg("保存成功");
                        $state.go("MM.chat");
                    }
                },function(err){
                    console.log(err);
                });
            }
        }

        /**
         ** 校验标题是否重复
         **/
        function checkTit(){
            if($scope.vm.standardQuestion.length==0){
                layer.msg("请输入标准问法！");
            }else{
                MaterialServer.checkKnowTitle.get({
                    //"applicationId":APPLICATION_ID,
                    "topic":$scope.vm.standardQuestion
                },function(data){
                    if(data.status==500){
                        layer.msg("标准问法重复,请重新输入");
                        $("#standardQuestion").focus();
                    }
                    if(data.status==200){

                    }
                },function(err){
                    console.log(err);
                });
            }
        }
        //判断是新增还是编辑，如果是编辑，判断标题有没有改动；
        function checkTitle(){
            if($scope.vm.editStandardQuestion){
                //编辑
                if($scope.vm.standardQuestion==$scope.vm.editStandardQuestion){
                    //alert('标题没改');
                }else{
                    //alert('标题改了');
                    checkTit();
                }
            }else{
                //新增
                checkTit();
            }
        }
        //检验数据是否合格
        function check(){
            if($scope.vm.standardQuestion==null||$scope.vm.standardQuestion.length==0){
                layer.msg("标准问法不能为空",{time:1000});
                return false;
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空",{time:1000});
                return false;
            }else{
                return true;
            }
        }
        //判断重复（扩展问及新增内容）
        function checkRepeat(val,arr,prop){
            var result;
            if(arr.length==0){
                result=0;
            }else{
                angular.forEach(arr,function(item){
                    if(item[prop]==val){
                        result=1;
                    }else{
                        result=0;
                    }
                });
            }
            return result;
        }



    }
])};

