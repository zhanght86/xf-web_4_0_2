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
            clearColor:clearColor,
            clearColorLibrary:clearColorLibrary,
            applyCategory:applyCategory,
            botInfo:null,  //bot信息
            deleteBot:deleteBot,
            categoryId: "",
            categoryTypeId: 10009,
            botSelectType:10009,
            categorySceneId: 0,
            categoryAttributeName: "",
            categoryName: "",
            categoryPid: "",
            categoryApplicationId: "",
            categoryLeaf: 1,
            botLibraryInfo:null,  //bot信息
            addBotLibrary:addBotLibrary, //添加点击时间
            editBotLibrary:editBotLibrary,
            deleteBotLibrary:deleteBotLibrary,
            categoryLibraryId: "",
            categoryLibraryTypeId: 10009,
            botLibrarySelectType:10009,
            categoryLibrarySceneId: 0,
            categoryLibraryAttributeName: "",
            categoryLibraryName: "",
            categoryLibraryPid: "",
            categoryLibraryLeaf: 1,
            reloadBotLibrary:reloadBotLibrary,
            reloadBot:reloadBot
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
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
            clearColor();
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $(this).attr("style","color:black;font-weight:bold;");
            console.log($scope.vm.botSelectValue);
            $scope.$apply()
        });
        $("#library").on("click","span",function(){
            clearColorLibrary();
            $scope.vm.knowledgeBotLibraryVal = $(this).html();
            $scope.vm.botLibrarySelectValue = $(this).attr("data-option");
            $(this).attr("style","color:black;font-weight:bold;");
            console.log($scope.vm.botLibrarySelectValue);
            $scope.$apply()
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $("#category").on("click",'i',function(){
            appendTree(this);
        });
        $("#library").on("click",'i',function(){
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
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf)+' data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf)+' data-option="'+data.data[i].categoryId+'"></i>'+
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
        //清除已选颜色
        function clearColorLibrary(){
            $.each($("#library").find("span"),function(index,value){
                $(value).attr("style","");
            });
        }
        //清除已选颜色
        function clearColor(){
            $.each($("#category").find("span"),function(index,value){
                $(value).attr("style","");
            });
        }
        //自动转换图标类型
        function styleSwitch(type,leaf){
            if(leaf==0){
                return "";
            }
            var style ='style="position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; display: inline-block; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
            switch (type){
                case 10008:
                    style='style="position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; display: inline-block; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
                case 10007:
                    style='style="position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; display: inline-block; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
                case 10006:
                    style='style="position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; display: inline-block; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
            }
            return style;
        }
        //套用
        function applyCategory(){
            httpRequestPost("/api/modeling/categorylibrary/applycategorybyid",{
                "categoryId": $scope.vm.botLibrarySelectValue,
                "categoryPid": $scope.vm.botSelectValue,
                "categoryApplicationId": categoryApplicationId,
                "categoryModifierId": categoryModifierId
            },function(data){
                if(data.data){
                    $("#category").empty();
                    initBot;
                }
            },function(err){
                console.log(err);
            });
        }
        $("#category").on("click",".delete",function(){
            console.log("delete");
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
            console.log($scope.vm.botInfo);
            botInfoToCategoryAttribute();
            deleteBot();
        });
        $("#library").on("click",".edit",function(){
            console.log("edit");
            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
            console.log($scope.vm.botLibraryInfo);
            botLibraryInfoToCategoryAttribute();
            editBotLibrary();
        });
        $("#library").on("click",".delete",function(){
            console.log("delete");
            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
            console.log($scope.vm.botLibraryInfo);
            botLibraryInfoToCategoryAttribute();
            deleteBotLibrary();
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
                                //重新加载
                                reloadBot(data);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                }
            });
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
        //属性填充
        function botLibraryInfoToCategoryAttribute(){
            if($scope.vm.botLibraryInfo){
                var category = eval('(' + $scope.vm.botLibraryInfo + ')');
                $scope.vm.botLibrarySelectValue=category.categoryId;
                $scope.vm.categoryLibraryId=category.categoryId;
                $scope.vm.categoryLibraryTypeId=category.categoryTypeId;
                $scope.vm.categoryLibrarySceneId=category.categorySceneId;
                $scope.vm.categoryLibraryAttributeName=category.categoryAttributeName;
                $scope.vm.categoryLibraryName=category.categoryName;
                $scope.vm.categoryLibraryPid=category.categoryPid;
                $scope.vm.categoryLibraryLeaf=category.categoryLeaf;
            }
        }
        //局部加载
        function reloadBot(data){
            $.each($("#category").find("li"),function(index,value){
                if($(value).find("i").attr("data-option")==$scope.vm.botSelectValue){
                    console.log($(value).find("i").attr("data-option"));
                    //移除指定元素
                    $(value).remove();
                }
            });
        }
        function addBotLibrary(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationDevelopment/addCategoryLibrary.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e===1){
                        if($("#categoryLibraryNameAdd").val()){
                            httpRequestPost("/api/modeling/categorylibrary/add",{
                                "categoryPid": $scope.vm.botLibrarySelectValue,
                                "categoryAttributeName": $("#categoryLibraryAttributeNameAdd").val(),
                                "categoryName": $("#categoryLibraryNameAdd").val(),
                                "categoryTypeId": $("#categoryLibraryTypeIdAdd").val(),
                                "categoryModifierId": categoryModifierId,
                                "categorySceneId": categorySceneId,
                                "categoryLeaf": 0
                            },function(data){
                                if(responseView(data)==true){
                                    //重新加载
                                    reloadBotLibrary(data,2);
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
        function editBotLibrary(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationDevelopment/editCategoryLibrary.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e===1){
                        if($("#categoryLibraryName").val()){
                            httpRequestPost("/api/modeling/categorylibrary/updatebycategoryid",{
                                "categoryId": $scope.vm.categoryLibraryId,
                                "categoryPid": $scope.vm.categoryLibraryPid,
                                "categoryAttributeName": $("#categoryLibraryAttributeName").val(),
                                "categoryName": $("#categoryLibraryName").val(),
                                "categoryTypeId": $("#categoryLibraryTypeId").val(),
                                "categoryModifierId": categoryModifierId,
                                "categorySceneId": $scope.vm.categoryLibrarySceneId,
                                "categoryLeaf": $scope.vm.categoryLibraryLeaf
                            },function(data){
                                if(responseView(data)==true){
                                    //重新加载
                                    reloadBotLibrary(data,2);
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
        function deleteBotLibrary(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationDevelopment/deleteCategory.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        httpRequestPost("/api/modeling/categorylibrary/deletebycategoryid",{
                            "categoryId": $scope.vm.categoryLibraryId,
                            "categoryPid": $scope.vm.categoryLibraryPid,
                            "categoryLeaf": $scope.vm.categoryLibraryLeaf
                        },function(data){
                            if(responseView(data)==true){
                                //重新加载
                                reloadBotLibrary(data,1);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                }
            });
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
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBotLibrary(data,type){
            if(type!=0){
                $.each($("#library").find("li"),function(index,value){
                    if($(value).find("i").attr("data-option")==$scope.vm.botLibrarySelectValue){
                        console.log($(value).find("i").attr("data-option"));
                        //移除指定元素
                        $(value).remove();
                    }
                });
            }

            if(type==1){
                return;
            }

            if($scope.vm.botLibrarySelectValue=="root"){
                initBot();
            }else{
                $.each($("#library").find("i"),function(index,value){
                    if(type==0){
                        if($(value).attr("data-option")==$scope.vm.botLibrarySelectValue){
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
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
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
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
    }
]);