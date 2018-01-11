/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  客服 知识 总览
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('CustOverviewController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"$stateParams","ngDialog","$timeout","$cookieStore","$window","$rootScope","$location",
    ($scope,localStorageService,KnowledgeService, $state,$stateParams,ngDialog,$timeout,$cookieStore,$window,$rootScope,$location)=> {
        $scope.vm = {
            botRoot : "",
            listData : [],           //知识列表
            newNumber : null ,       //新增条数
            paginationConf : {       // 分页
                pageSize :$location.search().pageSize?$location.search().pageSize:5 ,
                currentPage: $location.search().currentPage?$location.search().currentPage:1 ,
                search : getData,
                location : true
            } ,
            //fn
            exportExcel:exportExcel ,
            getData : getData ,             //数据获取
            delData : delData ,             //删除
            knowledgeIds : [], //刪除 id ，
            addDelIds : addDelIds ,
            keySearch : keySearch,
            napSearch : napSearch ,
            heighSarch : false ,
            seekAdvanceParameter : {
                // "knowledgeType" : "" , //搜索知识类型
                // "searchExtension" : "", //搜索的擴展問
                classifyList : [] ,
                "knowledgeTitle": "",         //知识标题默认值null
                "knowledgeContent": "",        //知识内容默认值null
                "knowledgeCreator": "",        //作者默认值null
                "knowledgeExpDateEnd": "",        //知识有效期开始值默认值null
                "knowledgeExpDateStart": "",        //知识有效期结束值默认值null
                "sourceType": 0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": 0 ,  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            } ,
            newKnowledge : "false", // 新增知识选择下拉
            jumpToNewKonwledge : jumpToNewKonwledge,  // 添加知识跳转页面
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll  ,//選擇全部

            selectedBot : [] ,
            paramsReset : paramsReset //搜索重置参数
        };
        function jumpToNewKonwledge(id){
            var addUrl;
            switch(id){
                case "100" :
                    addUrl = "KM.faq";
                    break;
                case "101":
                    addUrl = "KM.concept";
                    break;
                case "102" :
                    addUrl = "KM.list";
                    break;
                case "103" :
                    addUrl = "KM.factor";
                    break;
            }
            $state.go(addUrl) ;
        }
        // 初始化 数据
        napSearch(false);
        //高级搜索 开关
        $scope.$watch("vm.heighSarch",function(val){
            if(val){
                angular.element(".advanced_search").slideDown()
            }else{
                angular.element(".advanced_search").slideUp()
            }
        });
        // 1 scenesIds
        // 2 title
        // 3 heighsearch

        //是否清空 搜索内容  true  清空 false 不清空
        //@1 分頁 false   @2初始化 true
        function napSearch(type){
            getData(1,$scope.vm.paginationConf.pageSize);
            getNewNumber();
            if(type){
                $timeout(function(){
                    $scope.vm.paramsReset();
                },500);
            }
            $scope.vm.heighSarch = false ;
        }

        /**
         * 知识导出
         * @param index
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID+"&knowledgeTitle="+$scope.vm.knowledgeTitle +
                "&knowledgeContent="+$scope.vm.knowledgeContent+"&knowledgeCreator="+$scope.vm.knowledgeCreator+
                "&knowledgeExpDateEnd="+$scope.vm.knowledgeExpDateEnd+"&knowledgeExpDateStart="+$scope.vm.knowledgeExpDateStart+
                "&sourceType="+$scope.vm.sourceType+"&updateTimeType="+$scope.vm.updateTimeType;
                var url = KnowledgeService.custKnowExport+urlParams  ;//请求的url
            downLoadFiles(angular.element(".customer-over")[0],url)
        }
        function getData(index,pageSize){
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
            KnowledgeService.queryCustKnowList.save({
                    "applicationId":APPLICATION_ID ,
                    "type":0 ,
                    "index": (index-1)*pageSize,
                    "pageSize": pageSize,
                    "title": $scope.vm.knowledgeTitle,         //知识标题默认值null
                    "content": $scope.vm.seekAdvanceParameter.knowledgeContent,        //知识内容默认值null
                    "account": $scope.vm.seekAdvanceParameter.knowledgeCreator,        //作者默认值null
                    "expDateEnd": $scope.vm.seekAdvanceParameter.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                    "expDateStart": $scope.vm.seekAdvanceParameter.knowledgeExpDateStart,        //知识有效期结束值默认值null
                    "origin":$scope.vm.seekAdvanceParameter.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                    "timeType": $scope.vm.seekAdvanceParameter.updateTimeType ,   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
                    "classifyId":[],
                    "channel":130
                },function(response){
                    $scope.vm.isSelectAll = false ;
                    $scope.vm.knowledgeIds = [] ;
                layer.close(i) ;
                    if(response.data.total){
                        $scope.vm.listData = response.data.objs;
                        $scope.vm.paginationConf.totalItems = response.data.total ;
                        $scope.vm.paginationConf.numberOfPages = response.data.total/$scope.vm.paginationConf.pageSize;
                    }else{
                        layer.msg("未查询到数据");
                        $scope.vm.listData = [];
                        $scope.vm.paginationConf.totalItems = 0 ;
                    }
                },function(error){
                    layer.close(i) ;
                    console.log(error);
                })
        }
        function keySearch(e){
                var  srcObj = e.srcElement ? e.srcElement : e.target;
                var keycode = window.e?e.keyCode:e.which;
                if(keycode==13){
                    srcObj.blur();
                    napSearch();
                    srcObj.blur();
                }
        }
        function paramsReset(){
            //重置 参数 问题
            // $scope.vm.classifyList = [],				//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
            $scope.vm.knowledgeTitle = null,         //知识标题默认值null
            $scope.vm.seekAdvanceParameter =  {
                "knowledgeType" : "" , //搜索知识类型
                "searchExtension" : "", //搜索的擴展問
                "knowledgeTitle": null,         //知识标题默认值null
                "knowledgeContent": null,        //知识内容默认值null
                "knowledgeCreator": null,        //作者默认值null
                "knowledgeExpDateEnd": null,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": null,        //知识有效期结束值默认值null
                "sourceType": 0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": 0   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            }
        }
        function delData(){
            if(!$scope.vm.knowledgeIds || $scope.vm.knowledgeIds.length === 0) {
                layer.msg("请选择删除知识",{time:800});
            }else{
                layer.confirm('是否删除当前选中知识？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    KnowledgeService.removeCustKnow.save({
                        "knowledgeIds":$scope.vm.knowledgeIds
                    },function(response){
                        getData($scope.paginationConf.currentPage,$scope.paginationConf.pageSize);
                        getNewNumber();
                        layer.msg("刪除成功");
                    },function(error){console.log(error)})
                });
            }
        }
        function selectAll(items){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false ;
                $scope.vm.knowledgeIds = [] ;
            }else{
                $scope.vm.isSelectAll = true ;
                $scope.vm.knowledgeIds = [] ;
                angular.forEach(items,function(val){
                    $scope.vm.knowledgeIds.push(val.knowledgeId)
                });
            }
        }
        function addDelIds(id,arr){
            if(arr.inArray(id)){
                arr.remove(id) ;
                $scope.vm.isSelectAll = false ;
            }else{
                arr.push(id)
            }
            console.log(id,arr) ;
        }
        function getNewNumber(){
            KnowledgeService.queryCustNewNumber.save({
                "applicationId":APPLICATION_ID ,
                "type":0 ,
                "title": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "content": $scope.vm.seekAdvanceParameter.knowledgeContent,        //知识内容默认值null
                "account": $scope.vm.seekAdvanceParameter.knowledgeCreator,        //作者默认值null
                "expDateEnd": $scope.vm.seekAdvanceParameter.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "expDateStart": $scope.vm.seekAdvanceParameter.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "origin":$scope.vm.seekAdvanceParameter.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "timeType": $scope.vm.seekAdvanceParameter.updateTimeType ,   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
                "classifyId":[],
                "channel":130
            },function(data){
                $scope.vm.newNumber = data.data.total;
            },function(error){console.log(error)})
        }

/////////////////////////////////////////          Bot      /////////////////////////////////////////////////////
        $("body").on('click',function(e){
                  e = event || window.event;
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            if($(srcObj).closest(".aside-nav").hasClass("aside-nav")){
                e.stopPropagation();
            }else{
                $(".aside-nav").find(".type1").children("ul").slideUp() ;
                $timeout(function(){
                    $(".aside-nav").find(".type1").children("a").find(".icon-jj").css("backgroundPosition","0% 0%");
                },50) ;
            }
        });
        //获取root 数据
        void function(){
            KnowledgeService.queryChildNodes.get({"id":"root"},function (response) {
                if(response.status == 200){
                    $scope.vm.botRoot = response.data;
                }
            },function (error) {
                console.log(error)
            }) ;
        }() ;
        //点击更改bot value
        //绑定点击空白隐藏（滚动条除外）

        $(".aside-nav").on("click","a",function(e){
            //初始化
            $scope.vm.paramsReset();
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            if(srcObj.tagName=='I'){
                return
            }else if(!$(this).parent().hasClass('type1')){
                $(".botPathactiveMouse").removeClass("botPathactiveMouse") ;
                $(".botPathactiveClick").removeClass("botPathactiveClick") ;
                $(this).addClass("botPathactiveClick") ;
            }

            var id = angular.element(this).find("span").attr("data-option-id");
            $scope.vm.sceneIds.push(id);
            //获取bot全路径
            KnowledgeService.getBotFullPath.get({
                id: id
            },function(response){
                if(response.status = 200){
                    $scope.vm.selectedBot = response.data.split("/") ;
                }
            },function(error){console.log(error)});
            KnowledgeService.queryChildNodes.get({"id":id},function (response) {
                if(response.status == 200){
                    angular.forEach(response.data,function(item){
                        $scope.vm.classifyList.push(item.id)
                    });
                    napSearch()
                }
            },function (error) {
                console.log(error)
            }) ;
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-nav").on("click",'.ngBotAdd',function(){
            var id = $(this).attr("data-option-id");
            var that = $(this);
            var isEdg = that.hasClass('icon-ngJj') ;

            // 侧边 只能有一个选项
            //非侧边 可以存在多个
            if(that.parent().hasClass('type1')){  //root bot
                return false
            }else if(!that.closest("ul").hasClass("pas-menu_1")){
                that.parent().parent().parent().siblings().each(function(index,item){
                    $(item).find("ul").hide()
                }) ;
            }
            if(!that.parent().siblings().length){   // 新增
                if(!isEdg){   //加号
                    that.css("backgroundPosition","0% 100%");
                }else{     //业务词
                    that.closest("li").siblings().each(function(index,item){   //同级隐藏
                        $(item).find("ul").hide().find(".icon-jj ").css("backgroundPosition","0% 0%") ;
                    }) ;
                    that.closest("ul.menu_1").parent().siblings().each(function(index,item){   //父级元素兄弟元素所有子集隐藏
                        $(item).find("ul.pas-menu_1").hide() ;
                    })
                }
                //请求BOT数据 组装DOM
                KnowledgeService.queryChildNodes.get({"id":id}).$promise.then(function (response) {
                    if(response.status == 200){
                        var itemClassName = isEdg?"pas-menu_1":"menu_1";
                        var leafClassName = isEdg?"icon-jj":"icon-ngJj";
                        var  html = '<ul class="'+itemClassName+'" style="overflow:visible">';
                        //已经移除 icon-ngJj  ngBotAdd 样式 所有的应用于选择
                        angular.forEach(response.data,function(item){
                            var typeClass ;
                            // 叶子节点 node
                            if((item.leaf == 0) && (item.relation != "edge" )){
                                typeClass = "bot-noBg"　;
                            }else if((item.leaf != 0) && (item.relation == "edge" )){
                                typeClass = "bot-edge"　;
                            }else if((item.leaf != 0) && (item.relation == "node" )){
                                typeClass = "icon-jj"
                            }
                            var  backImage ;
                            switch(item.type){
                                case 160 :
                                    backImage = " bot-divide" ;
                                    break  ;
                                case 161 :
                                    backImage = " bot-process";
                                    break  ;
                                case 162 :
                                    backImage = " bot-attr" ;
                                    break  ;
                                case 163 :
                                    backImage = " bot-default" ;
                                    break  ;
                            }
                            html+= '<li data-option-id="'+item.id+'" class="slide-a">' +
                                '<a class="ellipsis bg50" href="javascript:;">'+
                                '<i class="'+leafClassName+" "+backImage+" "+typeClass+' ngBotAdd" data-option-id="'+item.id+'"></i>'+
                                '<span data-option-id="'+item.id+'">'+item.name+'</span>'+
                                '</a>' +
                                '</li>' ;
                        });
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent()));
                        $timeout(function(){
                            that.parents().next().slideDown()
                        },50) ;
                    }
                },function (error) {console.log(error)}) ;
            }else{  //操作当前 DOM 隐藏显示
                if(!isEdg){   //加号
                    if(that.css("backgroundPosition")=="0% 0%"){
                        that.css("backgroundPosition","0% 100%");
                        that.parent().next().slideDown()
                    }else{
                        that.css("backgroundPosition","0% 0%");
                        that.parent().next().slideUp() ;
                    }
                }else{       //业务词
                    that.parent().next().slideToggle() ;     //自身状态改变
                    that.closest("li").siblings().each(function(index,item){   //同级隐藏
                        $(item).find("ul").hide().find(".icon-jj ").css("backgroundPosition","0% 0%") ;
                    }) ;
                    that.closest("ul.menu_1").parent().siblings().each(function(index,item){   //父级元素兄弟元素所有子集隐藏
                        $(item).find("ul.pas-menu_1").hide() ;
                    })
                }
            }
        });
        $(".aside-nav").on("mouseenter",'.ellipsis',function() {
            var self = $(this) ;
            if(self.parent().hasClass('type1')){
                return false
            }else{
                if(self.hasClass("botPathactiveClick")){
                    return
                }else{
                    $(this).addClass("botPathactiveMouse")
                }
            }
        }) ;
        $(".aside-nav").on("mouseout",'.ellipsis',function() {
            var self = $(this) ;
            if(self.parent().hasClass('type1')){
                return  false
            }else{
                if(self.hasClass("botPathactiveClick")){
                    return
                }else{
                    self.removeClass("botPathactiveMouse")
                }
            }
        }) ;

    }])}