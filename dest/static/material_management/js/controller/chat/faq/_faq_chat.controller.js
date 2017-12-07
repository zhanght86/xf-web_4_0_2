/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('materialManagement').controller('faqChatController', [
    '$scope',"$state","MaterialServer","ngDialog", "$cookieStore","$stateParams",
    function ($scope,$state,MaterialServer,ngDialog,$cookieStore,$stateParams) {
        $state.go("materialManagement.faqChat");
        var paraData = $stateParams.scanDataList?angular.fromJson($stateParams.scanDataList):"" ;
        $scope.vm = {
            userName :  paraData?paraData.chatKnowledgeModifier: USER_NAME,
            standardQuestion :  paraData?paraData.standardQuestion:null,   //标准问
            extendedQuestion : "",    //扩展问
            extendedQuestionArr : paraData?paraData.extendedQuestionArr:[],  //扩展问数组
            remove : remove ,
            weight : "60" ,         //  权重
            addExtension : addExtension ,  //添加扩展
            chatKnowledgeId : paraData?paraData.chatKnowledgeId:null,
            contentVal : "",
            contentArr : paraData?paraData.contentArr:[] ,
            addContentDialog : addContentDialog,// 添加知识内容
            save : save ,
            scan : scan,
            scanData : $stateParams.scanData,
            type : $stateParams.scanData?$stateParams.scanData.type:1
        };

        //扩展问
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空",{time:1000});
            }else if(checkRepeat($scope.vm.extendedQuestion , $scope.vm.extendedQuestionArr ,"content")){
                layer.msg("扩展问题重复，请重新输入",{time:1000});
            }else{

                MaterialServer.addExtension.save({
                    content : $scope.vm.extendedQuestion
                },{
                    content : $scope.vm.extendedQuestion
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.content = angular.copy($scope.vm.extendedQuestion);
                        obj.type = angular.copy($scope.vm.weight);
                        $scope.vm.extendedQuestionArr.push(obj);
                        $scope.vm.extendedQuestion = "";
                        console.log($scope.vm.extendedQuestionArr);
                    }else if(data.status == 10008){
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
        //新增
        function addContentDialog(item,index){
            if(item){
                $scope.vm.contentVal = item.content
            }

            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/material_management/chat/add_content_dialog.html","450px",function(){
                if(item){
                    var val = angular.copy( $scope.vm.contentVal ) ;
                    $scope.vm.contentArr[index].chatKnowledgeContent = val ;
                    $scope.vm.contentVal = "" ;
                }else{
                    addContent();
                }
            },function(){
                $scope.vm.contentVal = "" ;
            }) ;
        }
        function addContent(){
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("扩展不能为空",{time:1000});
            // }else if(checkRepeat($scope.vm.contentVal , $scope.vm.contentArr ,"chatKnowledgeContent")){
            //     layer.msg("扩展问题重复，请重新输入");
            }else{
                var obj = {};
                obj.content = angular.copy($scope.vm.contentVal);
                $scope.vm.contentArr.push(obj);
                $scope.vm.contentVal = "";
                // MaterialServer.addContent.save({
                //     "chatKnowledgeContent" : $scope.vm.contentVal
                // },function(data){
                //     console.log(data);
                //     if(data.status == 10000){
                //         var obj = {};
                //         obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                //         $scope.vm.contentArr.push(obj);
                //         $scope.vm.contentVal = "";
                //     }else{
                //         layer.msg("扩展问重复")
                //     }
                // },function(err){
                //     console.log(err);
                // });

            }
        }

        //预览
        function scan(){
            if(check()){    // 方便测试  后期放开
                var params = {
                    chatKnowledgeId : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                    standardQuestion : $scope.vm.standardQuestion,
                    extendedQuestionArr : $scope.vm.extendedQuestionArr,
                    contentArr : $scope.vm.contentArr,
                    chatKnowledgeModifier : $scope.vm.userName,
                    //editUrl : "materialManagement.faqChat",
                    chatKnowledgeSource : "100"
                };
                $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:angular.toJson(params)});
            }
        }
        //保存  0 无验证   1  需要验证
        function save(){
                if(check()){
                    MaterialServer.faqSave.save({   
                        "modifierId":USER_ID,
                        "topic": $scope.vm.standardQuestion,
                        "chatKnowledgeContentList": $scope.vm.contentArr,
                        "chatKnowledgeQuestionList": $scope.vm.extendedQuestionArr,
                        "applicationId": APPLICATION_ID,
                        "origin":100
                        
                    },function(data){
                        console.log(data);
                        if(data.data==10004){
                            layer.msg("标准问题重复",{time:1000});
                        }else{
                            $state.go("materialManagement.chatKnowledgeBase");
                        }

                    },function(err){
                        console.log(err);
                    });
                }
            }

        //    判断重复(扩展问 及新增内容)
        function checkRepeat(val , arr ,prop){
            var result;
            if(arr.length==0){
                result = 0;
            }else{
                angular.forEach(arr,function(item){
                    if(item[prop]==val){
                        result = 1
                    }else{
                        result = 0
                    }
                })
            }
            return result
        }
        //验证 所有数据是否合格
        function check(){
            if($scope.vm.standardQuestion==null || $scope.vm.standardQuestion.length==0){
                layer.msg("标准问不能为空",{time:1000});
                return false;
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空",{time:1000});
                return false;
            }else{
                return true;
            }
        }

    }
]);

