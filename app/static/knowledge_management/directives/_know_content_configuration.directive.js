/**
 * @Author : MILES .
 * @Create : 2017/9/15.
 * @Module :  list factor 知识内容 组件
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.directive("knowContentConfiguration",
    ["KnowledgeService","$templateCache","$timeout","$sce",
    function(KnowledgeService,$templateCache,$timeout,$sce){
    // 要素 列表
    return {
        restrict: 'A',
        template :
            function(scope,attr){
                var result  ;
                if (attr["templateType"]=="true"){//如果解析不了，默认的无弹框
                    result = $templateCache.get("has-dialog") ;
                }else{
                    result =  $templateCache.get("not-dialog")
                }
                return result
            },
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
                                KnowledgeService[attr.knowContentConfiguration].save({
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
                  console.log(scope.vm.knowledgeRelevantContentList)
                    if(arr.indexOf(item)==-1){
                        arr.push(item)
                    }
                  console.log(arr)
                  console.log(scope.vm.knowledgeRelevantContentList)
                }
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
}])}
// 相关问题 键盘选择
//function selectEvent(e){
//        var  srcObj = e.srcElement ? e.srcElement : e.target;
//        var keycode = window.event?e.keyCode:e.which;
//    switch(keycode){
//        case 13 :
//            if(arr.indexOf(item)==-1){
//                arr.push(item)
//            }
//            $scope.vm.appointRelative = null;  //清楚title
//            $scope.vm.appointRelativeList = [];  //清除 列表
//            break ;
//        case 40 :
//            if(arr.indexOf(item)==-1){
//                arr.push(item)
//            }
//            $scope.vm.appointRelative = null;  //清楚title
//            $scope.vm.appointRelativeList = [];  //清除 列表
//            break ;
//    }
//}