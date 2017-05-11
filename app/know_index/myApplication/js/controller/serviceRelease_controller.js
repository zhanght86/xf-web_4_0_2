/**
 * Description:发布服务管理页面的控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 9:59
 */
angular.module('myApplicationSettingModule').controller('serviceReleaseController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout) {
        $scope.vm = {
            applicationId: $cookieStore.get("applicationId"),
            serviceData : "",   // 服务列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            dataTotal: "", //发布服务数据记录总数

            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务
            deleteService : deleteService, //删除服务

            editService : editService, //编辑服务
            addAndPublishService : addAndPublishService, //发布及编辑服务弹窗

            appName : "", //应用名称
            categoryIds : [], //分类id列表
            channels : [], //渠道id列表
            dimensionSelected : [], //选中的维度列表
            dimensionAll : [],//所有的维度列表
            originDimensionAll : [], //原始所有的维度列表，同上
            dimensions: [], //选中的维度id
            nodeCode : "", //节点编号
            serviceId : "", //服务id
            serviceName: "", //服务名称
            serviceStatus : 0, //服务状态
            serviceType : 10, //服务类型
            userId : $cookieStore.get("userId"), //获取用户id

            categoryData : "", //分类数据
            channelData : "", //渠道数据
            dimensionData : "", //维度数据
            typeData : "", //类型数据
            nodeData : "", //节点数据

            dialogTitle : "",  //对话框标题
            allowSubmit : 1, //是否允许提交

            selectChannel : selectChannel, //选择渠道
            listCategory : listCategory,  //弹出分类对话框
            listNodeData : listNodeData, //获取可用节点数据
            listChannelData : listChannelData, //获取渠道数据
            listTypeData : listTypeData,//获取发布类型数据
            listDimensionData : listDimensionData, //获取维度数据


            findServiceByServiceId : findServiceByServiceId, //根据服务id查询服务信息

            botRoot : "",     //根节点
            newCategoryIds : [],  //选中的分类节点

            //flagDialog : true, //发布按钮是否可点击，默认不可点击

            verifyRelease : verifyRelease, //发布服务校验
        };


        listDimensionData(); //获取维度数据
        listChannelData();  //获取渠道数据
        listTypeData();//获取发布类型数据


        //根据服务id查询服务信息
        function findServiceByServiceId(serviceId){
            $scope.vm.dialogTitle="编辑服务";
            httpRequestPost("/api/application/service/findServiceById",{
                "serviceId": serviceId
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
                        "serviceId": serviceId
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
        }

        //校验服务发布
        function verifyRelease(){

        }

        //添加并发布服务
        function addAndPublishService(){
            listNodeData(); //获取可用节点数据
            $scope.vm.dialogTitle="发布新服务";
            initPublishServiceInput();
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NewServiceRelease.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1) {
                        $scope.vm.dimensions=$scope.vm.dimensionSelected.id;

                        console.log("维度"+$scope.vm.dimensions);
                        if($scope.vm.serviceName==null||$scope.vm.serviceName==""){
                            layer.msg("发布服务的名称不能为空!");
                            $scope.vm.allowSubmit=0;
                            return;
                        }
                        if($scope.vm.channels==null||$scope.vm.channels.length==0){
                            angular.forEach($scope.vm.channelData,function(channel){
                                $scope.vm.channels.push(channel.channelId);
                            });
                            //layer.msg("发布服务时未选择渠道!");
                            //$scope.vm.allowSubmit=0;
                            //return;
                        }
                        if($scope.vm.dimensions==null||$scope.vm.dimensions.length==0){
                            angular.forEach($scope.vm.dimensionAll,function(dimension){
                                $scope.vm.dimensionSelected.push(dimension);
                            });
                            $scope.vm.dimensions=$scope.vm.dimensionSelected.id;
                            //layer.msg("发布服务时未选择发布维度!");
                            //$scope.vm.allowSubmit=0;
                            //return;
                        }
                        if($scope.vm.categoryIds==null||$scope.vm.categoryIds.length==0){
                            layer.msg("发布服务时未选择分类!");
                            $scope.vm.allowSubmit=0;
                            return;
                        }
                        if($scope.vm.nodeCode==null||$scope.vm.nodeCode==""){
                            layer.msg("发布服务时未选择发布节点!");
                            $scope.vm.allowSubmit=0;
                            return;
                        }


                        if($scope.vm.allowSubmit){  //服务名称验证没有错误
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
                                    listServiceData(1);
                                }else{
                                    layer.msg("新增发布服务失败");
                                }
                            },function(){
                                layer.msg("请求失败")
                            })
                        }
                    }
                    initPublishServiceInput();
                }
            });
        }

        function initPublishServiceInput(){
            $scope.vm.categoryIds=[]; //分类id列表
            $scope.vm.newCategoryIds=[]; //选择的分类id
            $scope.vm.channels=[]; //渠道id列表
            $scope.vm.dimensions=[]; //维度id列表
            $scope.vm.nodeCode=""; //节点编号
            $scope.vm.serviceName=""; //服务名称
            $scope.vm.serviceType=""; //服务类型
            $scope.vm.dimensionSelected=[];  //选中的维度
            $scope.vm.dimensionAll=$scope.vm.originDimensionAll;  //所有的维度
        }

        //编辑服务
        function editService(serviceId){
            findServiceByServiceId(serviceId);
            listNodeData(); //获取可用节点数据
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationRelease/NewServiceRelease.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1) {
                        console.log($scope.vm.allowSubmit);
                        if($scope.vm.allowSubmit){  //服务名称验证没有错误
                            $scope.vm.dimensions=$scope.vm.dimensionSelected.id;
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
                                    listServiceData(1);
                                }else{
                                    layer.msg("新增发布服务失败");
                                }
                            },function(){
                                layer.msg("请求失败")
                            })
                        }
                    }
                    initPublishServiceInput();
                }
            });



        }

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listServiceData(1);
        //请求服务列表
        function listServiceData(index){
            httpRequestPost("/api/application/service/listServiceByPage",{
                "applicationId": $scope.vm.applicationId,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.serviceData = data.data;
                $scope.vm.dataTotal =data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vm.pageSize,//每页记录数
                    pagesLength: 8,//分页框显示数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                listServiceData(current);
            }
        });

        //发布服务
        function publishService(serviceId){
            httpRequestPost("/api/application/service/publishService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("发布服务成功");
                    listServiceData(1);
                }else{
                    layer.msg("发布服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //上线服务
        function startService(serviceId){
            httpRequestPost("/api/application/service/startService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("上线服务成功");
                    listServiceData(1);
                }else{
                    layer.msg("上线服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }
        //下线服务
        function stopService(serviceId){
            httpRequestPost("/api/application/service/stopService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("下线服务成功");
                    listServiceData(1);
                }else{
                    layer.msg("下线服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //重启服务
        function restartService(serviceId){
            httpRequestPost("/api/application/service/restartService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("重启服务成功");
                    listServiceData(1);
                }else{
                    layer.msg("重启服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
        }

        //删除服务
        function deleteService(serviceId){
            httpRequestPost("/api/application/service/deleteService",{
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    layer.msg("删除服务成功");
                    listServiceData(1);
                }else{
                    layer.msg("删除服务失败");
                }
            },function(){
                layer.msg("请求失败");
            })
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

        //获取维度
        function  listDimensionData(){
            httpRequestPost("/api/application/dimension/list",{
                "applicationId" : $scope.vm.applicationId
            },function(data){
                if(data.data){
                    $scope.vm.dimensionAll = data.data;
                    $scope.vm.originDimensionAll=data.data;
                    $scope.$apply();
                }
            },function(err){
                layer.msg("获取维度失败，请刷新页面")
            });

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


        function relationBot(){
            getBotRoot();
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

    }
]);