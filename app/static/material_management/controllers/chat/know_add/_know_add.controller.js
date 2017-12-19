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
            graphicMessageId : '',    //知识id
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
            titleCheck:false,
            titleQuestion:false,
            titleContent:false,

        };

        //添加扩展问
        function addExtension(){
                if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                    layer.msg("扩展不能为空",{time:1000});
                }else{
                    MaterialServer.addExtension.get({
                        "applicationId":APPLICATION_ID,
                        "questionContent" : $scope.vm.extendedQuestion
                    },{
                        "applicationId":APPLICATION_ID,
                        "questionContent" : $scope.vm.extendedQuestion
                    },function(data){
                        console.log(data);
                        if(data.status == 200){
                            var obj = {};
                            obj.content = angular.copy($scope.vm.extendedQuestion);
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
            }else{
                MaterialServer.addContentArr.get({
                    "applicationId":APPLICATION_ID,
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
           // if(check()){
                if($scope.vm.editStandardQuestion){
                    //编辑
                    //alert("更新知识");
                    MaterialServer.saveChatKnowledge.save({
                        "applicationId":APPLICATION_ID,
                        "id": $scope.vm.graphicMessageId,
                        "chatKnowledgeQuestionList":$scope.vm.extendedQuestionArr,
                        "chatKnowledgeContentList":$scope.vm.contentArr,
                        "modifierId":USER_ID,
                        "origin":0,
                        "topic":$scope.vm.standardQuestion
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
                }else{
                    //新增
                    //alert("新增知识");
                    MaterialServer.faqSave.save({
                        "applicationId":APPLICATION_ID,
                        "chatKnowledgeQuestionList":$scope.vm.extendedQuestionArr,
                        "chatKnowledgeContentList":$scope.vm.contentArr,
                        "modifierId":USER_ID,
                        "origin":0,
                        "topic":$scope.vm.standardQuestion
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

            //}
        }

        /**
         ** 校验标题是否重复
         **/
        function checkTit(){
            MaterialServer.checkKnowTitle.get({
                "applicationId":APPLICATION_ID,
                "topic":$scope.vm.standardQuestion
            },function(data){
                if(data.status==500){
                    layer.msg("聊天主题重复,请重新输入");
                    $("#standardQuestion").focus();
                    //$scope.vm.titleCheck=false;
                }
                if(data.status==200){
                    //$scope.vm.titleCheck=true;
                }
            },function(err){
                console.log(err);
            });
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

        //获取编辑知识ID
        if($stateParams.knowTextId){
            $scope.vm.graphicMessageId = $stateParams.knowTextId;
            getKnowText($stateParams.knowTextId);
        }
        function getKnowText(id){
            MaterialServer.searchById.get({
                "id": id
            },function(data){
                if(data.status==200){
                    console.log(data);
                    $scope.vm.standardQuestion = data.data.topic;
                    $scope.vm.extendedQuestionArr = data.data.chatQuestionList;
                    $scope.vm.contentArr = data.data.chatKnowledgeContentList;

                    $scope.vm.editStandardQuestion = data.data.topic;
                }
            },function(err){
                console.log(err);
            });
            
        }


    }
])};

