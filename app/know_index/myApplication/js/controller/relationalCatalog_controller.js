
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('relationalCatalogController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService, $state,$stateParams,ngDialog) {
        //$state.go("relationalCatalog.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBot:knowledgeBot,  //bot点击事件
            knowledgeBotVal:"",  //bot 内容
            addBot:addBot //添加点击时间
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        //加载业务树
        initBot();
        //点击 root 的下拉效果
        function knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function initBot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data
            },function(){
                console.log("err or err")
            });
        }
        //点击更改bot value
        function botValChange(val){
            $scope.vm.knowledgeBotVal = val;
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $("#category-parent").val($scope.vm.knowledgeBotVal);
            $scope.vm.botSelectValue = $(this).attr("data-option");
            console.log($scope.vm.botSelectValue);
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            appendTree(this);
        });
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            console.log(that.parent().parent().siblings().length+"================");
            if(!that.parent().parent().siblings("li").length){
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
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span ng-click="vm.botValChange('+data.data[i].categoryName+')" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
                    that.css("backgroundPosition","0% 100%")
                    that.parent().parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().parent().next().slideUp()
                }
            }
        }
        //类目新增
        function addBot(){
            //数据校验
            if($scope.vm.botSelectValue==""){
                return;
            }
            httpRequestPost("/api/modeling/category/add",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": $scope.vm.botSelectValue,
                "categoryAttributeName": $("#category-attribute-name").val(),
                "categoryName": $("#category-name").val(),
                "categoryTypeId": $("#category-type").val(),
                "categoryModifierId": categoryModifierId,
                "categorySceneId": categorySceneId,
                "categoryLeaf": 0,
            },function(data){
                if(responseView(data)==true){
                    //清空指定pid下所有子分类 重新加载
                    reloadBot(data);
                }
            },function(err){
                console.log(err);
            });
        }
        function reloadBot(data){
            $.each($(".aside-navs").find("li"),function(index,value){
                console.log($(value).attr("data-option"));
                if($(value).attr("data-option")==$scope.vm.botSelectValue){

                }
            });
            if($scope.vm.botSelectValue=="root"){
                initBot();
            }else{
                $.each($(".aside-navs").find("i"),function(index,value){
                    console.log($(value).attr("data-option"));
                    if($(value).attr("data-option")==$scope.vm.botSelectValue){
                        var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                            '<div class="slide-a">'+
                            ' <a class="ellipsis" href="javascript:;">'+
                            '<i class="icon-jj" data-option="'+data.data[0].categoryId+'"></i>'+
                            '<span ng-click="vm.botValChange('+data.data[0].categoryName+')" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                            '</a>' +
                            '</div>' +
                            '</li>';
                        //按照修改时间排序 把数据添加到前面
                        $(value).parent().parent().next().prepend(html);
                    }
                });
            }
        }
        //返回状态显示
        function responseView(data){
            if(data==null){
                return false;
            }
            layer.msg(data.info);
            if(data.status==$scope.vm.success){
                return true;
            }
            return false;
        }
    }
]);