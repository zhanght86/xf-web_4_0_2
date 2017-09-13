/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('materialManagement').controller('conceptChatController', [
    '$scope',"$state","ngDialog","MaterialServer","$stateParams" ,"$cookieStore",
    function ($scope,$state,ngDialog,MaterialServer,$stateParams,$cookieStore) {
        $state.go("materialManagement.conceptChat");
        //console.log( $stateParams.scanDataList.extendedQuestionArr[0]);    //edit    -----taglist
        var paraOfData = $stateParams.scanDataList?angular.fromJson($stateParams.scanDataList):"" ;
        $scope.vm = {
            userName :  paraOfData?paraOfData.chatKnowledgeModifier:$cookieStore.get("userName"),
            standardQuestion :  paraOfData?paraOfData.standardQuestion:null,   //标准问
            extendedQuestion : "",    //扩展问
            extendedQuestionArr : paraOfData?paraOfData.extendedQuestionArr:[],  //扩展问数组
            chatKnowledgeId : paraOfData?paraOfData.chatKnowledgeId:null,
            remove : remove ,
            weight : "60" ,         //  权重
            addExtension : addExtension ,  //添加扩展
            contentVal : "",
            contentArr : paraOfData?paraOfData.contentArr:[] ,
            addContentDialog : addContentDialog,// 添加知识内容
            save : save,
            scan : scan,
            scanData : $stateParams.scanData,
            type : paraOfData?paraOfData.type:1
        };

        //擴展問
        function addExtension(){
            if($scope.vm.extendedQuestion.length==0||$scope.vm.extendedQuestion==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.extendedQuestion , $scope.vm.extendedQuestionArr ,"chatQuestionContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                //
                // httpRequestPost("/api/ms/chatKnowledge/checkConceCptChatQuestion",{
                //     "chatQuestionContent" : $scope.vm.extendedQuestion,
                //     "applicationId" :  APPLICATION_ID
                // },function(data){
                //     if(data.status == 200){
                //         var obj = {};
                //         //检验标签重复
                //         if($scope.vm.extendedQuestionArr.length){
                //             var len = data.data.length;
                //             var lenArr = $scope.vm.extendedQuestionArr.length;
                //             angular.forEach(data.data,function(input){
                //                 angular.forEach($scope.vm.extendedQuestionArr,function(item){
                //                     angular.forEach(item.tagList,function(val){
                //                         if(val == input) {
                //                             len -= 1;
                //                         }
                //                     });
                //                     if(len!=data.data.length){
                //                         lenArr -= 1;
                //                         layer.msg("扩展问题重复，请重新输入");
                //                         return false
                //                     };
                //                 });
                //                 if(lenArr != $scope.vm.extendedQuestionArr.length){
                //                     layer.msg("扩展问题重复，请重新输入");
                //                     return false
                //                 }else{
                //                     obj.chatQuestionContent = data.data;
                //                     obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion) ;
                //                     obj.tagList = data.data;
                //                     obj.chatQuestionType = angular.copy($scope.vm.weight);
                //                     $scope.vm.extendedQuestionArr.push(obj);
                //                     $scope.vm.extendedQuestion = "";
                //                 }
                //             });
                //         }else{
                //             obj.chatQuestionContent = data.data;
                //             obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion) ;
                //             obj.tagList = data.data;
                //             obj.chatQuestionType = angular.copy($scope.vm.weight);
                //             $scope.vm.extendedQuestionArr.push(obj);
                //             $scope.vm.extendedQuestion = "";
                //             $scope.$apply();
                //         }
                //
                //     }else{
                //         layer.msg("扩展问重复")
                //     }
                // },function(err){
                //     console.log(err)
                // })
                //
                MaterialServer.addExtension2.save({
                    "chatQuestionContent" : $scope.vm.extendedQuestion,
                    "applicationId" :  APPLICATION_ID
                },function(data){
                    if(data.status == 200){
                        var obj = {};
                        //检验标签重复
                        if($scope.vm.extendedQuestionArr.length){
                            var len = data.data.length;
                            var lenArr = $scope.vm.extendedQuestionArr.length;
                            angular.forEach(data.data,function(input){
                                angular.forEach($scope.vm.extendedQuestionArr,function(item){
                                    angular.forEach(item.tagList,function(val){
                                        if(val == input) {
                                            len -= 1;
                                        }
                                    });
                                    if(len!=data.data.length){
                                        lenArr -= 1;
                                        layer.msg("扩展问题重复，请重新输入");
                                        return false
                                    };
                                });
                                if(lenArr != $scope.vm.extendedQuestionArr.length){
                                    layer.msg("扩展问题重复，请重新输入");
                                    return false
                                }else{
                                    obj.chatQuestionContent = data.data;
                                    obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion) ;
                                    obj.tagList = data.data;
                                    obj.chatQuestionType = angular.copy($scope.vm.weight);
                                    $scope.vm.extendedQuestionArr.push(obj);
                                    $scope.vm.extendedQuestion = "";
                                }
                            });
                        }else{
                            obj.chatQuestionContent = data.data;
                            obj.chatQuestionContent = angular.copy($scope.vm.extendedQuestion) ;
                            obj.tagList = data.data;
                            obj.chatQuestionType = angular.copy($scope.vm.weight);
                            $scope.vm.extendedQuestionArr.push(obj);
                            $scope.vm.extendedQuestion = "";
                        }

                    }else{
                        layer.msg("扩展问重复")
                    }
                },function(err){
                    console.log(err)
                });
            }
        }
        function addContentDialog(item,index){
            if(item){
                $scope.vm.contentVal = item.chatKnowledgeContent
            }
            // var dialog = ngDialog.openConfirm({
            //     template:"/static/materialManagement/chat/addContentDialog.html",
            //     scope: $scope,
            //     closeByDocument:false,
            //     closeByEscape: true,
            //     showClose : true,
            //     backdrop : 'static',
            //     preCloseCallback:function(e){    //关闭回掉
            //         if(e === 1){
            //             if(item){
            //                 var val = angular.copy( $scope.vm.contentVal ) ;
            //                 $scope.vm.contentArr[index].chatKnowledgeContent = val ;
            //                 $scope.vm.contentVal = "" ;
            //             }else{
            //                 addContent()  ;
            //             }
            //         }else{
            //             $scope.vm.contentVal = "" ;
            //         }
            //     }
            // });
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/materialManagement/chat/addContentDialog.html","450px",function(){
                if(item){
                    var val = angular.copy( $scope.vm.contentVal ) ;
                    $scope.vm.contentArr[index].chatKnowledgeContent = val ;
                    $scope.vm.contentVal = "" ;
                }else{
                    addContent()  ;
                }
            },function(){
                $scope.vm.contentVal = "" ;
            }) ;
        }
        function addContent(){
            if($scope.vm.contentVal.length==0||$scope.vm.contentVal==""){
                layer.msg("扩展不能为空");
            }else if(checkRepeat($scope.vm.contentVal , $scope.vm.contentArr ,"chatKnowledgeContent")){
                layer.msg("扩展问题重复，请重新输入");
            }else{
                // httpRequestPost("/api/ms/chatKnowledge/checkChatKnowledgeContent",{
                //     "chatKnowledgeContent" : $scope.vm.contentVal
                // },function(data){
                //     console.log(data);
                //     if(data.status == 10000){
                //         var obj = {};
                //         obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                //         $scope.vm.contentArr.push(obj);
                //         $scope.vm.contentVal = "";
                //         $scope.$apply();
                //     }else{
                //         layer.msg("扩展问重复")
                //     }
                // },function(err){
                //     console.log(err)
                // })
                MaterialServer.addContent.save({
                    "chatKnowledgeContent" : $scope.vm.contentVal
                },function(data){
                    console.log(data);
                    if(data.status == 10000){
                        var obj = {};
                        obj.chatKnowledgeContent = angular.copy($scope.vm.contentVal);
                        $scope.vm.contentArr.push(obj);
                        $scope.vm.contentVal = "";
                        
                    }else{
                        layer.msg("扩展问重复")
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
        //预览
        function scan(){
            if(check()){
            var params = {
                chatKnowledgeId : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                standardQuestion : $scope.vm.standardQuestion,
                extendedQuestionArr : $scope.vm.extendedQuestionArr,
                contentArr : $scope.vm.contentArr,
                chatKnowledgeModifier : $scope.vm.userName,
                //editUrl : "materialManagement.conceptChat",
                chatKnowledgeSource : "101"
            };
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:angular.toJson(params)});
        }
        }
        //保存  0 无验证   1  需要验证
        function save(){
            if(check()){
                // httpRequestPost("/api/ms/chatKnowledge/addConceCptChatKnowledge",{
                //     "chatKnowledgeId" : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                //     "applicationId": APPLICATION_ID,
                //     "chatKnowledgeModifier": $scope.vm.userName,
                //     "userId" : USER_ID ,
                //     "chatKnowledgeTopic": $scope.vm.standardQuestion,
                //     "chatQuestionList" : $scope.vm.extendedQuestionArr,
                //     "chatKnowledgeContentList" : $scope.vm.contentArr
                // },function(data){
                //     if(data.data==10004){
                //         layer.msg("标准问重复")
                //     }else{
                //         $state.go("materialManagement.chatKnowledgeBase");
                //     }
                // },function(err){
                //     console.log(err);
                // })
                MaterialServer.addConceCptChatKnowledge.save({
                    "chatKnowledgeId" : $scope.vm.chatKnowledgeId?$scope.vm.chatKnowledgeId:null,
                    "applicationId": APPLICATION_ID,
                    "chatKnowledgeModifier": $scope.vm.userName,
                    "userId" : USER_ID ,
                    "chatKnowledgeTopic": $scope.vm.standardQuestion,
                    "chatQuestionList" : $scope.vm.extendedQuestionArr,
                    "chatKnowledgeContentList" : $scope.vm.contentArr
                },function(data){
                    if(data.data==10004){
                        layer.msg("标准问重复")
                    }else{
                        $state.go("materialManagement.chatKnowledgeBase");
                    }
                },function(err){
                    console.log(err);
                });
            }
        }
        //    判断重复
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
                layer.msg("标准问不能为空");
                return false
            }else if($scope.vm.contentArr.length==0){
                layer.msg("知识内容不能为空");
                return false
            }else{
                return true
            }
        }
    }
]);