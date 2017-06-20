/**
 * Created by mileS on 2017/3/28.
 */

angular.module('myApplicationSettingModule').controller('channelManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout) {
        $scope.vm = {
            applicationId: $cookieStore.get("applicationId"),
            channelData : "",   // 渠道数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            channelDataTotal: "", //渠道数据记录总数
            addChannel : addChannel,  //添加渠道
            editChannel : editChannel, //编辑渠道
            delChannel : delChannel, //删除渠道
            changeChannel : changeChannel, //修改渠道状态
            channelName : "",  //渠道名称
            statusId : "",  //状态
            userId : $cookieStore.get("userId"),   //用户id
            channelStatus : "",
            dialogTitle : "", //对话框标题
        };

        $scope.vmo = {
            applicationId: $cookieStore.get("applicationId"),
            blackListData : "",  //黑名单数据
            paginationConf : ""  ,//分页条件
            pageSize : 2 , //默认每页数量
            blackListDataTotal : "", //黑名单数据记录总数
            addBlacklist : addBlacklist, //添加黑名单
            delBlacklist : delBlacklist, //移除黑名单
            batchDelBlacklist : batchDelBlacklist, //批量移除黑名单
            channelList : "", //渠道列表
            blackListIdentify : "",  //黑名单标识
            blackListRemark : "", //黑名单备注
            channelId : "", //渠道id
            blackListUpdateId : $cookieStore.get("userId"),   //用户id
        };

        //获取渠道列表
        getChannelList();
        //获取状态列表
        getStatusList();
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listChannelData(1);
        //请求渠道列表
        function listChannelData(index){
            httpRequestPost("/api/application/channel/listChannelByPage",{
                "applicationId": $scope.vm.applicationId,
                "index" : (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.channelData = data.data;
                $scope.vm.channelDataTotal =data.total;
                console.log(Math.ceil(data.total/$scope.vm.pageSize))
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
            httpRequestPost("/api/application/channel/listBlackListByPage",{
                "applicationId": $scope.vmo.applicationId,
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
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        var timeout2 ;
        $scope.$watch('vmo.paginationConf.currentPage', function(current){
            if(current){
                if (timeout2) {
                    $timeout.cancel(timeout2)
                }
                timeout2 = $timeout(function () {
                    listBlackListData(current);
                }, 100)
            }
        },true);

        //获取状态列表
        function getStatusList(){
            httpRequestPost("/api/application/channel/listStatus",{
                "applicationId": $scope.vm.applicationId
            },function(data){
                $scope.vm.channelStatus = data.data;
                //$scope.vm.statusId=data.data[0].statusId;
            },function(){
                layer.msg("请求失败")
            })
        }

        //获取所有的渠道
        function getChannelList(){
            httpRequestPost("api/application/channel/listChannels",{
                "applicationId": $scope.vmo.applicationId
            },function(data){
                $scope.vmo.channelList = data.data;
            },function(){
                layer.msg("请求失败")
            })
        }

        //添加渠道窗口
        function addChannel(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/channelManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.channelName==null||$scope.vm.channelName==""){
                            layer.msg("渠道名称不能为空！");
                            return ;
                        }
                        httpRequestPost("/api/application/channel/addChannel",{
                            "applicationId": $scope.vm.applicationId,
                            "channelName": $scope.vm.channelName,
                            "statusId": $scope.vm.statusId.statusId,
                            "channelUpdateId": $scope.vm.userId
                        },function(data){          //类名重複
                            if(data.data===10002){
                                layer.msg("渠道重复！");
                                $scope.vm.channelName = "";
                            }else{
                                if(data.data===10001){
                                    layer.msg("添加出错了！");
                                }else{
                                    layer.msg("添加成功");
                                    //$state.reload();
                                    listChannelData(1);
                                }
                            }
                        },function(){
                            layer.msg("添加失敗");
                            $scope.vm.channelName = "";
                        })
                    }else{
                        $scope.vm.channelName = "";
                    }
                }
            });
        }


        //修改渠道
        function editChannel(item){
            $scope.vm.dialogTitle="编辑渠道";
            $scope.vm.channelName = item.channelName;
            console.log($scope.vm.channelStatus);
            for(var i in $scope.vm.channelStatus){
                if($scope.vm.channelStatus[i].statusId==item.statusId){//获取选中项.
                    $scope.vm.statusId =$scope.vm.channelStatus[i];
                    break;
                }
            }
            addDialog(singleEdit,item);
        }

        //编辑弹窗，添加公用
        function addDialog(callback,item){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/channelManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.channelName = "";
                    }
                }
            });
        }

        //编辑事件
        function singleEdit(item){
            if($scope.vm.channelName==null||$scope.vm.channelName==""){
                layer.msg("渠道名称不能为空！");
                return ;
            }
            httpRequestPost("/api/application/channel/editChannel",{
                "channelId": item.channelId,
                "applicationId": $scope.vm.applicationId,
                "channelName": $scope.vm.channelName,
                "statusId": $scope.vm.statusId.statusId,
                "channelUpdateId": $scope.vm.userId
            },function(data){
                if(data.data==10002){
                    layer.msg("渠道名称重复");
                }else{
                    if(data.data==10000){
                        layer.msg("编辑成功");
                        //$state.reload();
                        listChannelData(1);
                    }else{
                        layer.msg("编辑失败")
                    }
                }
            },function(){
                layer.msg("编辑失败")
            })
        }

        //删除渠道
        function delChannel(channelId){
            httpRequestPost("/api/application/channel/delChannel",{
                "channelId": channelId
            },function(data){
                if(data.data==10000){
                    layer.msg("删除成功");
                    //$state.reload();
                    listChannelData(1);
                }else{
                    layer.msg("删除失败")
                }
            },function(){
                layer.msg("请求失败")
            })
        }

        //修改渠道状态
        function changeChannel(channelId){
            httpRequestPost("/api/application/channel/changeStatus",{
                "channelId": channelId
            },function(data){
                if(data.data===10000){
                    layer.msg("状态修改成功");
                    //$state.reload();
                    listChannelData(1);
                }else{
                    layer.msg("状态修改失败")
                }
            },function(){
                layer.msg("请求失败")
            })
        }

        //添加黑名单
        function addBlacklist(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/blacklistManageDialog.html",
                width:"500px" ,
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/channel/checkBlackList",{
                            "applicationId": $scope.vmo.applicationId,
                            "blackListIdentify": $scope.vmo.blackListIdentify,
                            "channelId": $scope.vmo.channelId.channelId
                        },function(data){          //类名重複
                            if(data.data===10002){
                                layer.msg("黑名单重复！");
                                $scope.vmo.blackListIdentify = "";
                                $scope.vmo.blackListRemark = "";
                            }else{
                                if(data.data===10003){
                                    layer.msg("黑名单IP不合法！");
                                    $scope.vmo.blackListIdentify = "";
                                    $scope.vmo.blackListRemark = "";
                                }else{
                                    httpRequestPost("/api/application/channel/addBlackList",{
                                        "applicationId": $scope.vmo.applicationId,
                                        "blackListIdentify": $scope.vmo.blackListIdentify,
                                        "blackListRemark": $scope.vmo.blackListRemark,
                                        "blackListUpdateId": $scope.vmo.blackListUpdateId,
                                        "channelId": $scope.vmo.channelId
                                    },function(data){
                                        layer.msg("添加成功");
                                        //$state.reload();
                                        listBlackListData(1);
                                    },function(){
                                        layer.msg("添加失敗");
                                        $scope.vmo.blackListIdentify = "";
                                        $scope.vmo.blackListRemark = "";
                                    })
                                }
                            }
                        },function(){
                            layer.msg("添加失敗");
                            $scope.vmo.blackListIdentify = "";
                            $scope.vmo.blackListRemark = "";
                        })
                    }else{
                        $scope.vmo.blackListIdentify = "";
                        $scope.vmo.blackListRemark = "";
                    }
                }
            });
        }


        //移除黑名单
        function delBlacklist(blackListId){
            httpRequestPost("/api/application/channel/deleteBlackList",{
                "blackListId": blackListId
            },function(data){
                layer.msg("移除成功");
                //$state.reload();
                listBlackListData(1);
            },function(){
                layer.msg("请求失败")
            })
        }

        //批量移除黑名单
        function batchDelBlacklist(){
            httpRequestPost("/api/application/channel/batchDelBlackList",{
                "blackListIds": $scope.selectedList
            },function(data){
                if(data.data===10000){
                    layer.msg("移除成功");
                    //$state.reload();
                    listBlackListData(1);
                }else{
                    layer.msg("移除失败");
                }
            },function(){
                layer.msg("请求失败")
            })
        }




        //创建变量用来保存选中结果
        $scope.selectedList = [];
        $scope.updateSelection= updateSelection; //更新某一列数据的选择
        $scope.selectAll = selectAll; //全选
        $scope.isSelected = isSelected; //判断某一列是否已被选中
        $scope.isSelectedAll = isSelectedAll;  //判断是否已经全部选中
        function updateSelected(action, id){
            if (action == 'add' && $scope.selectedList.indexOf(id) == -1) $scope.selectedList.push(id);
            if (action == 'remove' && $scope.selectedList.indexOf(id) != -1) $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
            console.log($scope.selectedList);

        }

        //更新某一列数据的选择
        function updateSelection($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            console.log(action+"选中的id"+id);
            updateSelected(action, id);
        }

        //判断某一列是否已被选中
        function isSelected(id) {
            return $scope.selectedList.indexOf(id) >= 0;
        };


        //全选
        function selectAll ($event){
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            for (var i = 0; i < $scope.vmo.blackListData.length; i++) {
                var contact = $scope.vmo.blackListData[i];
                updateSelected(action, contact.blackListId);
            }
        }
        //判断是否已经全部选中
        function isSelectedAll() {
            return $scope.selectedList.length === $scope.vmo.blackListData.length;
        };

        //var updateSelected = function (action, id) {
        //    if (action == 'add' && $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
        //    if (action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
        //};
        ////更新某一列数据的选择
        //$scope.updateSelection = function ($event, id) {
        //    var checkbox = $event.target;
        //    var action = (checkbox.checked ? 'add' : 'remove');
        //    updateSelected(action, id);
        //};
        ////全选操作
        //$scope.selectAll = function ($event) {
        //    var checkbox = $event.target;
        //    var action = (checkbox.checked ? 'add' : 'remove');
        //    for (var i = 0; i < $scope.vmo.blackListData.length; i++) {
        //        var contact = $scope.vmo.blackListData[i];
        //        updateSelected(action, contact.blackListId);
        //    }
        //};
        //$scope.isSelected = function (id) {
        //    return $scope.selected.indexOf(id) >= 0;
        //};
        //$scope.isSelectedAll = function () {
        //    return $scope.selected.length === $scope.vmo.blackListData.length;
        //};

    }
]);