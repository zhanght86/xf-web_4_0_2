/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  客服 知识 总览
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('CustOverviewController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"$stateParams","ngDialog","$timeout","$cookieStore","$window","$rootScope","$location","$filter",
    ($scope,localStorageService,KnowledgeService, $state,$stateParams,ngDialog,$timeout,$cookieStore,$window,$rootScope,$location,$filter)=> {
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
            knowledgeIdList : [] ,// 此页知识id集合
            deleteIdList : [] ,   //要删除的知识i集合
            //fn
            exportExcel:exportExcel ,
            getData : getData ,             //数据获取
            delData : delData ,             //删除
            keySearch : keySearch,
            napSearch : napSearch ,
            heighSarch : false ,
            seekAdvanceParameter : {
                "classifyList" : null ,
                "knowledgeTitle": "",         //知识标题默认值null
                "knowledgeContent": "",        //知识内容默认值null
                "knowledgeCreator": "",        //作者默认值null
                "knowledgeExpDateEnd": "",        //知识有效期开始值默认值null
                "knowledgeExpDateStart": "",        //知识有效期结束值默认值null
                "sourceType": "",        //知识来源默认值"   ("":全部   120:单条新增  2：文档加工)
                "updateTimeType": 0 ,  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            } ,
            newKnowledge : "false", // 新增知识选择下拉
            jumpToNewKonwledge : jumpToNewKonwledge,  // 添加知识跳转页面
            selectedBot : [] ,
            paramsReset : paramsReset //搜索重置参数
        };
        console.log($location.search());
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
        //是否清空 搜索内容  true  清空 false 不清空
        //@1 分頁 false   @2初始化 true
        function napSearch(type){
            getData($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
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
                    "index": (index-1)*pageSize,
                    "pageSize": pageSize,
                    "title": $scope.vm.seekAdvanceParameter.knowledgeTitle || null,         //知识标题默认值null
                    "content": $scope.vm.seekAdvanceParameter.knowledgeContent || null ,        //知识内容默认值null
                    "account": $scope.vm.seekAdvanceParameter.knowledgeCreator || null,        //作者默认值null
                    "expDateEnd": $scope.vm.seekAdvanceParameter.knowledgeExpDateEnd || null ,        //知识有效期开始值默认值null
                    "expDateStart": $scope.vm.seekAdvanceParameter.knowledgeExpDateStart || null ,        //知识有效期结束值默认值null
                    "origin":$scope.vm.seekAdvanceParameter.sourceType || null,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                    "timeType": $scope.vm.seekAdvanceParameter.updateTimeType ,   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
                    "classifyId":$scope.vm.seekAdvanceParameter.classifyList,
                    "channel":130
                },function(response){
                    $scope.vm.knowledgeIdList = [] ;
                    $scope.vm.deleteIdList = [] ;
                    layer.close(i) ;
                    if(response.status == 200){
                        if(response.data.total){
                            $scope.vm.listData = response.data.data ;
                            $scope.vm.knowledgeIdList = response.data.data.map(item=>item.id) ;
                            $scope.vm.paginationConf.totalItems = response.data.total ;
                            $scope.vm.paginationConf.numberOfPages = response.data.total/pageSize ;
                        }else{
                            layer.msg("未查询到数据",{time:1000});
                            $scope.vm.listData = [];
                            $scope.vm.paginationConf.totalItems = 0 ;
                        }
                    }else{
                        layer.msg(response.info,{time:1000});
                        $scope.vm.listData = [];
                        $scope.vm.paginationConf.totalItems = 0 ;
                    }
                },function(error){
                    $scope.vm.deleteIdList = [] ;
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
            $scope.vm.selectedBot = [] ;
            $scope.vm.seekAdvanceParameter =  {
                "classifyList" : null ,
                "knowledgeType" : "" , //搜索知识类型
                "searchExtension" : "", //搜索的擴展問
                "knowledgeTitle": "",         //知识标题默认值null
                "knowledgeContent": "",        //知识内容默认值null
                "knowledgeCreator": "",        //作者默认值null
                "knowledgeExpDateEnd": "",        //知识有效期开始值默认值null
                "knowledgeExpDateStart": "",        //知识有效期结束值默认值null
                "sourceType": "",        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": 0   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            }
        }
        function delData(ids){
            if(ids.length === 0) {
                layer.msg("请选择删除知识",{time:800});
            }else{
                layer.confirm('是否删除当前选中知识？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    KnowledgeService.removeCustKnow.save({
                        "ids":ids
                    },function(response){
                        if(response.status == 200){
                            getData($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
                            layer.msg("刪除成功");
                        }
                    },function(error){console.log(error)})
                },function(){
                    console.log(1)
                });
            }
        }
        // 获取今日新增数量 --- temp
        // (function getNewNumber(){
        //     let today = $filter("date")(new Date().getTime(),"yyyy-MM-dd");
        //     KnowledgeService.queryCustNewNumber.save({
        //         "applicationId":APPLICATION_ID ,
        //         "updateTimeStart": today,        //知识有效期开始值默认值null
        //         "updateTimeEnd": today ,      //知识有效期结束值默认值null
        //         "channel":130
        //     },function(data){
        //         $scope.vm.newNumber = data.data;
        //     },function(error){console.log(error)})
        // })();
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
        (function(){
            KnowledgeService.queryChildNodes.get({"id":"root"},function (response) {
                if(response.status == 200){
                    $scope.vm.botRoot = response.data;
                }
            },function (error) {
                console.log(error)
            }) ;
        })() ;
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
            //获取bot全路径
            KnowledgeService.getBotFullPath.get({
                id: id
            },function(response){
                if(response.status = 200){
                    $scope.vm.selectedBot = response.data.split("/") ;
                }
            },function(error){console.log(error)});
            $scope.vm.seekAdvanceParameter.classifyList = id;
            napSearch() ;
            // KnowledgeService.queryChildNodes.get({"id":id},function (response) {
            //     if(response.status == 200){
            //         if(response.data.length){
            //             $scope.vm.seekAdvanceParameter.classifyList = response.data.map(item=>item.id);
            //         }else{
            //             $scope.vm.seekAdvanceParameter.classifyList = [];
            //         }
            //         napSearch()
            //     }
            // },function (error) {
            //     console.log(error)
            // }) ;
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
                        console.log(111)
                        var  html = '<ul class="'+itemClassName+'" >';
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
                            that.parents().next().slideDown().css("overflow","visible");
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