/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('knowledgeSingleAddConceptController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        $scope.vm = {
            aa : {list:["s","a","z"]},
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,            
            knowledgeTitle : "",   //标题
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            titleGroup : "", //点击标题添加内容
        };
        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
            });
////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        //获取bot
       function getKnowledgeBot(){
           httpRequestPost("/api/user/userLogin",{

           },function(data){

           },function(err){

           });
       }
        //点击bot 下拉
        function knowledgeBot(ev,lev){
            var ele = ev.target;
            if(lev == 0){
                $(ele).next().slideToggle()
            }else{
                $(ele).css({backgroundPosition:"left bottom"}).parent().parent().next().slideToggle()
            }
        }
        //点击更改bot value
        function botValChange(val,id){
            $scope.vm.knowledgeBotVal = val;
        }
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
       function KnowledgeAdd(){
           var dialog = ngDialog.openConfirm({
               template:"/know_index/knowledgeManagement/concept/knowledgeAddSingleConceptDialog.html",
               //controller:function($scope){
               //    $scope.show = function(){
               //
               //        console.log(6688688);
               //        $scope.closeThisDialog(); //关闭弹窗
               //    }},
               scope: $scope,
               closeByDocument:false,
               closeByEscape: true,
               showClose : true,
               backdrop : 'static',
               preCloseCallback:function(e){    //关闭回掉
                   if(e === 1){
                   }
               }
           });
       }




        //維度
        function  getDimensions(){
            httpRequestPost("/api/user/userLogin",{

            },function(data){

            },function(err){

            });
        }
        //渠道
        function  getChannel(){
            httpRequestPost("/api/user/userLogin",{

            },function(data){

            },function(err){

            });
        }


    }
]);