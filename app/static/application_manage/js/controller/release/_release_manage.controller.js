/**
 * Description:发布服务管理页面的控制器
 * Author: chengjianhua@ultrapower.com.cn
 * Date: 2017/4/10 9:59
 */
angular.module('myApplicationSettingModule').controller('releaseManageController', [
    '$scope', 'localStorageService',"ApplicationServer" ,"$state" ,"ngDialog","$cookieStore","$timeout","$interval",
    function ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$cookieStore,$timeout,$interval){
        $scope.vm = {
            serviceList : "",   // 服务列表数据
            paginationConf :{   // 分页条件
                pageSize : 5 ,
                pagesLength : 10
            }  ,//分页条件
            nodeList : {     //节点数据
                available : [] ,  // 可用的
                using : ""         //自身
            },
            dialogTitle : "",  //对话框标题
            publishService : publishService,  //发布服务
            startService : startService, //上线服务
            stopService : stopService, //下线服务
            restartService : restartService, //重启服务
            deleteService : deleteService, //删除服务
            addOrEditService : addOrEditService, //发布及编辑服务弹窗

            categoryIds : [], //分类id列表
            channels : [], //渠道id列表
            dimensionSelected : [], //选中的维度列表
            nodeCode : "", //节点编号
            serviceName: "", //服务名称
            serviceStatus : 0, //服务状态
            serviceType : 10, //服务类型
            categoryData : "", //分类数据
            channelData : "", //渠道数据
            dimensionData : "", //维度数据
            serviceTypeList : "", //类型数据

            selectChannel : selectChannel, //选择渠道
            listCategory : listCategory,  //弹出分类对话框
            botRoot : "",     //根节点
            newCategoryIds : [],  //选中的分类节点

            //flagDialog : true, //发布按钮是否可点击，默认不可点击

            verifyRelease : verifyRelease //发布服务校验
        };

        queryServiceTypeList();//获取发布类型数据
        queryServiceList(1);    // 获取服务列表
        //请求服务列表
        function queryServiceList(index){
            ApplicationServer.queryServiceList.save({
                "applicationId": APPLICATION_ID,
                "index" : (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize
            },function(response){
                $scope.vm.serviceList = response.data;
                $scope.vm.paginationConf.totalItems = response.total ;
                $scope.vm.paginationConf.numberOfPages = response.total/$scope.vm.paginationConf.pageSize ;
            },function(error){console.log(error)})
        }
        //获取发布类型数据
        function queryServiceTypeList(){
            ApplicationServer.queryServiceTypeList.save({
            },function(data){
                if(data.status==200){
                    $scope.vm.serviceTypeList=data.data;
                }else{
                    layer.msg("查询服务类型失败");
                }
            },function(error){console.log(error)})
        }
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    queryServiceList(current);
                }, 100)
            }
        },true);

        //根据服务id查询服务信息
        function findServiceByServiceId(serviceId){
            $scope.vm.dialogTitle="编辑服务";
            ApplicationServer.queryServiceById.save({
                "serviceId": serviceId
            },function(data){
                if(data.status==200){
                    $scope.vm.categoryIds=data.data.categoryIds;//分类id列表
                    $scope.vm.newCategoryIds=data.data.categoryIds;//选中的分类初始化
                    $scope.vm.channels=data.data.channels;//渠道id列表
                    $scope.vm.nodeCode=data.data.nodeCode;//节点编号
                    $scope.vm.serviceName=data.data.serviceName;//服务名称
                    $scope.vm.serviceStatus=data.data.serviceStatus;//服务状态
                    $scope.vm.serviceType=data.data.serviceType;//服务类型
                    $scope.vm.dimensionSelected = [];  //重置维度
                    angular.forEach($scope.$parent.$parent.MASTER.dimensionList,function(dimension){
                        if(data.data.dimensions.inArray(dimension.dimensionId)){
                            $scope.vm.dimensionSelected.push(dimension);
                        }
                    });
                    ApplicationServer.queryParentNodeInfo.save({ // 获取此服务使用的节点
                        "nodeCode" : data.data.nodeCode
                    },function(data){
                        if(data.status==200){
                            $scope.vm.nodeList.using = data.data;
                            $scope.vm.nodeCode = data.data.nodeCode;
                        }else{
                            layer.msg("查询节点信息失败");
                        }
                    },function(error){console.log(error)})
                }else{
                    layer.msg("查询服务失败");
                }
            },function(error){console.log(error) })
        }
        //校验服务发布
        function verifyRelease(){
            if($scope.vm.serviceName==null||$scope.vm.serviceName==""){
                layer.msg("发布服务的名称不能为空!");
                return 0;
            }else if($scope.vm.categoryIds==null||$scope.vm.categoryIds.length==0){
                layer.msg("发布服务时未选择分类!");
                return 0;
            }else if($scope.vm.nodeCode==null||$scope.vm.nodeCode==""){
                layer.msg("发布服务时未选择发布节点!");
                return 0;
            }else if($scope.vm.serviceType==null||$scope.vm.serviceType==""){
                layer.msg("发布服务时未选择发布类型!");
                return 0;
            }else{
                return 1;
            }
        }
        //发布服务
        function publishService(serviceId){
            layer.confirm("确认发布服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index) {
                ApplicationServer.releaseService.save({
                    "serviceId": serviceId,
                    "applicationId": APPLICATION_ID,
                    "userId": USER_ID, //获取用户id
                    "userName": USER_LOGIN_NAME //获取用户名称
                }, function (data) {
                    if (data.status == 200) {
                        layer.msg("发布服务成功");
                        queryServiceList(1);
                    } else {
                        layer.msg("发布服务失败");
                    }
                }, function (error) {
                    console.log(error);
                })
            })
        }
        //上线服务
        function startService(serviceId){
            layer.confirm("确认上线服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.startService.save({
                    "serviceId": serviceId
                },function(data){
                    if(data.status==200){
                        layer.msg("上线服务成功");
                        queryServiceList(1);
                    }else{
                        layer.msg("上线服务失败");
                    }
                },function(error){console.log(error);});
            })
        }
        //下线服务
        function stopService(serviceId){
            layer.confirm("确认下线服务？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
               ApplicationServer.downService.save({
                   "serviceId": serviceId
               },function(response){
                   if(response.status==200){
                       layer.msg("下线服务成功");
                       queryServiceList(1);
                   }else{
                       layer.msg("下线服务失败");
                   }
               },function(error){console.log(error)})
            });
        }
        //重启服务
        function restartService(serviceId){
            layer.confirm("确认重启？",{
                btn:['确认','取消'],
                shade:false
            },function(index){
                ApplicationServer.restartService.save({
                    "serviceId": serviceId
                },function(response){
                    if(response.status==200){
                        layer.msg("重启服务成功");
                        queryServiceList(1);
                    }else{
                        layer.msg("重启服务失败");
                    }
                },function(error){console.log(error)});
            })
        }
        //删除服务
        function deleteService(serviceId){
            layer.confirm("确认删除当前服务？",{
                btn:['确认','取消'],
                shade:false
            },function(){
                ApplicationServer.removeService.save({
                    "serviceId": serviceId,
                    "applicationId": APPLICATION_ID,
                    "userId" : USER_ID, //获取用户id
                    "userName" : USER_LOGIN_NAME //获取用户名称
                },function(data){
                    if(data.status==200){
                        layer.msg("删除服务成功");
                        queryServiceList(1);
                    }else{
                        layer.msg("删除服务失败");
                    }
                },function(error){console.log(error)})
            });
        }

        //获取可用节点数据
        function queryAvailableNodeList(){
            ApplicationServer.queryAvailableNodeList.save({
                },function(data){
                    if(data.status==200){
                        $scope.vm.nodeList.available=data.data;
                    }else{
                        layer.msg("查询可用节点失败");
                    }
                },function(error){console.log(error)})
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
        //编辑服务
        function addOrEditService(serviceId){
            if(!serviceId){   // 新增
                $scope.vm.dialogTitle="发布新服务";
                $scope.vm.serviceId = "" ;
            }else{             //编辑服务
                 $scope.vm.dialogTitle="编辑服务";
                 $scope.vm.serviceId = serviceId ;
                 findServiceByServiceId(serviceId);
            }
            queryAvailableNodeList() ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/release/release_manage/release_service.html","700px",function(){
                var parameter = {
                    "applicationId": APPLICATION_ID,
                    "categoryIds" : $scope.vm.categoryIds, //分类id列表
                    "channels" : $scope.vm.channels, //渠道id列表
                    "dimensions" : $scope.vm.dimensionSelected.id, //维度id列表
                    "nodeCode" : $scope.vm.nodeCode, //节点编号
                    "serviceName": $scope.vm.serviceName, //服务名称
                    "serviceType" : $scope.vm.serviceType, //服务类型
                    "userId" : USER_ID, //获取用户id
                    "userName" : USER_LOGIN_NAME //获取用户名称
                } ;
                if(!serviceId){
                    ApplicationServer.addService.save(parameter,function(data){
                        if(data.status==200){
                            queryServiceList(1);
                        }else{
                            layer.msg("新增发布服务失败");
                        }
                    },function(error){console.log(error);})
                }else{
                    parameter.serviceId = serviceId ;
                    ApplicationServer.updateService.save(parameter,function(data){
                        if(data.status==200){
                            queryServiceList(1);
                        }else{
                            layer.msg("修改发布服务失败");
                        }
                    },function(error){console.log(error);})
                }
            },"",function(){
                initPublishServiceInput();
            })
        }
        //弹出分类对话框
        function listCategory(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/release/release_manage/add_classfy.html","",function(){
                $scope.vm.categoryIds=$scope.vm.newCategoryIds;
            },"","",2) ;
            $timeout(function(){
                relationBot()
            },200)
        }
        //重置弹框内容
        function initPublishServiceInput(){
            $scope.vm.categoryIds=[]; //分类id列表
            $scope.vm.newCategoryIds=[]; //选择的分类id
            $scope.vm.channels=[]; //渠道id列表
            $scope.vm.nodeCode=""; //节点编号
            $scope.vm.serviceName=""; //服务名称
            $scope.vm.serviceType=""; //服务类型
            $scope.vm.dimensionSelected=[];  //选中的维度
        }

        // bot 类目树 方法
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
                httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                    "categoryApplicationId": APPLICATION_ID,
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
                    httpRequestPost("/api/ms/modeling/category/listbycategorypid",{
                        "categoryApplicationId": APPLICATION_ID,
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