/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module : 类目库套用
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('BotApplyController', [
    '$scope', 'localStorageService','BusinessModelingServer','$timeout',"$state" ,"$stateParams","ngDialog","$cookieStore",'$interval',"$http",
    ($scope,localStorageService,BusinessModelingServer,$timeout,$state,$stateParams,ngDialog,$cookieStore,$interval,$http)=> {
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
            categoryTypeId: 160,
            botSelectType:160,
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
            categoryLibraryTypeId: 160,
            botLibrarySelectType:160,
            categoryLibrarySceneId: 0,
            categoryLibraryAttributeName: "edge",
            categoryLibraryName: "",
            categoryLibraryPid: "",
            categoryLibraryDescribe: "",
            categoryLibraryLeaf: 1,
            reloadBotLibrary:reloadBotLibrary,
            reloadBot:reloadBot,
            //disableAttributeTypeForApply:disableAttributeTypeForApply,
            repeatCheckForCategory:repeatCheckForCategory,
            categoryNameNullOrBeyondLimit:"类目名称为空或超过长度限制50",
            notContainHtmlLabel:"不能包含HTML标签",
            categoryDescribeBeyondLimit:"描述超过长度限制2000",
            responseView:responseView,
            searchNodeForBot:searchNodeForBot,
            recursionForBot:recursionForBot,
            autoHeightForBot:autoHeightForBot,
            locationForBot:locationForBot,
            suggestionValue:"",
            suggestionData:"",
            winHeight:0,
             dataSplit:{},
        };

        var categoryApplicationId = APPLICATION_ID;
        var categoryModifierId = USER_ID;
        var categorySceneId = "";

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
            "name":$("#category-autocomplete").val().trim(),
        };
        //类目查找自动补全
        $('#category-autocomplete').autocomplete({
            serviceUrl: "/api/ms/classify/library/path/get",
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
                searchNodeForBot(suggestion);
                $scope.vm.suggestionValue=suggestion.value;
                $scope.vm.suggestionData=suggestion.data;
            }
        });
        $interval(function(){
            if(nullCheck($scope.vm.suggestionData)==true){
                var suggestion = new Object();
                suggestion.value=$scope.vm.suggestionValue;
                suggestion.data=$scope.vm.suggestionData;
                if(locationForBotFlag(suggestion)){
                    locationForBot(suggestion);
                    $scope.vm.suggestionValue="";
                    $scope.vm.suggestionData="";
                }
            }
        },2000);

         //搜寻节点
        function searchNodeForBot(suggestion){
            console.log(suggestion)
            console.log(suggestion.data)
            var currentNodeId = suggestion.data;
            var firstNode = $("#library").find("i").filter(":eq(0)");
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
                $scope.$apply();
            }else{
                recursionForBot(suggestion,firstNode);
            }
        }
        function recursionForBot(suggestion,node){
            var list = $("#library").find("li");
            var flag = false;
            $.each(list,function(index,value){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        clearColorLibrary();
                        $scope.vm.knowledgeBotLibraryVal = $(currNode).next().html();
                        $scope.vm.botLibrarySelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $scope.vm.categoryLibraryAttributeName = $(currNode).next().attr("node-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
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
                            appendLibraryTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendLibraryTree(currNode);
                        }
                        
                    }
               
            });
           recursionForBotnAgain(suggestion,node)
        }
        function recursionForBotnAgain(suggestion,node){
            var list = $("#library").find("li");
            var flag = false;
            $.each(list,function(index,value){
                var currNode = $(value).find("i").filter(":eq(0)");
                if($(value).attr("data-option")==suggestion.data){
                        clearColorLibrary();
                        $scope.vm.knowledgeBotLibraryVal = $(currNode).next().html();
                        $scope.vm.botLibrarySelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $scope.vm.categoryLibraryAttributeName = $(currNode).next().attr("node-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        console.log($(currNode).next().attr("id-option"))
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
                            appendLibraryTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendLibraryTree(currNode);
                        }
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
        initBotLibrary();
        //获取root 数据
        function initBot(){
            $("#category").empty();
             $(".aside-navs").empty();
            $http.get('api/ms/classify/children/get/root').success(function(data,status,headers,congfig){
                var html =  '<ul class="menus show">';
                for(var i=0;data.data != null && i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].id+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].name)+'>'+
                        '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" depict-option="'+data.data[i].depict+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' node-option="'+data.data[i].relation+'" bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" depict-option="'+data.data[i].depict+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                        '</a>' +
                        '</div>' +
                        '</li>';
                }
                html+='</ul>';
                $("#category").append(html);
                var firstNode = $(".aside-navs").find("i").filter(":eq(0)");
                if($(firstNode).css("backgroundPosition")=="0% 0%"){
                    appendTree(firstNode);
                }else if($(firstNode).parent().parent().next()==null){
                    appendTree(firstNode);
                }
            },function(){
            });
        }
        function initBotLibrary(){
            $("#library").empty();
            $http.get('api/ms/classify/library/children/get/root').success(function(data,status,headers,congfig){
                var html =  '<ul class="menus show">';
                for(var i=0;data.data != null && i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].id+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].name)+'>'+
                        '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" depict-option="'+data.data[i].depict+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                        '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' node-option="'+data.data[i].relation+'" bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" depict-option="'+data.data[i].depict+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
            });
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
        $("#category").on("click","span",function(){
            clearColor();
             $scope.vm.knowledgeBotVal = $(this).html();
            $scope.vm.botSelectValue = $(this).attr("data-option");
            $scope.vm.botSelectType = $(this).attr("type-option");
            $scope.vm.categoryAttributeName = $(this).attr("node-option");
            $scope.vm.categoryId=$(this).attr("id-option");
            $scope.vm.categoryPid=$(this).attr("pid-option")
            $scope.vm.categoryDescribe=$(this).attr("depict-option");
            if($scope.vm.categoryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if($scope.vm.categoryAttributeName=="edge"){
                $(this).attr("style","color:#ED7D31;font-weight:bold;");
            }
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
                $.ajax("api/ms/classify/children/get/"+id+"",{
                dataType: 'json', //服务器返回json格式数据
                type: "GET", //HTTP请求类型
                async:false,
                cache:false,
                success:function(data) {
                    if(data.status==200){
                        if(data.data){
                            var html = '<ul class="menus">';
                            for(var i=0;i<data.data.length;i++){
                             html+= '<li data-option="'+data.data[i].id+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].name)+'>'+
                                '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" depict-option="'+data.data[i].depict+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' node-option="'+data.data[i].relation+'" bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" depict-option="'+data.data[i].depict+'" bot-id="'+data.data[i].id+'"><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                            html+="</ul>";
                            $(html).appendTo((that.parent().parent().parent()));
                            that.parent().parent().next().slideDown();
                        }
                    }
                },
            })
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
                $.ajax("api/ms/classify/library/children/get/"+id+"",{
                dataType: 'json', //服务器返回json格式数据
                type: "GET", //HTTP请求类型
                async:false,
                cache:false,
                success:function(data) {
                    if(data.status==200){
                        if(data.data){
                            var html = '<ul class="menus">';
                            for(var i=0;i<data.data.length;i++){
                             html+= '<li data-option="'+data.data[i].id+'">' +
                                '<div class="slide-a">'+
                                '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].name)+'>'+
                                '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" depict-option="'+data.data[i].depict+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' node-option="'+data.data[i].relation+'" bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" depict-option="'+data.data[i].depict+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                        }
                            html+="</ul>";
                            $(html).appendTo((that.parent().parent().parent()));
                            that.parent().parent().next().slideDown();
                        }
                    }
                },
            })
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
                case 160:
                    style ='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-rq.png);"';break;
                case 161:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-sx.png);"';break;
                case 163:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-lc.png);"';break;
                case 162:
                    style='style="'+styleHidden+'position: relative;top: -1px; margin-right: 5px; width: 15px; height: 15px; vertical-align: middle; background-position: left top; background-repeat: no-repeat;background-image:url(../../images/pic-navs-dy.png);"';break;
            }
            
            return style;

        }

        //类目库套用
        function applyCategory(){
            if(applyValid()==false){
                return;
            }
            BusinessModelingServer.libraryQuote.save({
                  "lid": $scope.vm.categoryLibraryId,
                  "pid":$scope.vm.categoryId==""?"root":$scope.vm.categoryId,
            },function(data){
                 if(data.status==200){
                       layer.msg(data.info)
                        initBot();
                        initBotLibrary();
                 }else if(data.status==500){
                      layer.msg(data.info)
                       initBotLibrary();
                       initBot();
                 }
                
            },function(err){
            })
        }
        //套用验证
        function applyValid(){
            //rule edge->node
            if($scope.vm.botLibrarySelectValue=="root"){
                layer.msg("请选择要套用的bot节点");
                return false;
            }
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
            $scope.vm.botInfo = $(this).parent().attr("bot-info");
           // botInfoToCategoryAttribute();
             deleteBot($(this).parent().attr("bot-id"));
        });
         $("#library").on("click","span",function(){
             $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
             $scope.vm.categoryLibraryName=$(this).html();
             $scope.vm.categoryLibraryTypeId=$(this).attr("type-option");
             $scope.vm.categoryLibraryDescribe=$(this).attr("depict-option");
             $scope.vm.categoryLibraryAttributeName = $(this).attr("node-option");
             $scope.vm.categoryLibraryPid=$(this).attr("pid-option");
             $scope.vm.categoryLibraryId=$(this).attr("id-option");
             console.log($scope.vm.categoryLibraryName)
             console.log($scope.vm.categoryLibraryAttributeName)
        });
        $("#library").on("click",".edit",function(){
            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
           // botLibraryInfoToCategoryAttribute();
             $scope.vm.categoryLibraryName=$(this).parent().attr("bot-name");
             $scope.vm.categoryLibraryTypeId=$(this).parent().attr("bot-type");
             $scope.vm.categoryLibraryDescribe=$(this).parent().attr("depict-option")=="null"?"":$(this).parent().attr("depict-option");
             $scope.vm.categoryLibraryAttributeName = $(this).parent().attr("node-option");
             $scope.vm.categoryLibraryPid=$(this).parent().attr("bot-pid");
             $scope.vm.categoryLibraryId=$(this).parent().attr("bot-pid");
          // botInfoToCategoryAttribute();
            editBotLibrary($(this).parent().attr("bot-pid"),$(this).parent().attr("bot-id"));
        });
        $("#library").on("click",".delete",function(){
            $scope.vm.botLibraryInfo = $(this).parent().attr("bot-info");
           // botLibraryInfoToCategoryAttribute();
            deleteBotLibrary($(this).parent().attr("bot-id"));
        });
       //节点删除deleteBot
        function deleteBot(categoryId){
            var categoryId=categoryId;
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
                        if(data.status==200){ 
                            //数据组装
                            $scope.vm.categoryId=data.data;
                            layer.msg(data.info);
                            reloadBot(data.data,1);
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
                var category = $scope.vm.botLibraryInfo;
                console.log(category)
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
                                '<i '+styleSwitch(data.data[0].categoryTypeId,data.data[0].categoryLeaf,data.data[0].categoryAttributeName)+' data-option="'+data.data[0].categoryId+'"></i>'+
                                '<span '+nodeStyleSwitch(data.data[0].categoryAttributeName)+' node-option="'+data.data[0].categoryAttributeName+'" type-option="'+data.data[0].categoryTypeId+'" data-option="'+data.data[0].categoryId+'" title="'+data.data[0].categoryName+'">'+subStringWithTail(data.data[0].categoryName,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[0])+'><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            var obj = $(value).parent().parent().next();
                            var sty = styleSwitch(data.data[0].categoryTypeId,1,data.data[0].categoryAttributeName);
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
        function addBotLibrary(){
            $scope.vm.categoryLibraryTypeId=160;
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/bot/add_category_library.html",
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
                        if(isHtmlLabel($("#categoryLibraryNameAdd").val())){
                            $("#addErrorView").html($scope.vm.notContainHtmlLabel);
                            return false;
                        }
                        if(repeatCheckForCategory("#addErrorView",0)==false){
                            return false;
                        }
                        if(nullCheck($("#categoryLibraryDescribe").val())==true){
                            if(lengthCheck($("#categoryLibraryDescribe").val(),0,2000)==false){
                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
                                return false;
                            }else if(isHtmlLabel($("#categoryLibraryDescribe").val())) {
                                $("#describeErrorView").html($scope.vm.notContainHtmlLabel);
                                return false;
                            }else{
                                $scope.vm.categoryLibraryDescribe=$("#categoryLibraryDescribe").val().trim();
                            }
                        }
                    
                        if($scope.vm.botLibrarySelectValue==""){
                            var pid="root";
                            var relation="node";
                        }else if($scope.vm.botLibrarySelectValue=="root"){
                            var pid= $scope.vm.botLibrarySelectValue;
                            var relation= ($scope.vm.categoryLibraryAttributeName=="node") ? "edge" :"node"
                        }else{
                            var pid= $scope.vm.botLibrarySelectValue;
                            var relation= ($scope.vm.categoryLibraryAttributeName=="node") ? "edge" :"node"
                        }
                            BusinessModelingServer.libraryAdd.save({
                              "leaf": 0,
                              "name":$("#categoryLibraryNameAdd").val().trim(),
                              "pid": pid,
                              "relation": relation,
                              "type":  $("#categoryLibraryTypeIdAdd").val(),
                              "depict":$scope.vm.categoryLibraryDescribe,
                              "origin":120
                           },function(data){
                             if(data.status==200){
                                    layer.msg(data.info)
                                    //数据组装
                                    $scope.vm.dataSplit.name=$("#categoryLibraryNameAdd").val().trim(),
                                    $scope.vm.dataSplit.pid=pid;
                                    $scope.vm.dataSplit.relation=relation;
                                    $scope.vm.dataSplit.id=data.data;
                                    $scope.vm.dataSplit.type=$("#categoryLibraryTypeIdAdd").val();
                                    $scope.vm.dataSplit.leaf=0;
                                    $scope.vm.dataSplit.depict=$scope.vm.categoryLibraryDescribe;
                                    $scope.vm.categoryId=data.data;
                                    $("#categoryLibraryNameAdd").val('');
                                    $scope.vm.categoryLibraryDescribe="";
                                    reloadBotLibrary($scope.vm.dataSplit,0);
                                   $scope.vm.categoryRootPid=data.data;
                             }else if(data.status==500){
                                  layer.msg(data.info)
                             }
                            
                        },function(err){
                        })

                            }else{
                            }
                        }
                    });
                    if(dialog){
                        $timeout(function () {
                            //disableAttributeTypeForApply();
                            $("#categoryLibraryNameAdd").blur(function(){
                                if(lengthCheck($("#categoryLibraryNameAdd").val(),0,50)==false){
                                    $("#addErrorView").html($scope.vm.categoryNameNullOrBeyondLimit);
                                }else if(isHtmlLabel($("#categoryLibraryNameAdd").val())){
                                    $("#addErrorView").html($scope.vm.notContainHtmlLabel);
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
                request.pid=$scope.vm.botLibrarySelectValue;
                request.name=$scope.vm.categoryLibraryName;
            }else{
                request.pid=$scope.vm.botLibrarySelectValue;
                request.name=$("#categoryLibraryNameAdd").val();
            }
             $.ajax("/api/ms/classify/library/name/check",{
                dataType: 'json', //服务器返回json格式数据
                type: "GET", //HTTP请求类型
                async:false,
                cache:false,
                data: request, 
                success:function(data) {
                    if(data.status==200){
                       flag=true;
                    }else if(data.status==500){
                       layer.msg(data.info)
                       flag=false;
                    }
                },error:function(data) {
                    console.log(data)
                },
            })
            return flag;
        }
        function editBotLibrary(pid,id){
             if($scope.vm.categoryLibraryPid==""){
                var editpid="root";
                var relation="node";
            }else if($scope.vm.categoryLibraryPid=="root"){
                var editpid=$scope.vm.categoryLibraryPid;
                var relation= $scope.vm.categoryLibraryAttributeName
            }else{
                var editpid= $scope.vm.categoryLibraryPid;
                var relation= $scope.vm.categoryLibraryAttributeName
            }
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/bot/edit_category_library.html",
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
                        if(isHtmlLabel($("#categoryLibraryName").val())){
                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
                            return false;
                        }
                        // if(repeatCheckForCategory("#editErrorView",1)==false){
                        //     return false;
                        // }
                        if(nullCheck($("#categoryLibraryDescribe").val())==true){
                            if(lengthCheck($("#categoryLibraryDescribe").val(),0,2000)==false){
                                $("#describeErrorView").html($scope.vm.categoryDescribeBeyondLimit);
                                return false;
                            }else if(isHtmlLabel($("#categoryLibraryDescribe").val())){
                                $("#describeErrorView").html($scope.vm.notContainHtmlLabel);
                                return false;
                            }else{
                                $scope.vm.categoryLibraryDescribe=$("#categoryLibraryDescribe").val().trim();
                            }
                        }
                        httpRequestPost("/api/ms/classify/library/update",{
                            "id": id,
                            "pid": editpid,
                            "relation": relation,
                            "name": $scope.vm.categoryLibraryName,
                            "type": $scope.vm.categoryLibraryTypeId,
                            "categoryDescribe": $scope.vm.categoryLibraryDescribe,
                            "leaf": 0
                        },function(data){
                            if(data.status==200){
                                layer.msg(data.info);
                                //重新加载
                                 $scope.vm.dataSplit.name=$scope.vm.categoryLibraryName;
                                $scope.vm.dataSplit.pid=editpid;
                                $scope.vm.dataSplit.relation=relation;
                                $scope.vm.dataSplit.id=data.data;
                                $scope.vm.dataSplit.type=$scope.vm.categoryLibraryTypeId;
                                $scope.vm.dataSplit.leaf=1;
                                $scope.vm.dataSplit.depict=$scope.vm.categoryLibraryDescribe;
                                $scope.vm.categoryRootPid=data.data;
                                reloadBotLibrary($scope.vm.dataSplit,2);
                            }else{
                                layer.msg(data.info)
                            }
                            $scope.vm.dataSplit.name="";
                        },function(err){
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
                        }else if(isHtmlLabel($("#categoryLibraryName").val())){
                            $("#editErrorView").html($scope.vm.notContainHtmlLabel);
                        }else{
                            $("#editErrorView").html('');
                            repeatCheckForCategory("#editErrorView",1);
                        }
                    });
                //     $("#categoryLibraryTypeId").empty();
                //     var attrArr = [];
                //     attrArr[0]={name:"默认",value:160};
                //     attrArr[1]={name:"流程",value:161};
                //     attrArr[2]={name:"划分",value:163};
                //     attrArr[3]={name:"属性",value:162};
                //     for(var index=0;index<attrArr.length;index++){
                //         if($scope.vm.categoryLibraryAttributeName=="edge"){
                //             $("#categoryLibraryTypeId").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                //         }else{
                //             if((attrArr[index].value==$scope.vm.botSelectType)>0){
                //                 $("#categoryLibraryTypeId").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                //             }else{
                //                 $("#categoryLibraryTypeId").append('<option disabled="disabled" style="background-color: lightgrey;" value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                //             }
                //         }
                //     }
                //     $("#categoryLibraryTypeId").val($scope.vm.botSelectType);
                 }, 100);
            }
        }
       
        //节点删除
        function deleteBotLibrary(categoryId){
            var categoryId=categoryId;
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/bot/delete_category.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                    $http.post("api/ms/classify/library/delete/"+categoryId+"").success(function(data){
                        if(data.status==200){ 
                            //数据组装
                            $scope.vm.botLibrarySelectValue=data.data;
                            layer.msg(data.info);
                            reloadBotLibrary(data.data,1);
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
            console.log(data)
            if(type!=0){
                $.each($("#library").find("li"),function(index,value){
                    if($(value).find("i").attr("data-option")==$scope.vm.botLibrarySelectValue){
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

            if($scope.vm.botLibrarySelectValue=="root"){
                initBotLibrary();
            }else{
                var count = 0;
                $.each($("#library").find("i"),function(index,value){
                    if(type==2){
                         if($(value).attr("data-option")==data.pid){
                            count++;
                              var html = '<li data-option="'+data.pid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.name)+'>'+
                                '<i '+styleSwitch(data.type,data.leaf,data.relation)+' data-option="'+data.id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.relation)+' node-option="'+data.relation+'"  id-option="'+data.id+'" type-option="'+data.type+'" data-option="'+data.id+'" title="'+data.name+'">'+subStringWithTail(data.name,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data)+' node-option="'+data.relation+'" bot-name="'+data.name+'" bot-type="'+data.type+'" bot-pid="'+data.pid+'" depict-option="'+data.depict+'"  bot-id="'+data.id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            $(value).parent().parent().next().append(html);
                        }
                    }else if(type==0){
                        if($(value).attr("data-option")==data.pid){
                            count++;
                            var html = '<li data-option="'+data.pid+'">' +
                                '<div class="slide-a">'+
                                ' <a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.name)+'>'+
                                '<i '+styleSwitch(data.type,data.leaf,data.relation)+' data-option="'+data.id+'"></i>'+
                                '<span '+nodeStyleSwitch(data.relation)+' node-option="'+data.relation+'" id-option="'+data.id+'" type-option="'+data.type+'" data-option="'+data.id+'" title="'+data.name+'">'+subStringWithTail(data.name,10,"...")+'</span>'+
                                '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data)+' node-option="'+data.relation+'" bot-name="'+data.name+'" bot-type="'+data.type+'" bot-pid="'+data.pid+'" depict-option="'+data.depict+'"  bot-id="'+data.id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            //按照修改时间排序 把数据添加到前面
                            var obj = $(value).parent().parent().next();
                            var nodeType = "edge";
                            if(data.relation=="node"){
                                nodeType = "edge";
                            }else if(data.relation=="edge"){
                                nodeType = "node";
                            }
                             var sty = styleSwitch(data.type,1,nodeType);
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
                    initBotLibrary();
                }
            }
        }
        //禁用指定属性类型
        function disableAttributeTypeForApply(){
            $("#categoryLibraryTypeIdAdd").empty();
            var attrArr = [];
            attrArr[0]={name:"默认",value:160};
            attrArr[1]={name:"流程",value:161};
            attrArr[2]={name:"划分",value:163};
            attrArr[3]={name:"属性",value:162};
            for(var index=0;index<attrArr.length;index++){
                if($scope.vm.categoryLibraryAttributeName=="node"){
                    $("#categoryLibraryTypeIdAdd").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                }else{
                    if((attrArr[index].value==$scope.vm.botSelectType)>0){
                        $("#categoryLibraryTypeIdAdd").append('<option value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                    }else{
                        $("#categoryLibraryTypeIdAdd").append('<option disabled="disabled" style="background-color: lightgrey;" value='+attrArr[index].value+'>'+attrArr[index].name+'</option>');
                    }
                }
            }
            $("#categoryLibraryTypeIdAdd").val($scope.vm.botSelectType);
        }
    }
])};