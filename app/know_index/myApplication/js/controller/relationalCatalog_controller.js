
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
            botSelectType:10009,
            categorySceneId: 0,
            categoryAttributeName: "",
            categoryName: "",
            categoryPid: "",
            categoryApplicationId: "",
            categoryLeaf: 1,
            botInfoToCategoryAttribute:botInfoToCategoryAttribute,
            clearColor:clearColor,
            repeatCheck:repeatCheck,
            categoryNameNullOrBeyondLimit:"类目名称为空或超过长度限制50"
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");

        var params = {
            "categoryName":$("#category-autocomplete").val(),
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
            }
        });
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
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+JSON.stringify(data.data[i])+'><img class="edit" src="images/bot-edit.png"/><img class="delete" style="width: 12px;" src="images/detel.png"/></p>'+
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
            clearColor();
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $scope.vm.botSelectType = $(this).attr("type-option");
            $(this).attr("style","color:black;font-weight:bold;");
            console.log($scope.vm.botSelectValue);
            disableAttributeType();
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
                            "categoryAttributeName": $("#categoryName").val(),
                            "categoryName": $("#categoryName").val(),
                            "categoryTypeId": $("#categoryTypeId").val(),
                            "categoryModifierId": categoryModifierId,
                            "categorySceneId": $scope.vm.categorySceneId,
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
                                '<span type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
                "categoryAttributeName": $("#category-name").val(),
                "categoryName": $("#category-name").val(),
                "categoryTypeId": $("#category-type").val(),
                "categoryModifierId": categoryModifierId,
                "categorySceneId": categorySceneId,
                "categoryLeaf": 0
            },function(data){
                if(responseView(data)==true){
                    //重新加载
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
                request.categoryAttributeName=$("#categoryName").val();
                request.categoryName=$("#categoryName").val();
                request.categorySceneId=$scope.vm.categorySceneId;
            }else{
                request.categoryApplicationId=categoryApplicationId;
                request.categoryPid=$scope.vm.botSelectValue;
                request.categoryAttributeName=$("#category-name").val();
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
                    if($(value).find("i").attr("data-option")==$scope.vm.botSelectValue){
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
                    if(type==0){
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
                            if($(value).parent().parent().next()){
                                $(value).parent().parent().next().prepend(html);
                            }else{
                                var htmlAppend='<ul class="menus show">'+html+'</ul>';
                                $(value).parent().parent().parent().append(htmlAppend);
                            }
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
                $scope.vm.categorySceneId=category.categorySceneId;
                $scope.vm.categoryAttributeName=category.categoryAttributeName;
                $scope.vm.categoryName=category.categoryName;
                $scope.vm.categoryPid=category.categoryPid;
                $scope.vm.categoryApplicationId=category.categoryApplicationId;
                $scope.vm.categoryLeaf=category.categoryLeaf;
            }
        }
        //禁用指定属性类型
        function disableAttributeType(){
            $.each($("#category-type").find("option"),function(index,value){
                console.log($(value).val() +"======"+ $scope.vm.botSelectType);
                if(($(value).val()==$scope.vm.botSelectType & $scope.vm.botSelectType!=10009)>0){
                    $(value).attr("disabled","disabled");
                    $(value).attr("style","background-color: lightgrey");
                }else{
                    $(value).attr("disabled",null);
                    $(value).attr("style","");
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