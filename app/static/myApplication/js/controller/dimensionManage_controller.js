/**
 * Created by mileS on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('dimensionManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval","$cookieStore",
    function ($scope,localStorageService, $state,ngDialog,$timeout,$interval,$cookieStore) {
        $scope.vm = {
            addDimension : addDimension,
            editDimension : editDimension,
            pageSize : 5,
            listData : "",   // table 数据
            listDataTotal : "",
            deleteDimension:deleteDimension,
            deleteItem : deleteItem,
            findDimension : findDimension,
            getData : getData, //返回维度列表
            savePro : savePro, //x向数组中添加数据
            verifyRelease:verifyRelease,  //校验方法
            check:check,
            allowSubmit:1, //是否允许提交
            userId: $cookieStore.get("userId"),
            applicationId: $cookieStore.get("applicationId"),
            paginationConf : "", //分页条件
            switchTurn :10001,
            newDimensions : [],
            getDimensionVal : "",
            getDimension : "",
            dimension : "",
            dimensionVal : "",
            dimensionName : "",
            dimensionStatusId: "",
            dimensionParentId:"",
            dimensionId:"",
            dimensionNameArray: [],
            dimensionUpdateNameArray :[],
            dimensionIdArray:[],

            oldDimension : [],
            oldDimensionName : []
        };

        getData(1);
        function getData(index){
            httpRequestPost("/api/application/dimension/listDimension",{
                index:(index - 1)*$scope.vm.pageSize,
                pageSize:$scope.vm.pageSize,
                userId:$scope.vm.userId,
                applicationId:$scope.vm.applicationId
            },function(data){
              console.log(data);
                if(data.status == 10005){
                    layer.msg("查询到记录为空！");
                    return;
                }
                $scope.vm.listData = data.data.dimensionList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
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
                    getData(current);
                }, 100)

            }
        },true);

        //删除维度
        function deleteDimension(dimensionId){
            var dialog = ngDialog.openConfirm({
                template:"/static/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/dimension/deleteById",{
                            applicationId:$scope.vm.applicationId,
                            dimensionId:dimensionId
                        },function(data){
                            if(data.status == 12009){
                                layer.msg("存在知识使用该维度，请修改后删除");
                            }
                            if(data.status == 10013){
                                getData(1);
                                layer.msg("维度删除成功!");
                            }
                            //$state.reload();
                        },function(){
                            layer.msg("请求失败");
                        })
                    }
                }
            });
        }

        //删除子集维度
        function deleteItem(item){
            console.log(item.dimensionId);
            httpRequestPost("/api/application/dimension/deleteChildDimensionById",{
                dimensionId:item.dimensionId
            },function(data){
                $scope.vm.oldDimension.remove(item);
            },function(){
                layer.msg("请求失败")
            })
        }

        function findDimension(){
            //为空查询判断
            if($scope.vm.getDimension == ''|| $scope.vm.getDimension == null){
                getData(1);
            }else {
                httpRequestPost("/api/application/dimension/findByDimensionName", {
                    dimensionName: $scope.vm.getDimension,
                    applicationId: $scope.vm.applicationId,
                    dimensionParentId: 0
                }, function (data) {
                    if (data.status == 10005) {
                        $scope.vm.listData = "";
                        $scope.vm.listDataTotal = 0;
                        layer.msg("没有查询到记录!");
                        $scope.$apply();
                        return;
                    }
                    $scope.vm.listData = data.data.dimensionList;
                    $scope.vm.listDataTotal = data.data.total;
                    $scope.$apply()
                }, function () {
                    layer.msg("请求失败")
                })
            }
        }

        //添加添加校验
        function verifyRelease(){
            if($scope.vm.dimension == null || $scope.vm.dimension == ""){
                layer.msg("维度名称不能为空!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.dimension.length > 50){
                layer.msg("维度名称长度不能超过50个字符!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            return 1;
        }

        function addDimension(){
            var dialog = ngDialog.openConfirm({
                template:"/static/myApplication/applicationConfig/dimensionManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.allowSubmit) {
                            httpRequestPost("/api/application/dimension/addDimension", {
                                applicationId: $scope.vm.applicationId,
                                userId: $scope.vm.userId,
                                dimensionName: $scope.vm.dimension,
                                dimensionStatusId: $scope.vm.switchTurn,
                                dimensionParentId: 0,
                                dimensionNameArray: $scope.vm.newDimensions,

                            }, function (data) {
                                //$state.reload();
                                if (data.status == 10002) {
                                    layer.msg("维度名称重复，请重新添加！")
                                } else {
                                    layer.msg("维度添加成功！")
                                    getData(1);
                                }
                            }, function () {
                                layer.msg("请求失败")
                            });
                        }
                        //添加成功，清空数据
                        $scope.vm.newDimensions = [];
                        $scope.vm.dimension = "";
                        $scope.vm.getDimensionVal = "";
                    }else{
                        $scope.vm.newDimensions = [];
                        $scope.vm.dimension = "";
                        $scope.vm.getDimensionVal = "";
                    }
                }
            });
        }
        //编辑添加校验
        function check(){
            if($scope.vm.dimensionName == null || $scope.vm.dimensionName == ""){
                layer.msg("维度名称不能为空!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.dimensionName.length > 50){
                layer.msg("维度名称长度不能超过50个字符!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            return 1;
        }

        function editDimension(data){
            console.log(data);
            $scope.vm.applicationId = data.applicationId;
            $scope.vm.dimensionName = data.dimensionName;
            $scope.vm.dimensionId = data.dimensionId;
            console.log(data.dimensionId);
            angular.forEach(data.dimensionChildList,function(data1){
                var obj = {};
                obj.dimensionName = data1.dimensionName;
                obj.dimensionId = data1.dimensionId;
                $scope.vm.oldDimension.push(obj);

                $scope.vm.oldDimensionName.push(data1.dimensionName);
            });
            var dialog = ngDialog.openConfirm({
                template:"/static/myApplication/applicationConfig/dimensionManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        if($scope.vm.allowSubmit) {
                            httpRequestPost("/api/application/dimension/updateDimensionById", {
                                dimensionName: $scope.vm.dimensionName,
                                userId: $scope.vm.userId,
                                applicationId: $scope.vm.applicationId,
                                dimensionId: $scope.vm.dimensionId,
                                dimensionStatusId: $scope.vm.switchTurn,
                                dimensionNameArray: $scope.vm.newDimensions,
                                dimensionParentId: 0
                            }, function (data) {
                                if (data.status == 10002) {
                                    layer.msg("该维度已经存在，请重新编辑!");
                                    return;
                                }
                                getData(1);
                                layer.msg("维度修改成功!");
                            }, function () {
                                layer.msg("请求失败")
                            })
                        }
                        //添加成功后清空数组数据
                        $scope.vm.newDimensions = [];
                        $scope.vm.oldDimension = [];
                    }else{
                        $scope.vm.oldDimension = [];
                        $scope.vm.newDimensions = [];
                    }
                }
            });
        }
        //数组中添加数据
        function savePro(vm,arr){
            if(arr.length > 0 && arr.indexOf(vm) != -1){
                layer.msg("该维度表示已经存在，请重新添加");
                return;
            }
            if($scope.vm.oldDimensionName.indexOf(vm) != -1){
                layer.msg("该维度表示已经存在，请重新添加!");
                return;
            }
            if(vm.length == 0){
                layer.msg("请添加维度表示!");
                return;
            }
            if(arr.indexOf(vm)){
                arr.push(vm)
            }
            //添加
            $scope.vm.getDimensionVal = "";
            //编辑
            $scope.vm.dimensionVal = "";
        }
    }
]);