
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('myApplicationModule').controller('relationalCatalogController',[
    '$scope','localStorageService','$timeout', '$state','$stateParams','ngDialog','$cookieStore',function ($scope,localStorageService,$timeout,$state,$stateParams,ngDialog,$cookieStore) {
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
            botInfo:null,  //bot信息
            addBot:addBot, //添加点击时间
            editBot:editBot,
            deleteBot:deleteBot,
            categoryId: "",
            categoryTypeId: 10009,
            botSelectType:10009,
            categorySceneId: 0,
            categoryAttributeName: "edge",
            categoryName: "",
            categoryPid: "",
            categoryApplicationId: "",
            categoryLeaf: 1,
            botInfoToCategoryAttribute:botInfoToCategoryAttribute,
            clearColor:clearColor,
            repeatCheck:repeatCheck,
            categoryNameNullOrBeyondLimit:"类目名称为空或超过长度限制50",
            searchNode:searchNode,
            recursion:recursion,
            location:location,
            autoHeight:autoHeight
        };
        //setCookie("categoryApplicationId","360619411498860544");
        //setCookie("categoryModifierId","1");
        //setCookie("categorySceneId","10023");
        var categoryApplicationId = $cookieStore.get("applicationId");
        var categoryModifierId = $cookieStore.get("userId");
        var categorySceneId = $cookieStore.get("sceneId");

        autoHeight();

        function autoHeight(){
            var $win = $(window);
            var winHeight = $win.height()*0.75;
            $(".libraryFt").attr("style","width: 450px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: left;");
            $(".libraryRth").attr("style","width: 670px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: right;padding: 30px;");
        }

        var params = {
            "categoryName":$("#category-autocomplete").val(),
            "categoryAttributeName":"node",
            "categoryApplicationId":categoryApplicationId
        };
        console.log("========"+JSON.stringify(params));
        //类目查找自动补全
        $('#category-autocomplete').autocomplete({
            serviceUrl: "/api/modeling/category/searchbycategoryname",
            type:'POST',
            params:params,
            paramName:'categoryName',
            dataType:'json',
            transformResult:function(data){
                var result = new Object();
                var array = [];
                if(data.data){
                    for(var i=0;i<data.data.length;i++){
                        array[i]={
                            data:data.data[i].categoryId,
                            value:data.data[i].categoryName
                        }
                    }
                }
                result.suggestions = array;
                return result;
            },
            onSelect: function(suggestion) {
                console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
                searchNode(suggestion);
                location(suggestion);
            }
        });
        //搜寻节点
        function searchNode(suggestion){
            var currentNodeId = suggestion.data;
            console.log('currentNodeId:'+currentNodeId);
            var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
            console.log($(firstNode).next().html()+"======"+$(firstNode).attr("data-option")+'currentNodeId:'+currentNodeId+"======"+$(firstNode).css("backgroundPosition"));
            if($(firstNode).css("backgroundPosition")=="0% 0%"){
                appendTree(firstNode);
            }else if($(firstNode).parent().parent().next()==null){
                appendTree(firstNode);
            }
            if($(firstNode).attr("data-option")==currentNodeId){
                clearColor();
                $scope.vm.knowledgeBotVal = $(firstNode).next().html();
                $scope.vm.botSelectValue = $(firstNode).next().attr("data-option");
                $scope.vm.botSelectType = $(firstNode).next().attr("type-option");
                $scope.vm.categoryAttributeName = $(firstNode).next().attr("node-option");
                $(firstNode).next().attr("style","color:black;font-weight:bold;");
                console.log($scope.vm.botSelectValue);
                console.log($scope.vm.categoryAttributeName);
                disableAttributeType();
                $scope.$apply();
            }else{
                recursion(suggestion,firstNode);
            }
        }
        function recursion(suggestion,node){
            var list = $(".aside-navs").find("li");
            var flag = false;
            $.each(list,function(index,value){
                if($(value).attr("data-option")==$(node).attr("data-option")){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        console.log("===hit===");
                        clearColor();
                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $scope.vm.categoryAttributeName = $(currNode).next().attr("node-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        console.log($scope.vm.botSelectValue);
                        console.log($scope.vm.categoryAttributeName);
                        disableAttributeType();
                        $scope.$apply();
                        flag = true;
                        //跳出
                        return true;
                    }else{
                        if(flag==true){
                            return true;
                        }
                        //展开
                        if($(currNode).css("backgroundPosition")=="0% 0%"){
                            appendTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendTree(currNode);
                        }
                        //递归
                        recursion(suggestion,currNode);
                    }
                }
            });
        }
        //定位
        function location(suggestion){
            var currentNodeId = suggestion.data;
            var initHeight = 0;
            var sum = $(".aside-navs").find("i").length;
            $.each($(".aside-navs").find("i"),function(index,value){
                if($(value).attr("data-option")==currentNodeId){
                    var sumHeight = sum*$(value).outerHeight();
                    var offset = (initHeight+1/sum)*sumHeight;
                    console.log(sumHeight+"========"+offset);
                    $(".libraryFt").animate({
                        scrollTop:offset+"px"
                    },800);
                    return true;
                }else{
                    initHeight++;
                }
            });
        }
        //加载业务树
        initBot();

        //获取root 数据
        function initBot(){
            $(".aside-navs").empty();
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
                        '<span node-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $(".aside-navs").append(html);
                var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
                if($(firstNode).css("backgroundPosition")=="0% 0%"){
                    appendTree(firstNode);
                }else if($(firstNode).parent().parent().next()==null){
                    appendTree(firstNode);
                }
            },function(){
                console.log("err or err");
            });
        }
        $(".aside-navs").on("click","span",function(){
            clearColor();
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $scope.vm.botSelectType = $(this).attr("type-option");
            $scope.vm.categoryAttributeName = $(this).attr("node-option");
            $(this).attr("style","color:black;font-weight:bold;");
            console.log($scope.vm.botSelectValue);
            console.log($scope.vm.categoryAttributeName);
            disableAttributeType();
            $scope.$apply();
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
                        if(lengthCheck($("#categoryName").val(),0,50)==false){
                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                            return false;
                        }
                        if(repeatCheck("#editErrorView",1)==false){
                            return false;
                        }
                        httpRequestPost("/api/modeling/category/updatebycategoryid",{
                            "categoryId": $scope.vm.categoryId,
                            "categoryApplicationId": $scope.vm.categoryApplicationId,
                            "categoryPid": $scope.vm.categoryPid,
                            "categoryAttributeName": $scope.vm.categoryAttributeName,
                            "categoryName": $("#categoryName").val(),
                            "categoryTypeId": $("#categoryTypeId").val(),
                            "categoryModifierId": categoryModifierId,
                            "categorySceneId": categorySceneId,
                            "categoryLeaf": $scope.vm.categoryLeaf
                        },function(data){
                            if(responseView(data)==true){
                                //重新加载
                                reloadBot(data,2);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                    //还原类目属性类型
                    $scope.vm.categoryAttributeName="edge";
                }
            });
            if(dialog){
                $timeout(function () {
                    $("#categoryName").blur(function(){
                        if(lengthCheck($("#categoryName").val(),0,50)==false){
                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                        }else{
                            $("#editErrorView").html('');
                            repeatCheck("#editErrorView",1);
                        }
                    });
                    //$.each($("#categoryTypeId").find("option"),function(index,value){
                    //    console.log($(value).val() +"======"+ $scope.vm.categoryTypeId);
                    //    if(($(value).val()==$scope.vm.categoryTypeId)>0){
                    //        $("#categoryTypeId").val($scope.vm.categoryTypeId)
                    //        $(value).attr("disabled",null);
                    //        $(value).attr("style","");
                    //    }else{
                    //        $(value).attr("disabled","disabled");
                    //        $(value).attr("style","background-color: lightgrey");
                    //    }
                    //});
                }, 100);
            }
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
                                //重新加载
                                reloadBot(data,1);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                    //还原类目属性类型
                    $scope.vm.categoryAttributeName="edge";
                }
            });
        }
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'i',function(){
            appendTree(this);
        });
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPostAsync("/api/modeling/category/listbycategorypid",{
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
        //类目新增
        function addBot(){
            //数据校验
            if($scope.vm.botSelectValue=="root"){
                return;
            }
            if(lengthCheck($("#category-name").val(),0,50)==false){
                $(".c-error").html($scope.vm.categoryNameNullOrBeyondLimit);
                return;
            }
            if(repeatCheck(".c-error",0)==false){
                return;
            }
            httpRequestPost("/api/modeling/category/add",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": $scope.vm.botSelectValue,
                "categoryAttributeName": $scope.vm.categoryAttributeName,
                "categoryName": $("#category-name").val(),
                "categoryTypeId": $("#category-type").val(),
                "categoryModifierId": categoryModifierId,
                "categorySceneId": categorySceneId,
                "categoryLeaf": 0
            },function(data){
                if(responseView(data)==true){
                    //重新加载
                    $("#category-name").val('');
                    reloadBot(data,0);
                }
            },function(err){
                console.log(err);
            });
        }

        /**
         * 类目名称城府判断  0:添加时的重复判断 1:修改时的重复判断
         * @param type
         * @returns {boolean}
         */
        function repeatCheck(selector,type){
            var flag = false;
            var request = new Object();
            if(type==1){
                request.categoryId=$scope.vm.categoryId;
                request.categoryApplicationId=$scope.vm.categoryApplicationId;
                request.categoryPid=$scope.vm.categoryPid;
                request.categoryAttributeName=$scope.vm.categoryAttributeName;
                request.categoryName=$("#categoryName").val();
                request.categorySceneId=categorySceneId;
            }else{
                request.categoryApplicationId=categoryApplicationId;
                request.categoryPid=$scope.vm.botSelectValue;
                request.categoryAttributeName=$scope.vm.categoryAttributeName;
                request.categoryName=$("#category-name").val();
                request.categorySceneId=categorySceneId;
            }
            httpRequestPostAsync("/api/modeling/category/repeatcheck",request,function(data){
                if(responseWithoutView(data)==false){
                    if(data){
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
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBot(data,type){
            if(type!=0){
                $.each($(".aside-navs").find("li"),function(index,value){
                    if($(value).find("i").attr("data-option")==$scope.vm.categoryId){
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
                            var nodeType = "edge";
                            if(data.data[0].categoryAttributeName=="node"){
                                nodeType = "edge";
                            }else if(data.data[0].categoryAttributeName=="edge"){
                                nodeType = "node";
                            }
                            var sty = styleSwitch(data.data[0].categoryTypeId,1,nodeType);
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
        //属性填充
        function botInfoToCategoryAttribute(){
            if($scope.vm.botInfo){
                var category = eval('(' + $scope.vm.botInfo + ')');
                $scope.vm.botSelectValue=category.categoryId;
                $scope.vm.categoryId=category.categoryId;
                $scope.vm.categoryTypeId=category.categoryTypeId;
                categorySceneId=category.categorySceneId;
                $scope.vm.categoryName=category.categoryName;
                $scope.vm.categoryAttributeName=category.categoryAttributeName;
                $scope.vm.categoryPid=category.categoryPid;
                $scope.vm.categoryApplicationId=category.categoryApplicationId;
                $scope.vm.categoryLeaf=category.categoryLeaf;
            }
        }
        //禁用指定属性类型
        function disableAttributeType(){
            $.each($("#category-type").find("option"),function(index,value){
                if($scope.vm.categoryAttributeName=="node"){
                    $(value).attr("disabled",null);
                    $(value).attr("style","");
                }else{
                    console.log($(value).val() +"======"+ $scope.vm.botSelectType);
                    if(($(value).val()==$scope.vm.botSelectType)>0){
                        $("#category-type").val($scope.vm.botSelectType)
                        $(value).attr("disabled",null);
                        $(value).attr("style","");
                    }else{
                        $(value).attr("disabled","disabled");
                        $(value).attr("style","background-color: lightgrey");
                    }
                }
            });
        }
        //清除已选颜色
        function clearColor(){
            $.each($(".aside-navs").find("span"),function(index,value){
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
        $("#category-name").blur(function(){
            if(lengthCheck($("#category-name").val(),0,50)==false){
                $(".c-error").html($scope.vm.categoryNameNullOrBeyondLimit);
            }else{
                $(".c-error").html('');
                repeatCheck(".c-error",0);
            }
        });
    }
]);