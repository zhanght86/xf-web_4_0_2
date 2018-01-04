/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module : 类目库
 */
module.exports = businessModelingModule =>{
    businessModelingModule
    .controller('BotController',[
    '$scope','localStorageService','BusinessModelingServer','$timeout', '$state','$stateParams','ngDialog','$cookieStore','$interval','$http',
    ($scope,localStorageService,BusinessModelingServer,$timeout,$state,$stateParams,ngDialog,$cookieStore,$interval,$http)=> {
        $scope.vm = {
            success : 200,
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
            categoryTypeId: 160,
            botSelectType:160,
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
            notContainHtmlLabel:"不能包含HTML标签",
            categoryDescribeBeyondLimit:"描述内容超过长度限制2000",
            searchNode:searchNode,
            recursion:recursion,
            location:location,
            autoHeight:autoHeight,
            downloadTemplate:downloadTemplate,
            exportAll:exportAll,
            batchUpload:batchUpload,
            categoryDescribe:"",
            suggestionValue:"",
            suggestionData:"",
            categoryRootPid:"",
            winHeight:0
        };

        //搜索
      

         BusinessModelingServer.classifyGetPath.get({
         	name:"测试"
         },function(data){
            console.log(data)
         })


        var categoryApplicationId = APPLICATION_ID;
        var categoryModifierId = USER_ID;
        //var categorySceneId = SCENE_ID;
        autoHeight();
        function autoHeight(){
            var $win = $(window);
            var winHeight = $win.height()*0.75;
            $scope.vm.winHeight=winHeight+5;
            $(".libraryFt").attr("style","width: 450px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: left;");
            $(".libraryRth").attr("style","width: 720px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: right;padding: 30px;");
        }

        var params = {
            "name":$("#category-autocomplete").val().trim(),
        };
        //类目查找自动补全
        $('#category-autocomplete').autocomplete({
            serviceUrl: "/api/ms/classify/get/path",
            type:'GET',
            params:params,
            paramName:'name',
            dataType:'json',
            transformResult:function(data){
                var result = new Object();
                var array = [];
                if(data.data){
                    for(var i=0;i<data.data.length;i++){
                        array[i]={
                            data:data.data[i].id,
                            value:data.data[i].name
                        }
                    }
                }
                result.suggestions = array;
                return result;
            },
            onSelect: function(suggestion) {
                searchNode(suggestion);
                $scope.vm.suggestionValue=suggestion.value;
                $scope.vm.suggestionData=suggestion.data;
            }
        });
        $interval(function(){
            if(nullCheck($scope.vm.suggestionData)==true){
                var suggestion = new Object();
                suggestion.value=$scope.vm.suggestionValue;
                suggestion.data=$scope.vm.suggestionData;
                if(locationFlag(suggestion)){
                    location(suggestion);
                    $scope.vm.suggestionValue="";
                    $scope.vm.suggestionData="";
                }
            }
        },2000);
        //搜寻节点
        function searchNode(suggestion){
        	console.log(suggestion)
            var currentNodeId = suggestion.data;
            var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
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
                updateCreateMethod($scope.vm.knowledgeBotVal,$scope.vm.categoryAttributeName);
                disableAttributeType();
                $scope.$apply();
            }else{
                recursion(suggestion,firstNode);
            }
        }
        function recursion(suggestion,node){
            var list = $(".aside-navs").find("li");
            console.log(list.length)
            var flag = false;
            $.each(list,function(index,value){
                if($(value).attr("data-option")==$(node).attr("data-option")){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        clearColor();
                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $scope.vm.categoryAttributeName = $(currNode).next().attr("node-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        updateCreateMethod($scope.vm.knowledgeBotVal,$scope.vm.categoryAttributeName);
                        disableAttributeType();
                        $scope.$apply();
                        flag = true;
                        //跳出
                        return false;
                    }else{
                        //展开
                        if($(currNode).css("backgroundPosition")=="0% 0%"){
                            appendTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendTree(currNode);
                        }
                        if(flag==true){
                            return false;
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
                    var lib = $(".libraryFt");
                    var scrollHeight=0;
                    if(lib.length>0){
                        scrollHeight = lib[0].scrollHeight;
                    }
                    var offset = 0;
                    if(scrollHeight-100>0){
                        offset = (((initHeight+1)/sum)*(scrollHeight-100));
                    }
                    $(".libraryFt").animate({
                        scrollTop:offset+"px"
                    },800);
                    return false;
                }else{
                    initHeight++;
                }
            });
        }
        function locationFlag(suggestion){
            var currentNodeId = suggestion.data;
            var flag = false;
            var sum = $(".aside-navs").find("i").length;
            $.each($(".aside-navs").find("i"),function(index,value){
                if($(value).attr("data-option")==currentNodeId){
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

        //加载业务树
        initBot();
        //获取root 数据
        function initBot(){
            $(".aside-navs").empty();
            $http.get('api/ms/classify/get/children/root').success(function(data,status,headers,congfig){
              console.log(data)
                var html =  '<ul class="menus show">';
                for(var i=0;data.data != null && i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].id+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].relation)+'>'+
                        '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
            });
        }
        $(".aside-navs").on("click","span",function(){

            clearColor();
            $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $scope.vm.botSelectType = $(this).attr("type-option");
            $scope.vm.categoryAttributeName = $(this).attr("node-option");
            $scope.vm.categoryId=$(this).attr("id-option");
            $scope.vm.categoryPid=$(this).attr("pid-option")
            if($scope.vm.categoryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if($scope.vm.categoryAttributeName=="edge"){
                $(this).attr("style","color:#ED7D31;font-weight:bold;");
            }
            updateCreateMethod($scope.vm.knowledgeBotVal,$scope.vm.categoryAttributeName);
            disableAttributeType();
             alert( $scope.vm.categoryAttributeName)
            $scope.$apply();
        });

        //更新新建方法
        function updateCreateMethod(knowledgeBotVal,categoryAttributeName){
            if(categoryAttributeName=="node"){
                $("#createMethod").html("新建关系到"+knowledgeBotVal+"下面");
            }else if(categoryAttributeName=="edge"){
                $("#createMethod").html("新建节点到"+knowledgeBotVal+"下面");
            }
        }
        $(".aside-navs").on("click",".edit",function(){
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
             console.log($(this).parent().attr("bot-type"))
             $scope.vm.categoryName=$(this).parent().attr("bot-name");
             $scope.vm.categoryTypeId=$(this).parent().attr("bot-type");
             $scope.vm.categoryDescribe=$(this).parent().attr("bot-depict")
           botInfoToCategoryAttribute();
            editBot($(this).parent().attr("bot-pid"),$(this).parent().attr("bot-id"));
        });


        function editBot(pid,id){
        	var pid=pid;
        	var id=id;
        	//alert(pid)
            if(pid==""){
            	var editpid="root";
            	var relation="node";
            }else if (pid=="root"){
                var editpid= id;
            	var relation="node"
            }else{
            	var editpid= pid;
            	var relation="node"
            }
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/bot/edit_category.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){  //关闭回调
                    if(e===1){
                        if(lengthCheck($("#categoryName").val(),0,50)==false){
                            $("#editErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                            return false;
                        }
                       
                        if(isHtmlLabel($("#categoryName").val())){
                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
                            return false;
                        }
                        if(nullCheck($("#categoryDescribe").val())==true){
                            if(lengthCheck($("#categoryDescribe").val(),0,2000)==false){
                                $("#categoryDescribeError").html($scope.vm.categoryDescribeBeyondLimit);
                                return false;
                            }else if(isHtmlLabel($("#categoryDescribe").val())){
                                $("#categoryDescribeError").html($scope.vm.notContainHtmlLabel);
                                return false;
                            }else{
                                $scope.vm.categoryDescribe=$("#categoryDescribe").val().trim();
                            }
                        }
                        BusinessModelingServer.classifyUpdate.save({
                            "id": id,
                            "pid": editpid,
                            "name": $("#categoryName").val().trim(),
                            "type": $("#categoryTypeId").val(),
                            "depict": $scope.vm.categoryDescribe,
                            "leaf": 0,
                            "relation":relation,
                        },function(data){
                             if(data.status==200){
                             	layer.msg(data.info)
                               //重新加载
                                reloadBot(data,0);
                             }else if(data.status==500){
                                layer.msg(data.info)
                             }
                                
                            
                        })
                      
                    }else{
                    }
                    //还原类目属性类型
                    $scope.vm.categoryDescribe="";
                    $scope.vm.categoryAttributeName="edge";
                }
            });
           
        }
        $(".aside-navs").on("click",".delete",function(){
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
            botInfoToCategoryAttribute();
            deleteBot($(this).parent().attr("bot-id"));
        });

        //节点删除
        function deleteBot(categoryId){
        	var categoryId=categoryId;
        	//alert(categoryId)
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/bot/delete_category.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                    $http.post("api/ms/classify/delete/"+categoryId+"").success(function(data){
                    	console.log(data)
                    	if(data.status==200){
                    		layer.msg(data.info)
                    		reloadBot(data,1);
                    	}else if(data.status==500){
                    		layer.msg(data.info)
                    	}
                    })
                      
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
               $http.get('api/ms/classify/get/children/'+""+id+"").success(function(data,status,headers,congfig){
                	console.log(data)
                    if(data.data){
                        var html = '<ul class="menus">';
                        for(var i=0;i<data.data.length;i++){
                             html+= '<li data-option="'+data.data[i].id+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].relation)+'>'+
                        '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        that.parent().parent().next().slideDown();
                    }
                },function(err){
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
                $("#category-name-error").html($scope.vm.categoryNameNullOrBeyondLimit);
                return;
            }
            if(isHtmlLabel($("#category-name").val())){
                $("#category-name-error").html($scope.vm.notContainHtmlLabel);
                return;
            }
            // if(repeatCheck("#category-name-error",0)==false){
            //     return;
            // }
            if(nullCheck($("#category-describe").val())==true){
                if(lengthCheck($("#category-describe").val(),0,2000)==false){
                    $("#category-describe-error").html($scope.vm.categoryDescribeBeyondLimit);
                    return;
                }else if(isHtmlLabel($("#category-describe").val())){
                    $("#category-describe-error").html($scope.vm.notContainHtmlLabel);
                    return;
                }else{
                    $scope.vm.categoryDescribe=$("#category-describe").val().trim();
                }
            }
            if($scope.vm.categoryPid==""){
            	var pid="root";
            	var relation="node";
            }else if($scope.vm.categoryPid=="root"){
                var pid= $scope.vm.categoryId;
            	var relation= ($scope.vm.categoryAttributeName=="node") ? "edge" :"node"
            }else{
            	var pid= $scope.vm.categoryId;
            	var relation= ($scope.vm.categoryAttributeName=="node") ? "edge" :"node"
            }
            
	          BusinessModelingServer.classifyAdd.save({
	                  "leaf": 0,
					  "name":$("#category-name").val().trim(),
					  "pid":pid,
					  "relation": relation,
					  "type": $("#category-type").val(),
					  "depict":$("#category-describe").val(),
	            },function(data){
	            	 console.log(data)
	            	 if(data.status==200){
						  $("#category-name").val('');
		                    reloadBot(data,0);
		                  $("#category-describe").val('');
		                  $scope.vm.categoryRootPid=data.data;
	            	 }else if(data.status==500){
	            	 	  layer.msg(data.info)
	            	 }
	            	
                },function(err){
	            })

         
            $scope.vm.categoryDescribe="";
        }

        /**
         * 类目名称城府判断  0:添加时的重复判断 1:修改时的重复判断
         * @param type
         * @returns {boolean}
         */
        function repeatCheck(selector,type){
            var flag = false;
            var request = new Object();
           // alert(type)
            console.log($scope.vm.categoryId)
            if(type==1){
                request.id=$scope.vm.categoryId;
                request.applicationId=APPLICATION_ID;
                request.pid=$scope.vm.botSelectValue;
                request.name=$("#categoryName").val().trim();
            }else{
                //request.applicationId=APPLICATION_ID;
                request.pid=$scope.vm.categoryId;
                //request.id=$scope.vm.categoryId;
                request.name=$("#category-name").val().trim();
            }
           BusinessModelingServer.classifyNameCheck.get(request,function(data){
               if(responseWithoutView(data)==false){
                if(data.status==500){
                	layer.msg(data.info)
                }
	            }else{
	               	flag=true;
	            }
           })
            return flag;
        }
        //局部加载 type:0->添加 1:删除 2:修改
        function reloadBot(data,type){
            if(type!=0){
                $.each($(".aside-navs").find("li"),function(index,value){
                    if($(value).find("i").attr("data-option")==$scope.vm.categoryId){
                        var length = $(value).parent().find("li").length-1;
                        //删除以后判断 子级以下是否还有节点 如果没有隐藏下拉开关
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
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].id+'" title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[0])+'><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].id+'" title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[0])+'><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
                            if($(value).parent().parent().next()!=null){
                                var len = $(value).parent().parent().next().find("li").length;
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
        function botInfoToCategoryAttribute(){
        	console.log($scope.vm.botInfo)
            if($scope.vm.botInfo){
                var category = JSON.parse($scope.vm.botInfo);
                $scope.vm.botSelectValue=category.categoryId;
                $scope.vm.categoryId=category.categoryId;
                $scope.vm.categoryTypeId=category.categoryTypeId;
                $scope.vm.categoryName=category.categoryName;
                $scope.vm.categoryPid=category.categoryPid;
                $scope.vm.categoryApplicationId=category.categoryApplicationId;
                if(nullCheck(category.categoryDescribe)==true){
                    $scope.vm.categoryDescribe=underlineToWhiteSpace(category.categoryDescribe);
                }
                $scope.vm.categoryLeaf=category.categoryLeaf;
            }
        }

        //禁用指定属性类型
        function disableAttributeType(){
           //  $.each($("#category-type").find("option"),function(index,value){
           //      if($scope.vm.categoryAttributeName=="node"){
           //          $(value).attr("disabled",null);
           //          $(value).attr("style","");
           //      }else{
           //          if(($(value).val()==$scope.vm.botSelectType)>0){
           //              $("#category-type").val($scope.vm.botSelectType);
           //              $(value).attr("disabled",null);
           //              $(value).attr("style","");
           //          }else{
           //              $(value).attr("disabled","disabled");
           //              $(value).attr("style","background-color: lightgrey");
           //          }
           //      }
           // });
        }

        //清除已选颜色
        function clearColor(){
            $.each($(".aside-navs").find("span"),function(index,value){
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
        //节点样式转换
        function nodeStyleSwitch(attrType){
            if(attrType=="edge"){
                return "style='color:#ED7D31;'";
            }else{
                return "";
            }
        }
        //显示节点描述
        function categoryDescribeView(describeStr){
            if(nullCheck(describeStr)==true){
                return "title='"+describeStr+"'";
            }
            return "";
        }
        $("#category-name").blur(function(){
            if(lengthCheck($("#category-name").val(),0,50)==false){
                $("#category-name-error").html($scope.vm.categoryNameNullOrBeyondLimit);
            }else{
                $("#category-name-error").html('');
               // repeatCheck("#category-name-error",0);
            }
        });

		/**
		 * Category对象转换为JSON字符串
		 * @param obj
		 * @returns {*}
		 */
		function toCategoryString(obj){
		    if(obj==null || obj==undefined){
		        return "";
		    }
		    var str='{';
		    str+='"categoryId":"'+obj.id+'",';
		    str+='"categoryTypeId":'+obj.type+',';
		    str+='"categoryName":"'+obj.name+'",';
		    str+='"categoryModifierId":"'+obj.modifierId+'",';
		    str+='"categoryModifyTime":'+obj.modifyTime+',';
		    str+='"categoryPid":"'+obj.pid+'",';
		    str+='"categoryApplicationId":"'+obj.applicationId+'",';
		    str+='"categoryLeaf":'+obj.leaf+',';
		    if(obj.describe==null){
		        str+='"categoryDescribe":null';
		    }else{
		        str+='"categoryDescribe":"'+fillWhiteSpace(obj.categoryDescribe)+'"';
		    }
		    str+='}';
		    return str;
		}

     


     //导出导入

        function downloadTemplate(){
            downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","","business_ontology_tree_template.xlsx");
        }
        function exportAll(){
            httpRequestPost("/api/ms/classify/export",{
                "applicationId":categoryApplicationId
            },function(data){
                if(responseView(data)==true){
                    if(data.exportFileNameList.length>0){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[0]);
                    }
                }
            });
        }
        function batchUpload(){
            var pid = 'root';
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/batch_upload.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    //refresh
                    initBot();
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/category/batchAdd?applicationId='+categoryApplicationId+'&modifierId='+categoryModifierId+'&sceneId='+categorySceneId+'&pid='+pid);
                }, 100);
            }
        }
    }
])};