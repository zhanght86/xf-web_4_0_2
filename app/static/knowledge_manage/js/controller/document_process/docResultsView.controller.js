/**
 * @author shaomingjin
 *  知识文档分析结果控制器
 */
angular.module('knowledgeManagementModule').controller('doc_results_viewController', [
    /*'$scope', 'DetailService','localStorageService','$state','$stateParams',"$timeout",'ngDialog','$cookieStore',*/
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","knowledgeAddServer","$window","$stateParams","DetailService","$filter",
    /*function ($scope,DetailService,localStorageService,$state,$stateParams,$timeout,ngDialog,$cookieStore) {*/
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,knowledgeAddServer,$window,$stateParams,DetailService,$filter) {
        var self = this;
        if($stateParams.knowDocId != null)
            $state.go("back.doc_results_view");
        $scope.knowDocId = $stateParams.knowDocId;
        $scope.knowDocCreateTime = $stateParams.knowDocCreateTime;
        $scope.knowDocUserName = $stateParams.knowDocUserName;

        $scope.vm={
            applicationId : $cookieStore.get("applicationId"),
            modifier: $cookieStore.get("userId"),
            knowIgnoreAllConfirm : knowIgnoreAllConfirm, //忽略全部
            knowAddAll : knowAddAll, //添加全部
            knowIgnoreConfirm :knowIgnoreConfirm, //忽略单条知识
            addKnowClass : addKnowClass, //添加知识点分类
            refreshFn : refreshFn,
            botRoot : "",      //根节点
            knowledgeBotVal : "",  //bot 内容
            botSelectAdd : botSelectAdd,
            botClassfy : [],   //类目
            creatSelectBot : [], //手选生成 bot
            stateUrlVal: "knowledgeManagement.faqAdd",
            stateUrl : [
                        {value:"knowledgeManagement.faqAdd", name:"FAQ知识"},
                        {value:"knowledgeManagement.singleAddConcept", name:"概念型知识"}
                       ],
            stateVal: 2,
            state : [{value:2, name:"FAQ知识"},
                     {value:3, name:"概念型知识"}],
            botTreeOperate:botTreeOperate,
            searchBotAutoTag:searchBotAutoTag,
            slideToggle:slideToggle

        };

        //点击bot分类的 加号
        function botSelectAdd(){
            if($scope.vm.botFullPath){
                $scope.vm.creatSelectBot.push($scope.vm.botFullPath);
                $scope.vm.botFullPath = "";
                $scope.vm.knowledgeBotVal = "";
            }
        }

        //滑动
        function slideToggle(el,callBack){
            $timeout(function(){
                angular.element(el).slideToggle();
            },50);
            if(callBack){
                callBack()
            }
        }

        //BOT搜索自动补全
        function searchBotAutoTag(el,url,callback){
            $(el).autocomplete({
                serviceUrl: url,
                type:'POST',
                params:{
                    "categoryName":$(el).val(),
                    "categoryAttributeName":"node",
                    "categoryApplicationId":APPLICATION_ID
                },
                paramName:'categoryName',
                dataType:'json',
                transformResult:function(data){
                    var result = {
                        suggestions : []
                    };
                    if(data.data){
                        angular.forEach(data.data,function(item){
                            result.suggestions.push({
                                data:item.categoryId,
                                value:item.categoryName,
                                type : item.categoryTypeId
                            })
                        }) ;
                    }
                    return result;
                },
                onSelect: function(suggestion) {
                    console.log(suggestion) ;
                    callback(suggestion) ;
                }
            });
        }

        /*bot*/
        function botTreeOperate(self1,initUrl,getNodeUrl,selectCall){
            console.log("=====coming=====");
            var tree = {
                init : function(){
                    httpRequestPost(initUrl,{
                        "categoryApplicationId": APPLICATION_ID,
                        "categoryPid": "root"
                    },function(data){
                        self1.vm.botRoot = data.data;
                    },function(error){
                        console.log(error)
                    });
                } ,
                getChildNode : getChildNode,
                selectNode : selectNode
            };
            function getChildNode(){
                $(".aside-navs").on("click",'i',function(){
                    var id = $(this).attr("data-option");
                    var that = $(this);
                    if(!that.parent().parent().siblings().length){
                        that.css("backgroundPosition","0% 100%");
                        httpRequestPost(getNodeUrl,{
                            "categoryApplicationId":APPLICATION_ID,
                            "categoryPid": id
                        },function(data){
                            console.log(data) ;
                            if(data.data){
                                var  html = '<ul class="menus">';
                                for(var i=0;i<data.data.length;i++){
                                    var typeClass ;
                                    // 叶子节点 node
                                    if((data.data[i].categoryLeaf == 0)){
                                        typeClass = "bot-leaf"　;
                                    }else if((data.data[i].categoryLeaf != 0) && (data.data[i].categoryAttributeName == "edge" )){
                                        typeClass = "bot-edge"　;
                                    }else if((data.data[i].categoryLeaf != 0) && (data.data[i].categoryAttributeName == "node" )){
                                        typeClass = "icon-jj"
                                    }
                                    var  backImage ;
                                    switch(data.data[i].categoryTypeId){
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
                                    html+= '<li>' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">' ;

                                    html+=            '<i class="'+typeClass + backImage +'" data-option="'+data.data[i].categoryId+'"></i>' ;

                                    html+=             '<span>'+data.data[i].categoryName+'</span>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }
                                html+="</ul>";
                                $(html).appendTo((that.parent().parent().parent()));
                                that.parent().parent().next().slideDown()
                            }
                        },function(err){
                            //layer.msg(err)
                        });
                    }else{
                        if(that.css("backgroundPosition")=="0% 0%"){
                            that.css("backgroundPosition","0% 100%");
                            that.parent().parent().next().slideDown()
                        }else{
                            that.css("backgroundPosition","0% 0%");
                            that.parent().parent().next().slideUp()
                        }
                    }
                });
            }
            function selectNode(){
                $(".aside-navs").on("click","span",function(){
                    //类型节点
                    var pre = $(this).prev() ;
                    angular.element(".icon-jj").css("backgroundPosition","0% 0%");
                    var id = pre.attr("data-option");
                    selectCall(id) ;   //添加bot分類
                    angular.element(".rootClassfy,.menus").slideToggle();
                    //$scope.$apply();
                    //}
                });
            }
            tree.init() ;
            tree.getChildNode() ;
            tree.selectNode() ;
            //return tree ;
        }

        // 获取Bot全路径
        function getBotFullPath(id){
            httpRequestPost("/api/ms/modeling/category/getcategoryfullname",{
                categoryId: id
            },function(data){
                if(data.status = 10000){
                    var allBot = angular.copy($scope.vm.creatSelectBot.concat($scope.vm.botClassfy)) ,
                        botResult = $scope.MASTER.isBotRepeat(id,data.categoryFullName.split("/"),"",allBot) ;
                    $scope.$apply(function(){
                        console.log(data) ;
                        $scope.vm.knowledgeBotVal = data.categoryFullName;
                        if(botResult != false){
                            //$scope.vm.knowledgeBotVal = data.categoryFullName.split("/");
                            $scope.vm.botFullPath= botResult;
                        }
                    });
                }
            },function(error){console.log(error)});
        }

        //  主页保存 获取参数
        function getParams(){
            var categoryIds = [];
            $.each($scope.vm.creatSelectBot,function(index,value){
                console.log($(value).classificationId);
                console.log(value.classificationId);
                categoryIds.push(value.classificationId);
            });
            var params =  {
                "applicationId": APPLICATION_ID,
                "userId" : USER_ID,
                "categoryIds" : categoryIds,
                "documentationId" : $scope.knowDocId,
                "knowledgeStatus" : $scope.vm.stateVal
            };
            return params
        }

//        提交 检验参数
        function checkSave(){
            var params = getParams();
            console.log(params) ;
            if(!params.categoryIds.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false;
            }else if(!params.documentationId){
                return false;
            }else{
                return true;
            }
        }

        /**
         * 刷新列表
         */
        function refreshFn(){
            $scope.queryDocKnowItems();
        }
        function knowIgnoreAllConfirm(){
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/document_know_process/doc_results_viewDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        $scope.ignoreDocKnowAll();
                    }
                }
            });
        }
        /**
         * 添加全部
         */
        function knowAddAll(){
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/document_know_process/doc_results_viewDialog_add_all.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                width:'775px',
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if(checkSave()){
                            httpRequestPost("/api/ms/knowledgeDocumentation/batchAddKnowledge",getParams(),function(data){
                                if(data.status == 200){
                                    layer.msg("添加成功");
                                }
                                console.log(data);
                            },function(error){
                                console.log(error)
                            });
                        }
                    }
                }
            });
            if(dialog){
                $timeout(function(){
                    botTreeOperate($scope,"/api/ms/modeling/category/listbycategorypid","/api/ms/modeling/category/listbycategorypid",getBotFullPath);
                    //BOT搜索自动补全
                    searchBotAutoTag(".botTagAuto","/api/ms/modeling/category/searchbycategoryname",function(suggestion){
                        $scope.$apply(function(){
                            var allBot = angular.copy($scope.vm.botClassfy.concat($scope.vm.creatSelectBot)) ,
                                botResult = $scope.MASTER.isBotRepeat(suggestion.data,suggestion.value.split("/"),suggestion.type,allBot) ;
                            $scope.vm.knowledgeBotVal = suggestion.value;
                            if(botResult != false){
                                $scope.vm.botFullPath= botResult;
                            }
                        })
                    });
                },100);
            }
        }
        function knowIgnoreConfirm(knowledgeId){
            var dialog = ngDialog.openConfirm({
                template:"/static/knowledgeManagement/document_know_process/doc_results_viewDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.info(knowledgeId);
                        $scope.ignoreDocKnow(knowledgeId);
                    }
                }
            });
        }
        function addKnowClass(knowledgeId, knowledgeTitle, knowledgeContent){
            if($cookieStore.get("sceneId") == 2){ //营销场景直接跳转到营销知识新增
                $state.go("knowledgeManagement.conceptAdd",{
                    data:angular.toJson({
                        'docmentation': {
                            'documentationId': $scope.knowDocId,
                            'knowDocCreateTime': $scope.knowDocCreateTime,
                            'knowDocUserName': $scope.knowDocUserName,
                            'knowledgeId': knowledgeId,
                            'documentationTitle': knowledgeTitle,
                            'documentationContext': knowledgeContent
                        }
                    })
                });
            }else{
                var dialog = ngDialog.openConfirm({
                    template:"/static/knowledgeManagement/document_know_process/doc_results_viewDialog_add.html",
                    scope: $scope,
                    closeByDocument:false,
                    closeByEscape: true,
                    showClose : true,
                    backdrop : 'static',
                    preCloseCallback:function(e){    //关闭回掉
                        if(e === 1){
                            $state.go($scope.vm.stateUrlVal,{
                                data:angular.toJson({
                                    'docmentation': {
                                        'documentationId': $scope.knowDocId,
                                        'knowDocCreateTime': $scope.knowDocCreateTime,
                                        'knowDocUserName': $scope.knowDocUserName,
                                        'knowledgeId': knowledgeId,
                                        'documentationTitle': knowledgeTitle,
                                        'documentationContext': knowledgeContent
                                    }
                                })
                            });
                        }
                    }
                });
            }
        }
        /**
         *  忽略知识点
         * @param knowledgeId
         */
        $scope.ignoreDocKnow = function (knowledgeId) {
            DetailService.ignoreDocKnow.save(
                {
                    "knowledgeId": knowledgeId,
                    "requestId": "string"
                },function(resource){
                    if(resource.status == 200){
                        $scope.vm.refreshFn();
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }

        /**
         *  忽略全部知识点
         * @param knowledgeId
         */
        $scope.ignoreDocKnowAll = function () {
            DetailService.ignoreDocKnowAll.save(
                {
                    "documentationId": $scope.knowDocId,
                    "requestId": "string"
                },function(resource){
                    if(resource.status == 200){
                        $scope.vm.refreshFn();
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }
        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            console.log()
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6,//分页框数量

            };
        }
        self.initSearch();

        //根据知识文档id查询相关知识条目
        $scope.queryDocKnowItems = function(){
            if(!$scope.knowDocId)
                return ;
            DetailService.queryDocKnowItems.save(
                {
                    "documentationId": $scope.knowDocId,
                    "knowledgeStatus" : 0, //未分类
                    "index": ($scope.SearchPOJO.currentPage-1)*$scope.SearchPOJO.pageSize,
                    "pageSize": $scope.SearchPOJO.pageSize,
                    "requestId": "string",
                },function(resource){
                    //分页数据没有状态
                    if(resource.status == 200){
                        $scope.paginationConf.totalItems = resource.data.total;
                        $scope.knowItems = resource.data.objs;
                    }
                },function(){
                    console.info("文档详情查询失败");
                })
        }

        //监听分页菜单的变化
        var timeout3;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout3) {
                $timeout.cancel(timeout3);
            }
            timeout3 = $timeout(function () {
                $scope.queryDocKnowItems();
            }, 350)
        }, true)
    }
])