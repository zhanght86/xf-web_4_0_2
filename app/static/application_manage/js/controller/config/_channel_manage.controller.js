/**
 * Created by mileS on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('channelManageController', [
    '$scope', 'localStorageService' ,"configurationServer","$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, configurationServer,$state,ngDialog,$cookieStore,$timeout) {
        //渠道管理
        $scope.vm = {
            channelData : "",   // 渠道数据
            paginationConf : ""  ,//分页条件
            pageSize : 3 , //默认每页数量
            channelDataTotal: "", //渠道数据记录总数
            //addChannel : addChannel,  //添加渠道
            //editChannel : editChannel, //编辑渠道
            //delChannel : delChannel, //删除渠道
            changeChannel : changeChannel, //修改渠道状态
            //channelName : "",  //渠道名称
            //statusId : "",  //状态
            //channelStatus : "",
            //dialogTitle : "" //对话框标题
            simpleOperateTitle : ""
        };
        // 黑名单管理
        $scope.vmo = {
            blackListData : "",  //黑名单数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            blackListDataTotal : "", //黑名单数据记录总数
            addBlacklist : addBlacklist, //添加黑名单
            removeBlacklist : removeBlacklist, //批量移除黑名单
            //channelList : "", //渠道列表
            blackListIdentify : "",  //黑名单标识
            blackListRemark : "", //黑名单备注
            channelId : "", //渠道id
            addBlackListCheck : addBlackListCheck,
            selectedList  : []  ,//已选择黑名单 ,
            isSelectedAll : false ,
            selectAll : selectAll , //全部加入黑名单
            selectSingle : selectSingle
        };

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listChannelData(1);
        //请求渠道列表
        function listChannelData(index){
            configurationServer.queryChannelList.save({
                "applicationId": APPLICATION_ID,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.channelData = data.data;
                $scope.vm.channelDataTotal =data.total;
                console.log(Math.ceil(data.total/$scope.vm.pageSize)) ;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vm.pageSize,//每页记录数
                    pagesLength: 8,//分页框显示数量
                };
            },function(error){ console.log(error)});
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    listChannelData(current);
                }, 100)
            }
        },true);
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listBlackListData(1);
        //请求黑名单列表
        function listBlackListData(index){
            configurationServer.queryBlacklist.save({
                "applicationId": APPLICATION_ID,
                "index" : (index-1)*$scope.vmo.pageSize,
                "pageSize": $scope.vmo.pageSize
            },function(data){
                $scope.vmo.blackListData = data.data;
                $scope.vmo.blackListDataTotal =data.total;
                $scope.vmo.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.total, //总记录数
                    pageSize: $scope.vmo.pageSize,//每页记录数
                    pagesLength: 8,//分页框显示数量
                };
            },function(error){console.log(error)}) ;
        }
        var timeout2 ;
        $scope.$watch('vmo.paginationConf.currentPage', function(current){
            if(current){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    initBlackList() ;
                    listBlackListData(current);
                }, 100)
            }
        },true);
        //修改渠道状态
        function changeChannel(channelId,statusId){
            $scope.vm.simpleOperateTitle = (statusId == 50001)?"确定要启用吗":"确定要禁用吗" ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/base/public_html/simple_operate.html","300px",function(){
                    configurationServer.changeChannelStatus.save({
                        "channelId": channelId
                    },function(response) {
                        if (response.data === 10000) {
                            layer.msg("状态修改成功");
                            listChannelData(1);
                        } else if (data.status == 12008) {
                            layer.msg("存在是指使用该渠道，请修改知识后操作");
                        } else{
                            layer.msg("状态修改失败")
                        }
                    },function(error){console.log(error)})
            }) ;
        }
        //全选
        function selectAll (){
            if(!$scope.vmo.isSelectedAll){
                $scope.vmo.isSelectedAll = true;
                $scope.vmo.selectedList = [];
                angular.forEach($scope.vmo.blackListData,function(item){
                    $scope.vmo.selectedList.push(item.blackListId);
                });
            }else{
                $scope.vmo.isSelectedAll = false;
                $scope.vmo.selectedList = [];
            }
        }
        // 黑名单单个添加删除
        function selectSingle(id){
            if($scope.vmo.selectedList.inArray(id)){
                $scope.vmo.selectedList.remove(id);
                $scope.vmo.isSelectedAll = false;
            }else{
                $scope.vmo.selectedList.push(id);
            }
            if($scope.vmo.selectedList.length==$scope.vmo.blackListData.length){
                $scope.vmo.isSelectedAll = true;
            }
        }
        //添加黑名单
        function addBlacklist(){
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/config/channel_manage/add_blacklist.html","500px",function(){
                configurationServer.addBlacklist.save({
                    "applicationId": APPLICATION_ID,
                    "blackListIdentify": $scope.vmo.blackListIdentify,
                    "blackListRemark": $scope.vmo.blackListRemark,
                    "blackListUpdateId": USER_ID,
                    "channelId": $scope.vmo.channelId
                },function(data){
                    $scope.vmo.blackListRemark = "" ;
                    $scope.vmo.isSelectedAll = false ;
                    $scope.vmo.blackListIdentify = "";
                    layer.msg("添加成功");
                    if($scope.vmo.selectedList.length == $scope.vmo.pageSize){
                        $scope.vmo.selectedList.pop() ;
                        $scope.vmo.isSelectedAll = false
                    }
                    listBlackListData(1) ;
                },function(){
                    initBlackBackUp()
                })
            },initBlackBackUp) ;
        }
        //檢測是否合理黑名单内容是否合理
        function addBlackListCheck(){
            if(!$scope.vmo.blackListIdentify){
                layer.msg("请填写正确的ip标识") ;
            }else{
                configurationServer.checkBlackList.save({
                    "applicationId": APPLICATION_ID,
                    "blackListIdentify": $scope.vmo.blackListIdentify,
                    "channelId": $scope.vmo.channelId
                },function(data){          //类名重複
                    if(data.data===10002){
                        layer.msg("黑名单重复！");
                        initBlackBackUp()
                    }else{
                        if(data.data===10003){
                            layer.msg("黑名单IP不合法！");
                            initBlackBackUp()
                        }else{
                            ngDialog.closeAll(1) ;
                        }
                    }
                }) ;
            }
        }
        //移除黑名单
        function removeBlacklist(blackListIds){
            if(blackListIds.length == 0){
                layer.msg("请选择要删除的黑名单!");
            }else{
                $scope.vm.simpleOperateTitle = "确定要删除吗" ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/base/public_html/simple_operate.html","300px",function(){
                    configurationServer.removeBlacklist.save({
                        "applicationId": APPLICATION_ID,
                        "blackListIds": blackListIds
                    },function(data){
                        if(data.data===10000){
                            initBlackList() ;
                            layer.msg("移除成功");
                            listBlackListData(1);
                        }else{
                            layer.msg("移除失败");
                        }
                    },function(error){ console.log(error)})
                }) ;
            }
        }
        //黑名单列表选择删除
        function initBlackList(){
            $scope.vmo.selectedList = [] ;
            $scope.vmo.isSelectedAll = false
        }
        // 黑名单 添加 数据初始化
        function initBlackBackUp(){
            $scope.vmo.blackListIdentify = "";
            $scope.vmo.blackListRemark = "";
        }








        //获取所有的渠道
        //(function getChannelList(){
        //    httpRequestPost("api/application/channel/listChannels",{
        //        "applicationId": APPLICATION_ID
        //    },function(data){
        //        $scope.vmo.channelList = data.data;
        //    },function(){
        //        console.log("请求失败")
        //    })
        //})();
        //获取状态列表
        //(function getStatusList(){
        //    httpRequestPost("/api/application/channel/listStatus",{
        //        "applicationId": APPLICATION_ID
        //    },function(data){
        //        $scope.vm.channelStatus = data.data;
        //    },function(){
        //        console.log("请求失败")
        //    })
        //})() ;

        //添加渠道窗口
        //function addChannel(){
        //    var dialog = ngDialog.openConfirm({
        //        template:"/static/myApplication/applicationConfig/channelManageDialog.html",
        //        scope: $scope,
        //        closeByDocument:false,
        //        closeByEscape: true,
        //        showClose : true,
        //        backdrop : 'static',
        //        preCloseCallback:function(e){    //关闭回掉
        //            if(e === 1){
        //                if($scope.vm.channelName==null||$scope.vm.channelName==""){
        //                    layer.msg("渠道名称不能为空！");
        //                    return ;
        //                }
        //                httpRequestPost("/api/application/channel/addChannel",{
        //                    "applicationId": APPLICATION_ID,
        //                    "channelName": $scope.vm.channelName,
        //                    "statusId": $scope.vm.statusId.statusId,
        //                    "channelUpdateId": USER_ID
        //                },function(data){          //类名重複
        //                    if(data.data===10002){
        //                        layer.msg("渠道重复！");
        //                        $scope.vm.channelName = "";
        //                    }else{
        //                        if(data.data===10001){
        //                            layer.msg("添加出错了！");
        //                        }else{
        //                            layer.msg("添加成功");
        //                            //$state.reload();
        //                            listChannelData(1);
        //                        }
        //                    }
        //                },function(){
        //                    layer.msg("添加失敗");
        //                    $scope.vm.channelName = "";
        //                })
        //            }else{
        //                $scope.vm.channelName = "";
        //            }
        //        }
        //    });
        //}


        //修改渠道
        //function editChannel(item){
        //    $scope.vm.dialogTitle="编辑渠道";
        //    $scope.vm.channelName = item.channelName;
        //    console.log($scope.vm.channelStatus);
        //    for(var i in $scope.vm.channelStatus){
        //        if($scope.vm.channelStatus[i].statusId==item.statusId){//获取选中项.
        //            $scope.vm.statusId =$scope.vm.channelStatus[i];
        //            break;
        //        }
        //    }
        //    addDialog(singleEdit,item);
        //}

        //编辑弹窗，添加公用
        //function addDialog(callback,item){
        //    var dialog = ngDialog.openConfirm({
        //        template:"/static/myApplication/applicationConfig/channelManageDialog.html",
        //        scope: $scope,
        //        closeByDocument:false,
        //        closeByEscape: true,
        //        showClose : true,
        //        backdrop : 'static',
        //        preCloseCallback:function(e){    //关闭回掉
        //            if(e === 1){
        //                callback(item)
        //            }else{
        //                $scope.vm.channelName = "";
        //            }
        //        }
        //    });
        //}

        //编辑事件
        //function singleEdit(item){
        //    if($scope.vm.channelName==null||$scope.vm.channelName==""){
        //        layer.msg("渠道名称不能为空！");
        //        return ;
        //    }
        //    httpRequestPost("/api/application/channel/editChannel",{
        //        "channelId": item.channelId,
        //        "applicationId": APPLICATION_ID,
        //        "channelName": $scope.vm.channelName,
        //        "statusId": $scope.vm.statusId.statusId,
        //        "channelUpdateId": USER_ID
        //    },function(data){
        //        if(data.data==10002){
        //            layer.msg("渠道名称重复");
        //        }else{
        //            if(data.data==10000){
        //                layer.msg("编辑成功");
        //                //$state.reload();
        //                listChannelData(1);
        //            }else{
        //                layer.msg("编辑失败")
        //            }
        //        }
        //    },function(){
        //        console.log("编辑失败")
        //    })
        //}

        //删除渠道
        //function delChannel(channelId){
        //    httpRequestPost("/api/application/channel/delChannel",{
        //        "channelId": channelId
        //    },function(data){
        //        if(data.data==10000){
        //            layer.msg("删除成功");
        //            //$state.reload();
        //            listChannelData(1);
        //        }else{
        //            layer.msg("删除失败")
        //        }
        //    },function(){
        //        layer.msg("请求失败")
        //    })
        //}







    }
]);