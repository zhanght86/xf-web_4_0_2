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
//主页面
            applicationId : $cookieStore.get("applicationId"),
            framework : ['信用卡办理','金葵花卡办理流程','黑金卡办理流程'],      //业务框架
            KnowledgeAdd: KnowledgeAdd,  //新增点击事件
            botSelectValue:"",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal : "",  //bot 内容
            botValChange : botValChange,

            title : "",   //标题
            timeStart : "",      //起始时间
            timeEnd : "",
            isTimeTable : false,  //时间表隐藏
            timeFlag : "启用",
            getTitleGroup : getTitleGroup,   //点击获取添加标题
            titleGroup : ["ddd"], //点击标题添加内容

            //展示内容
            scantitle : "",
            scanChannels : "",
            scanDimensions : "",
 //弹框相关
            newTitle: "",
            channels : "",     //渠道
            dimensions : ""  ,  //维度
                            //高级选项内容
            slideDown : slideDown,
            slideFlag : false,
            question : "",
            tip : "",
            tail : "" ,
            appointRelative : "",
            getAppointRelative : getAppointRelative ,
            appointRelativeGroup : ['储蓄卡办理方式','储ddd蓄卡办理方式'],
            removeAppointRelative : removeAppointRelative,
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
               scope: $scope,
               closeByDocument:false,
               closeByEscape: true,
               showClose : true,
               backdrop : 'static',
               preCloseCallback:function(e){    //关闭回掉
                   if(e === 1){
                       saveNew()
                   }
               }
           });
           $timeout(function(){
               var widget = new AutoComplete('search_bar', ['Apple', 'Banana', 'Orange']);
           },500);
           //}
       }

        function slideDown(){
            $scope.vm.slideFlag = ! $scope.vm.slideFlag;
            $(".senior_div").slideToggle();
        }

        //新增保存
        function saveNew(){
            httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                "title" : $scope.vm.title,
                "applicationId" : $scope.vm.applicationId
            },function(data){
                console.log(data)
            },function(err){
                layer.msg("数据请求失败")
            });
        }

        function getTitleGroup(){
            httpRequestPost("/api/elementKnowledgeAdd/byTitleGetClassify",{
                "title" : $scope.vm.title,
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


        /* ****************************************** //
        *
        *               弹框相关
        *
        */ // ****************************************** //

        function getAppointRelative(){

        }
        //維度
        getDimensions();
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
            httpRequestPost("/api/application/channel/listChannels",{
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