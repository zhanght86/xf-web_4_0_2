/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('myApplicationModule').controller('botApplyController', [
    '$scope', 'localStorageService','$timeout',"$state" ,"$stateParams","ngDialog",function ($scope,localStorageService,$timeout,$state,$stateParams,ngDialog) {
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            categoryNode:"node",
            categoryEdge:"edge",
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
            categoryLibraryAttributeName: "edge",
            categoryLibraryName: "",
            categoryLibraryPid: "",
            categoryLibraryLeaf: 1,
            reloadBotLibrary:reloadBotLibrary,
            reloadBot:reloadBot,
            disableAttributeTypeForApply:disableAttributeTypeForApply,
            repeatCheckForCategory:repeatCheckForCategory,
            categoryNameNullOrBeyondLimit:"类目名称为空或超过长度限制50"
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
            $("#category").empty();
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;">'+
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
            $("#library").empty();
            httpRequestPost("/api/modeling/categorylibrary/listbycategorypid",{
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;">'+
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span node-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
            $scope.vm.botSelectType = $(this).attr("type-option");
            $scope.vm.categoryLibraryAttributeName = $(this).attr("node-option");
            $(this).attr("style","color:black;font-weight:bold;");
            console.log($scope.vm.botLibrarySelectValue);
            console.log($scope.vm.categoryLibraryAttributeName);
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
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span node-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
        function styleSwitch(type,leaf,attrType){
            var styleHidden = "display: inline-block;";
            if(leaf==0){
                styleHidden="display:none;";
            }
            if(attrType=="node"){
                return "style='"+styleHidden+"position: relative;top: -1px;margin-right: 2px;width: 15px;height: 15px;vertical-align: middle;background-position: left top;background-repeat: no-repeat;background-image: url(../../images/images/aside-nav-icon.png);'";
            }
            var style ='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';
            switch (type){
                case 10008:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
                case 10007:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
                case 10006:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
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
                    initBot();
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
                                reloadBot(data,0);
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
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBot(data,type){
            if(type!=0){
                $.each($(".aside-navs").find("li"),function(index,value){
                    if($(value).find("i").attr("data-option")==$scope.vm.categoryId){
                        var currPid = $(value).attr("data-option");
                        var length = $(value).parent().find("li").length-1;
                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
                        console.log("==========="+length+"=====");
                        if(length==0){
                            $(value).parent().prev().find("i").attr("style","display:none");
                        }
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
                var count=0;
                $.each($(".aside-navs").find("i"),function(index,value){
                    if(type==2){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().prepend(html);
                        }
                    }else if(type==0){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            var obj = $(value).parent().parent().next();
                            var sty = styleSwitch(data.data[0].categoryTypeId,1,data.data[0].categoryAttributeName);
                            sty = sty.substring(7,sty.length-1);
                            console.log("===="+sty);
                            console.log("====obj===="+obj);
                            if($(value).parent().parent().next()!=null){
                                var len = $(value).parent().parent().next().find("li").length;
                                console.log("====len===="+len);
                                if(len>0){
                                    $(value).parent().parent().next().prepend(html);
                                }else{
                                    $(value).parent().parent().next().prepend(html);
                                    $(value).attr("style",sty);
                                }
                            }else{
                                var htmlAppend='<ul class="menus show">'+html+'</ul>';
                                $(value).parent().parent().parent().append(htmlAppend);
                                //加上子节点之后 把开关按钮显示
                                $(value).attr("style",sty);
                            }
                        }
                    }
                });
                if(count==0){
                    initBot();
                }
            }
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
                        if(lengthCheck($("#categoryLibraryNameAdd").val(),0,50)==false){
                            $("#addErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                            return false;
                        }
                        if(repeatCheckForCategory("#addErrorView",0)==false){
                            return false;
                        }
                        console.log("=========="+$("#categoryLibraryNameAdd").val());
                        httpRequestPost("/api/modeling/categorylibrary/add",{
                            "categoryPid": $scope.vm.botLibrarySelectValue,
                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
                            "categoryName": $("#categoryLibraryNameAdd").val(),
                            "categoryTypeId": $("#categoryLibraryTypeIdAdd").val(),
                            "categoryModifierId": categoryModifierId,
                            "categorySceneId": categorySceneId,
                            "categoryLeaf": 0
                        },function(data){
                            if(responseView(data)==true){
                                //重新加载
                                reloadBotLibrary(data,0);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    disableAttributeTypeForApply();
                    $("#categoryLibraryNameAdd").blur(function(){
                        if(lengthCheck($("#categoryLibraryNameAdd").val(),0,50)==false){
                            $("#addErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                        }else{
                            $("#addErrorView").html('');
                            repeatCheckForCategory("#addErrorView",0);
                        }
                    });
                }, 100);
            }
        }
        /**
         * 类目名称城府判断  0:添加时的重复判断 1:修改时的重复判断
         * @param type
         * @returns {boolean}
         */
        function repeatCheckForCategory(selector,type){
            var flag = false;
            var request = new Object();
            if(type==1){
                request.categoryId=$scope.vm.categoryLibraryId;
                request.categoryPid=$scope.vm.categoryLibraryPid;
                request.categoryAttributeName=$("#categoryLibraryName").val();
                request.categoryName=$("#categoryLibraryName").val();
                request.categorySceneId=$scope.vm.categoryLibrarySceneId;
            }else{
                request.categoryPid=$scope.vm.botLibrarySelectValue;
                request.categoryAttributeName=$("#categoryLibraryNameAdd").val();
                request.categoryName=$("#categoryLibraryNameAdd").val();
                request.categorySceneId=categorySceneId;
            }
            httpRequestPostAsync("/api/modeling/categorylibrary/repeatcheck",request,function(data){
                if(responseWithoutView(data)==false){
                    if (data) {
                        $(selector).html(data.info);
                    }
                }else{
                    flag = true;
                }
            },function(err){
                console.log(err);
            });
            return flag;
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
                        if(lengthCheck($("#categoryLibraryName").val(),0,50)==false){
                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                            return false;
                        }
                        if(repeatCheckForCategory("#editErrorView",1)==false){
                            return false;
                        }
                        httpRequestPost("/api/modeling/categorylibrary/updatebycategoryid",{
                            "categoryId": $scope.vm.categoryLibraryId,
                            "categoryPid": $scope.vm.categoryLibraryPid,
                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
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
                    }else{
                    }
                    //初始节点类型
                    $scope.vm.categoryLibraryAttributeName="edge";
                }
            });
            if(dialog){
                $timeout(function () {
                    $("#categoryLibraryName").blur(function(){
                        if(lengthCheck($("#categoryLibraryName").val(),0,50)==false){
                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                        }else{
                            $("#editErrorView").html('');
                            repeatCheckForCategory("#editErrorView",1);
                        }
                    });
                }, 100);
            }
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
                    //初始节点类型
                    $scope.vm.categoryLibraryAttributeName="edge";
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
        //返回状态显示
        function responseWithoutView(data){
            if(data==null){
                return false;
            }
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
                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
                        console.log("==========="+length+"=====");
                        if(length==0){
                            $(value).parent().prev().find("i").attr("style","display:none");
                        }
                        //移除指定元素
                        $(value).remove();
                    }
                });
            }

            if(type==1){
                return;
            }

            if($scope.vm.botLibrarySelectValue=="root"){
                initBotLibrary();
            }else{
                var count = 0;
                $.each($("#library").find("i"),function(index,value){
                    if(type==2){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().prepend(html);
                        }
                    }else if(type==0){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;">'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'">'+data.data[0].categoryName+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            var obj = $(value).parent().parent().next();
                            var sty = styleSwitch(data.data[0].categoryTypeId,1,data.data[0].categoryAttributeName);
                            sty = sty.substring(7,sty.length-1);
                            console.log("===="+sty);
                            console.log("====obj===="+obj);
                            if($(value).parent().parent().next()!=null){
                                var len = $(value).parent().parent().next().find("li").length;
                                console.log("====len===="+len);
                                if(len>0){
                                    $(value).parent().parent().next().prepend(html);
                                }else{
                                    $(value).parent().parent().next().prepend(html);
                                    $(value).attr("style",sty);
                                }
                            }else{
                                var htmlAppend='<ul class="menus show">'+html+'</ul>';
                                $(value).parent().parent().parent().append(htmlAppend);
                                $(value).attr("style",sty);
                            }
                        }
                    }
                });
                if(count==0){
                    initBotLibrary();
                }
            }
        }
        //禁用指定属性类型
        function disableAttributeTypeForApply(){
            $("#categoryLibraryTypeIdAdd").empty();
            var attrArr = [];
            attrArr[0]={name:"默认",value:10009};
            attrArr[1]={name:"流程",value:10008};
            attrArr[2]={name:"划分",value:10007};
            attrArr[3]={name:"属性",value:10006};
            for(var index=0;index<attrArr.length;index++){
                if((attrArr[index].value==$scope.vm.botSelectType)>0){
                    console.log("0==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                    $("#categoryLibraryTypeIdAdd").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                }else{
                    console.log("1==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                    $("#categoryLibraryTypeIdAdd").append('<option disabled="disabled" style="background-color: lightgrey;" value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                }
            }
            $("#categoryLibraryTypeIdAdd").val($scope.vm.botSelectType);
        }
    }
]);89