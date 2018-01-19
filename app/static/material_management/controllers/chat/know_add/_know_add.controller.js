/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('KnowAddController', [
    '$scope',"$state","MaterialServer","ngDialog", "$cookieStore","$stateParams","$timeout",
    ($scope,$state,MaterialServer,ngDialog,$cookieStore,$stateParams,$timeout)=> {
        $state.go("MM.chatAdd");

        $scope.vm = {
            standardQuestion :  '',   //标准问
            editStandardQuestion :'',    //编辑标准问


            chatKnowledgeId : '',
            save : save ,
            checkTitle : checkTitle ,          //标题

            extensionQuestionList : [{"content":"",type:60}], //扩展问集合
            skipNewLine : skipNewLine ,// 跳转到新的行
            extensionUnique : extensionUnique,
            removeExtention :removeExtention,

            contentArr : [{"content":""}], //知识内容集合
            skipNewLineCon : skipNewLineCon ,// 跳转到新的行
            ConUnique : ConUnique,
            removeCon : removeCon,


        };
        /**
         * 检测扩展问标签是否重复
         * false   return   ；  true  return ext
         * */
        function extensionUnique(all,msg){
            console.log(all);
            let allExt = all.map(ext=>ext.content).filter(ext=>ext) ;
            let newExt = [];
            angular.forEach(allExt,function(ext,index){
                if(!newExt.inArray(ext)){
                    //newExt.push(ext)
                    MaterialServer.addExtension.get({
                        "questionContent" : ext
                    },function(data){
                        console.log(data);
                        if(data.status == 200){
                            newExt.push(ext);
                            console.log(newExt);
                        }else if(data.status == 500){
                            layer.msg(msg?msg:''+ext+"添加重复",{time:1000});
                        }
                    },function(err){
                        console.log(err);
                    });

                }else{
                    layer.msg(msg?msg:''+ext+"添加重复",{time:1000})
                }
            })

        }
        /**
         * 扩展问 跳转到新的行
         *
         * */
        function skipNewLine(scope,e,index) {
            let len = scope.vm.extensionQuestionList.length ;
            e = e || window.event ;
            if((e.keyCode|| e.which)==13 && nullCheck(scope.vm.extensionQuestionList[len-1])){
                if(!scope.vm.extensionQuestionList[index].content){
                    return layer.msg("请填写完整")
                }else {
                    scope.vm.extensionQuestionList.push({
                        "content":"",type:60
                    })
                    console.log($scope.vm.extensionQuestionList);
                };
                $timeout(function(){
                    $(e.target).parent().parent().children().last().find("input").focus();
                })
            }
        }
        //删除扩展问
        function removeExtention(scope,index) {
            if(index == 0){
                scope.vm.extensionQuestionList[0].content = ""
            }else{
                scope.vm.extensionQuestionList.splice(index,1);
            }
        }

        /**
         * 检测知识内容是否重复
         * false   return   ；  true  return ext
         * */
        function ConUnique(all,msg){
            console.log(all);
            let allExt = all.map(ext=>ext.content).filter(ext=>ext) ;
            let newExt = [];
            angular.forEach(allExt,function(ext,index){
                if(!newExt.inArray(ext)){
                    //newExt.push(ext)
                    MaterialServer.addContentArr.get({
                        "content" : ext
                    },function(data){
                        console.log(data);
                        if(data.status == 200){
                            newExt.push(ext);
                            console.log(newExt);
                        }else if(data.status == 500){
                            layer.msg(msg?msg:''+ext+"添加重复",{time:1000});
                        }
                    },function(err){
                        console.log(err);
                    });

                }else{
                    layer.msg(msg?msg:''+ext+"添加重复",{time:1000})
                }
            })

        }
        /**
         * 知识内容 跳转到新的行
         *
         * */
        function skipNewLineCon(scope,e,index) {
            let len = scope.vm.contentArr.length ;
            e = e || window.event ;
            if((e.keyCode|| e.which)==13 && nullCheck(scope.vm.contentArr[len-1])){
                if(!scope.vm.contentArr[index].content){
                    return layer.msg("请填写完整")
                }else {
                    scope.vm.contentArr.push({
                        "content":"",
                    })
                    console.log($scope.vm.contentArr);
                };
                $timeout(function(){
                    $(e.target).parent().parent().children().last().find("input").focus();
                })
            }
        }
        //删除知识内容
        function removeCon(scope,index) {
            if(index == 0){
                scope.vm.contentArr[0].content = ""
            }else{
                scope.vm.contentArr.splice(index,1);
            }
        }

        //保存
        function save(){
            if(check()){
                //alert("新增知识");
                MaterialServer.faqSave.save({
                    //"chatKnowledgeQuestionList":$scope.vm.contentArr,
                    "chatKnowledgeQuestionList":$scope.vm.extensionQuestionList,
                    "chatKnowledgeContentList":$scope.vm.contentArr,
                    "modifierId":USER_ID,
                    "origin":0,
                    "topic":$scope.vm.standardQuestion,
                },function(data){
                    if(data.status==500){
                        layer.msg(data.info,{time:1000});
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

