/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('businessModelingModule').controller('frameworkLibraryController', [
    '$scope','$timeout',"$state", "$stateParams","ngDialog",
    function ($scope,$timeout,$state, $stateParams, ngDialog) {
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
                pagesLength: 8,//分页框数量
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
            relateConcept:null
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
            loadFrameLibrary(1);
            $scope.$apply();
        });
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
        //加载对应类目下的框架库
        function loadFrameLibrary(current){
            httpRequestPost("/api/modeling/frame/listbyattribute",{
                "frameCategoryId": $scope.vm.botSelectValue,
                "index":(current-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $("#frame-library").empty();
                $scope.vm.paginationConf={
                    currentPage: 1,//当前页
                    totalItems: Math.ceil(data.total/6), //总页数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
                if(data.data){
                    var html = "";
                    for(var i=0;i<data.data.length;i++){
                        if(i%2==0){
                            html += '<div class="libraryRthCnt" data-option="'+data.data[i].frameId+'">';
                        }else{
                            html += '<div class="libraryRthCnt even" data-option="'+data.data[i].frameId+'">';
                        }
                        html += '   <a href="javascript:;" class="pa delete_a" data-option="'+data.data[i].frameId+'"></a>'+
                                '   <img src="../../images/images/libTxt_22.png"/>'+
                                '   <p>银行邻域业务框架</p>'+
                                '   <div>' +
                                '      <a class="edit" type-option='+data.data[i].frameTypeId+' frame-info='+JSON.stringify(data.data[i])+' href="javascript:;">'+data.data[i].frameTitle+'</a>' +
                                '   </div>'+
                                '</div>';
                    }
                    $("#frame-library").append(html);
                }
            },function(err){
                console.log(err);
            });
        }
        //修改框架
        $("#frame-library").on("click",'.edit',function(){
            $scope.vm.frameTypeId=$(this).attr("type-option");
            console.log("======frameTypeId======"+$scope.vm.frameTypeId);
            $scope.vm.frameInfo=$(this).attr("frame-info");
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
        });
        //删除框架
        $("#frame-library").on("click",'.pa',function(){
            var frameId = $(this).attr("data-option");
            console.log("======delete frame======"+frameId);
            httpRequestPost("/api/modeling/frame/delete",{
                "frameId":frameId
            },function(data){
                if(responseView(data)==true){
                    loadFrameLibrary(1);
                }
            },function(err){
                console.log(err);
            });
        });

        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                loadFrameLibrary(current);
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
                        $scope.vm.frameTitle=$("#frameTitle").val();
                        if($("#frameTitle").val()==""){
                            layer.msg("请添加框架标题");
                            return;
                        }
                        $scope.vm.frameTypeId=$("#frameTypeId").val();
                        console.log($scope.vm.frameTypeId);
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
                        if(faqValidata()==true){
                            faqAssemble(0);
                            faqRequestAdd();
                        }
                    }
                }
            });
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
                        if(faqValidata()==true){
                            faqAssemble(1);
                            faqRequestUpdate();
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    fillFaqUpdatePage();
                    //单个删除元素
                    $("#faq_extension").on("click",'.del',function(){
                        console.log("======deletebyelementId======");
                        if($(this).attr("element-id")==null){
                            return;
                        }
                        var elementId=$(this).attr("element-id");
                        console.log("======elementId======"+elementId);
                        $(this).parent().parent().remove();
                        httpRequestPost("/api/modeling/frame/deleteelementbyid",{
                            "elementId":elementId
                        },function(data){
                            responseView(data);
                        },function(err){
                            console.log(err);
                        });
                    });
                }, 100);
            }
        }
        function fillFaqUpdatePage(){
            for(var i=0;i<$scope.vm.elementIdArray.length;i++){
                if($scope.vm.elementAttributeIdArray[i]==10025){
                    $("#standard_question").val($scope.vm.elementContentArray[i]);
                    $("#standard_question").attr("element-id",$scope.vm.elementIdArray[i]);
                }else{
                    var html= '<div class="row cl mb-10"><label class="form-label col-xs-4 col-sm-2 text-r">扩展问题：</label><div class="formControls col-xs-8 col-sm-9"><input type="text" class="L input-text mr-10" element-id="'+$scope.vm.elementIdArray[i]+'" value="'+$scope.vm.elementContentArray[i]+'" style="width:300px;"><a element-id="'+$scope.vm.elementIdArray[i]+'" href="javascript:;" class="del"><img src="../../images/images/delete_img.png"></a></div></div>';
                    $(".exten_problem").append(html);
                }
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
                    for(var i=0;i<tagArr.length;i++){
                        tagHtml+='<span class="tag_s">'+tagArr[i]+'</span>';
                    }
                    tagHtml+='</div>';
                    var html =  '<div class="row cl mb-10" element-id="'+$scope.vm.elementIdArray[i]+'">'+
                        '   <label class="form-label col-xs-4 col-sm-2 text-r mt-7">概念扩展：</label>' +
                        '   <div class="formControls col-xs-8 col-sm-9">'+
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
            $scope.vm.elementAskContentArray[0]=$scope.vm.defaultString;
            $scope.vm.elementAttributeIdArray[0]=10025;
            $scope.vm.elementContentArray[0]=$("#standard_question").val();
            $scope.vm.elementFrameIdArray[0]=$scope.vm.defaultString;
            $scope.vm.elementMiningTypeIdArray[0]=$scope.vm.defaultInt;
            $scope.vm.elementRelateConceptArray[0]=$scope.vm.defaultString;
            $scope.vm.elementTypeIdArray[0]=$scope.vm.defaultInt;
            if(type==1){
                $scope.vm.elementIdArray[0]=$("#standard_question").attr("element-id");
            }
            $.each($(".exten_problem").find("input").filter(":gt(0)"),function(index,value){
                $scope.vm.elementAskContentArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementAttributeIdArray[index+1]=10026;
                $scope.vm.elementContentArray[index+1]=$(value).val();
                $scope.vm.elementFrameIdArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index+1]=$scope.vm.defaultInt;
                $scope.vm.elementRelateConceptArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementTypeIdArray[index+1]=$scope.vm.defaultInt;
                if(type==1){
                    if($(value).attr("element-id")){
                        $scope.vm.elementIdArray[index+1]=$(value).attr("element-id");
                    }else{
                        $scope.vm.elementIdArray[index+1]=$scope.vm.defaultString;
                    }
                }
            });
        }
        //组装框架数据
        function assembleFrame(){
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
        function faqValidata(){
            return true;
        }
        function faqRequestAdd(){
            httpRequestPost("/api/modeling/frame/add",{
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
                        loadFrameLibrary(1);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        function faqRequestUpdate(){
            httpRequestPost("/api/modeling/frame/update",{
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
                        loadFrameLibrary(1);
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
                        }
                    }
                }
            });
        }
        //概念框架验证 0:添加 1:修改
        function conceptValidate(type){
            if(type==0){

            }else{

            }
            return true;
        }
        //组装概念数据 0:添加 1:修改
        function conceptAssemble(type){
            $scope.vm.elementAskContentArray[0]=$scope.vm.defaultString;
            $scope.vm.elementAttributeIdArray[0]=10025;
            $scope.vm.elementContentArray[0]=$("#concept_title").val();
            $scope.vm.elementFrameIdArray[0]=$scope.vm.defaultString;
            $scope.vm.elementMiningTypeIdArray[0]=$scope.vm.defaultInt;
            $scope.vm.elementRelateConceptArray[0]=$scope.vm.defaultString;
            $scope.vm.elementTypeIdArray[0]=$scope.vm.defaultInt;
            if(type==1){
                $scope.vm.elementIdArray[0]=$("#concept_title").attr("element-id");
            }
            $.each($("#concept_extension").find(".formControls").filter(":gt(0)"),function(index,value){
                var contentInfo = $(value).find("input").val()+$scope.vm.textAndTagSplit;
                $.each($(value).find("span"),function(index1,value1){
                    contentInfo+=$(value1).html()+$scope.vm.conceptSplit;
                });
                if(contentInfo.indexOf($scope.vm.conceptSplit)>0){
                    contentInfo=contentInfo.substring(0,contentInfo.length-1);
                }
                console.log("==="+contentInfo);
                $scope.vm.elementAskContentArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementAttributeIdArray[index+1]=10026;
                $scope.vm.elementContentArray[index+1]=contentInfo;
                $scope.vm.elementFrameIdArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index+1]=$scope.vm.defaultInt;
                $scope.vm.elementRelateConceptArray[index+1]=$scope.vm.defaultString;
                $scope.vm.elementTypeIdArray[index+1]=$scope.vm.defaultInt;
                if(type==1){
                    if($(value).attr("element-id")){
                        $scope.vm.elementIdArray[index+1]=$(value).attr("element-id");
                    }else{
                        $scope.vm.elementIdArray[index+1]=$scope.vm.defaultString;
                    }
                }
            });
        }
        //概念添加请求
        function conceptRequestAdd(){
            httpRequestPost("/api/modeling/frame/add",{
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
                        loadFrameLibrary(1);
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
                        if(faqValidata()==true){
                            conceptAssemble(1);
                            conceptRequestUpdate();
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    fillConceptUpdatePage();
                    //单个删除元素
                    $("#concept_extension").on("click",'.del',function(){
                        console.log("======deletebyelementId======");
                        if($(this).attr("element-id")==null){
                            return;
                        }
                        var elementId=$(this).attr("element-id");
                        console.log("======elementId======"+elementId);
                        $(this).parent().parent().remove();
                        httpRequestPost("/api/modeling/frame/deleteelementbyid",{
                            "elementId":elementId
                        },function(data){
                            responseView(data);
                        },function(err){
                            console.log(err);
                        });
                    });
                }, 100);
            }
        }
        //概念添加请求
        function conceptRequestUpdate(){
            httpRequestPost("/api/modeling/frame/update",{
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
                    loadFrameLibrary(1);
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
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
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
                        serviceUrl: "/api/modeling/frame/searchconceptbykeyword",
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
                    $("#add-item").on("click","tr",function(){
                        //clear
                        $.each($("#add-item").find("tr"),function(index,value){
                            $(value).attr("item-selected");
                        });
                        console.log("===focus==="+$(this));
                        $(this).attr("item-selected","true");
                    });
                }, 100);
            }
        }
        //元素类型验证
        function elementValidate(type){
            if(type==0){

            }else{

            }
            return true;
        }
        //元素类型数据组装
        function elementAssemble(type){
            $.each($("#add-item").find("tr"),function(index,value){
                console.log("====="+$(value).find(".ele-name-add").val());
                $scope.vm.elementAskContentArray[index]=$(value).find(".ele-asked-add").val();
                $scope.vm.elementAttributeIdArray[index]=$scope.vm.defaultInt;
                $scope.vm.elementContentArray[index]=$(value).find(".ele-name-add").val();
                $scope.vm.elementFrameIdArray[index]=$scope.vm.defaultString;
                $scope.vm.elementMiningTypeIdArray[index]=$(value).find(".mining-type-add").val();
                $scope.vm.elementRelateConceptArray[index]=$(value).find(".ele-concept-add").attr("data-option");
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
            httpRequestPost("/api/modeling/frame/add",{
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
                        loadFrameLibrary(1);
                    }
                }
            },function(err){
                console.log(err);
            });
        }
        //元素类型修改请求
        function elementRequestUpdate(){
            httpRequestPost("/api/modeling/frame/update",{
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
                        loadFrameLibrary(1);
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
                        if(elementValidate()==true){
                            elementAssemble(1);
                            elementRequestUpdate();
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    fillElementUpdatePage();
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
                        serviceUrl: "/api/modeling/frame/searchconceptbykeyword",
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
                    $("#add-item").on("click","tr",function(){
                        //clear
                        $.each($("#add-item").find("tr"),function(index,value){
                            $(value).attr("item-selected");
                        });
                        console.log("===focus==="+$(this));
                        $(this).attr("item-selected","true");
                    });
                }, 100);
            }
        }
        //填充元素修改页面
        function fillElementUpdatePage(){
            for(var i=0;i<$scope.vm.elementIdArray.length;i++){
                var originStr = $scope.vm.elementRelateConceptArray[i];
                console.log("===="+originStr);
                var idx1 = originStr.indexOf($scope.vm.textAndTagSplit);
                if(idx1<=0){
                    return;
                }
                var conceptValueArr = originStr.split($scope.vm.conceptSplit);
                console.log("===="+conceptValueArr);
                var conceptValue = "";
                for(var j=0;j<conceptValueArr.length;j++){
                    httpRequestPostAsync("/api/modeling/frame/searchconceptbyid",{
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
                console.log("===conceptValue==="+conceptValue);
                var html =  '<tr element-id="'+$scope.vm.elementIdArray[i]+'">'+
                    '   <td><input type="text" class="ele-name-add" placeholder="地区" value="'+$scope.vm.elementContentArray[i]+'"/></td>'+
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
                    '   <td><input type="text" class="ele-asked-add" placeholder="" value="'+$scope.vm.elementAskContentArray[i]+'"/></td>'+
                    '   <td><input type="text" class="ele-concept-add" placeholder="从概念库中选择" value="'+conceptValue+'" data-option="'+originStr+'" disabled="disabled"/></td>'+
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
        //开关
        function turnOn(targetValue,targetName){
            $scope.vm[targetName] = targetValue ? 0 : 1 ;
        }
        //概念打标
        function concept_marking(){
            $.each($(".exten_problem").find("input").filter(":eq(0)"),function(index,value){
                console.log("==========="+$(value).val());
                if($(value).val()){
                    var arr = [];
                    arr[0]=$(value).val();
                    httpRequestPost("/api/modeling/frame/batchtag",{
                        "extendQuestionList":arr,
                        "applicationId":"1"
                    },function(data){
                        if(data){
                            if(data.status==200){
                                if(data.data.length>0){
                                    if(data.data[0][0]!=null){
                                        appendTag(data.data[0][0])
                                    }
                                }
                            }
                        }
                    },function(err){
                        console.log(err);
                    });
                }
            });
        }
        function appendTag(data){
            var tagHtml = '<div class="tag_box">';
            for(var i=0;i<data.tagList.length;i++){
                tagHtml+='<span class="tag_s">'+data.tagList[i]+'</span>';
            }
            tagHtml+='</div>';
            var html =  '<div class="row cl mb-10">'+
                        '   <label class="form-label col-xs-4 col-sm-2 text-r mt-7">概念扩展：</label>' +
                        '   <div class="formControls col-xs-8 col-sm-9">'+
                        '       <input type="hidden" value="'+data.word+'"/>'+
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
            if(eleName==null){
                return;
            }
            if(eleName==""){
                return;
            }
            var eleType = $(".ele-type").val();
            var miningType = $(".mining-type").val();
            var eleAsked = $(".ele-asked").val();
            if(eleAsked==null){
                return;
            }
            if(eleAsked==""){
                return;
            }
            var relateConceptIds = $(".ele-concept").attr("data-option");
            var relateConceptVals = $(".ele-concept").val();
            relateConceptVals=relateConceptVals.substring(0,relateConceptVals.length-1);
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
            var html =  '<tr>'+
                        '   <td><input type="text" class="ele-name-add" placeholder="地区" value="'+eleName+'"/></td>'+
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
                        '   <td><input type="text" class="ele-asked-add" placeholder="" value="'+eleAsked+'"/></td>'+
                        '   <td><input type="text" class="ele-concept-add" placeholder="从概念库中选择" value="'+relateConceptVals+'" data-option="'+relateConceptIds+'" disabled="disabled"/></td>'+
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
            $.each($("#add-item").find("tr"),function(index,value){
                console.log(index+"===focus==="+$(value));
                if($(value).attr("item-selected")=="true"){
                    if($(value).attr("element-id")!=null){
                        httpRequestPostAsync("/api/modeling/frame/deleteelementbyid",{
                            "elementId":$(value).attr("element-id")
                        },function(data){
                            if(responseView(data)==true){
                                loadFrameLibrary(1);
                            }
                        },function(err){
                            console.log(err);
                        });
                    }
                    $(value).remove();
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