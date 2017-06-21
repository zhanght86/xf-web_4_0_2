
/**
 * Created by mileS on 2017/6/3
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('markServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$timeout","$cookieStore","$window",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$timeout,$cookieStore,$window ) {
        $state.go("markServScenaOverview.manage");
        //******************************************** //
        var n = 1;   // 定義淚目數  類別
        //********************************************//
        $scope.vm = {
            applicationName : $cookieStore.get("applicationName"),
            imgUrl : $cookieStore.get("imgUrl"),
            robotHead : $cookieStore.get("robotHead"),
            exportExcel : exportExcel ,
            creatBot : [],
            frameCategoryId : "",

            botRoot : null,
            type : true,
            listData : [],                  //页面展示内容
            //fn
            getData : getData ,             //数据获取
            delData : delData ,             //删除
            knowledgeTotal : null,         //知识总条数
            newNumber : null ,              //更新条数
            getNewNumber : getNewNumber ,  //获取更新条数

            knowledgeIds : [], //刪除 id ，
            addDelIds : addDelIds ,
            // params set
            "pageSize": 5,
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
            getSourceType : getSourceType,
            getUpdateTimeType : getUpdateTimeType,

            scan : scan ,   // 点击标题预览

            heighSarch : false ,
            selectAll : selectAll ,
            isSelectAll  : false ,  // 全选 删除
            paramsReset : paramsReset //搜索重置参数
        };
        /**
         * 知识导出
         * @param index
         */
        function exportExcel(){
            httpRequestPost("/api/ms/knowledgeManage/exportExcel",{
                "applicationId" : APPLICATION_ID,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,	//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": $scope.vm.updateTimeType   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            },function(data){
                if(data.status==500){
                    layer.msg("导出失败") 
                }else{
                    window.open("/api/ms/chatKnowledge/downloadExcel?fileName="+ data.data,"_blank");
                }
            },function(err){
                console.log(err);
            });

        }
        napSearch(false);
        //高级搜索 开关
        $scope.$watch("vm.heighSarch",function(val){
            if(val){
                angular.element(".advanced_search").slideDown()
            }else{
                angular.element(".advanced_search").slideUp()
            }
        });
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
        function scan(item){

            var obj = {};
            obj.applicationId = APPLICATION_ID ;
            obj.knowledgeId = item.knowledgeId;
            obj.knowledgeType = "104";
            $window.knowledgeScan = obj ;
            var url = $state.href("markKnowledgePreview.manage");
            $window.open(url,'_blank');
            //$state.go("custKnowledgePreview.manage")
        }
        function getSourceType(val){
            $scope.vm.sourceType = val
        }
        function getUpdateTimeType(val){
            $scope.vm.updateTimeType = val
        }
        getData(1) ;
        function getData(index){
            //console.log((index-1)*$scope.vm.pageSize);
            httpRequestPost("/api/ms/knowledgeManage/overView/searchList",{
                "applicationId" : APPLICATION_ID,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,	//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": $scope.vm.updateTimeType   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            },function(data){
                $scope.vm.listData = data.data.objs;
                $scope.vm.knowledgeTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 10,//分页框数量
                    //numberOfPages  : Math.ceil(data.data.total/5)
                };
                $scope.$apply();
                return true;
            },function(){
            });
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
            $scope.vm.sceneIds = [],						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                $scope.vm.knowledgeTitle = null,         //知识标题默认值null
                $scope.vm.knowledgeContent = null,        //知识内容默认值null
                $scope.vm.knowledgeCreator = null,        //作者默认值null
                $scope.vm.knowledgeExpDateEnd = null,        //知识有效期开始值默认值null
                $scope.vm.knowledgeExpDateStart = null,        //知识有效期结束值默认值null
                $scope.vm.sourceType =0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                $scope.vm.updateTimeType = 0  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
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
        }

        function delData(){
            if(!$scope.vm.knowledgeIds || $scope.vm.knowledgeIds.length === 0)
            {
                layer.msg("请选择删除知识",{time:800});
            }else{
                layer.confirm('是否删除当前选中知识？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    httpRequestPost("/api/ms/knowledgeManage/deleteKnowledge",{
                        "knowledgeIds":$scope.vm.knowledgeIds
                    },function(data){
                        $state.reload();
                        layer.msg("刪除成功",{time:1000});
                    },function(){
                        layer.msg("刪除失败",{time:1000});
                    });
                }, function(){
                });
            }
        }
        function getNewNumber(){
            httpRequestPost(" /api/ms/knowledgeManage/overView/searchTotalAndToday",{
                "applicationId" : APPLICATION_ID,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            },function(data){
                $scope.vm.newNumber = data.data.total;
                console.log(data)
                return true;

            },function(){
                layer.msg("查找今日新增条数失败")
            });
        }
/////////////////////////////////////////          Bot      /////////////////////////////////////////////////////
        $("body").on('click',function(e){
            e = event || window.event;
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            console.log($(srcObj).closest(".aside-nav").hasClass(".aside-nav")) ;
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
                        var  html = '<ul class="'+itemClassName+'">';
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
                            html+= '<li data-option-id="'+item.categoryId+'" class="slide-a">' +
                                '<a class="ellipsis bg50" href="javascript:;">'+
                                '<i class="'+leafClassName+" "+backImage+" "+typeClass+' ngBotAdd" data-option-id="'+item.categoryId+'"></i>'+
                                '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                '</a>' +
                                '</li>' ;

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

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
    }]);