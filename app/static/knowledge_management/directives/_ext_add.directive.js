/**
 * @Author : MILES .
 * @Create : 2017/9/19.
 * @Module : 概念扩展
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.directive("conceptExtension",
    ["KnowledgeService","$templateCache","$timeout","$sce","localStorageService",
    function(KnowledgeService,$templateCache,$timeout,$sce,localStorageService){
    return {
        restrict : "A" ,
        template : function(scope,attr){
            if(attr.conceptExt=="dialog"){
                return $templateCache.get("ext")
            }else{
                return $templateCache.get("ext-not-dialog")
            }
        } ,
        link : function(scope,el,attr,ctr){
            scope.dirExtHasTag = {
                title : "" ,
                type : 60 ,
                getExtensionByFrame : getExtensionByFrame ,
                getExtension : getExtension ,
                rmeoveExtHasTagToLocal : rmeoveExtHasTagToLocal
            } ;
            /**
             * 删除页面扩展问，并添加到local中
             * @params ｛isEdit｝       knowledgeId（是否是编辑）；判断是否调用本地local假删除
             * @params ｛item｝         删除的扩展问
             * */
            function rmeoveExtHasTagToLocal(isEdit,item){
                if(isEdit){
                    //localStorageService.clearAll() ;
                    var local = localStorageService.get("cust_concept_ext") ;
                    if(local){
                        local.push(item) ;
                        localStorageService.set("cust_concept_ext",local) ;
                    }else{
                        localStorageService.set("cust_concept_ext",new array(item)) ;
                    }
                    console.log(localStorageService.get("cust_concept_ext"))
                }
            }
            /**
             * 获取扩展问
             * @params ｛isEdit｝       knowledgeId（是否是编辑）；判断是否调用本地local假删除
             * @params ｛localName｝    localStorage name
             * @params ｛title｝        扩展问标题
             * @params ｛type｝         扩展问类型
             * @params ｛allExt｝       页面所有扩展问，比较时候重复复
             * */
            function getExtension(isEdit,localName,title,type,allExt){
                // 标题是否重复
                var usable = isTitleUsable(title,type,allExt) ;
                var local =  localStorageService.get(localName)   ;
                if(!title){
                    layer.msg("扩展问不能为空");
                    return ;
                }else if(usable == false){
                    layer.msg("生成扩展问重复,已阻止添加");
                    return false
                }
                if(isEdit){
                    if(local!=null){
                        var result = false ;
                        angular.forEach(local,function(item,index){
                            if(item.extensionQuestionTitle == title && item.extensionQuestionType == type){
                                scope.vm.extensions.push(item);
                                local.splice(index,1) ;
                                localStorageService.set(localName,local);
                                result = true ;
                            }
                        }) ;
                        if(result){
                            return ;
                        }
                    }
                }
                var parameter =  {"applicationId": APPLICATION_ID} ,call;  // 参数以及成功回调
                if(attr.tag=='true'){                              // 需要打标签的 （非faq）
                    parameter.extendQuestionList = new Array(title) ;      // 公用应用id
                    call = function(res){
                        if (res.status == 500) {
                            layer.msg(res.data);
                        }else if(res.status == 10026 ){
                            layer.msg("扩展问添加重复，请重新添加")
                        } else if (res.status == 200) {
                            var result = scope.$parent.knowCtr.isExtensionTagRepeat(res.data,allExt,title,type) ;
                            if(result != false){
                                scope.dirExtHasTag.type = 60 ;
                                scope.dirExtHasTag.title = "";
                                scope.vm.extensions.push(result);
                            }
                        }
                    }
                }else{                                                  // faq
                    parameter.title = title ;
                    call = function(res){
                        if(res.status == 500){
                            layer.msg('根据"'+title+'"生成扩展问题重复') ;
                        }else if(res.status==200){
                            scope.vm.extensions.push(usable);
                        }
                    }
                }
                KnowledgeService[attr.api].save(parameter, call, function (error) {
                    //status == 500
                    //layer.msg("概念扩展打标失败，请检查服务，重新打标");
                    console.log(error)})
            }
            /**
            * 是否与页面扩展问有冲突
            * 重复：false ；
            * 不重复：{
                         extensionQuestionTitle : title ,
                         extensionQuestionType : type
                      }
            * */
            function isTitleUsable(title,type,allExt){
                var result = {
                    extensionQuestionTitle : title ,
                    extensionQuestionType : type
                };
                //所有标题以及手动打标生成的扩展问
               if(allExt.length){
                    var len = allExt.length;
                    angular.forEach(allExt,function(val){
                        if(val.extensionQuestionTitle == title && val.extensionQuestionType == type){
                            len-=1 ;
                            result = false ;
                        }
                    })
                }
                return  result ;
            }
            function getExtensionByFrame(id,type){
                console.log(id);
                httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                    "frameTypeId": 10012,
                    "frameId": id,
                    "index": 0,
                    "pageSize":999999
                },function(data){
                    if(data.status==10000){
                        //var extensionQuestionList = [],
                        //    frameQuestionTagList = [];
                        var obj = {};
                        if (data.data[0].elements) {
                            angular.forEach(data.data[0].elements, function (item, index) {
                                var  extensionQuestionList = [] ,
                                    frameQuestionTagList = [];
                                obj={
                                    "extensionQuestionType": 60 ,  //61
                                    "extensionQuestionTitle": data.data[0].frameTitle
                                } ;
                                extensionQuestionList.push((item.elementContent.substring(0,item.elementContent.indexOf('#'))));
                                frameQuestionTagList.push(item.elementContent.substring(item.elementContent.indexOf('#')+1).split('；'));
                                checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,obj);
                            });
                        }
                        scope.$apply();
                    }
                }, function (error) {console.log(error)});
            }
            //y业务框架生成扩展问校验
            function checkExtensionByFrame(extensionQuestionList,frameQuestionTagList,oldWord){
                var title = extensionQuestionList[0] ;
                var weight = oldWord.extensionQuestionType ;
                console.log(oldWord,title);
                var isLocalHasExt = addLocalExtension(title)  ;
                if(isLocalHasExt){
                    $scope.vm.extensionsByFrame.push(isLocalHasExt);
                    return ;
                }
                httpRequestPost("/api/ms/conceptKnowledge/checkFrameTag",{
                    "applicationId": APPLICATION_ID,
                    "extensionQuestionList" : extensionQuestionList,
                    "frameQuestionTagList" : frameQuestionTagList
                },function(data){
                    if(data.status==200){
                        $scope.$apply(function(){
                            var allExtension = $scope.vm.extensions.concat($scope.vm.extensionsByFrame) ;
                            var result = $scope.$parent.knowCtr.isExtensionTagRepeat(data.data,allExtension,title,weight) ;
                            if(result != false){
                                $scope.vm.extensionTitle = "";
                                $scope.vm.extensionsByFrame.push(result);
                            }
                        })
                    }
                }, function () {
                });
            }

        }
    }
}])} ;
