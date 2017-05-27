/**
 * Created by mileS on 2017/3/23.
 */
angular.module('businessModelingModule').controller('frameworkLibraryController', [
    '$scope','$timeout',"$state", "$stateParams","$compile","ngDialog","$cookieStore",
    function ($scope,$timeout,$state, $stateParams,$compile,ngDialog,$cookieStore) {
        $state.go("frameworkLibrary.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            success : 10000,
            illegal : 10003,
            failed : 10004,
            empty : 10005,
            botSelectValue:"root",
            botRoot : "",     //根节点
            knowledgeBotVal:"",  //bot 内容
            botInfo:null,  //bot信息
            clearColor:clearColor,
            loadFrameLibrary:loadFrameLibrary,
            addFrame:addFrame,
            paginationConf:{
                currentPage: 1,//当前页
                totalItems: 0, //总页数
                pageSize: 1,//第页条目数
                pagesLength: 8//分页框数量
            },
            pageSize:6,
            frameInfo:null,
            addFaq:addFaq,
            addConcept:addConcept,
            addElement:addElement,
            updateFaq:updateFaq,
            updateConcept:updateConcept,
            updateElement:updateElement,
            frameTitle:"",
            frameTypeId:0,
            elementAskContentArray: [],
            elementAttributeIdArray: [],
            elementContentArray: [],
            elementFrameIdArray: [],
            elementMiningTypeIdArray: [],
            elementRelateConceptArray: [],
            elementTypeIdArray: [],
            frameCategoryId: "",
            frameEnableStatusId: 1,
            frameModifierId: "",
            defaultString: "null",
            textAndTagSplit: "#",
            conceptSplit: "；",
            defaultInt: 0,
            responseView:responseView,
            turnOn:turnOn,
            elementIdArray:[],
            concept_marking:concept_marking,
            addEle:addEle,
            delEle:delEle,
            relateConcept:null,
            frameTitleNullErrorInfo:"框架标题为空或超过长度限制50",
            frameTitleRepeatCheck:frameTitleRepeatCheck,
            searchNodeForFrame:searchNodeForFrame,
            recursionForFrame:recursionForFrame,
            autoHeightForFrame:autoHeightForFrame,
            locationForFrame:locationForFrame,
            listData:"",
            editFrame:editFrame,
            deleteFrame:deleteFrame,
            searchByFrameTitle:searchByFrameTitle,
            current:1
        };
        $scope.categoryAttributeName;

        var categoryApplicationId = $cookieStore.get("applicationId");
        var categoryModifierId = $cookieStore.get("userId");

        autoHeightForFrame();

        function autoHeightForFrame(){
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
        //类目查找自动补全
        $('#category-autocomplete').autocomplete({
            serviceUrl: "/api/ms/modeling/category/searchbycategoryname",
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
                searchNodeForFrame(suggestion);
                locationForFrame(suggestion);
            }
        });
        //定位
        function locationForFrame(suggestion){
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
        //搜寻节点
        function searchNodeForFrame(suggestion){
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
                $(firstNode).next().attr("style","color:black;font-weight:bold;");
                console.log(1,$scope.vm.botSelectValue);
                loadFrameLibrary(1,0);
                $scope.$apply();
            }else{
                recursionForFrame(suggestion,firstNode);
            }
        }
        function recursionForFrame(suggestion,node){
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
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        console.log($scope.vm.botSelectValue);
                        loadFrameLibrary(1,0);
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
                            appendTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendTree(currNode);
                        }
                        //递归
                        recursionForFrame(suggestion,currNode);
                    }
                }
            });
        }
        //加载业务树
        initBot();

        //获取root 数据
        function initBot(){
            $(".aside-navs").empty();
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": categoryApplicationId,
                "categoryPid": "root"
            },function(data){
                var html =  '<ul class="menus show">';
                for(var i=0;i<data.data.length;i++){
                    html+= '<li data-option="'+data.data[i].categoryPid+'">' +
                        '<div class="slide-a">'+
                        '<a class="ellipsis" href="javascript:;">'+
                        '<i '+styleSwitch(data.data[i].categoryTypeId,data.data[i].categoryLeaf,data.data[i].categoryAttributeName)+' data-option="'+data.data[i].categoryId+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' type-option="'+data.data[i].categoryTypeId+'"attribute-option="'+data.data[i].categoryAttributeName+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
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
            var categoryAttributeName =$(this).attr("attribute-option");
            if(categoryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if(categoryAttributeName=="edge"){
                $(this).attr("style","color:blue;font-weight:bold;");
            }
            console.log($scope.vm.botSelectValue);
            console.log($scope.vm.botSelectType);
            loadFrameLibrary(1,0);
            $scope.$apply();
        });
        //节点样式转换
        function nodeStyleSwitch(attrType){
            console.log("===nodeStyleSwitch===");
            if(attrType=="edge"){
                return "style='color:blue;'";
            }else{
                return "";
            }
        }
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-navs").on("click",'i',function(){
            appendTree(this);
        });
        //重设请求数组
        function requestArrayReset(){
            $scope.vm.elementAskContentArray=[];
            $scope.vm.elementAttributeIdArray=[];
            $scope.vm.elementContentArray=[];
            $scope.vm.elementFrameIdArray=[];
            $scope.vm.elementMiningTypeIdArray=[];
            $scope.vm.elementRelateConceptArray=[];
            $scope.vm.elementTypeIdArray=[];
            $scope.vm.elementIdArray=[];
        }
        //加载子树
        function appendTree(obj){
            var id = $(obj).attr("data-option");
            var that = $(obj);
            if(!that.parent().parent().siblings().length){
                that.css("backgroundPosition","0% 100%");
                httpRequestPostAsync("/api/ms/modeling/category/listbycategorypid",{
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
                                '<span '+nodeStyleSwitch(data.data[i].categoryAttributeName)+' attribute-option="'+data.data[i].categoryAttributeName+'" type-option="'+data.data[i].categoryTypeId+'" data-option="'+data.data[i].categoryId+'">'+data.data[i].categoryName+'</span>'+
                                '</a>' +
                                '</div>' +
                                '</li>';
                            console.log(data.data[i].categoryAttributeName);
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
        function clearColor(){
            $.each($(".aside-navs").find("span"),function(index,value){
                if($(this).attr("attribute-option")=="node"){
                    $(this).attr("style","");
                }else if($(this).attr("attribute-option")=="edge"){
                    $(this).attr("style","color:blue;");
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
        //加载对应类目下的框架库
        function loadFrameLibrary(current,type){
            $scope.vm.current=current;
            httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                "frameCategoryId": $scope.vm.botSelectValue,
                "index":(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                if(data.data){
                    $scope.vm.listData = data.data;
                    $scope.vm.paginationConf={
                        currentPage: current,//当前页
                        totalItems: data.total, //总页数
                        pageSize: $scope.vm.pageSize,//第页条目数
                        pagesLength: 8  //分页框数量
                    };
                }else{
                    $scope.vm.listData="";
                }
                $scope.$apply();
            },function(err){
                console.log(err);
            });
        }
        //修改框架
        function editFrame(item){
            console.log("======"+$(item)+"======");
            $scope.vm.frameTypeId=item.frameTypeId;
            console.log("======frameTypeId======"+$scope.vm.frameTypeId);
            $scope.vm.frameInfo=JSON.stringify(item);
            var frameInfo = eval('(' + $scope.vm.frameInfo + ')');
            console.log(frameInfo);
            //赋值
            assembleFrame();

            if($scope.vm.frameTypeId==10011){
                updateFaq();
            }
            if($scope.vm.frameTypeId==10012){
                updateConcept();
            }
            if($scope.vm.frameTypeId==10013){
                updateElement();
            }
        }
        //删除框架
        function deleteFrame(item){
            console.log("======"+item+"======");
            var frameId = item.frameId;
            console.log("======delete frame======"+frameId);
            httpRequestPost("/api/ms/modeling/frame/delete",{
                "frameId":frameId
            },function(data){
                if(responseView(data)==true){
                    loadFrameLibrary(1,0);
                }
            },function(err){
                console.log(err);
            });
        }

        function searchByFrameTitle(current,type){
            $scope.vm.current=current;
            console.log("===searchByFrameTitle===");
            if($("#keyWords").val()){
                httpRequestPost("/api/ms/modeling/frame/listbyattribute",{
                    "frameCategoryId": $scope.vm.botSelectValue,
                    "frameTitle": "%"+$("#keyWords").val()+"%",
                    "index":(current-1)*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    if(data.data){
                        $scope.vm.listData = data.data;
                        $scope.vm.paginationConf={
                            currentPage: current,//当前页
                            totalItems: data.total, //总页数
                            pageSize: $scope.vm.pageSize,//第页条目数
                            pagesLength: 8  //分页框数量
                        };
                    }else{
                        $scope.vm.listData="";
                    }
                    $scope.$apply();
                },function(err){
                    console.log(err);
                });
            }
        }

        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                loadFrameLibrary(current,0);
            }
        });
        //添加框架
        function addFrame(){
            if($scope.vm.botSelectValue=="root"){
                layer.msg("请选择类目");
                return;
            }
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/frameworkLibraryDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        $scope.vm.frameTypeId=$("#frameTypeId").val();
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#frameTitle").val();
                        if(lengthCheck($("#frameTitle").val(),0,50)==false){
                            $("#frameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return false;
                        }
                        if(frameTitleRepeatCheck(0,"#frameAddErrorObj")==false){
                            return false;
                        }
                        if($scope.vm.frameTypeId==10011){
                            addFaq();
                        }
                        if($scope.vm.frameTypeId==10012){
                            addConcept();
                        }
                        if($scope.vm.frameTypeId==10013){
                            addElement();
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function(){
                    $("#frameTitle").blur(function(){
                        $scope.vm.frameTypeId=$("#frameTypeId").val();
                        $scope.vm.frameTitle=$("#frameTitle").val();
                        if(lengthCheck($("#frameTitle").val(),0,50)==false){
                            $("#frameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                        }else{
                            $("#frameAddErrorObj").html('');
                            frameTitleRepeatCheck(0,"#frameAddErrorObj");
                        }
                    });
                },100);
            }
        }

        /**
         * 框架标题重复判断
         * @param type 0:添加时 1:修改时
         * @param selector
         * @returns {boolean}
         */
        function frameTitleRepeatCheck(type,selector){
            var flag = false;
            var request = new Object();
            request.frameTitle=$scope.vm.frameTitle;
            request.frameTypeId=$scope.vm.frameTypeId;
            request.frameCategoryId=$scope.vm.botSelectValue;
            if(type==1){
                request.frameId=$scope.vm.frameId;
            }
            httpRequestPostAsync("/api/ms/modeling/frame/repeatcheck",request,function(data){
                if(data){
                    if(responseWithoutView(data)==true){
                        $(selector).html('');
                        flag = true;
                    }else{
                        if(data){
                            $(selector).html(data.info);
                        }
                    }
                }
            },function(err){
                console.log(err);
            });
            return flag;
        }
        //添加表达式
        function addFaq(){
            console.log("addFaq");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/faqNewFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(faqValidata(0)==true){
                            faqAssemble(0);
                            faqRequestAdd();
                        }else{
                            return false;
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function(){
                    $("#faqFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#faqFrameTitle").val();
                        if(lengthCheck($("#faqFrameTitle").val(),0,50)==false){
                            $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(0,"#faqFrameAddErrorObj")==false){
                            return;
                        }
                    });
                },100);
            }
        }
        //修改表达式
        function updateFaq(){
            console.log("updateFaq");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/updateFaqFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(faqValidata(1)==true){
                            faqAssemble(1);
                            faqRequestUpdate();
                        }else{
                            return false;
                        }
                    }
                    loadFrameLibrary(1,0);
                }
            });
            if(dialog){
                $timeout(function () {
                    fillFaqUpdatePage();
                    $("#faqFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#faqFrameTitle").val();
                        if(lengthCheck($("#faqFrameTitle").val(),0,50)==false){
                            $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(1,"#faqFrameAddErrorObj")==false){
                            return;
                        }
                    });
                    //单个删除元素
                    $("#faq_extension").on("click",'.del',function(){
                        console.log("======deletebyelementId======");
                        if($(this).attr("element-id")==null){
                            return;
                        }
                        var obj = $(this).parent().parent();
                        var elementId=$(this).attr("element-id");
                        layer.confirm("删除以后不能恢复，确认删除？",{
                            btn:['确认','取消'],
                            shade:false
                        },function(){
                            console.log("======elementId======"+elementId);
                            httpRequestPostAsync("/api/ms/modeling/frame/deleteelementbyid",{
                                "elementId":elementId
                            },function(data){
                                if (responseView(data)==true) {
                                    $(obj).remove();
                                }
                            },function(err){
                                console.log(err);
                            });
                        },function(){
                            console.log("cancel");
                        });
                    });
                }, 100);
            }
        }
        function fillFaqUpdatePage(){
            for(var i=0;i<$scope.vm.elementIdArray.length;i++){
                var html= '<div class="row cl mb-10"><label class="form-label col-xs-4 col-sm-2 text-r">扩展问题：</label><div class="formControls col-xs-8 col-sm-9"><input type="text" class="L input-text mr-10" element-id="'+$scope.vm.elementIdArray[i]+'" value="'+$scope.vm.elementContentArray[i]+'" style="width:300px;" disabled="disabled"><a element-id="'+$scope.vm.elementIdArray[i]+'" href="javascript:;" class="del"><img src="../../images/images/delete_img.png"></a></div></div>';
                $(".exten_problem").append(html);
            }
        }
        function fillConceptUpdatePage(){
            for(var i=0;i<$scope.vm.elementIdArray.length;i++){
                if($scope.vm.elementAttributeIdArray[i]==10025){
                    $("#concept_title").val($scope.vm.elementContentArray[i]);
                    $("#concept_title").attr("element-id",$scope.vm.elementIdArray[i]);
                }else{
                    var originStr = $scope.vm.elementContentArray[i];
                    console.log("===="+originStr);
                    var idx1 = originStr.indexOf($scope.vm.textAndTagSplit);
                    if(idx1<=0){
                        return;
                    }
                    var originalText = originStr.substring(0,idx1);
                    console.log("===="+originalText);
                    var tagStr = originStr.substring(idx1+1,originStr.length);
                    var tagArr = tagStr.split($scope.vm.conceptSplit);
                    console.log("===="+tagArr);
                    var tagHtml = '<div class="tag_box">';
                    for(var j=0;j<tagArr.length;j++){
                        tagHtml+='<span class="tag_s">'+tagArr[j]+'</span>';
                    }
                    tagHtml+='</div>';
                    var html =  '<div class="row cl mb-10" element-id="'+$scope.vm.elementIdArray[i]+'">'+
                        '   <label class="form-label col-xs-4 col-sm-2 text-r mt-7">概念扩展：</label>' +
                        '   <div class="formControls col-xs-8 col-sm-9" element-id="'+$scope.vm.elementIdArray[i]+'">'+
                        '       <input type="hidden" value="'+originalText+'"/>'+
                        tagHtml+
                        '       <a href="javascript:;" element-id="'+$scope.vm.elementIdArray[i]+'" class="del del-button">'+
                        '           <img src="../../images/images/delete_img.png">'+
                        '       </a>'+
                        '   </div>'+
                        '</div>';
                    $("#concept_extension").append(html);
                }
            }
        }
        //表达式类型数据组装 0:新增 1:修改
        function faqAssemble(type){
            requestArrayReset();
            $.each($(".exten_problem").find("input").filter(":gt(0)"),function(index,value){
                $scope.vm.elementAskContentArray[index]=$scope.vm.defaultString;
                $scope.vm.elementAttributeIdArray[index]=10026;
                $scope.vm.elementContentArray[index]=$(value).val();
                $scope.vm.elementFrameIdArray[index]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index]=$scope.vm.defaultInt;
                $scope.vm.elementRelateConceptArray[index]=$scope.vm.defaultString;
                $scope.vm.elementTypeIdArray[index]=$scope.vm.defaultInt;
                if(type==1){
                    if($(value).attr("element-id")){
                        $scope.vm.elementIdArray[index]=$(value).attr("element-id");
                    }else{
                        $scope.vm.elementIdArray[index]=$scope.vm.defaultString;
                    }
                }
            });
        }
        //组装框架数据
        function assembleFrame(){
            requestArrayReset();
            var frameInfo = eval('(' + $scope.vm.frameInfo + ')');
            $scope.vm.frameId=frameInfo.frameId;
            $scope.vm.frameTypeId=frameInfo.frameTypeId;
            $scope.vm.frameTitle=frameInfo.frameTitle;
            $scope.vm.frameModifierId=frameInfo.frameModifierId;
            $scope.vm.frameCategoryId=frameInfo.frameCategoryId;
            $scope.vm.frameEnableStatusId=frameInfo.frameEnableStatusId;
            for(var i=0;i<frameInfo.elements.length;i++){
                $scope.vm.elementAskContentArray[i]=frameInfo.elements[i].elementAskContent;
                $scope.vm.elementAttributeIdArray[i]=frameInfo.elements[i].elementAttributeId;
                $scope.vm.elementContentArray[i]=frameInfo.elements[i].elementContent;
                $scope.vm.elementFrameIdArray[i]=frameInfo.elements[i].elementFrameId;
                $scope.vm.elementMiningTypeIdArray[i]=frameInfo.elements[i].elementMiningTypeId;
                $scope.vm.elementRelateConceptArray[i]=frameInfo.elements[i].elementRelateConcept;
                $scope.vm.elementTypeIdArray[i]=frameInfo.elements[i].elementTypeId;
                $scope.vm.elementIdArray[i]=frameInfo.elements[i].elementId;
            }
        }
        //
        //表达式类型数据校验
        function faqValidata(type){
            //框架标题校验
            console.log($scope.vm.frameTitle);
            if(lengthCheck($scope.vm.frameTitle,0,50)==false){
                $("#faqFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                return false;
            }
            if(frameTitleRepeatCheck(type,"#faqFrameAddErrorObj")==false){
                return false;
            }
            //扩展问题校验
            var length = $(".exten_problem").find("input").filter(":gt(0)").length;
            console.log(length);
            if(length==0){
                $("#faqExtendQuestionErrorObj").html("至少应该有一个扩展问题");
                return false;
            }
            return true;
        }
        function faqRequestAdd(){
            httpRequestPost("/api/ms/modeling/frame/add",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId
            },function(data){
                if(data){
                    if(responseView(data)==true){
                        loadFrameLibrary(1,0);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        function faqRequestUpdate(){
            httpRequestPost("/api/ms/modeling/frame/update",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "elementIdArray":$scope.vm.elementIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId,
                "frameId":$scope.vm.frameId
            },function(data){
                if(data){
                    if(responseView(data)==true){
                        loadFrameLibrary(1,0);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        //添加概念表达式
        function addConcept(){
            console.log("addConcept");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/conceptNewFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(conceptValidate(0)==true){
                            conceptAssemble(0);
                            conceptRequestAdd();
                        }else{
                            return false;
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function(){
                    $("#conceptFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#conceptFrameTitle").val();
                        if(lengthCheck($("#conceptFrameTitle").val(),0,50)==false){
                            $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(0,"#conceptFrameAddErrorObj")==false){
                            return;
                        }
                    });
                    $("#concept_title").blur(function(){
                        console.log("concept_title");
                        if(lengthCheck($("#concept_title").val(),0,50)==false){
                            $("#conceptTitleErrorObj").html("概念标题为空或超过长度限制50");
                        }else{
                            $("#conceptTitleErrorObj").html('');
                        }
                    });
                },100);
            }
        }
        //概念框架验证 0:添加 1:修改
        function conceptValidate(type){
            //框架标题校验
            console.log($scope.vm.frameTitle);
            if(lengthCheck($scope.vm.frameTitle,0,50)==false){
                $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                return false;
            }
            if(frameTitleRepeatCheck(type,"#conceptFrameAddErrorObj")==false){
                return false;
            }
            //标准问题校验
            if(lengthCheck($("#concept_title").val(),0,50)==false){
                $("#conceptTitleErrorObj").html("概念标题为空或超过长度限制50");
                return false;
            }
            //扩展问题校验
            var length = $(".exten_problem").find("input").filter(":gt(0)").length;
            console.log(length);
            if(length==0){
                $("#conceptExtendQuestionErrorObj").html("至少应该有一个概念扩展");
                return false;
            }
            return true;
        }
        //组装概念数据 0:添加 1:修改
        function conceptAssemble(type){
            requestArrayReset();
            $.each($("#concept_extension").find(".formControls").filter(":gt(0)"),function(index,value){
                var contentInfo = $(value).find("input").val()+$scope.vm.textAndTagSplit;
                $.each($(value).find("span"),function(index1,value1){
                    contentInfo+=$(value1).html()+$scope.vm.conceptSplit;
                });
                if(contentInfo.indexOf($scope.vm.conceptSplit)>0){
                    contentInfo=contentInfo.substring(0,contentInfo.length-1);
                }
                console.log("==="+contentInfo);
                $scope.vm.elementAskContentArray[index]=$scope.vm.defaultString;
                $scope.vm.elementAttributeIdArray[index]=10026;
                $scope.vm.elementContentArray[index]=contentInfo;
                $scope.vm.elementFrameIdArray[index]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index]=$scope.vm.defaultInt;
                $scope.vm.elementRelateConceptArray[index]=$scope.vm.defaultString;
                $scope.vm.elementTypeIdArray[index]=$scope.vm.defaultInt;
                if(type==1){
                    if($(value).attr("element-id")){
                        $scope.vm.elementIdArray[index]=$(value).attr("element-id");
                    }else{
                        $scope.vm.elementIdArray[index]=$scope.vm.defaultString;
                    }
                }
            });
        }
        //概念添加请求
        function conceptRequestAdd(){
            httpRequestPost("/api/ms/modeling/frame/add",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId
            },function(data){
                if(data){
                    if(responseView(data)==true){
                        loadFrameLibrary(1,0);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        //修改概念表达式
        function updateConcept(){
            console.log("updateConcept");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/updateConceptFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(conceptValidate(1)==true){
                            conceptAssemble(1);
                            conceptRequestUpdate();
                        }else{
                            return false;
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    fillConceptUpdatePage();
                    $("#conceptFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#conceptFrameTitle").val();
                        if(lengthCheck($("#conceptFrameTitle").val(),0,50)==false){
                            $("#conceptFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(1,"#conceptFrameAddErrorObj")==false){
                            return;
                        }
                    });
                    $("#concept_title").blur(function(){
                        console.log("concept_title");
                        if(lengthCheck($("#concept_title").val(),0,50)==false){
                            $("#conceptTitleErrorObj").html("概念标题为空或超过长度限制50");
                        }else{
                            $("#conceptTitleErrorObj").html('');
                        }
                    });
                    //单个删除元素
                    $("#concept_extension").on("click",'.del',function(){
                        console.log("======deletebyelementId======");
                        if($(this).attr("element-id")==null){
                            return;
                        }
                        var obj = $(this).parent().parent().remove();
                        var elementId=$(this).attr("element-id");
                        layer.confirm("删除以后不能恢复，确认删除？",{
                            btn:['确认','取消'],
                            shade:false
                        },function(){
                            console.log("======elementId======"+elementId);
                            $(this).parent().parent().remove();
                            httpRequestPost("/api/ms/modeling/frame/deleteelementbyid",{
                                "elementId":elementId
                            },function(data){
                                if (responseView(data)==true) {
                                    $(obj).remove();
                                }
                            },function(err){
                                console.log(err);
                            });
                        },function(){
                            console.log("cancel");
                        });
                    });
                }, 100);
            }
        }
        //概念添加请求
        function conceptRequestUpdate(){
            httpRequestPost("/api/ms/modeling/frame/update",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "elementIdArray":$scope.vm.elementIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId,
                "frameId":$scope.vm.frameId
            },function(data){
                if(responseView(data)==true){
                    loadFrameLibrary(1,0);
                }
            },function(err){
                console.log(err);
            });
        }
        //添加要素
        function addElement(){
            console.log("addElement");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/factorNewFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(elementValidate(0)==true){
                            elementAssemble(0);
                            elementRequestAdd();
                        }else{
                            return false;
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    //选择全部
                    $("#selectAll").click(function(){
                        console.log($(this).prop("checked"));
                        if($(this).prop("checked")==true){
                            $.each($("#add-item").find(".sid"),function(index,value){
                                $(value).prop("checked",true);
                            });
                        }else{
                            $.each($("#add-item").find(".sid"),function(index,value){
                                $(value).prop("checked",false);
                            });
                        }
                    });

                    $("#elementFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#elementFrameTitle").val();
                        if(lengthCheck($("#elementFrameTitle").val(),0,50)==false){
                            $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(0,"#elementFrameAddErrorObj")==false){
                            return;
                        }
                    });
                    $("#ele-name-tr").mouseenter(function(){
                        $("#ele-name-error").attr("style","display:none;");
                        $("#ele-name-error").html('');
                    });
                    $("#ele-asked-tr").mouseenter(function(){
                        $("#ele-asked-error").attr("style","display:none;");
                        $("#ele-asked-error").html('');
                    });
                    $("#ele-concept-tr").mouseenter(function(){
                        $("#ele-concept-error").attr("style","display:none;");
                        $("#ele-concept-error").html('');
                    });
                    $(".ele-name").blur(function(){
                        if(lengthCheck($(".ele-name").val(),0,50)==false){
                            $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
                            $("#ele-name-error").attr("style","display:inline-block;left: 10px;");
                            return;
                        }else{
                            $("#ele-name-error").html('');
                            $("#ele-name-error").attr("style","display:none;");
                        }
                        $.each($("#add-item").find("tr"),function(index,value){
                            console.log("====="+$(value).find(".ele-name-add").val());
                            if($(".ele-name").val()==$(value).find(".ele-name-add").val()){
                                $("#ele-name-error").html('要素名称不能与已有要素名称重复');
                                $("#ele-name-error").attr("style","display:inline-block;left: 10px;");
                                return true;
                            }else{
                                $("#ele-name-error").html('');
                                $("#ele-name-error").attr("style","display:none;");
                            }
                        });
                    });
                    $(".ele-asked").blur(function(){
                        if(lengthCheck($(".ele-asked").val(),0,255)==false){
                            $("#ele-asked-error").html('反问不能为空或超过长度限制255');
                            $("#ele-asked-error").attr("style","display:inline-block;left: 10px;");
                            return;
                        }else{
                            $("#ele-asked-error").html('');
                            $("#ele-asked-error").attr("style","display:none;");
                        }
                        $.each($("#add-item").find("tr"),function(index,value){
                            console.log("====="+$(value).find(".ele-asked-add").val());
                            if($(".ele-asked").val()==$(value).find(".ele-asked-add").val()){
                                $("#ele-asked-error").html('反问不能与已有反问重复');
                                $("#ele-asked-error").attr("style","display:inline-block;left: 10px;");
                                return true;
                            }else{
                                $("#ele-asked-error").html('');
                                $("#ele-asked-error").attr("style","display:none;");
                            }
                        });
                    });
                    $(".ele-concept").blur(function(){
                        var relateConceptIds = $(".ele-concept").attr("data-option");
                        var relateConceptVals = $(".ele-concept").val();
                        relateConceptVals=relateConceptVals.substring(0,relateConceptVals.length-1);
                        var sumConceptStr = relateConceptIds+$scope.vm.textAndTagSplit+relateConceptVals;
                        if(lengthCheck(sumConceptStr,0,255)==false){
                            $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
                            $("#ele-concept-error").attr("style","display:inline-block;left: 10px;");
                            return;
                        }else{
                            $("#ele-concept-error").html('');
                            $("#ele-concept-error").attr("style","display:none;");
                        }
                        if(relateConceptVals==null){
                            return;
                        }
                        if(relateConceptVals==""){
                            return;
                        }
                        if(relateConceptIds==null){
                            return;
                        }
                        if(relateConceptIds==""){
                            return;
                        }
                    });
                    var keyword = "";
                    var keywordarr = $("#ele-concept-autocomplete").val().split(",");
                    console.log("====keywordarr===="+keywordarr);
                    keyword = keywordarr[keywordarr.length];
                    var conceptParams = {
                        "conceptKeyword":keyword,
                        "applicationId":categoryApplicationId
                    };
                    $scope.vm.relateConcept = new HashMap();
                    $("#ele-concept-autocomplete").on("keydown",function(event) {
                        if ( event.keyCode === 9 &&
                            $(this).autocomplete("instance").menu.active ) {
                            event.preventDefault();
                        }
                    }).autocomplete({
                        serviceUrl: "/api/ms/modeling/frame/searchconceptbykeyword",
                        type:'POST',
                        params:conceptParams,
                        paramName:'conceptKeyword',
                        dataType:'json',
                        delimiter:",",
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
                            console.log("==="+JSON.stringify(conceptParams));
                            console.log('You selected: ' + suggestion.value + ',' + suggestion.data);
                            $scope.vm.relateConcept.put(suggestion.value,suggestion.data);
                            var selectConceptValue = "";
                            if($("#ele-concept-autocomplete").val()!=suggestion.value){
                                var terms = splitAuto($("#ele-concept-autocomplete").val());
                                console.log("===terms==="+terms);
                                for(var i=0;i<terms.length;i++){
                                    if(terms[i]==suggestion.value){
                                        //如果重复不添加
                                        continue;
                                    }else{
                                        selectConceptValue+=terms[i]+",";
                                    }
                                }
                            }
                            if(selectConceptValue==""){
                                $("#ele-concept-autocomplete").val(suggestion.value+",");
                            }else{
                                $("#ele-concept-autocomplete").val(selectConceptValue+suggestion.value+",");
                            }
                            var selectConceptId = "";
                            console.log("===hashMap==="+$scope.vm.relateConcept);
                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
                            for(var i=0;i<selectedTerms.length;i++){
                                if($scope.vm.relateConcept.get(selectedTerms[i])!=null){
                                    selectConceptId+=$scope.vm.relateConcept.get(selectedTerms[i])+$scope.vm.conceptSplit;
                                }
                            }
                            selectConceptId=selectConceptId.substring(0,selectConceptId.length-1);
                            console.log("===selectConceptId==="+selectConceptId);
                            $("#ele-concept-autocomplete").attr("data-option",selectConceptId);
                        },
                        onSearchStart:function(){
                            console.log("====onSearchStart=====");
                            var selectConceptId = "";
                            console.log("===hashMap==="+$scope.vm.relateConcept);
                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
                            for(var i=0;i<selectedTerms.length;i++){
                                if($scope.vm.relateConcept.get(selectedTerms[i])!=null){
                                    selectConceptId+=$scope.vm.relateConcept.get(selectedTerms[i])+$scope.vm.conceptSplit;
                                }
                            }
                            selectConceptId=selectConceptId.substring(0,selectConceptId.length-1);
                            console.log("===selectConceptId==="+selectConceptId);
                            $("#ele-concept-autocomplete").attr("data-option",selectConceptId);
                        }
                    });
                }, 100);
            }
        }
        //元素类型验证
        function elementValidate(type){
            console.log($scope.vm.frameTypeId);
            $scope.vm.frameTitle=$("#elementFrameTitle").val();
            if(lengthCheck($("#elementFrameTitle").val(),0,50)==false){
                $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                return false;
            }
            if(frameTitleRepeatCheck(type,"#elementFrameAddErrorObj")==false){
                return false;
            }
            var length = $("#add-item").find("tr").length;
            console.log(length);
            if(length==0){
                $("#elementNumberErr").html("至少应该有一个要素");
                return false;
            }else{
                $("#elementNumberErr").html('');
            }
            return true;
        }
        //元素类型数据组装
        function elementAssemble(type){
            requestArrayReset();
            $.each($("#add-item").find("tr"),function(index,value){
                console.log("====="+$(value).find(".ele-name-add").val());
                $scope.vm.elementAskContentArray[index]=$(value).find(".ele-asked-add").val();
                $scope.vm.elementAttributeIdArray[index]=$scope.vm.defaultInt;
                $scope.vm.elementContentArray[index]=$(value).find(".ele-name-add").val();
                $scope.vm.elementFrameIdArray[index]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index]=$(value).find(".mining-type-add").val();
                console.log("====="+$(value).find(".ele-concept-add").attr("data-option")+"===123");
                if($(value).find(".ele-concept-add").attr("data-option")==""){
                    $scope.vm.elementRelateConceptArray[index]=$scope.vm.defaultString;
                }else{
                    $scope.vm.elementRelateConceptArray[index]=$(value).find(".ele-concept-add").attr("data-option");
                }
                $scope.vm.elementTypeIdArray[index]=$(value).find(".ele-type-add").val();
                if(type==1){
                    if($(value).attr("element-id")){
                        $scope.vm.elementIdArray[index]=$(value).attr("element-id");
                    }else{
                        $scope.vm.elementIdArray[index]=$scope.vm.defaultString;
                    }
                }
            });
        }
        //元素类型添加请求
        function elementRequestAdd(){
            httpRequestPost("/api/ms/modeling/frame/add",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId
            },function(data){
                if(data){
                    if(responseView(data)==true){
                        loadFrameLibrary(1,0);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        //元素类型修改请求
        function elementRequestUpdate(){
            httpRequestPost("/api/ms/modeling/frame/update",{
                "elementAskContentArray":$scope.vm.elementAskContentArray,
                "elementAttributeIdArray":$scope.vm.elementAttributeIdArray,
                "elementContentArray":$scope.vm.elementContentArray,
                "elementFrameIdArray":$scope.vm.elementFrameIdArray,
                "elementMiningTypeIdArray":$scope.vm.elementMiningTypeIdArray,
                "elementRelateConceptArray":$scope.vm.elementRelateConceptArray,
                "elementTypeIdArray":$scope.vm.elementTypeIdArray,
                "elementIdArray":$scope.vm.elementIdArray,
                "frameCategoryId":$scope.vm.botSelectValue,
                "frameEnableStatusId":$scope.vm.frameEnableStatusId,
                "frameModifierId":categoryModifierId,
                "frameTitle":$scope.vm.frameTitle,
                "frameTypeId":$scope.vm.frameTypeId,
                "frameId":$scope.vm.frameId
            },function(data){
                if(data){
                    if(responseView(data)==true){
                        loadFrameLibrary(1,0);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        //修改要素
        function updateElement(){
            console.log("updateConcept");
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/updateFactorFrame.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(elementValidate(1)==true){
                            elementAssemble(1);
                            elementRequestUpdate();
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    fillElementUpdatePage();
                    //选择全部
                    $("#selectAll").click(function(){
                        console.log($(this).prop("checked"));
                        if($(this).prop("checked")==true){
                            $.each($("#add-item").find(".sid"),function(index,value){
                                $(value).prop("checked",true);
                            });
                        }else{
                            $.each($("#add-item").find(".sid"),function(index,value){
                                $(value).prop("checked",false);
                            });
                        }
                    });
                    $("#elementFrameTitle").blur(function(){
                        console.log($scope.vm.frameTypeId);
                        $scope.vm.frameTitle=$("#elementFrameTitle").val();
                        if(lengthCheck($("#elementFrameTitle").val(),0,50)==false){
                            $("#elementFrameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return;
                        }
                        if(frameTitleRepeatCheck(1,"#elementFrameAddErrorObj")==false){
                            return;
                        }
                    });
                    $("#ele-name-tr").mouseenter(function(){
                        $("#ele-name-error").attr("style","display:none;");
                        $("#ele-name-error").html('');
                    });
                    $("#ele-asked-tr").mouseenter(function(){
                        $("#ele-asked-error").attr("style","display:none;");
                        $("#ele-asked-error").html('');
                    });
                    $("#ele-concept-tr").mouseenter(function(){
                        $("#ele-concept-error").attr("style","display:none;");
                        $("#ele-concept-error").html('');
                    });
                    $(".ele-name").blur(function(){
                        if(lengthCheck($(".ele-name").val(),0,50)==false){
                            $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
                            $("#ele-name-error").attr("style","display:inline-block;left: 148px;");
                            return;
                        }else{
                            $("#ele-name-error").html('');
                            $("#ele-name-error").attr("style","display:none;");
                        }
                        $.each($("#add-item").find("tr"),function(index,value){
                            console.log("====="+$(value).find(".ele-name-add").val());
                            if($(".ele-name").val()==$(value).find(".ele-name-add").val()){
                                $("#ele-name-error").html('要素名称不能与已有要素名称重复');
                                $("#ele-name-error").attr("style","display:inline-block;left: 148px;");
                                return true;
                            }else{
                                $("#ele-name-error").html('');
                                $("#ele-name-error").attr("style","display:none;");
                            }
                        });
                    });
                    $(".ele-asked").blur(function(){
                        if(lengthCheck($(".ele-asked").val(),0,255)==false){
                            $("#ele-asked-error").html('反问不能为空或超过长度限制255');
                            $("#ele-asked-error").attr("style","display:inline-block;left: 496px;");
                            return;
                        }else{
                            $("#ele-asked-error").html('');
                            $("#ele-asked-error").attr("style","display:none;");
                        }
                        $.each($("#add-item").find("tr"),function(index,value){
                            console.log("====="+$(value).find(".ele-asked-add").val());
                            if($(".ele-asked").val()==$(value).find(".ele-asked-add").val()){
                                $("#ele-asked-error").html('反问不能与已有反问重复');
                                $("#ele-asked-error").attr("style","display:inline-block;left: 496px;");
                                return true;
                            }else{
                                $("#ele-asked-error").html('');
                                $("#ele-asked-error").attr("style","display:none;");
                            }
                        });
                    });
                    $(".ele-concept").blur(function(){
                        var relateConceptIds = $(".ele-concept").attr("data-option");
                        var relateConceptVals = $(".ele-concept").val();
                        relateConceptVals=relateConceptVals.substring(0,relateConceptVals.length-1);
                        var sumConceptStr = relateConceptIds+$scope.vm.textAndTagSplit+relateConceptVals;
                        if(lengthCheck(sumConceptStr,0,255)==false){
                            $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
                            $("#ele-concept-error").attr("style","display:inline-block;left: 710px;");
                            return;
                        }else{
                            $("#ele-concept-error").html('');
                            $("#ele-concept-error").attr("style","display:none;");
                        }
                        if(relateConceptVals==null){
                            return;
                        }
                        if(relateConceptVals==""){
                            return;
                        }
                        if(relateConceptIds==null){
                            return;
                        }
                        if(relateConceptIds==""){
                            return;
                        }
                    });
                    var keyword = "";
                    var keywordarr = $("#ele-concept-autocomplete").val().split(",");
                    console.log("====keywordarr===="+keywordarr);
                    keyword = keywordarr[keywordarr.length];
                    var conceptParams = {
                        "conceptKeyword":keyword,
                        "applicationId":categoryApplicationId
                    };
                    $scope.vm.relateConcept = new HashMap();
                    $("#ele-concept-autocomplete").on("keydown",function(event) {
                        if ( event.keyCode === 9 &&
                            $(this).autocomplete("instance").menu.active ) {
                            event.preventDefault();
                        }
                    }).autocomplete({
                        serviceUrl: "/api/ms/modeling/frame/searchconceptbykeyword",
                        type:'POST',
                        params:conceptParams,
                        paramName:'conceptKeyword',
                        dataType:'json',
                        delimiter:",",
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
                            console.log("==="+JSON.stringify(conceptParams));
                            console.log('You selected: ' + suggestion.value + ',' + suggestion.data);
                            $scope.vm.relateConcept.put(suggestion.value,suggestion.data);
                            var selectConceptValue = "";
                            if($("#ele-concept-autocomplete").val()!=suggestion.value){
                                var terms = splitAuto($("#ele-concept-autocomplete").val());
                                console.log("===terms==="+terms);
                                for(var i=0;i<terms.length;i++){
                                    if(terms[i]==suggestion.value){
                                        //如果重复不添加
                                        continue;
                                    }else{
                                        selectConceptValue+=terms[i]+",";
                                    }
                                }
                            }
                            if(selectConceptValue==""){
                                $("#ele-concept-autocomplete").val(suggestion.value+",");
                            }else{
                                $("#ele-concept-autocomplete").val(selectConceptValue+suggestion.value+",");
                            }
                            var selectConceptId = "";
                            console.log("===hashMap==="+$scope.vm.relateConcept);
                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
                            for(var i=0;i<selectedTerms.length;i++){
                                if($scope.vm.relateConcept.get(selectedTerms[i])!=null){
                                    selectConceptId+=$scope.vm.relateConcept.get(selectedTerms[i])+$scope.vm.conceptSplit;
                                }
                            }
                            selectConceptId=selectConceptId.substring(0,selectConceptId.length-1);
                            console.log("===selectConceptId==="+selectConceptId);
                            $("#ele-concept-autocomplete").attr("data-option",selectConceptId);
                        },
                        onSearchStart:function(){
                            console.log("====onSearchStart=====");
                            var selectConceptId = "";
                            console.log("===hashMap==="+$scope.vm.relateConcept);
                            var selectedTerms = splitAuto($("#ele-concept-autocomplete").val());
                            for(var i=0;i<selectedTerms.length;i++){
                                if($scope.vm.relateConcept.get(selectedTerms[i])!=null){
                                    selectConceptId+=$scope.vm.relateConcept.get(selectedTerms[i])+$scope.vm.conceptSplit;
                                }
                            }
                            selectConceptId=selectConceptId.substring(0,selectConceptId.length-1);
                            console.log("===selectConceptId==="+selectConceptId);
                            $("#ele-concept-autocomplete").attr("data-option",selectConceptId);
                        }
                    });
                }, 100);
            }
        }
        //填充元素修改页面
        function fillElementUpdatePage(){
            for(var i=0;i<$scope.vm.elementIdArray.length;i++){
                var originStr = $scope.vm.elementRelateConceptArray[i];
                console.log("===="+originStr);
                var conceptValue = "";
                var idx1 = originStr.indexOf($scope.vm.textAndTagSplit);
                if(idx1>=0){
                    var conceptValueArr = originStr.split($scope.vm.conceptSplit);
                    console.log("===="+conceptValueArr);

                    for(var j=0;j<conceptValueArr.length;j++){
                        httpRequestPostAsync("/api/ms/modeling/frame/searchconceptbyid",{
                            "conceptId":conceptValueArr[j]
                        },function(data){
                            if(data.status==10000){
                                conceptValue+=data.conceptWithWeight.name+",";
                            }
                        },function(err){
                            console.log(err);
                        });
                    }
                    conceptValue=conceptValue.substring(0,conceptValue.length-1);
                }

                console.log("===conceptValue==="+conceptValue);
                var html =  '<tr element-id="'+$scope.vm.elementIdArray[i]+'">'+
                    '   <td><input type="checkbox" class="sid"/></td>'+
                    '   <td><input type="text" style="width: 200px;" class="input_text ele-name-add" disabled="disabled" value="'+$scope.vm.elementContentArray[i]+'"/></td>'+
                    '   <td>'+
                    '       <select class="ele-type-add bd">'+
                    '           <option value=10014>字符串</option>'+
                    '           <option value=10015>数字</option>'+
                    '           <option value=10016>范围</option>'+
                    '       </select>'+
                    '   </td>'+
                    '   <td>'+
                    '       <select class="mining-type-add bd">'+
                    '           <option value=10017>OEC</option>'+
                    '           <option value=10018>GATE</option>'+
                    '       </select>'+
                    '   </td>'+
                    '   <td><input style="width: 200px;" type="text" class="input_text ele-asked-add" value="'+$scope.vm.elementAskContentArray[i]+'" disabled="disabled"/></td>'+
                    '   <td><input style="width: 180px;" type="text" class="input_text ele-concept-add" placeholder="从概念库中选择" value="'+conceptValue+'" data-option="'+originStr+'" disabled="disabled"/></td>'+
                    '</tr>';
                $("#add-item").append(html);

                $("#add-item").find("tr").filter(":eq("+i+")").find(".ele-type-add").val($scope.vm.elementTypeIdArray[i]);
                $("#add-item").find("tr").filter(":eq("+i+")").find(".mining-type-add").val($scope.vm.elementMiningTypeIdArray[i]);
            }
        }
        //返回状态显示
        function responseView(data){
            if(data==null){
                return false;
            }
            layer.msg(data.info);
            if(data.status==$scope.vm.success){
                console.log("===success===");
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
        //开关
        function turnOn(targetValue,targetName){
            $scope.vm[targetName] = targetValue ? 0 : 1 ;
        }
        //概念打标
        function concept_marking(){
            $.each($(".exten_problem").find("input").filter(":eq(0)"),function(index,value){
                console.log("==========="+$(value).val());
                if(lengthCheck($(value).val(),0,255)==false){
                    $("#conceptExtendQuestionErrorObj").html("概念扩展不能为空或长度超过255");
                    return true;
                }
                if($(value).val()==$("#concept_title").val()){
                    $("#conceptExtendQuestionErrorObj").html("概念标题不能与概念扩展重复");
                    return true;
                }
                $.each($(".exten_problem").find("input").filter(":gt(0)"),function(index1,value1){
                    console.log($(value1).val());
                    if($(value).val()==$(value1).val()){
                        $("#conceptExtendQuestionErrorObj").html("不能与已有概念扩展重复");
                        return true;
                    }
                });
                $("#conceptExtendQuestionErrorObj").html('');
                var arr = [];
                arr[0]=$(value).val();
                httpRequestPost("/api/ms/modeling/frame/batchtag",{
                    "extendQuestionList":arr,
                    "applicationId":categoryApplicationId
                },function(data){
                    if(data){
                        if(data.status==200){
                            if(data.data.length>0){
                                if(data.data[0]!=null){
                                    appendTag(data.data[0],$(value).val());
                                }
                            }
                        }
                    }
                },function(err){
                    console.log(err);
                    $("#conceptExtendQuestionErrorObj").html("打标失败，请正确发布节点后再进行打标操作!");
                });
            });
        }
        function appendTag(data,originStr){
            var tagHtml = '<div class="tag_box">';
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i].tagList.length;j++){
                    tagHtml+='<span class="tag_s">'+data[i].tagList[j]+'</span>';
                }
            }
            tagHtml+='</div>';
            var html =  '<div class="row cl mb-10">'+
                        '   <label class="form-label col-xs-4 col-sm-2 text-r mt-7">概念扩展：</label>' +
                        '   <div class="formControls col-xs-8 col-sm-9">'+
                        '       <input type="hidden" value="'+originStr+'"/>'+
                        tagHtml+
                        '       <a href="javascript:;" class="del-button" onclick="rem_ques(this);">'+
                        '           <img src="../../images/images/delete_img.png">'+
                        '       </a>'+
                        '   </div>'+
                        '</div>';
            $("#concept_extension").append(html);
        }
        //添加表格子元素
        function addEle(){
            console.log("addEle");
            var eleName = $(".ele-name").val();
            if(lengthCheck(eleName,0,50)==false){
                $("#ele-name-error").html('要素名称不能为空或超过长度限制50');
                $("#ele-name-error").attr("style","display:inline-block;left: 10px;");
                return;
            }else{
                $("#ele-name-error").html('');
                $("#ele-name-error").attr("style","display:none;");
            }
            var flag1 = false;
            $.each($("#add-item").find("tr"),function(index,value){
                console.log("====="+$(value).find(".ele-name-add").val());
                if(eleName==$(value).find(".ele-name-add").val()){
                    $("#ele-name-error").html('要素名称不能与已有要素名称重复');
                    $("#ele-name-error").attr("style","display:inline-block;left: 10px;");
                    flag1 = true;
                }
            });
            if(flag1==true){
                return;
            }
            $("#ele-name-error").html('');
            $("#ele-name-error").attr("style","display:none;");
            var eleType = $(".ele-type").val();
            var miningType = $(".mining-type").val();
            var eleAsked = $(".ele-asked").val();
            if(lengthCheck(eleAsked,0,255)==false){
                $("#ele-asked-error").html('反问不能为空或超过长度限制255');
                $("#ele-asked-error").attr("style","display:inline-block;left: 10px;");
                return;
            }else{
                $("#ele-asked-error").html('');
                $("#ele-asked-error").attr("style","display:none;");
            }
            var flag2 = false;
            $.each($("#add-item").find("tr"),function(index,value){
                console.log("====="+$(value).find(".ele-asked-add").val());
                if(eleAsked==$(value).find(".ele-asked-add").val()){
                    $("#ele-asked-error").html('反问不能与已有反问重复');
                    $("#ele-asked-error").attr("style","display:inline-block;left: 10px;");
                    flag2 = true;
                }
            });
            if(flag2==true){
                return;
            }
            $("#ele-asked-error").html('');
            $("#ele-asked-error").attr("style","display:none;");
            var relateConceptIds = "";
            var relateConceptVals = "";
            if($(".ele-concept").attr("data-option")==undefined){

            }else{
                relateConceptIds = $(".ele-concept").attr("data-option");
                console.log($(".ele-concept").attr("data-option"));
                relateConceptVals = $(".ele-concept").val();
                console.log($(".ele-concept").val());
                relateConceptVals=relateConceptVals.substring(0,relateConceptVals.length-1);
                var sumConceptStr = relateConceptIds+$scope.vm.textAndTagSplit+relateConceptVals;
                if(lengthCheck(sumConceptStr,0,255)==false){
                    $("#ele-concept-error").html('相关概念不能为空或超过长度限制');
                    $("#ele-concept-error").attr("style","display:inline-block;left: 10px;");
                    return;
                }else{
                    $("#ele-concept-error").html('');
                    $("#ele-concept-error").attr("style","display:none;");
                }
                if(relateConceptVals==null){
                    return;
                }
                if(relateConceptVals==""){
                    return;
                }
                if(relateConceptIds==null){
                    return;
                }
                if(relateConceptIds==""){
                    return;
                }
            }

            var html =  '<tr>'+
                        '   <td><input type="checkbox" class="sid"/></td>'+
                        '   <td class="pr"><input type="text" style="width: 200px;" class="input_text ele-name-add" placeholder="地区" value="'+eleName+'" disabled="disabled"/></td>'+
                        '   <td>'+
                        '       <select class="ele-type-add bd">'+
                        '           <option value=10014>字符串</option>'+
                        '           <option value=10015>数字</option>'+
                        '           <option value=10016>范围</option>'+
                        '       </select>'+
                        '   </td>'+
                        '   <td>'+
                        '       <select class="mining-type-add bd">'+
                        '           <option value=10017>OEC</option>'+
                        '           <option value=10018>GATE</option>'+
                        '       </select>'+
                        '   </td>'+
                        '   <td class="pr"><input type="text" style="width: 200px;" class="input_text ele-asked-add" placeholder="" value="'+eleAsked+'" disabled="disabled"/></td>'+
                        '   <td class="pr"><input type="text" style="width: 180px;" class="input_text ele-concept-add" placeholder="从概念库中选择" value="'+relateConceptVals+'" data-option="'+relateConceptIds+'" disabled="disabled"/></td>'+
                        '</tr>';
            $("#add-item").prepend(html);

            $("#add-item").find("tr").filter(":eq(0)").find(".ele-type-add").val(eleType);
            $("#add-item").find("tr").filter(":eq(0)").find(".mining-type-add").val(miningType);
            //clear
            $(".ele-name").val("");
            $(".ele-type").val(10014);
            $(".mining-type").val(10017);
            $(".ele-asked").val("");
            $(".ele-concept").attr("data-option","");
            $(".ele-concept").val("");
        }
        //删除表格子元素
        function delEle(){
            console.log("delEle");
            $.each($("#add-item").find(".sid"),function(index,value){
                console.log($(value).prop("checked"));
                if($(value).prop("checked")==true){
                    if ($(value).parent().parent().attr("element-id")!=null) {
                        httpRequestPostAsync("/api/ms/modeling/frame/deleteelementbyid",{
                            "elementId":$(value).parent().parent().attr("element-id")
                        },function(data){
                            if(responseView(data)==true){
                                loadFrameLibrary(1,0);

                            }
                        },function(err){
                            console.log(err);
                        });
                    }
                    $(value).parent().parent().remove();
                }
            });
        }
        function splitAuto(val) {
            return val.split(",");
        }
        function HashMap(){
            //定义长度
            var length = 0;
            //创建一个对象
            var obj = new Object();

            /**
             * 判断Map是否为空
             */
            this.isEmpty = function(){
                return length == 0;
            };

            /**
             * 判断对象中是否包含给定Key
             */
            this.containsKey=function(key){
                return (key in obj);
            };

            /**
             * 判断对象中是否包含给定的Value
             */
            this.containsValue=function(value){
                for(var key in obj){
                    if(obj[key] == value){
                        return true;
                    }
                }
                return false;
            };

            /**
             *向map中添加数据
             */
            this.put=function(key,value){
                if(!this.containsKey(key)){
                    length++;
                }
                obj[key] = value;
            };

            /**
             * 根据给定的Key获得Value
             */
            this.get=function(key){
                return this.containsKey(key)?obj[key]:null;
            };

            /**
             * 根据给定的Key删除一个值
             */
            this.remove=function(key){
                if(this.containsKey(key)&&(delete obj[key])){
                    length--;
                }
            };

            /**
             * 获得Map中的所有Value
             */
            this.values=function(){
                var _values= new Array();
                for(var key in obj){
                    _values.push(obj[key]);
                }
                return _values;
            };

            /**
             * 获得Map中的所有Key
             */
            this.keySet=function(){
                var _keys = new Array();
                for(var key in obj){
                    _keys.push(key);
                }
                return _keys;
            };

            /**
             * 获得Map的长度
             */
            this.size = function(){
                return length;
            };

            /**
             * 清空Map
             */
            this.clear = function(){
                length = 0;
                obj = new Object();
            };
        }
    }
]);