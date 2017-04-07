/**
 * Created by 41212 on 2017/3/28.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('knowledgeSingleAddConceptController', [
    '$scope', 'localStorageService' ,'$timeout',"$state" ,"ngDialog","$cookieStore","FileUploader",
    function ($scope,localStorageService,$timeout, $state,ngDialog,$cookieStore,FileUploader) {
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            framework : ['信用卡办理','金葵花卡办理流程','黑金卡办理流程'],      //业务框架
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            botSelectValue:"",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,            
            knowledgeTitle : "",   //标题
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            titleGroup : "", //点击标题添加内容
            channels : "",     //渠道
            dimensions : ""    //维度
        };

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
      //{
    //    "categoryApplicationId": "360619411498860544",
    //    "categoryPid": "root"
      //}
        getBotRoot();
    //    getDimensions();
    //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
                $timeout(function(){
                    $(ele).next().slideToggle();
                },50)
        }        

       //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": $scope.vm.applicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                alert("err or err")
            });
        }
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
       $(".aside-navs").on("click",'.icon-jj',function(){
           var id = $(this).attr("data-option");
           var that = $(this);
           if(!that.parent().parent().siblings().length){
               that.css("backgroundPosition","0% 100%")
               httpRequestPost("/api/modeling/category/listbycategorypid",{
                   "categoryApplicationId": $scope.vm.applicationId,
                   "categoryPid": id
               },function(data){
                   if(data.data){
                       var  html = '<ul class="menus">';
                       for(var i=0;i<data.data.length;i++){
                           html+= '<li>' +
                               '<div class="slide-a">'+
                               ' <a class="ellipsis" href="javascript:;">'+
                               '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                               '<span>'+data.data[i].categoryName+'</span>'+
                               '</a>' +
                               '</div>' +
                               '</li>'
                       }
                       html+="</ul>";
                       $(html).appendTo((that.parent().parent().parent()));
                       that.parent().parent().next().slideDown()
                   }
               },function(err){
                        alert(err)
               });
           }else{
               if(that.css("backgroundPosition")=="0% 0%"){
                   that.css("backgroundPosition","0% 100%");
                   that.parent().parent().next().slideDown()
               }else{
                   that.css("backgroundPosition","0% 0%");
                   that.parent().parent().next().slideUp()
               }
           }
       });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////

        //检测时间表开关
        $scope.$watch("vm.isTimeTable",function(val){
            if(val==true){
                $scope.vm.timeFlag="禁用"
            }else{
                $scope.vm.timeFlag="启用"
            }
        });

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


        //
        //{
        //    "accessToken": "string",
        //    "applicationDescription": "string",
        //    "applicationId": "string",
        //    "applicationLisence": "string",
        //    "applicationName": "string",
        //    "requestId": "string",
        //    "sceneId": "string",
        //    "statusId": 0,
        //    "userId": "string"
        //}
        //維度
        //getDimensions();
        function  getDimensions(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensions = data.data
                }
                console.log(data)
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });
        }
        //渠道
        getChannel();
        function  getChannel(){
            //console.log($scope.vm.applicationId);
            //
            //httpRequestPost("/api/elementKnowledgeAdd/loadChannel",{
            //    "applicationId" :"360619411498860540"
            //},function(data){
            //    console.log(data);
            //},function(err){
            //    layer.msg("连接网路失败")
            //}) /api/applicationannelstChannels
            httpRequestPost("/api/application/channel/dimension/list",{
                //"applicationId": "360619411498860544"
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.channels = data.data
                }
                 console.log(data)
            },function(err){
                layer.msg("获取渠道失败，请刷新页面")
            });
        }





    }
]);