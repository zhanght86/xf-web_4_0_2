/**
 * @Author : MILES .
 * @Create : 2017/12/7.
 * @Module : 框架库
 */
module.exports = businessModelingModule =>{
    businessModelingModule.controller('FrameLibraryController', [
    '$scope','$timeout',"$state", "$stateParams","BusinessModelingServer","$compile","$location","ngDialog","$cookieStore","$interval","$http",
    ($scope,$timeout,$state, $stateParams,BusinessModelingServer,$compile,$location,ngDialog,$cookieStore,$interval,$http) =>{
        // $state.go("frameworkLibrary.manage",{userPermission:$stateParams.userPermission});
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
            paginationConf : {     //分页条件
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : loadFrameLibrary,
                location : true
            },
            frameInfo:null,
            addFaq:addFaq,
            addElement:addElement,
            updateFaq:updateFaq,
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
            //responseView:responseView,
            turnOn:turnOn,
            elementIdArray:[],
            addEle:addEle,
            delEle:delEle,
            relateConcept:null,
            frameTitleNullErrorInfo:"框架标题为空或超过长度限制50",
            notContainHtmlLabel:"不能包含HTML标签",
            frameTitleRepeatCheck:frameTitleRepeatCheck,
            searchNodeForFrame:searchNodeForFrame,
            recursionForFrame:recursionForFrame,
            autoHeightForFrame:autoHeightForFrame,
            locationForFrame:locationForFrame,
            listData:"",
            editFrame:editFrame,
            deleteFrame:deleteFrame,
            downloadTemplate:downloadTemplate,
            exportAll:exportAll,
            batchUpload:batchUpload,
            batchDelete:batchDelete,
            suggestionValue:"",
            suggestionData:"",
            winHeight:0,
            contentList:[],
            addQues:addQues,
            keyLogin:keyLogin,
            extensionProblem:[],
            id:"",
            ids:[],
            selectAll:selectAll,
            selectSingle:selectSingle,
            initBatchTest:initBatchTest,
            classifyId:"",

            delSelectAll:delSelectAll,
            delSelectSingle:delSelectSingle,
            delIds:[],
            flag:false

        };
       
    //添加扩展问模板
     $scope.vm.extensionProblem.push({
           "attributeType":80,
            "order":0
        })
         //键盘监听事件
         function keyLogin(e){
           var srcObj = e.srcElement ? e.srcElement : e.target;
           var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){//回车
                addQues();
            }
        }
        function addQues(){
            //初始化数字值
            $scope.vm.contentList.length=0;
            var len=$(".extensionProblem").length
            for(var i=0;i<len;i++){
                //当扩展问为空时删除扩展问
                if($(".extensionProblem").eq(i).val()==""){
                    $scope.vm.extensionProblem.splice(i,1)
                }else{
                    console.log($(".extensionProblem").eq(i).val())
                    $scope.vm.contentList.push({
                        "attributeType":"80",
                        "content":$(".extensionProblem").eq(i).val()
                    })
                }
            }
            //当扩展问不为空时新增一行
            $scope.vm.extensionProblem.push({
            "order":1
          })
            console.log($scope.vm.contentList)
        }


        $scope.categoryAttributeName;

        // var categoryApplicationId = $cookieStore.get("applicationId");
        // var categoryModifierId = $cookieStore.get("userId");
        var categoryApplicationId = APPLICATION_ID;
        var categoryModifierId = USER_ID;

        autoHeightForFrame();

        function autoHeightForFrame(){
            var $win = $(window);
            var winHeight = $win.height()*0.75;
            $scope.vm.winHeight=winHeight+5;
            $(".libraryFt").attr("style","width: 450px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: left;box-sizing:border-box;");
            $(".libraryRth").attr("style","width: 710px;height: "+winHeight+"px;overflow-y: auto;background: #fff;float: right;padding: 30px;box-sizing:border-box;");
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
                searchNodeForFrame(suggestion);
                $scope.vm.suggestionValue=suggestion.value;
                $scope.vm.suggestionData=suggestion.data;
            }
        });
        $interval(function(){
            if(nullCheck($scope.vm.suggestionData)==true){
                var suggestion = new Object();
                suggestion.value=$scope.vm.suggestionValue;
                suggestion.data=$scope.vm.suggestionData;
                if(locationForFrameFlag(suggestion)){
                    locationForFrame(suggestion);
                    $scope.vm.suggestionValue="";
                    $scope.vm.suggestionData="";
                }
            }
        },2000);
        //定位
        function locationForFrame(suggestion){
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
        function locationForFrameFlag(suggestion){
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
        //搜寻节点
        function searchNodeForFrame(suggestion){
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
                $(firstNode).next().attr("style","color:black;font-weight:bold;");
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
               // if($(value).attr("data-option")==$(node).attr("data-option")){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        clearColor();
                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        loadFrameLibrary(1,0);
                        $scope.$apply();
                        flag = true;
                        //跳出
                        return false;
                    }else{
                        if(flag==true){
                            return false;
                        }
                        //展开
                        if($(currNode).css("backgroundPosition")=="0% 0%"){
                            appendTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendTree(currNode);
                        }
                        //递归
                        //recursionForFrame(suggestion,currNode);
                    }
              //  }
            });
            recursionForFrameAgain(suggestion,node);
        }

        function recursionForFrameAgain(suggestion,node){
            var list = $(".aside-navs").find("li");
            var flag = false;
            $.each(list,function(index,value){
               // if($(value).attr("data-option")==$(node).attr("data-option")){
                    var currNode = $(value).find("i").filter(":eq(0)");
                    if($(currNode).attr("data-option")==suggestion.data){
                        clearColor();
                        $scope.vm.knowledgeBotVal = $(currNode).next().html();
                        $scope.vm.botSelectValue = $(currNode).next().attr("data-option");
                        $scope.vm.classifyId = $(currNode).next().attr("data-option");
                        $scope.vm.botSelectType = $(currNode).next().attr("type-option");
                        $(currNode).next().attr("style","color:black;font-weight:bold;");
                        loadFrameLibrary(1,0);
                        $scope.$apply();
                        flag = true;
                        //跳出
                        return false;
                    }else{
                        if(flag==true){
                            return false;
                        }
                        //展开
                        if($(currNode).css("backgroundPosition")=="0% 0%"){
                            appendTree(currNode);
                        }else if($(currNode).parent().parent().next()==null){
                            appendTree(currNode);
                        }
                        //递归
                        //recursionForFrame(suggestion,currNode);
                    }
              //  }
            });
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
                        '<a class="ellipsis" href="javascript:;" '+categoryDescribeView(data.data[i].name)+'>'+
                        '<i '+styleSwitch(data.data[i].type,data.data[i].leaf,data.data[i].relation)+' data-option="'+data.data[i].id+'"></i>'+
                        '<span '+nodeStyleSwitch(data.data[i].relation)+' id-option="'+data.data[i].id+'" pid-option="'+data.data[i].pid+'" node-option="'+data.data[i].relation+'" type-option="'+data.data[i].type+'" data-option="'+data.data[i].id+'" title="'+data.data[i].name+'">'+subStringWithTail(data.data[i].name,10,"...")+'</span>'+
                        // '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
           $scope.vm.classifyId=$(this).attr("id-option");
            $scope.vm.categoryPid=$(this).attr("pid-option")
            if($scope.vm.categoryAttributeName=="node"){
                $(this).attr("style","color:black;font-weight:bold;");
            }else if($scope.vm.categoryAttributeName=="edge"){
                $(this).attr("style","color:#ED7D31;font-weight:bold;");
            }
             loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
            $scope.$apply();
        });

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
                $.ajax("api/ms/classify/get/children/"+id+"",{
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
                                // '&nbsp;<p class="treeEdit" bot-info='+toCategoryString(data.data[i])+' node-option="'+data.data[i].relation+'" bot-name="'+data.data[i].name+'" bot-type="'+data.data[i].type+'" bot-pid="'+data.data[i].pid+'" depict-option="'+data.data[i].depict+'" bot-id="'+data.data[i].id+'"><img class="edit" src="../../../../../images/bot-edit.png"/><img class="delete" style="width: 12px;" src="../../../../../images/detel.png"/></p>'+
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
        /////////////////////////////////加载对应类目下的框架库///////////////////////////////////////////

         /**
        *   
        框架库
        列表展示
        查询服务
        *
        */
        function loadFrameLibrary(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1 ;
                $location.search("currentPage",1 ) ;
            }
           // let i = layer.msg('资源加载中...',{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            httpRequestPost("/api/ms/frame/get/param",{
                "title": $scope.vm.title,
                "classifyId":$scope.vm.classifyId,
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize,
            },function(data){
                // layer.close(i);
               if(data.status==200){
                 $scope.vm.listData = data.data.data;
                 $scope.vm.paginationConf.totalItems = data.data.total;
                 $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize;
               }else{
                  
               }
                $scope.$apply();
            },function(err){
               // layer.close(i);
            });
        }

          /**
            *   
            框架库
            编辑
            *
            */
        function editFrame(item){
            $scope.vm.frameTypeId=item.type;
            $scope.vm.frameInfo=JSON.stringify(item);
            var frameInfo = eval('(' + $scope.vm.frameInfo + ')');
            //赋值
            if($scope.vm.frameTypeId==100||$scope.vm.frameTypeId==101){
                updateFaq(item);
            }
            if($scope.vm.frameTypeId==102){
                updateElement(item);
            }
        }
         /**
            *   
            框架库
            单条框架信息删除
            *
            */
        function deleteFrame(item){
            var frameId = item.id;
            layer.confirm('确认删除？', {
                btn: ['确认','取消'], //按钮
                shade: 0.3 //不显示遮罩
            }, function(){
                 httpRequestPost("api/ms/frame/delete/"+frameId+"",{
                },function(data){
                   if(data.status==200){
                       layer.msg(data.info,{time:2000})
                        loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                    }else{
                        layer.msg(data.info,{time:2000})
                    }
                },function(err){
                });
            }, function(){
            });
        }

       
        //全选
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.ids = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.ids=[];
                angular.forEach($scope.vm.listData,function (val) {
                    $scope.vm.ids.push(val.id);
                })
            }
            console.log($scope.vm.ids);
        }
        //单选
        function selectSingle(id){
            if($scope.vm.ids.inArray(id)){
                $scope.vm.ids.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.ids.push(id);

            }
            if($scope.vm.ids.length==$scope.vm.listData.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.ids);
        }
        //全选清空
        function initBatchTest(){
            $scope.vm.isSelectAll=false;
            $scope.vm.ids=[];
        }    
        /**
        *   
        框架库
        批量删除
        *
        */
        function batchDelete(){
            if ($scope.vm.ids.length == 0) {
                layer.msg("请选择要删除的记录！");
                return;
            }
            layer.confirm('确认要删除吗？', function (index) {
                layer.close(index);
                httpRequestPost("/api/ms/frame/batch/delete",{
                    "frameIds":$scope.vm.ids,
                },function(data){
                    if(data.status==200){
                         loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                         initBatchTest();  //清空选项 
                         layer.msg(data.data.statusName,{time:2000})
                    }else{
                         layer.msg(data.data.statusName,{time:2000})
                    }
                });
            });
        }
     
        /**
        *   
        框架库
        新增
        *
        */
        function addFrame(){
            //清空类目
            $scope.vm.frameTitle="";
            if($scope.vm.classifyId==""){
                layer.msg("请选择类目");
                return;
            }
            if($scope.vm.categoryAttributeName=="edge"){
                layer.msg("edge下不可以新建框架库",{time:2000});
                return false;
            }
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/frame/framework_library_dialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        //初始化扩展问
                        $scope.vm.extensionProblem.length=0;
                        $scope.vm.extensionProblem.push({
                          "attributeType":80,
                           "order":0
                        })
                        
                        $scope.vm.frameTypeId=$("#frameTypeId").val();
                        $scope.vm.frameTitle=$("#frameTitle").val().trim();
                        if(lengthCheck($("#frameTitle").val(),0,50)==false){
                            $("#frameAddErrorObj").html($scope.vm.frameTitleNullErrorInfo);
                            return false;
                        }
                        if(isHtmlLabel($("#frameTitle").val())){
                            $("#frameAddErrorObj").html($scope.vm.notContainHtmlLabel);
                            return false;
                        }
                        if(frameTitleRepeatCheck()==false){
                            $("#frameAddErrorObj").html("标题重复"); 
                            return false;
                           }

                        if($scope.vm.frameTypeId==100||$scope.vm.frameTypeId==101){
                            addFaq();
                        }
                        if($scope.vm.frameTypeId==102){
                            addElement();
                        }
                    }
                }
            });
        }

        /**
         * 框架标题重复判断
         * @param selector
         * @returns {boolean}
         */
         function frameTitleRepeatCheck(){
            var flag;
            $.ajax("/api/ms/frame/repeat/title",{
                dataType: 'json', //服务器返回json格式数据
                type: "GET", //HTTP请求类型
                async:false,
                cache:false,
                data: {
                  "title":$scope.vm.frameTitle
                }, 
                success:function(data) {
                    if(data.status==200){
                       flag=true;
                    }else if(data.status==500){
                       flag=false;
                    }
                },error:function(data) {
                    console.log(data)
                },
            })
             return flag
        }
        //添加表达式
        function addFaq(){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/frame/faq_new_frame.html",
                width:"650px",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(faqValidata(0)==true){
                            faqRequestAdd();
                             
                        }else{
                            return false;
                        }
                    }
                }
            });
        }
        //表达式数据校验
        function faqValidata(type){
            //框架标题校验
            if(lengthCheck($scope.vm.frameTitle,0,50)==false){
                layer.msg($scope.vm.frameTitleNullErrorInfo);
                return false;
            }
            if(isHtmlLabel($scope.vm.frameTitle)){
                layer.msg($scope.vm.notContainHtmlLabel);
                return false;
            }
            //扩展问题校验
            if($scope.vm.contentList.length==0){
                layer.msg("至少应该有一个扩展问题");
                return false;
            }
            return true;
        }
        //IFQ和概念要素的新增
        function faqRequestAdd(){
            httpRequestPost("/api/ms/frame/add",{
                "classifyId":$scope.vm.classifyId,
                "status":$scope.vm.frameEnableStatusId,
                "title":$scope.vm.frameTitle,
                "type":$scope.vm.frameTypeId,
                "contentList":$scope.vm.contentList 
            },function(data){
                if(data.status==200){
                     layer.msg(data.info,{time:2000})
                     loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                 }else{
                    layer.msg(data.info,{time:2000})
                 }
            },function(err){
            });
        }

        //IFQ和概念要素的修改
        function updateFaq(item){
            console.log(item)
           $scope.vm.extensionProblem.length=0;
           $scope.vm.frameEnableStatusId=item.status;
           $scope.vm.frameTitle=item.title;
           $scope.vm.frameTypeId=item.type;
           $scope.vm.classifyId=item.classifyId;
           $scope.vm.id=item.id;
           for (let i= 0; i < item.frameContentList.length; i++) {
               $scope.vm.extensionProblem.push({
                  "content":item.frameContentList[i].content,
                  "order":i
               })
           };
            $scope.vm.extensionProblem.push(
                {
                 "content":"",
                  "order":1
                })
          
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/frame/update_faq_frame.html",
                width:"625px",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(faqValidata(1)==true){
                            faqRequestUpdate();
                        }else{
                            return false;
                        }
                    }
                    loadFrameLibrary(1,0);
                }
            });
        }
       
        function faqRequestUpdate(){
            httpRequestPost("/api/ms/frame/update",{
                "id":$scope.vm.id,
                "classifyId":$scope.vm.classifyId,
                "status":$scope.vm.frameEnableStatusId,
                "title":$scope.vm.frameTitle,
                "type":$scope.vm.frameTypeId,
                "contentList":$scope.vm.contentList 
            }
            ,function(data){
                 if(data.status==200){
                    layer.msg(data.info,{time:2000})
                     loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                 }else{
                    layer.msg(data.info,{time:2000})
                 }
            },function(err){
            });
        }
      
        //////////////////////////////////要素新////////////////////////////////////////
        //添加要素
        function addElement(){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/frame/factor_new_frame.html",
                width:"860px",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(elementValidate()==true){
                            elementRequestAdd();
                        }else{
                            return false;
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function () {
                    $(".ele-name").blur(function(){
                         alert(1)
                        $.each($("#add-item").find("tr"),function(index,value){
                            if($(".ele-name").val()==$(value).find(".ele-name-add").val()){
                               layer.msg('要素名称不能与已有要素名称重复');
                                $("#ele-name-error").attr("style","display:inline-block;left: 10px;z-index:9999;");
                                return true;
                            }else{
                                $("#ele-name-error").html('');
                                $("#ele-name-error").attr("style","display:none;");
                            }
                        });
                    });
                
                }, 100);
            }
        }
        //元素类型验证
        function elementValidate(){
             $scope.vm.contentList.length=0;
            var len=$scope.vm.extensionProblem.length;
            for(var i=1;i<len;i++){
               var value=$(".ele-name").eq(i).val();
               if(value==""){
                  layer.msg("要素名称不能为空");
                   return false;
               }else{
                  $scope.vm.contentList.push({
                    askContent:$(".ele-asked").eq(i).val(),
                    content:$(".ele-name").eq(i).val(),
                    attributeType:$(".ele-type").eq(i).val(),
                }) 
               }
            } 
            console.log($scope.vm.contentList)
            return true;
            
        }
        
        //元素类型添加请求
        function elementRequestAdd(){
            httpRequestPost("/api/ms/frame/add",{
                "contentList":$scope.vm.contentList,
                "classifyId":$scope.vm.classifyId,
                "status":$scope.vm.frameEnableStatusId,
                "title":$scope.vm.frameTitle,
                "type":$scope.vm.frameTypeId
            },function(data){
                if(data.status==200){
                     loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                     layer.msg(data.info,{time:2000})

                 }else{
                   layer.msg(data.info,{time:2000})
                 }
            },function(err){
                console.log(err)
            });
        }


        //元素类型修改请求
        function elementRequestUpdate(){
            httpRequestPost("/api/ms/frame/update",{
                "contentList":$scope.vm.contentList,
                "classifyId":$scope.vm.classifyId,
                "status":$scope.vm.frameEnableStatusId,
                "id":$scope.vm.id,
                "title":$scope.vm.frameTitle,
                "type":$scope.vm.frameTypeId
            },function(data){
                if(data.status==200){
                     loadFrameLibrary($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                     layer.msg(data.info,{time:2000})
                 }else{
                   layer.msg(data.info,{time:2000})
                 }
            },function(err){
            });
        }
        //修改要素
        function updateElement(item){
            console.log(item)
           $scope.vm.extensionProblem.length=0;
           $scope.vm.frameEnableStatusId=item.status;
           $scope.vm.frameTitle=item.title;
           $scope.vm.frameTypeId=item.type;
           $scope.vm.classifyId=item.classifyId;
           $scope.vm.id=item.id;
           for (let i= 0; i < item.frameContentList.length; i++) {
               $scope.vm.extensionProblem.push({
                  "content":item.frameContentList[i].content,
                  "askContent":item.frameContentList[i].askContent,
                  "attributeType":item.frameContentList[i].attributeType,
                  "order":1
               })
           };
            $scope.vm.extensionProblem.splice(0,0,{
                "attributeType":80,
                 "order":0
            })
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/views/frame/update_factor_frame.html",
                width:"840px",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回调
                    if(e === 1){
                        if(elementValidate()==true){
                            elementRequestUpdate();
                        }else{
                            return false;
                        }
                    }
                }
            });
        }
        
        
        //开关
        function turnOn(targetValue,targetName){
            $scope.vm[targetName] = targetValue ? 0 : 1 ;
        }
       
        //添加表格子元素
        function addEle(){
            var eleName = $(".ele-name").val();
            if(lengthCheck(eleName,0,50)==false){
               layer.msg('要素名称不能为空或超过长度限制50');
                return;
            }
            //初始化表格元素
            $scope.vm.extensionProblem[0].order=1;
            $scope.vm.extensionProblem.splice(0,0,{
            "attributeType":80,
            "order":0
           })

        }

        //全选
        function delSelectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false;
                $scope.vm.delIds = [];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.delIds=[];
                for (var i =1 ; i <$scope.vm.extensionProblem.length; i++) {
                    $scope.vm.delIds.push(i);
                };
               
            }
            console.log($scope.vm.delIds);
        }
        //单选
        function delSelectSingle(id){
            if($scope.vm.delIds.inArray(id)){
                $scope.vm.delIds.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.delIds.push(id);

            }
            if($scope.vm.delIds.length==$scope.vm.listData.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.delIds);
        }
        //全选清空
        function delSelect(){
            $scope.vm.isSelectAll=false;
            $scope.vm.delIds=[];
        }    

        
        //删除表格子元素
        function delEle(){
            console.log($scope.vm.delIds)
            console.log( $scope.vm.extensionProblem)
            if($scope.vm.delIds.length==0){
              layer.msg("请选择要删除的信息！")
              return;
            }
            layer.confirm("确认删除？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                layer.close(index);
               for(let i=0;i<$scope.vm.delIds.length;i++){
                     $scope.vm.extensionProblem.splice($scope.vm.delIds.sort(function(a,b){return b-a})[i],1)
               }
               layer.msg("删除成功")
               delSelect();

            },function(){
            });
        }
        
        /**
     * 长度检测 包括边界
     * @param value
     * @param min
     * @param max
     */
    function lengthCheck(value,min,max){
        if(nullCheck(value)==false){
            return false;
        }
        if(value.length<min){
            return false;
        }
        if(value.length>max){
            return false;
        }
        return true;
    }
       

        ////////////////////////////////导入、导出、模板下载///////////////////////////////////////////

            //批量导入
        function batchUpload(){
            var frameType = 10011;
            if($scope.vm.botSelectValue=="root"){
                layer.msg("请选择类目");
                return;
            }
            var dialog1 = ngDialog.openConfirm({
                template:"/static/business_modeling/frame_database/frame_select_dialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e==10011){
                        frameType=10011;
                        batchUploadFrame(frameType)
                    }else if(e==10012){
                        frameType=10012;
                        batchUploadFrame(frameType)
                    }else if(e==10013){
                        frameType=10013;
                        batchUploadFrame(frameType)
                    }
                }
            });
        }

        function batchUploadFrame(frameType){
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/batch_upload.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    //refresh
                    loadFrameLibrary(1,0);
                }
            });
            if(dialog){
                $timeout(function () {
                    initUpload('/api/ms/modeling/frame/batchAdd?applicationId='+categoryApplicationId+'&modifierId='+categoryModifierId+'&categoryId='+$scope.vm.botSelectValue+'&frameTypeId='+frameType);
                }, 100);
            }
        }

        function downloadTemplate(){
            var frameTemplate = "frame_faq_template.xlsx";
            var dialog = ngDialog.openConfirm({
                template:"/static/business_modeling/frame_database/frame_select_dialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e==10011){
                        frameTemplate="frame_faq_template.xlsx";
                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","",frameTemplate);
                    }else if(e==10012){
                        frameTemplate="frame_concept_template.xlsx";
                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","",frameTemplate);
                    }else if(e==10013){
                        frameTemplate="frame_element_template.xlsx";
                        downloadFile("/api/ms/knowledgeManage/downloadKnowledgeTemplate","",frameTemplate);
                    }
                }
            });
        }

        function exportAll(){
            var frameType = 10011;
            if($scope.vm.botSelectValue=="root"){
                layer.msg("请选择类目");
                return;
            }
            var dialog1 = ngDialog.openConfirm({
                template:"/static/business_modeling/frame_database/frame_select_dialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e==10011){
                        frameType=10011;
                        exportAllDialog(frameType)
                    }else if(e==10012){
                        frameType=10012;
                        exportAllDialog(frameType)
                    }else if(e==10013){
                        frameType=10013;
                        exportAllDialog(frameType)
                    }
                }
            });
        }

        function exportAllDialog(frameType){
            httpRequestPost("/api/ms/modeling/frame/export",{
                "frameCategoryId": $scope.vm.botSelectValue,
                "frameTypeId": frameType
            },function(data){
                if(responseView(data)==true){
                    if(data.exportFileNameList.length>0){
                        downloadFile("/api/ms/modeling/downloadWithPath",data.filePath,data.exportFileNameList[0]);
                    }
                }
            },function(err){
            });
        }


    }
])};