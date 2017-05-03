/**
 * Description:发布服务控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/12 15:46
 */
angular.module('myApplicationSettingModule').controller('newServiceReleaseController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$stateParams","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$stateParams,$cookieStore,$timeout) {
        $scope.vm = {
            applicationId: $cookieStore.get("applicationId"),
            appName : "", //应用名称
            categoryIds : [], //分类id列表
            channels : [], //渠道id列表
            dimensionSelected : [], //选中的维度列表
            dimensionAll : [],//所有的维度列表
            dimensions: [], //选中的维度id
            //dimensionAll : "",//所有的维度列表
            nodeCode : "", //节点编号
            serviceId : $stateParams.serviceId, //服务id
            serviceName: "", //服务名称
            serviceStatus : 0, //服务状态
            serviceType : 0, //服务类型
            userId : $cookieStore.get("userId"), //获取用户id

            categoryData : "", //分类数据
            channelData : "", //渠道数据
            dimensionData : "", //维度数据
            typeData : "", //类型数据
            nodeData : "", //节点数据

            dialogTitle : "",  //对话框标题
            allowSubmit : 1, //是否允许提交

            selectChannel : selectChannel, //选择渠道
            selectType : selectType, //选择服务类型
            selectNode : selectNode, //选择节点

            listCategory : listCategory,  //弹出分类对话框
            listNodeData : listNodeData, //获取可用节点数据
            listChannelData : listChannelData, //获取渠道数据
            listTypeData : listTypeData,//获取发布类型数据
            listDimensionData : listDimensionData, //获取维度数据



            publish : publish, //发布服务
            cancelPublish : cancelPublish, //取消发布服务
            findServiceByServiceId : findServiceByServiceId, //根据服务id查询服务信息

            botRoot : "",     //根节点
            newCategoryIds : [],  //选中的分类节点

        };
        listDimensionData(); //获取维度数据
        findServiceByServiceId(); //根据服务id查询服务信息

        listNodeData(); //获取可用节点数据
        listChannelData();  //获取渠道数据
        listTypeData();//获取发布类型数据


        //根据服务id查询服务信息
        function findServiceByServiceId(){
            if($stateParams.serviceId!=null){
                $scope.vm.dialogTitle="编辑服务";
                httpRequestPost("/api/application/service/findServiceById",{
                    "serviceId": $stateParams.serviceId
                },function(data){
                    if(data.status==200){
                        console.log(data)
                        $scope.vm.appName=data.data.appName;//应用名称
                        $scope.vm.categoryIds=data.data.categoryIds;//分类id列表
                        $scope.vm.newCategoryIds=data.data.categoryIds;//选中的分类初始化
                        $scope.vm.channels=data.data.channels;//渠道id列表
                        console.log("查询结果"+data.data.channels);
                        //$scope.vm.dimensions=data.data.dimensions;//维度id列表
                        $scope.vm.nodeCode=data.data.nodeCode;//节点编号
                        $scope.vm.serviceName=data.data.serviceName;//服务名称
                        $scope.vm.serviceStatus=data.data.serviceStatus;//服务状态
                        $scope.vm.serviceType=data.data.serviceType;//服务类型
                        $scope.vm.serviceId=data.data.serviceId;//服务id
                        $scope.$apply();
                        httpRequestPost("/api/application/node/findParentNodeInfo",{
                            "nodeCode" : data.data.nodeCode
                        },function(data){
                            if(data.status==200){
                                $scope.vm.nodeData.push(data.data);
                                $scope.$apply();
                            }else{
                                layer.msg("查询节点信息失败");
                            }
                        },function(){
                            layer.msg("请求失败");
                        })
                        httpRequestPost("/api/application/service/listDimensionByServiceId",{
                            "serviceId": $stateParams.serviceId
                        },function(data1){
                            if(data1.status==200){
                                var dimensionSelected=[];
                                angular.forEach(data1.data,function(dimensionId){
                                    angular.forEach($scope.vm.dimensionAll,function(dimension){
                                        if(dimensionId==dimension.dimensionId){
                                            dimensionSelected.push(dimension);
                                            //$scope.vm.dimensionAll.remove(dimension);
                                        }
                                    });
                                });
                                $scope.vm.dimensionSelected=dimensionSelected;
                                $scope.$apply();

                            }else{
                                layer.msg("查询失败");
                            }
                        },function(){
                            layer.msg("请求失败");
                        })
                    }else{
                        layer.msg("查询服务失败");
                    }
                },function(){
                    layer.msg("请求失败");
                })
            }else{
                $scope.vm.dialogTitle="发布新服务";
            }
        }

        //发布服务
        function publish(){
            console.log($scope.vm.allowSubmit);
            if($scope.vm.allowSubmit){  //服务名称验证没有错误
                $scope.vm.dimensions=$scope.vm.dimensionSelected.id;
                if($scope.vm.serviceId!=null){
                    console.log("渠道id"+$scope.vm.channels);

                    httpRequestPost("/api/application/service/editService",{
                        "applicationId": $scope.vm.applicationId,
                        "categoryIds" : $scope.vm.categoryIds, //分类id列表
                        "channels" : $scope.vm.channels, //渠道id列表
                        "dimensions" : $scope.vm.dimensions, //维度id列表
                        "nodeCode" : $scope.vm.nodeCode, //节点编号
                        "serviceName": $scope.vm.serviceName, //服务名称
                        "serviceType" : $scope.vm.serviceType, //服务类型
                        "userId" : $scope.vm.userId, //获取用户id
                        "serviceId" : $scope.vm.serviceId //服务id
                    },function(data){
                        if(data.status==200){
                            $state.go("setting.releaseMan");
                        }else{
                            layer.msg("新增发布服务失败");
                        }
                    },function(){
                        layer.msg("请求失败")
                    })
                }else{
                    httpRequestPost("/api/application/service/addAndPublishService",{
                        "applicationId": $scope.vm.applicationId,
                        "categoryIds" : $scope.vm.categoryIds, //分类id列表
                        "channels" : $scope.vm.channels, //渠道id列表
                        "dimensions" : $scope.vm.dimensions, //维度id列表
                        "nodeCode" : $scope.vm.nodeCode, //节点编号
                        "serviceName": $scope.vm.serviceName, //服务名称
                        "serviceType" : $scope.vm.serviceType, //服务类型
                        "userId" : $scope.vm.userId //获取用户id
                    },function(data){
                        if(data.status==200){
                            $state.go("setting.releaseMan");
                        }else{
                            layer.msg("新增发布服务失败");
                        }
                    },function(){
                        layer.msg("请求失败")
                    })
                }
            }
        }


        //取消发布服务
        function cancelPublish(){
            $state.go("setting.releaseMan");
        }

        //获取渠道数据
        function listChannelData(){
            httpRequestPost("/api/application/channel/listChannels",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                if(data.status==200){
                    $scope.vm.channelData=data.data;
                    $scope.$apply();
                }else{
                    layer.msg("查询渠道失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }



        //获取发布类型数据
        function listTypeData(){
            httpRequestPost("/api/application/service/listServiceType",{
            },function(data){
                if(data.status==200){
                    $scope.vm.typeData=data.data;
                    $scope.$apply();
                }else{
                    layer.msg("查询服务类型失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //获取可用节点数据
        function listNodeData(){
            httpRequestPost("/api/application/node/listNoUsingNode",{
            },function(data){
                if(data.status==200){
                    $scope.vm.nodeData=data.data;
                    $scope.$apply();
                }else{
                    layer.msg("查询可用节点失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }


        //弹出分类对话框
        function listCategory(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NewServiceReleaseDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        $scope.vm.categoryIds=$scope.vm.newCategoryIds;
                    }
                }
            });
            $timeout(function(){
                relationBot()
            },200)
        }

        //选择渠道
        function selectChannel(channelId){
            if($scope.vm.channels==null){
                $scope.vm.channels=[];
            }
            var index=$scope.vm.channels.inArray(channelId);
            if(index){
                $scope.vm.channels.remove(channelId);
            }else{
                $scope.vm.channels.push(channelId);
            }
        }



        //选择服务类型
        function selectType(serviceType){
            $scope.vm.serviceType=serviceType;
        }
        //选择节点
        function selectNode(nodeCode){
            $scope.vm.nodeCode=nodeCode;
        }


        //获取维度
        function  listDimensionData(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensionAll = data.data;
                    $scope.$apply();

                }
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });

        }





////////////////////////////////////// ///          Bot     /////////////////////////////////////////////////////
        function relationBot(){
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
                },200)
            }

            //获取root 数据
            function getBotRoot(){
                httpRequestPost("/api/modeling/category/listbycategorypid",{
                    "categoryApplicationId": $scope.vm.applicationId,
                    "categoryPid": "root"
                },function(data){
                    //console.log(data);
                    $scope.vm.botRoot = data.data;
                    $scope.$apply()
                },function(){
                   layer.msg("获取BOT分类失败")
                });
            }
            //点击更改bot ids
            $(".aside-navs-cont").on("click",".botSelect",function(){
                var self = angular.element(this);
                var id = self.attr("data-option");
                if(self.prop("checked")){
                   $scope.vm.newCategoryIds.push(id);
                    $scope.$apply();
                    console.log($scope.vm.newCategoryIds);
                }else{
                    $scope.vm.newCategoryIds.remove(id);
                    $scope.$apply();
                    console.log($scope.vm.newCategoryIds);
                }
            });
            //点击下一级 bot 下拉数据填充以及下拉效果
            $(".aside-navs-cont").on("click",'.icon-jj',function(){
                var id = $(this).attr("data-option");
                console.log("点击的节点："+id);
                var that = $(this);
                if(!that.parent().parent().siblings().length){
                    that.css("backgroundPosition","0% 100%");
                    httpRequestPost("/api/modeling/category/listbycategorypid",{
                        "categoryApplicationId": $scope.vm.applicationId,
                        "categoryPid": id
                    },function(data){
                        if(data.data){
                            var  html = '<ul class="menus">';
                            for(var i=0;i<data.data.length;i++){
                                var checkbox="";
                                if($scope.vm.categoryIds!=null){
                                    //判断选中的分类是否为空
                                    checkbox = $scope.vm.categoryIds.inArray(data.data[i].categoryId);
                                }
                                html+= '<li>' +
                                    '<div class="slide-a">'+
                                    ' <a class="ellipsis" href="javascript:;">'+
                                    '<i class="icon-jj" data-option="'+data.data[i].categoryId+'"></i>'+
                                    '<input type="checkbox" class="botSelect" ';
                                if(checkbox){
                                    html+=' checked ';
                                }
                                html+='data-option="'+data.data[i].categoryId+'"/>'+
                                '<span>'+data.data[i].categoryName+'</span>'+
                                    '</a>' +
                                    '</div>' +
                                    '</li>'
                            }
                            html+="</ul>";
                            $(html).appendTo((that.parent().parent().parent()));
                            that.parent().parent().next().slideDown()
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
        }
////////////////////////////////////////           Bot     //////////////////////////////////////////////////////
    }

]).directive('checkServiceName', function($http){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c){
            scope.$watch(attrs.ngModel, function(n){
                if(!n) return;
                $http({
                    method: 'POST',
                    url: '/api/application/service/checkName',
                    data:{
                        serviceName: scope.vm.serviceName,
                        serviceId : scope.vm.serviceId
                    }
                }).success(function(data){
                    if(data.data){
                        c.$setValidity('unique', true);
                        scope.vm.allowSubmit=1;
                    }else{
                        c.$setValidity('unique', false);
                        scope.vm.allowSubmit=0;
                    }
                }).error(function(data){
                    c.$setValidity('unique', false);
                    scope.vm.allowSubmit=0;
                })
            });
        }
    }
});