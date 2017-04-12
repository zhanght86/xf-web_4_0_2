/**
 * Created by 41212 on 2017/3/23.
 */
angular.module('businessModelingModule').controller('frameworkLibraryController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
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
            addFaq:addFaq,
            addConcept:addConcept,
            addElement:addElement,
            frameTitle:"",
            frameTypeId:0
        };
        setCookie("categoryApplicationId","360619411498860544");
        setCookie("categoryModifierId","1");
        setCookie("categorySceneId","10023");
        var categoryApplicationId = getCookie("categoryApplicationId");
        var categoryModifierId = getCookie("categoryModifierId");
        var categorySceneId = getCookie("categorySceneId");
        var params = {
            "categoryName":$("#categoryName").val(),
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
            $scope.$apply()
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
                "frameEnableStatusId": 1,
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
                        html += '   <img src="../../images/images/libTxt_22.png"/>'+
                                '   <p>银行邻域业务框架</p>'+
                                '   <div>' +
                                '      <a href="javascript:;">'+data.data[i].frameTitle+'</a>' +
                                '   </div>'+
                                '</div>';
                    }
                    $("#frame-library").append(html);
                }
            },function(err){
                console.log(err);
            });
        }
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
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                    }
                }
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
                    }
                }
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
                    }
                }
            });
        }
    }
]);