/**
 * @Author : MILES .
 * @Create : 2017/9/15.
 * @Module :  list factor 知识内容 组件
 */
angular.module("knowledgeManagementModule").directive("listRelatedQuestion",["KnowledgeService","$timeout",function(KnowledgeService,$timeout){
    // 要素 列表
    return {
        //replace : true, //格式可以替换
        //transclude : false, //能够让你移动一个标识符的原始子节点到一个新模板的位置
        //scope : {
        //
        //} ,
        templateUrl : "/static/knowledge_manage/components/know_content_not_dialog.html" ,
        link : function(scope,el,attr,ctr){
            scope.dirCont = {
                search : false ,
                empty : false ,
                appointRelative : "" ,
                appointRelativeList : "" ,
                addAppoint : addAppoint ,
                leaveAppointEnter : leaveAppointEnter ,
                slideDown :slideDown
            } ;
            scope.$watch("dirCont.appointRelative",function(val,old){
                if(val){
                    var timer ;
                     if(timer){
                            $timeout.cancel(timer)
                        }else{
                         timer = $timeout(function () {
                                scope.dirCont.empty = false ;
                                scope.dirCont.search = true ;
                                KnowledgeService[attr.listRelatedQuestion].save({
                                    "title" : val
                                },function(response){
                                    if(response.status == 200 ){
                                        scope.dirCont.search = false ;
                                        if( response.data.length == 0 ){
                                            scope.dirCont.empty = true ;
                                            scope.dirCont.appointRelativeList = [] ;
                                        }else{
                                            scope.dirCont.appointRelativeList = response.data ;
                                            scope.dirCont.empty = false ;
                                        }
                                    }else{
                                    }
                                })
                            }, 300)
                        }
                }else{
                    scope.dirCont.srearch = false ;
                    scope.dirCont.empty = false ;
                }
            }) ;
            //点击添加相关问
              function addAppoint(item,arr){
                    if(arr.indexOf(item)==-1){
                        arr.push(item)
                    }
                } ;
            // 光标移开
            function leaveAppointEnter(){
                $timeout(function(){
                    scope.dirCont.appointRelativeList = [];  //清除 列表
                },200) ;
                scope.dirCont.empty = false ;
                scope.dirCont.search = false ;
            }
           function slideDown(){
                scope.dirCont.slideFlag = ! scope.dirCont.slideFlag;
                $(".senior_div").slideToggle();
                if(scope.dirCont.slideFlag){
                    $(".senior_div").css('overflow','visible');
                }
            }
        }
    }
}]);
