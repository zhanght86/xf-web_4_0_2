/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('myApplicationModule').controller('botApplyController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBotVal:"",  //bot 内容
            botLibrarySelectValue:"root",
            botLibraryRoot : "",     //根节点
            knowledgeBotLibraryVal:"",  //bot 内容
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        //加载业务树
        initBot();
        initBotLibrary();
        //获取root 数据
        function initBot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;">'+
                        '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $("#category").append(html);
            },function(){
                console.log("err or err");
            });
        }
        function initBotLibrary(){
            httpRequestPost("/api/modeling/categorylibrary/listbycategorypid",{
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;">'+
                        '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $("#library").append(html);
            },function(){
                console.log("err or err");
            });
        }
        $("#category").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            console.log($scope.vm.botSelectValue);
            $scope.$apply()
        });
        $("#library").on("click","span",function(){
            $scope.vm.knowledgeBotLibraryVal = $(this).html();
            $scope.vm.botLibrarySelectValue = $(this).attr("data-option");
            console.log($scope.vm.botLibrarySelectValue);
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $("#category").on("click",'.icon-jj',function(){
            appendTree(this);
        });
        $("#library").on("click",'.icon-jj',function(){
            appendLibraryTree(this);
        });
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId": categoryApplicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown();
                    }
                },function(err){
                    console.log(err);
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%");
                    that.parent().parent().next().slideDown();
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp();
                }
            }
        }
        function appendLibraryTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/categorylibrary/listbycategorypid",{
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown();
                    }
                },function(err){
                    console.log(err);
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%");
                    that.parent().parent().next().slideDown();
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp();
                }
            }
        }
    }
]);