
/**
 * Created by mileS on 2017/4/3.
 * 控制器
 */
angular.module('knowledgeManagementModule').controller('custServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$timeout","$cookieStore","$window","$rootScope",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$timeout,$cookieStore,$window,$rootScope ) {
        //$state.go("custServScenaOverview");
        //******************************************** //
        var n = 1;   // 定義淚目數  類別
        //********************************************//
        $scope.vm = {
            applicationId : $cookieStore.get("applicationId"),
            applicationName : $cookieStore.get("applicationName"),
            imgUrl : $cookieStore.get("imgUrl"),
            robotHead : $cookieStore.get("robotHead"),
            //editName : editName
            //getCreatBot : getCreatBot,
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

            newKnowledge : "false",
            jumpToNewKonwledge : jumpToNewKonwledge,
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll //選擇全部
        };
        function jumpToNewKonwledge(id){
            var addUrl=null;
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
            }
            if(!addUrl)
                return ;
            var url = $state.href(addUrl);
            $window.open(url,'_blank');
            $scope.vm.newKnowledge = "false";
        }
        napSearch();
        //高级搜索 开关
        $scope.$watch("vm.heighSarch",function(val){
            if(val){
                angular.element(".advanced_search").slideDown()
            }else{
                angular.element(".advanced_search").slideUp()
            }
        });
        function napSearch(){
            getData(1);
            getNewNumber();
            $timeout(function(){
                setParams();
            },500);
        }
        function scan(item){
            var obj = {};
            obj.applicationId = $scope.vm.applicationId ;
            obj.knowledgeId = item.knowledgeId;
            obj.knowledgeType = item.knowledgeType;
            $window.knowledgeScan = obj ;
            var url = $state.href("custKnowledgePreview.manage");
            $window.open(url,'_blank');
            //$state.go("custKnowledgePreview.manage")
        }
        function getSourceType(val){
            $scope.vm.sourceType = val
        }
        function getUpdateTimeType(val){
            $scope.vm.updateTimeType = val
        }
        function getData(index){
            //console.log((index-1)*$scope.vm.pageSize);
            httpRequestPost("/api/ms/knowledgeManage/overView/searchList",{
                "applicationId" : $scope.vm.applicationId,
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
                console.log(data);
                $scope.vm.listData = data.data.objs;
                $scope.vm.knowledgeTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 10,//分页框数量
                };
                $scope.$apply();
                return true;
            },function(){
                console.log("getDate==failed");
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
        function setParams(){
            //重置 参数 问题
            $scope.vm.sceneIds = [],						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
            $scope.vm.knowledgeTitle = null,         //知识标题默认值null
            $scope.vm.knowledgeContent = null,        //知识内容默认值null
            $scope.vm.knowledgeCreator = null,        //作者默认值null
            $scope.vm.knowledgeExpDateEnd = null,        //知识有效期开始值默认值null
            $scope.vm.knowledgeExpDateStart = null,        //知识有效期结束值默认值null
            $scope.vm.sourceType =0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            $scope.vm.updateTimeType = 0 , //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            $scope.vm.heighSarch = false
        }
        function delData(){
            if(!$scope.vm.knowledgeIds || $scope.vm.knowledgeIds.length === 0)
            {
                layer.msg("请选择删除知识");
                return;
            }
            //console.log($scope.vm.knowledgeIds);
            httpRequestPost("/api/ms/knowledgeManage/overView/deleteKnowledge",{
                "knowledgeIds":$scope.vm.knowledgeIds
            },function(data){
                $state.reload();
                layer.msg("刪除成功");
            },function(){
                layer.msg("刪除失败");
            });
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
            httpRequestPost(" /api/ms/knowledgeManage/overView/searchTotalAndToday",{
                "applicationId" : $scope.vm.applicationId,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            },function(data){
                $scope.vm.newNumber = data.data.total;
                //console.log(data)
                return true;

            },function(){
                layer.msg("查找今日新增条数失败")
            });
        }

////////////////////////////////////// ///          Bot      /////////////////////////////////////////////////////
        getBotRoot();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }
        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId": $scope.vm.applicationId,
                "categoryPid": "root"
            },function(data){
                //console.log(data);
                $scope.vm.botRoot = data.data;
                $scope.$apply()
            },function(){
                console.log("getDate==failed")
            });
        }
        //点击更改bot value
        $(".aside-nav").on("click","span",function(){
            var id = angular.element(this).attr("data-option-id");
            $scope.vm.sceneIds.push(id);
            httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                "categoryApplicationId":$scope.vm.applicationId,
                "categoryPid": id
            },function(data){
                    angular.forEach(data.data,function(item){
                        $scope.vm.sceneIds.push(item.categoryId)
                    });
                napSearch()
            },function(){});
            $scope.$apply();
            //console.log( $scope.vm.sceneIds)
        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-nav").on("click",'.ngBotAdd',function(){
            var id = $(this).attr("data-option-id");
            var that = $(this);
            var isEdg = that.hasClass('icon-jj') ;
            if(!that.parent().siblings().length){
                if(isEdg){
                    that.css("backgroundPosition","0% 100%");
                }
                httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                    "categoryApplicationId":$scope.vm.applicationId,
                    "categoryPid": id
                },function(data){
                    if(data.data){
                            var itemClassName = isEdg?"menu_1":"pas-menu_1";
                            var leafClassName = isEdg?"icon-ngJj":"icon-jj";
                            var  html = '<ul class="'+itemClassName+'">';
                            angular.forEach(data.data,function(item){
                                //1  存在叶节点   >
                                if(item.categoryLeaf){
                                    html+= '<li data-option-id="'+item.categoryId+'"class="slide-a  bg50 bgE3">' +
                                            //'<div class="slide-a  bg50 bgE3">'+
                                                ' <a class="ellipsis bg50" href="javascript:;">'+
                                                    '<i class="'+leafClassName+' ngBotAdd" data-option-id="'+item.categoryId+'"></i>'+
                                                    '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                                '</a>' +
                                            //'</div>' +
                                         '</li>'
                                }else{
                                    //不存在叶节点
                                    html+= '<li class="bg50 bgE3" data-option-id="'+item.categoryId+'"class="slide-a  bg50 bgE3">' +
                                        //'<div class="slide-a  bg50 bgE3">'+
                                        ' <a class="ellipsis bg50" href="javascript:;">'+
                                        '<i class="'+leafClassName+'" style="background:0" data-option-id="'+item.categoryId+'"></i>'+
                                        '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                        '</a>' +
                                        //'</div>' +
                                        '</li>'
                                }
                            });
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent()));
                        $timeout(function(){
                            that.parents().next().slideDown()
                        },50) ;
                    }
                },function(err){
                    console.log("getDate==failed");
                });
            }else{
                if(that.css("backgroundPosition")=="0% 0%"){
                    that.css("backgroundPosition","0% 100%");
                    that.parent().next().slideDown()
                }else{
                    that.css("backgroundPosition","0% 0%");
                    that.parent().next().slideUp()
                }
            }
        });

        //第二种  箭头添加 hover
        //$(".aside-nav").on("mouseenter",'.leafHover',function(){
        //    var id = $(this).attr("data-option-id");
        //    $(this).addClass("");
        //    //console.log(id)
        //    var that = $(this);
        //    if($(that).children().length==1){
        //        httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
        //            "categoryApplicationId":$scope.vm.applicationId,
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