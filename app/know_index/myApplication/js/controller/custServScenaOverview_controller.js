
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('custServScenaOverviewController', [
    '$scope', 'localStorageService' ,"$state" ,"$stateParams","ngDialog","$timeout",
    function ($scope,localStorageService, $state,$stateParams,ngDialog,$timeout ) {
        $state.go("custServScenaOverview.manage",{userPermission:$stateParams.userPermission});
        var applicationId = getCookie("applicationId");

        //******************************************** //
        var n = 1;   // 定義淚目數  類別
        //********************************************//
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            //editName : editName
            //getCreatBot : getCreatBot,
            creatBot : [],
            frameCategoryId : "",
            knowledgeBotVal: "",
            knowledgeBot : knowledgeBot,
            botRoot : null,
            type : true,
            listData : [],
            //fn
            getData : getData ,
            delData : delData ,
            knowledgeTotal : null,
            newNumber : null ,
            getNewNumber : getNewNumber ,

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
            "sourceType": 0,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            "updateTimeType": 0 ,  //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)

            keySearch : keySearch,
            //getSourceType : getSourceType,
            //getUpdateTimeType : getUpdateTimeType,
        };

        function getSourceType(val){
            $scope.vm.sourceType = val
        }
        function getUpdateTimeType(val){
            $scope.vm.updateTimeType = val
        }


        getData();
        function getData(index){
            //alert()
            httpRequestPost("/api/knowledgeManage/overView/searchList",{
                "index": 0,
                "pageSize": $scope.vm.pageSize,
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
                "updateTimeType": $scope.vm.updateTimeType   //知识更新时间默认值0   (0:不限 1:近三天 2:近七天 3:近一月)
            },function(data){
                $scope.vm.listData = data.data.objs;
                $scope.vm.knowledgeTotal = data.data.total
                console.log(data);
                $scope.$apply();
            },function(){
                alert("err or err")
            });
        }

        function keySearch(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.vm.getData(1);
                }
        }
        function delData(){
            httpRequestPost("/api/knowledgeManage/overView/searchList",{
                "knowledgeIds":$scope.vm.knowledgeIds
            },function(data){
              layer.msg("刪除成功")
            },function(){
                layer.msg("刪除失败")
            });
        }
        function addDelIds(id,arr){
            if(arr.inArray(id)){
                arr.remove(id)
            }else{
                arr.push(id)
            }
        }
        getNewNumber();
        function getNewNumber(){
            httpRequestPost(" /api/knowledgeManage/overView/searchTotalAndToday",{
                "sceneIds": $scope.vm.sceneIds.length?$scope.vm.sceneIds:null,						//类目编号集默认值null（格式String[],如{“1”,”2”,”3”}）
                "knowledgeTitle": $scope.vm.knowledgeTitle,         //知识标题默认值null
                "knowledgeContent": $scope.vm.knowledgeContent,        //知识内容默认值null
                "knowledgeCreator": $scope.vm.knowledgeCreator,        //作者默认值null
                "knowledgeExpDateEnd": $scope.vm.knowledgeExpDateEnd,        //知识有效期开始值默认值null
                "knowledgeExpDateStart": $scope.vm.knowledgeExpDateStart,        //知识有效期结束值默认值null
                "sourceType":$scope.vm.sourceType,        //知识来源默认值0   (0:全部   1:单条新增  2：文档加工)
            },function(data){
                $scope.vm.newNumber = data.data.total
                console.log(data)
            },function(){
                layer.msg("查找今日新增条数失败")
            });
        }

////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        //{
        //    "categoryApplicationId": "360619411498860544",
        //    "categoryPid": "root"
        //}
        getBotRoot();
        //    getDimensions();
        //    getChannel();
        //点击 root 的下拉效果
        function  knowledgeBot(ev){
            var ele = ev.target;
            $timeout(function(){
                $(ele).next().slideToggle();
            },50)
        }

        //获取root 数据
        function getBotRoot(){
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId": applicationId,
                "categoryPid": "root"
            },function(data){
                console.log(data);
                $scope.vm.botRoot = data.data;
                $scope.$apply()
            },function(){
                alert("err or err")
            });
        }
        //点击更改bot value
        $(".aside-nav").on("click","span",function(){
            var id = angular.element(this).attr("data-option-id");
            $scope.vm.sceneIds.push(id);
            httpRequestPost("/api/modeling/category/listbycategorypid",{
                "categoryApplicationId":applicationId,
                "categoryPid": id
            },function(data){
                console.log(data);
                    angular.forEach(data.data,function(item){
                        $scope.vm.sceneIds.push(item.categoryId)
                    })
            },function(){});
            $scope.$apply();

        });
        //点击下一级 bot 下拉数据填充以及下拉效果
        $(".aside-nav").on("click",'.icon-jj',function(){
            var id = $(this).attr("data-option");
            var that = $(this);
            if(!that.parent().parent().siblings().length){
                //that.css("backgroundPosition","0% 100%");
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":applicationId,
                    "categoryPid": id
                },function(data){
                    //console.log(data)
                    if(data.data){
                        //type true +   false 》
                        //无叶节点
                        // 加号 跟 箭头 区别开
                        if($scope.vm.type){
                            var  html = '<ul class="menus_1 ">';
                            angular.forEach(data.data,function(item){
                                //1  存在叶节点   >
                                if(item.categoryLeaf){
                                    html+= '<li class="leafHover" data-option="'+item.categoryId+'">' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                        //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                        '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span><i class="icon-r icon-jt"></i>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }else{
                                    //不存在叶节点
                                    html+= '<li>' +
                                        '<div class="slide-a">'+
                                        ' <a class="ellipsis" href="javascript:;">'+
                                        //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                        '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                        '</a>' +
                                        '</div>' +
                                        '</li>'
                                }
                            });
                        }else{
                            //1  存在叶节点
                            //if(item.categoryLeaf){
                            //    html+= '<li>' +
                            //        '<div class="slide-a">'+
                            //        ' <a class="ellipsis" href="javascript:;">'+
                            //            '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                            //        '<span>'+item.categoryName+'</span>'+
                            //        '</a>' +
                            //        '</div>' +
                            //        '</li>'
                            //}else{
                            //    //不存在叶节点
                            //    html+= '<li>' +
                            //        '<div class="slide-a">'+
                            //        ' <a class="ellipsis" href="javascript:;">'+
                            //            //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                            //        '<span>'+item.categoryName+'</span>'+
                            //        '</a>' +
                            //        '</div>' +
                            //        '</li>'
                            //}
                        }
                        html+="</ul>";
                        $(html).appendTo((that.parent().parent().parent()));
                        //$timeout(function(){
                        //    that.parent().parent().next().slideDown()
                        //},2000);
                        $scope.vm.type = !$scope.vm.type;
                    }
                },function(err){
                    alert(err)
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

        //第二种  箭头添加 hover
        $(".aside-nav").on("mouseenter",'.leafHover',function(){
            var id = $(this).attr("data-option");
            //console.log(id)
            var that = $(this);
            //if(!that.parent().parent().siblings().length){
            //    that.css("backgroundPosition","0% 100%");
            if($(that).children().length==1){
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId":applicationId,
                    "categoryPid": id
                },function(data){
                    console.log(data);
                    if(data.data){
                        console.log(data);
                            n+=1;
                            if(!$scope.vm.type){
                                var  html = '<ul class="pas-menu_1 leaf'+n+'">';
                                angular.forEach(data.data,function(item){
                                    //1  存在叶节点
                                    if(item.categoryLeaf){
                                        console.log(1111);
                                        html+= '<li data-option="'+item.categoryId+'">' +
                                            '<div class="slide-a">'+
                                            ' <a class="ellipsis" href="javascript:;">'+
                                             '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                            '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span></i>'+
                                            '</a>' +
                                            '</div>' +
                                            '</li>'
                                    }else{
                                        //不存在叶节点
                                        html+= '<li data-option="'+item.categoryId+'">' +
                                            '<div class="slide-a">'+
                                            ' <a class="ellipsis" href="javascript:;">'+
                                                //'<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                                            '<span data-option-id="'+item.categoryId+'">'+item.categoryName+'</span>'+
                                            '</a>' +
                                            '</div>' +
                                            '</li>'
                                    }
                                });
                            }else{
                            //    console.log($scope.vm.type　+"sss");
                            //    var  html = '<ul class="pas-menu_1 leaf'+n+'">';
                            //    angular.forEach(data.data,function(item){
                            //    //1  存在叶节点
                            //    if(item.categoryLeaf){
                            //        html+= '<li>' +
                            //            '<div class="slide-a">'+
                            //            ' <a class="ellipsis" href="javascript:;">'+
                            //            '<i class="icon-jj" data-option="'+item.categoryId+'"></i>'+
                            //            '<span>'+item.categoryName+'</span>'+
                            //            '</a>' +
                            //            '</div>' +
                            //            '</li>'
                            //    }else{
                            //        //不存在叶节点
                            //        html+= '<li>' +
                            //            '<div class="slide-a">'+
                            //            ' <a class="ellipsis" href="javascript:;">'+
                            //                //'<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                            //            '<span>'+item.categoryName+'</span>'+
                            //            '</a>' +
                            //            '</div>' +
                            //            '</li>'
                            //    }
                            //})
                            }
                            html+="</ul>";
                            $(html).appendTo((that));
                            $(".leaf"+n).show();
                    }
                },function(err){
                    alert(err)
                });

        }else{
             $(that).children().eq(1).show()
            }
        });

        $(".aside-nav").on("mouseleave",'.leafHover',function(){
            var that = $(this);
            if($(that).children().length==2){
                $(that).children().eq(1).hide();
            }
            //$(".leaf"+n).remove();
        });

////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
    }]);