/**
 * Created by mileS on 2017/4/3.
 * 客服 知识 总览
 */
angular.module('knowledgeManagementModule').controller('custOverviewController', [
    '$scope', 'localStorageService' ,"KnowledgeService","$state" ,"$stateParams","ngDialog","$timeout","$cookieStore","$window","$rootScope","$log",
    function ($scope,localStorageService,KnowledgeService, $state,$stateParams,ngDialog,$timeout,$cookieStore,$window,$rootScope,$log ) {
        //******************************************** //
        var n = 1;   // 定義淚目數  類別
        //********************************************//
        $scope.vm = {
            applicationName : APPLICATION_NAME,
            creatBot : [],
            frameCategoryId : "",
            botRoot : null,
            type : true,

            listData : [],           //知识列表
            newNumber : null ,       //新增条数
            paginationConf : {       // 分页
                pageSize : 5 ,
                pagesLength : 10
            } ,
            //fn
            exportExcel:exportExcel ,
            getData : getData ,             //数据获取
            delData : delData ,             //删除

            knowledgeIds : [], //刪除 id ，
            addDelIds : addDelIds ,
            // params set
            sceneIds : [] ,
            "knowledgeTitle": null,         //知识标题默认值null
            "knowledgeContent": null,        //知识内容默认值null
            "knowledgeCreator": null,        //作者默认值null
            "knowledgeExpDateEnd": null,        //知识有效期开始值默认值null
            "knowledgeExpDateStart": null,        //知识有效期结束值默认值null
            sourceType: 0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            "updateTimeType": 0 ,  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)

            keySearch : keySearch,
            napSearch : napSearch ,
            getUpdateTimeType : getUpdateTimeType,

            heighSarch : false ,
            knowledgeType : "" , //搜索知识类型
            searchExtension : "", //搜索的擴展問
            newKnowledge : "false", // 新增知识选择下拉
            jumpToNewKonwledge : jumpToNewKonwledge,
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll  ,//選擇全部

            selectedBot : [] ,
            paramsReset : paramsReset //搜索重置参数
        };
        function jumpToNewKonwledge(id){
            var addUrl;
            switch(id){
                case "100" :
                    addUrl = "knowledgeManagement.faqAdd";
                    break;
                case "101":
                    addUrl = "knowledgeManagement.singleAddConcept";
                    break;
                case "102" :
                    addUrl = "knowledgeManagement.listAdd";
                    break;
                case "103" :
                    addUrl = "knowledgeManagement.factorAdd";
                    break;
                case "106" :
                    addUrl = "knowledgeManagement.markKnow";
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
            getData(1);
            getNewNumber();
            if(type){
                $timeout(function(){
                    $scope.vm.paramsReset();
                },500);
            }
            $scope.vm.heighSarch = false ;
        }

        function getUpdateTimeType(val){
            $scope.vm.updateTimeType = val
        }

        /**
         * 知识导出
         * @param index
         */
        function exportExcel(){
            var sceneIds = $scope.vm.sceneIds.length?$scope.vm.sceneIds:null;
            //KnowledgeService.exportCustKnow.get({
            //    applicationId : APPLICATION_ID,
            //    sceneIds : sceneIds,
            //    knowledgeTitle : $scope.vm.knowledgeTitle?$scope.vm.knowledgeTitle:null ,
            //    knowledgeContent : $scope.vm.knowledgeContent ? $scope.vm.knowledgeContent : null,
            //    knowledgeCreator : $scope.vm.knowledgeCreator?$scope.vm.knowledgeCreator:null ,
            //    knowledgeExpDateEnd : $scope.vm.knowledgeExpDateEnd? $scope.vm.knowledgeExpDateEnd : null ,
            //    knowledgeExpDateStart : $scope.vm.knowledgeExpDateStart? $scope.vm.knowledgeExpDateStart : null ,
            //    sourceType : $scope.vm.sourceType  ,
            //    updateTimeType : $scope.vm.updateTimeType ,
            //}) ;
            var urlParams =
                "?applicationId="+APPLICATION_ID+"&sceneIds="+sceneIds +"&knowledgeTitle="+$scope.vm.knowledgeTitle +
                "&knowledgeContent="+$scope.vm.knowledgeContent+"&knowledgeCreator="+$scope.vm.knowledgeCreator+
                "&knowledgeExpDateEnd="+$scope.vm.knowledgeExpDateEnd+"&knowledgeExpDateStart="+$scope.vm.knowledgeExpDateStart+
                "&sourceType="+$scope.vm.sourceType+"&updateTimeType="+$scope.vm.updateTimeType;
                var url = "/api/ms/knowledgeManage/exportExcel"+urlParams  ;//请求的url
                $window.open(url,"_blank") ;
            //httpRequestPost("/api/ms/knowledgeManage/exportExcel",{
            //    "applicationId" : APPLICATION_ID,
            //    "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,	//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
            //    "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
            //    "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
            //    "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
            //    "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
            //    "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
            //    "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            //    "updateTimeType": $scope.vm.updateTimeType   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            //},function(data){
            //    if(data.status==500){
            //        layer.msg("导出失败")
            //    }else{
            //        window.open("/api/ms/chatKnowledge/downloadExcel?fileName="+ data.data,"_blank");
            //    }
            //},function(err){
            //    console.log(err);
            //});

        }

        function getData(index){
            KnowledgeService.queryCustKnowList.save({
                    "applicationId" : APPLICATION_ID,
                    "index": (index-1)*$scope.vm.paginationConf.pageSize,
                    "pageSize": $scope.vm.paginationConf.pageSize,
                    "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,	//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                    "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                    "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                    "knowledgeUpdate": $scope.vm.knowledgeCreator,        //作者默认值null
                    "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                    "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                    "knowledgeOrigin":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                    "updateTimeType": $scope.vm.updateTimeType ,   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
                    "knowledgeType" : $scope.vm.knowledgeType ,
                    "knowledgeExtensionQuestion" : $scope.vm.searchExtension
                },function(response){
                    $scope.vm.isSelectAll = false ;
                    $scope.vm.knowledgeIds = [] ;
                    if(response.data.total){
                        $scope.vm.listData = response.data.objs;
                        $scope.vm.paginationConf.totalItems = response.data.total ;
                        $scope.vm.paginationConf.numberOfPages = response.data.total/$scope.vm.paginationConf.pageSize;
                    }else{
                        layer.msg("未查询到数据");
                        $scope.vm.listData = [];
                        $scope.vm.paginationConf.totalItems = 0 ;
                    }
                },function(error){$log(error);})
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
              timeout = $timeout(function () {
                    getData(current);
              }, 100)

            }
        },true);
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
                $scope.vm.knowledgeType = "" ,
                $scope.vm.searchExtension = "",
                $scope.vm.sceneIds = [],				//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                $scope.vm.knowledgeTitle = null,         //知识标题默认值null
                $scope.vm.knowledgeContent = null,        //知识内容默认值null
                $scope.vm.knowledgeUpdate = null,        //作者默认值null
                $scope.vm.knowledgeCreator = null,          //作者默认为空
                $scope.vm.knowledgeExpDateEnd = null,        //知识有效期开始值默认值null
                $scope.vm.knowledgeExpDateStart = null,        //知识有效期结束值默认值null
                $scope.vm.sourceType =0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                $scope.vm.updateTimeType = 0  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
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
                    },function(data){
                        getData(1);
                        getNewNumber();
                        layer.msg("刪除成功");
                    },function(error){$log(error)})
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
                "applicationId" : APPLICATION_ID,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeUpdate": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            },function(data){
                $scope.vm.newNumber = data.data.total;
            },function(error){$log(error)})
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
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": APPLICATION_ID,
                "categoryPid": "root"
            },function(data){
                $scope.vm.botRoot = data.data;
                $scope.$apply()
            },function(){
                console.log("getDate==failed")
            });
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
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                "categoryId": id
            },function(data){
                $scope.vm.selectedBot = data.categoryFullName.split("/") ;
                console.log(data)
            },function(){});
            // 获取知识数据
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId":APPLICATION_ID,
                "categoryPid": id
            },function(data){
                angular.forEach(data.data,function(item){
                    $scope.vm.sceneIds.push(item.categoryId)
                });
                napSearch()
            },function(){});
            $scope.$apply();
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
                httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                    "categoryApplicationId":APPLICATION_ID,
                    "categoryPid": id
                },function(data){
                    console.log(data)  ;
                    if(data.data){
                            var itemClassName = isEdg?"pas-menu_1":"menu_1";
                            var leafClassName = isEdg?"icon-jj":"icon-ngJj";
                            var  html = '<ul class="'+itemClassName+'" style="overflow:visible;">';
                            //已经移除 icon-ngJj  ngBotAdd 样式 所有的应用于选择
                            angular.forEach(data.data,function(item){
                                var typeClass ;
                                // 叶子节点 node
                                if((item.categoryLeaf == 0) && (item.categoryAttributeName != "edge" )){
                                    typeClass = "bot-noBg"　;
                                }else if((item.categoryLeaf != 0) && (item.categoryAttributeName == "edge" )){
                                    typeClass = "bot-edge"　;
                                }else if((item.categoryLeaf != 0) && (item.categoryAttributeName == "node" )){
                                    typeClass = "icon-jj"
                                }
                                var  backImage ;
                                switch(item.categoryTypeId){
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
                                //1  存在叶节点   >
                                //if(item.categoryLeaf){
                                //    html+= '<li data-option-id="'+item.categoryId+'" class="slide-a  bg50 bgE3">' +
                                //    '<a class="ellipsis bg50" href="javascript:;">'+
                                    html+= '<li data-option-id="'+item.categoryId+'" class="slide-a">' +
                                                '<a class="ellipsis bg50" href="javascript:;">'+
                                                    '<i class="'+leafClassName+" "+backImage+" "+typeClass+' ngBotAdd" data-option-id="'+item.categoryId+'"></i>'+
                                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                                '</a>' +
                                             '</li>' ;
                                //}else{
                                //    //不存在叶节点
                                //    html+= '<li class="bg50 bgE3" data-option-id="'+item.categoryId+'" class="slide-a  bg50 bgE3">' +
                                //                ' <a class="ellipsis bg50" href="javascript:;">'+
                                //                    '<i class="'+leafClassName+'" style="background:0" data-option-id="'+item.categoryId+'"></i>'+
                                //                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                //                '</a>' +
                                //           '</li>'
                                //}
                            });
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent()));
                        $timeout(function(){
                            that.parents().next().slideDown()
                        },50) ;
                    }
                },function(err){
                    //console.log("getDate==failed");
                });
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
        //第二种  箭头添加 hover
        //$(".aside-nav").on("mouseenter",'.leafHover',function(){
        //    var id = $(this).attr("data-option-id");
        //    $(this).addClass("");
        //    //console.log(id)
        //    var that = $(this);
        //    if($(that).children().length==1){
        //        httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
        //            "categoryApplicationId":APPLICATION_ID,
        //            "categoryPid": id
        //        },function(data){
        //            //console.log(data);
        //            if(data.data){
        //                //console.log(data);
        //                    n+=1;
        //                        var  html = '<ul class="pas-menu_1 leaf'+n+'">';
        //                        angular.forEach(data.data,function(item){
        //                            //1  存在叶节点
        //                            if(item.categoryLeaf){
        //                                html+= '<li data-option-id="'+item.categoryId+'">' +
        //                                    '<div class="slide-a">'+
        //                                    ' <a class="ellipsis" href="javascript:;">'+
        //                                     '<i class="icon-ngJj ngBotAdd" data-option-id="'+item.categoryId+'"></i>'+
        //                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span></i>'+
        //                                    '</a>' +
        //                                    '</div>' +
        //                                    '</li>'
        //                            }else{
        //                                //不存在叶节点
        //                                html+= '<li data-option-id="'+item.categoryId+'">' +
        //                                    '<div class="slide-a">'+
        //                                    ' <a class="ellipsis" href="javascript:;">'+
        //                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
        //                                    '</a>' +
        //                                    '</div>' +
        //                                    '</li>'
        //                            }
        //                        });
        //                    }
        //            html+="</ul>";
        //            $(html).appendTo((that));
        //            $(".leaf"+n).show();
        //            //}
        //        },function(err){
        //            console.log("getDate==failed");
        //        });
        //
        //}else{
        //     $(that).children().eq(1).show()
        //    }
        //});
        //$(".aside-nav").on("mouseleave",'.leafHover',function(){
        //    var that = $(this);
        //    if($(that).children().length==2){
        //        $(that).children().eq(1).hide();
        //    }
        //});

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
    }])