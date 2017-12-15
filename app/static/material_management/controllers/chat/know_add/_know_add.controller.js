/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('KnowAddController', [
    '$scope',"$state","MaterialServer","ngDialog", "$cookieStore","$stateParams",
    ($scope,$state,MaterialServer,ngDialog,$cookieStore,$stateParams)=> {
        $state.go("materialManagement.knowAdd");

        $scope.vm = {
            standardQuestion :  '',   //标准问
            extendedQuestion : "",         //扩展问
            extendedQuestionArr : [],     //扩展问数组
            addExtension : addExtension ,  //添加扩展
            remove : remove ,

            contentVal : "",                  //知识内容
            contentArr : [] ,                 //知识内容数组

            chatKnowledgeId : '',
            save : save ,
            checkTitle : checkTitle ,          //标题
            titleCheck:false,
            titleQuestion:false,
            titleContent:false,
            addLine : addLine,                   //添加一行

        };

        //添加扩展问
        function addExtension(e){

            var  srcObj = e.srcElement ? e.srcElement : e.target;
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                //addLine();
                if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                    layer.msg("扩展不能为空",{time:1000});
                }else{
                    MaterialServer.addExtension.get({
                        "applicationId":APPLICATION_ID,
                        "content" : $scope.vm.extendedQuestion
                    },{
                        "applicationId":APPLICATION_ID,
                        "content" : $scope.vm.extendedQuestion
                    },function(data){
                        console.log(data);
                        if(data.status == 200){
                            var obj = {};
                            obj.content = angular.copy($scope.vm.extendedQuestion);
                            //obj.type = angular.copy($scope.vm.weight);
                            $scope.vm.extendedQuestionArr.push(obj);
                            console.log($scope.vm.extendedQuestionArr);
                            $scope.vm.titleQuestion=true;
                        }else if(data.status == 500){
                            layer.msg("扩展问重复",{time:1000});
                            $scope.vm.titleQuestion=false;
                            srcObj.focus();
                        }
                    },function(err){
                        console.log(err);
                    });

                }
            }

        }
        // //表格添加一行
        // function addLine(){
        //     var str='<tr><td><input type="text" class="txt" enternextline ng-model="vm.extendedQuestion" ng-keyup="vm.addExtension($event)" style="width:100%;"/></td></tr>';
        //     $(".material_table").append(str);
        // }
        //刪除
        function remove(item,arr){
            arr.remove(item);
        }
        //保存
        function save(){
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
        //校验标题是否重复
        function checkTitle(){
            MaterialServer.checkKnowTitle.get({
                "applicationId":APPLICATION_ID,
                "topic":$scope.vm.standardQuestion
            },function(data){
                if(data.status==500){
                    layer.msg("聊天主题重复,请重新输入");
                    $("#standardQuestion").focus();
                    $scope.vm.titleCheck=false;
                }
                if(data.status==200){
                    $scope.vm.titleCheck=true;
                }
            },function(err){
                console.log(err);
            });
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
        //判断重复(扩展问 及新增内容)
        // function checkRepeat(val , arr ,prop){
        //     var result;
        //     if(arr.length==0){
        //         result = 0;
        //     }else{
        //         angular.forEach(arr,function(item){
        //             if(item[prop]==val){
        //                 result = 1
        //             }else{
        //                 result = 0
        //             }
        //         })
        //     }
        //     return result
        // }

    }
])};
