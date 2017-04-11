
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('myApplicationModule').controller('relationalCatalogController',[
    '$scope','localStorageService','$timeout', '$state','$stateParams','ngDialog',function ($scope,localStorageService,$timeout,$state,$stateParams,ngDialog) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBotVal:"",  //bot 内容
            botInfo:null,  //bot信息
            addBot:addBot, //添加点击时间
            editBot:editBot,
            deleteBot:deleteBot,
            categoryId: "",
            categoryTypeId: 10009,
            categorySceneId: 0,
            categoryAttributeName: "",
            categoryName: "",
            categoryPid: "",
            categoryApplicationId: "",
            categoryLeaf: 1,
            botInfoToCategoryAttribute:botInfoToCategoryAttribute
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        //加载业务树
        initBot();

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
                $(".aside-navs").append(html);
            },function(){
                console.log("err or err");
            });
        }
        $(".aside-navs").on("click","span",function(){
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            console.log($scope.vm.botSelectValue);
            $scope.$apply()
        });
        $(".aside-navs").on("click",".edit",function(){
            console.log("edit");
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
            console.log($scope.vm.botInfo);
            botInfoToCategoryAttribute();
            editBot();
        });
        function editBot(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationDevelopment/editCategory.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e===1){
                        if($("#categoryName").val()){
                            httpRequestPost("/api/modeling/category/updatebycategoryid",{
                                "categoryId": $scope.vm.categoryId,
                                "categoryApplicationId": $scope.vm.categoryApplicationId,
                                "categoryPid": $scope.vm.categoryPid,
                                "categoryAttributeName": $("#categoryAttributeName").val(),
                                "categoryName": $("#categoryName").val(),
                                "categoryTypeId": $("#categoryTypeId").val(),
                                "categoryModifierId": categoryModifierId,
                                "categorySceneId": $scope.vm.categorySceneId,
                                "categoryLeaf": $scope.vm.categoryLeaf
                            },function(data){
                                if(responseView(data)==true){
                                    //清空指定pid下所有子分类 重新加载
                                    reloadBot(data,2);
                                }
                            },function(err){
                                console.log(err);
                            });
                        }
                    }else{
                    }
                }
            });
        }
        $(".aside-navs").on("click",".delete",function(){
            console.log("delete");
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
            console.log($scope.vm.botInfo);
            botInfoToCategoryAttribute();
            deleteBot();
        });
        function deleteBot(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationDevelopment/deleteCategory.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        httpRequestPost("/api/modeling/category/deletebycategoryid",{
                            "categoryId": $scope.vm.categoryId,
                            "categoryApplicationId": $scope.vm.categoryApplicationId,
                            "categoryPid": $scope.vm.categoryPid,
                            "categoryLeaf": $scope.vm.categoryLeaf
                        },function(data){
                            if(responseView(data)==true){
                                //清空指定pid下所有子分类 重新加载
                                reloadBot(data,1);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                }
            });
        }
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'.icon-jj',function(){
            appendTree(this);
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
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                    reloadBot(data,0);
                }
            },function(err){
                console.log(err);
            });
        }
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBot(data,type){
            if(type!=0){
                $.each($(".aside-navs").find("li"),function(index,value){
                    if($(value).find(".icon-jj").attr("data-option")==$scope.vm.botSelectValue){
                        console.log($(value).find(".icon-jj").attr("data-option"));
                        //移除指定元素
                        $(value).remove();
                    }
                });
            }

            if(type==1){
                return;
            }

            if($scope.vm.botSelectValue=="root"){
                initBot();
            }else{
                $.each($(".aside-navs").find("i"),function(index,value){
                    if(type==0){
                        if($(value).attr("data-option")==$scope.vm.botSelectValue){
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().prepend(html);
                        }
                    }
                    if(type==2){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i class="icon-jj" data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().prepend(html);
                        }
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
        //属性填充
        function botInfoToCategoryAttribute(){
            if($scope.vm.botInfo){
                var category = eval('(' + $scope.vm.botInfo + ')');
                $scope.vm.botSelectValue=category.categoryId;
                $scope.vm.categoryId=category.categoryId;
                $scope.vm.categoryTypeId=category.categoryTypeId;
                $scope.vm.categorySceneId=category.categorySceneId;
                $scope.vm.categoryAttributeName=category.categoryAttributeName;
                $scope.vm.categoryName=category.categoryName;
                $scope.vm.categoryPid=category.categoryPid;
                $scope.vm.categoryApplicationId=category.categoryApplicationId;
                $scope.vm.categoryLeaf=category.categoryLeaf;
            }
        }
    }
]);