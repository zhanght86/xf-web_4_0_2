/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */
angular.module('myApplicationModule').controller('botApplyController', [
    '$scope', 'localStorageService','$timeout',"$state" ,"$stateParams","ngDialog","$cookieStore",'$interval',function ($scope,localStorageService,$timeout,$state,$stateParams,ngDialog,$cookieStore,$interval) {
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
            categoryTypeId: 163,
            botSelectType:163,
            categorySceneId: 0,
            categoryAttributeName: "edge",
            categoryName: "",
            categoryPid: "",
            categoryApplicationId: "",
            categoryLeaf: 1,
            botLibraryInfo:null,  //bot信息
            addBotLibrary:addBotLibrary, //添加点击时间
            editBotLibrary:editBotLibrary,
            deleteBotLibrary:deleteBotLibrary,
            categoryLibraryId: "",
            categoryLibraryTypeId: 163,
            botLibrarySelectType:163,
            categoryLibrarySceneId: 0,
            categoryLibraryAttributeName: "edge",
            categoryLibraryName: "",
            categoryLibraryPid: "",
            categoryLibraryDescribe: "",
            categoryLibraryLeaf: 1,
            reloadBotLibrary:reloadBotLibrary,
            reloadBot:reloadBot,
            disableAttributeTypeForApply:disableAttributeTypeForApply,
            repeatCheckForCategory:repeatCheckForCategory,
            categoryNameNullOrBeyondLimit:"类目名称为空或超过长度限制50",
            categoryDescribeBeyondLimit:"描述超过长度限制2000",
            responseView:responseView,
            searchNodeForBot:searchNodeForBot,
            recursionForBot:recursionForBot,
            autoHeightForBot:autoHeightForBot,
            locationForBot:locationForBot,
            suggestionValue:"",
            suggestionData:"",
            winHeight:0
        };

        var categoryApplicationId = $cookieStore.get("applicationId");
        var categoryModifierId = $cookieStore.get("userId");
        var categorySceneId = $cookieStore.get("sceneId");

        autoHeightForBot();

        function autoHeightForBot(){
            var $win = $(window);
            var winHeight = $win.height()*0.75;
            $scope.vm.winHeight=winHeight+5;
            $(".libraryFt").attr("style","width: 450px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: left;");
            $(".library_mid").attr("style","width: 200px;height: "+winHeight+"px;background: #fff;padding: 50px 20px;");
            $(".libraryRth").attr("style","width: 670px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: right;padding: 30px;");
        }

        var params = {
            "categoryName":$("#category-autocomplete").val(),
            "categoryAttributeName":"node",
            "categorySceneId":categorySceneId
        };
        console.log("========"+toCategoryLibraryString(params));
        //类目查找自动补全
        $('#category-autocomplete').autocomplete({
            serviceUrl: "/api/ms/modeling/categorylibrary/searchbycategoryname",
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
                searchNodeForBot(suggestion);
                $scope.vm.suggestionValue=suggestion.value;
                $scope.vm.suggestionData=suggestion.data;
            }
        });
        $interval(function(){
            console.log("===suggestionData===:"+$scope.vm.suggestionData);
            if($scope.vm.suggestionData){
                var suggestion = new Object();
                suggestion.value=$scope.vm.suggestionValue;
                suggestion.data=$scope.vm.suggestionData;
                if(locationForBotFlag(suggestion)){
                    locationForBot(suggestion);
                    $scope.vm.suggestionValue="";
                    $scope.vm.suggestionData="";
                }
            }
        },100);
        function locationForBot(suggestion){
            var currentNodeId = suggestion.data;
            var initHeight = 0;
            var sum = $("#library").find("i").length;
            $.each($("#library").find("i"),function(index,value){
                if($(value).attr("data-option")==currentNodeId){
                    var lib = $(".libraryFt");
                    var scrollHeight=0;
                    if(lib.length>0){
                        scrollHeight = lib[0].scrollHeight;
                    }
                    var offset = 0;
                    if(scrollHeight-100>0){
                        offset = (((initHeight+1)/sum)*(scrollHeight-100));
                    }
                    console.log("===location==="+offset+"===="+sum);
                    $(".libraryFt").animate({
                        scrollTop:offset+"px"
                    },800);
                    return false;
                }else{
                    initHeight++;
                }
            });
        }
        function locationForBot(suggestion){
            var currentNodeId = suggestion.data;
            var initHeight = 0;
            var sum = $("#library").find("i").length;
            $.each($("#library").find("i"),function(index,value){
                if($(value).attr("data-option")==currentNodeId){
                    var lib = $(".libraryFt");
                    var scrollHeight=0;
                    if(lib.length>0){
                        scrollHeight = lib[0].scrollHeight;
                    }
                    var offset = 0;
                    if(scrollHeight-100>0){
                        offset = (((initHeight+1)/sum)*(scrollHeight-100));
                    }
                    console.log("===location==="+offset+"===="+sum);
                    $(".libraryFt").animate({
                        scrollTop:offset+"px"
                    },800);
                    return false;
                }else{
                    initHeight++;
                }
            });
        }
        function locationForBotFlag(suggestion){
            var currentNodeId = suggestion.data;
            var flag = false;
            var sum = $("#library").find("i").length;
            $.each($("#library").find("i"),function(index,value){
                if($(value).attr("data-option")==currentNodeId){
                    console.log(currentNodeId+"===exists===");
                    var lib = $(".libraryFt");
                    var scrollHeight=0;
                    if(lib.length>0){
                        scrollHeight = lib[0].scrollHeight;
                    }
                    if(sum>=10 && scrollHeight>=$scope.vm.winHeight){
                        flag = true;
                    }else if(sum<10){
                        flag = true;
                    }
                    return false;
                }
            });
            return flag;
        }
        //搜寻节点
        function searchNodeForBot(suggestion){
            var currentNodeId = suggestion.data;
            console.log('currentNodeId:'+currentNodeId);
            var firstNode = $("#library").find("i").filter(":eq(0)");
            console.log($(firstNode).next().html()+"======"+$(firstNode).attr("data-option")+'currentNodeId:'+currentNodeId+"======"+$(firstNode).css("backgroundPosition"));
            if($(firstNode).css("backgroundPosition")=="0% 0%"){
                appendLibraryTree(firstNode);
            }else if($(firstNode).parent().parent().next()==null){
                appendLibraryTree(firstNode);
            }
            if($(firstNode).attr("data-option")==currentNodeId){
                clearColorLibrary();
                $scope.vm.knowledgeBotLibraryVal = $(firstNode).next().html();
                $scope.vm.botLibrarySelectValue = $(firstNode).next().attr("data-option");
                $scope.vm.botSelectType = $(firstNode).next().attr("type-option");
                $scope.vm.categoryLibraryAttributeName = $(firstNode).next().attr("node-option");
                $(firstNode).next().attr("style","color:black;font-weight:bold;");
                console.log($scope.vm.botLibrarySelectValue);
                console.log($scope.vm.categoryLibraryAttributeName);
                $scope.$apply();
            }else{
                recursionForBot(suggestion,firstNode);
            }
        }
        function recursionForBot(suggestion,node){
            var list = $("#library").find("li");
            var flag = false;
            $.each(list,function(index,value){
                if($(value).attr("data-option")==$(node).attr("data-option")){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        console.log("===hit===");
                        clearColorLibrary();
                        $scope.vm.knowledgeBotLibraryVal = $(currNode).next().html();
                        $scope.vm.botLibrarySelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $scope.vm.categoryLibraryAttributeName = $(currNode).next().attr("node-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        console.log($scope.vm.botLibrarySelectValue);
                        console.log($scope.vm.categoryLibraryAttributeName);
                        $scope.$apply();
                        flag = true;
                        //跳出
                        return true;
                    }else{
                        if(flag==true){
                            return true;
                        }
                        //展开
                        console.log("==="+$(currNode).css("backgroundPosition"));
                        if($(currNode).css("backgroundPosition")=="0% 0%"){
                            appendLibraryTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendLibraryTree(currNode);
                        }
                        //递归
                        recursionForBot(suggestion,currNode);
                    }
                }
            });
        }
        //加载业务树
        initBot();
        initBotLibrary();
        //获取root 数据
        function initBot(){
            $("#category").empty();
            httpRequestPostAsync("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;data.data != null && i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].categoryDescribe)+'>'+
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' type-option="'+data.data[i].categoryTypeId+'" node-option="'+data.data[i].categoryAttributeName+'" data-option="'+data.data[i].categoryId+'" title="'+data.data[i].categoryName+'">'+subStringWithTail(data.data[i].categoryName,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+'><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $("#category").append(html);
                var firstNode = $("#category").find("i").filter(":eq(0)");
                if($(firstNode).css("backgroundPosition")=="0% 0%"){
                    appendTree(firstNode);
                }else if($(firstNode).parent().parent().next()==null){
                    appendTree(firstNode);
                }
            },function(){
                console.log("err or err");
            });
        }
        function initBotLibrary(){
            $("#library").empty();
            httpRequestPost("/api/ms/modeling/categorylibrary/listbycategorypid",{
                "categoryPid": "root",
                "categorySceneId": categorySceneId,
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;data.data != null && i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].categoryDescribe)+'>'+
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' node-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'" title="'+data.data[i].categoryName+'">'+subStringWithTail(data.data[i].categoryName,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryLibraryString(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $("#library").append(html);
                var firstNode = $("#library").find("i").filter(":eq(0)");
                if($(firstNode).css("backgroundPosition")=="0% 0%"){
                    appendLibraryTree(firstNode);
                }else if($(firstNode).parent().parent().next()==null){
                    appendLibraryTree(firstNode);
                }
            },function(){
                console.log("err or err");
            });
        }
        //节点样式转换
        function nodeStyleSwitch(attrType){
            console.log("===nodeStyleSwitch===");
            if(attrType=="edge"){
                return "style='color:#ED7D31;'";
            }else{
                return "";
            }
        }
        //显示节点描述
        function categoryDescribeView(describeStr){
            console.log("===describe===");
            if(nullCheck(describeStr)==true){
                return "title='"+describeStr+"'";
            }
            return "";
        }
        $("#category").on("click","span",function(){
            clearColor();
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $scope.vm.categoryAttributeName = $(this).attr("node-option");
            if($scope.vm.categoryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if($scope.vm.categoryAttributeName=="edge"){
                $(this).attr("style","color:#ED7D31;font-weight:bold;");
            }
            console.log($scope.vm.botSelectValue);
            console.log($scope.vm.categoryAttributeName);
            $scope.$apply()
        });
        $("#library").on("click","span",function(){
            clearColorLibrary();
            $scope.vm.knowledgeBotLibraryVal = $(this).html();
            $scope.vm.botLibrarySelectValue = $(this).attr("data-option");
            $scope.vm.botSelectType = $(this).attr("type-option");
            $scope.vm.categoryLibraryAttributeName = $(this).attr("node-option");
            if($scope.vm.categoryLibraryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if($scope.vm.categoryLibraryAttributeName=="edge"){
                $(this).attr("style","color:#ED7D31;font-weight:bold;");
            }
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
                httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                    "categoryApplicationId": categoryApplicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' type-option="'+data.data[i].categoryTypeId+'" node-option="'+data.data[i].categoryAttributeName+'" data-option="'+data.data[i].categoryId+'" title="'+data.data[i].categoryName+'">'+subStringWithTail(data.data[i].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+'><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                httpRequestPostAsync("/api/ms/modeling/categorylibrary/listbycategorypid",{
                    "categoryPid": id
                },function(data){
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                            html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' node-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'" title="'+data.data[i].categoryName+'">'+subStringWithTail(data.data[i].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryLibraryString(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                if($(this).attr("node-option")=="node"){
                    $(this).attr("style","");
                }else if($(this).attr("node-option")=="edge"){
                    $(this).attr("style","color:#ED7D31;");
                }
            });
        }
        //清除已选颜色
        function clearColor(){
            $.each($("#category").find("span"),function(index,value){
                if($(this).attr("node-option")=="node"){
                    $(this).attr("style","");
                }else if($(this).attr("node-option")=="edge"){
                    $(this).attr("style","color:#ED7D31;");
                }
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
                case 161:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
                case 160:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
                case 162:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
            }
            return style;
        }
        //套用
        function applyCategory(){
            console.log($scope.vm.botLibrarySelectValue);
            console.log($scope.vm.botSelectValue);
            if(applyValid()==false){
                return;
            }
            httpRequestPost("/api/ms/modeling/categorylibrary/applycategorybyid",{
                "categoryId": $scope.vm.botLibrarySelectValue,
                "categoryPid": $scope.vm.botSelectValue,
                "categoryApplicationId": categoryApplicationId,
                "categoryModifierId": categoryModifierId
            },function(data){
                if(responseView(data)==true){
                    initBot();
                }
            },function(err){
                console.log(err);
            });
        }
        //套用验证
        function applyValid(){
            //rule edge->node
            if($scope.vm.botLibrarySelectValue=="root"){
                layer.msg("请选择要套用的bot节点");
                return false;
            }
            console.log($scope.vm.categoryAttributeName+"===="+$scope.vm.categoryLibraryAttributeName);
            if($scope.vm.categoryAttributeName==$scope.vm.categoryLibraryAttributeName){
                if($scope.vm.categoryAttributeName=="edge"){
                    layer.msg("关系以下必须添加节点");
                }else{
                    layer.msg("节点以下必须添加关系");
                }
                return false;
            }
            return true;
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
                        httpRequestPost("/api/ms/modeling/category/deletebycategoryid",{
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
                }
            });
        }
        //属性填充
        function botInfoToCategoryAttribute(){
            if($scope.vm.botInfo){
                var category = JSON.parse($scope.vm.botInfo);
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
                var category = JSON.parse($scope.vm.botLibraryInfo);
                $scope.vm.botLibrarySelectValue=category.categoryId;
                $scope.vm.categoryLibraryId=category.categoryId;
                $scope.vm.categoryLibraryTypeId=category.categoryTypeId;
                $scope.vm.categoryLibrarySceneId=category.categorySceneId;
                $scope.vm.categoryLibraryAttributeName=category.categoryAttributeName;
                $scope.vm.categoryLibraryName=category.categoryName;
                $scope.vm.categoryLibraryPid=category.categoryPid;
                if(nullCheck(category.categoryDescribe)==true){
                    $scope.vm.categoryLibraryDescribe=underlineToWhiteSpace(category.categoryDescribe);
                }
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
                        if(length==0 && type==1){
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
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[0].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'" title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().append(html);
                        }
                    }else if(type==0){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[0].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'" title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                                    $(value).parent().parent().next().append(html);
                                }else{
                                    $(value).parent().parent().next().append(html);
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
                        if(nullCheck($("#categoryLibraryDescribe").val())==true){
                            if(lengthCheck($("#categoryLibraryDescribe").val(),0,2000)==false){
                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
                                return false;
                            }else{
                                $scope.vm.categoryLibraryDescribe=$("#categoryLibraryDescribe").val();
                            }
                        }
                        console.log("=========="+$("#categoryLibraryNameAdd").val());
                        httpRequestPost("/api/ms/modeling/categorylibrary/add",{
                            "categoryPid": $scope.vm.botLibrarySelectValue,
                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
                            "categoryName": $("#categoryLibraryNameAdd").val(),
                            "categoryTypeId": $("#categoryLibraryTypeIdAdd").val(),
                            "categoryModifierId": categoryModifierId,
                            "categoryDescribe": $scope.vm.categoryLibraryDescribe,
                            "categorySceneId": categorySceneId,
                            "categoryLeaf": 0
                        },function(data){
                            if(responseView(data)==true){
                                //重新加载
                                reloadBotLibrary(data,0);
                            }
                            $("#categoryLibraryDescribe").val('');
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
                request.categorySceneId=categorySceneId;
            }else{
                request.categoryPid=$scope.vm.botLibrarySelectValue;
                request.categoryAttributeName=$("#categoryLibraryNameAdd").val();
                request.categoryName=$("#categoryLibraryNameAdd").val();
                request.categorySceneId=categorySceneId;
            }
            httpRequestPostAsync("/api/ms/modeling/categorylibrary/repeatcheck",request,function(data){
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
                        if(nullCheck($("#categoryLibraryDescribe").val())==true){
                            if(lengthCheck($("#categoryLibraryDescribe").val(),0,2000)==false){
                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
                                return false;
                            }else{
                                $scope.vm.categoryLibraryDescribe=$("#categoryLibraryDescribe").val();
                            }
                        }
                        httpRequestPost("/api/ms/modeling/categorylibrary/updatebycategoryid",{
                            "categoryId": $scope.vm.categoryLibraryId,
                            "categoryPid": $scope.vm.categoryLibraryPid,
                            "categoryAttributeName": $scope.vm.categoryLibraryAttributeName,
                            "categoryName": $("#categoryLibraryName").val(),
                            "categoryTypeId": $("#categoryLibraryTypeId").val(),
                            "categoryModifierId": categoryModifierId,
                            "categoryDescribe": $scope.vm.categoryLibraryDescribe,
                            "categorySceneId": categorySceneId,
                            "categoryLeaf": $scope.vm.categoryLibraryLeaf
                        },function(data){
                            if(responseView(data)==true){
                                //重新加载
                                reloadBotLibrary(data,2);
                            }
                            $("#categoryLibraryDescribe").val('')
                        },function(err){
                            console.log(err);
                        });
                    }else{
                    }
                    //初始节点类型
                    //$scope.vm.categoryLibraryAttributeName="edge";
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
                    $("#categoryLibraryTypeId").empty();
                    var attrArr = [];
                    attrArr[0]={name:"默认",value:163};
                    attrArr[1]={name:"流程",value:161};
                    attrArr[2]={name:"划分",value:160};
                    attrArr[3]={name:"属性",value:162};
                    for(var index=0;index<attrArr.length;index++){
                        if($scope.vm.categoryLibraryAttributeName=="edge"){
                            console.log("0==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                            $("#categoryLibraryTypeId").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                        }else{
                            if((attrArr[index].value==$scope.vm.botSelectType)>0){
                                console.log("0==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                                $("#categoryLibraryTypeId").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                            }else{
                                console.log("1==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                                $("#categoryLibraryTypeId").append('<option disabled="disabled" style="background-color: lightgrey;" value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                            }
                        }
                    }
                    $("#categoryLibraryTypeId").val($scope.vm.botSelectType);
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
                        httpRequestPost("/api/ms/modeling/categorylibrary/deletebycategoryid",{
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
                        if(length==0 && type==1){
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
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[0].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'"title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryLibraryString(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().append(html);
                        }
                    }else if(type==0){
                        if($(value).attr("data-option")==data.data[0].categoryPid){
                            count++;
                            var html = '<li data-option="'+data.data[0].categoryPid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[0].categoryDescribe)+'>'+
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'"title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryLibraryString(data.data[0])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
                                    $(value).parent().parent().next().append(html);
                                }else{
                                    $(value).parent().parent().next().append(html);
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
            attrArr[0]={name:"默认",value:163};
            attrArr[1]={name:"流程",value:161};
            attrArr[2]={name:"划分",value:160};
            attrArr[3]={name:"属性",value:162};
            for(var index=0;index<attrArr.length;index++){
                if($scope.vm.categoryLibraryAttributeName=="node"){
                    console.log("0==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                    $("#categoryLibraryTypeIdAdd").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                }else{
                    if((attrArr[index].value==$scope.vm.botSelectType)>0){
                        console.log("0==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                        $("#categoryLibraryTypeIdAdd").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                    }else{
                        console.log("1==="+attrArr[index].value+"=="+$scope.vm.botSelectType);
                        $("#categoryLibraryTypeIdAdd").append('<option disabled="disabled" style="background-color: lightgrey;" value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                    }
                }
            }
            $("#categoryLibraryTypeIdAdd").val($scope.vm.botSelectType);
        }
    }
]);89