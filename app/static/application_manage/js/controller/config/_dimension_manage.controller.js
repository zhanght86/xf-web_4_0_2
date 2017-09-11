/**
 * Created by mileS on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('dimensionManageController', [
    '$scope', 'localStorageService' ,"configurationServer","$state" ,"ngDialog","$timeout","$interval","$cookieStore",
    function ($scope,localStorageService,configurationServer, $state,ngDialog,$timeout,$interval,$cookieStore) {
        $scope.vm = {
            simpleOperateTitle : "" ,  // 删除修改弹框的title
            operateDimension : operateDimension,   // 添加编辑维度
            paginationConf : {
                pageSize: 5,//第页条目数
                pagesLength: 10,//分页框数量
            },
            listData : "",   // table 数据
            deleteDimension:deleteDimension,
            deleteItem : deleteItem,
            getData : getData, //返回维度列表
            savePro : savePro, //x向数组中添加数据
            verifyRelease:verifyRelease,  //校验方法
            //check:check,
            allowSubmit:1, //是否允许提交
            switchTurn :10001,
            childDimensionList : [] ,
            childDimensionVal : "",
            getDimension : "",
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
        // 获取所有维度
        getData(1);
        function getData(index){
            configurationServer.queryDimensionList.save({
                index:(index - 1)*$scope.vm.paginationConf.pageSize,
                pageSize:$scope.vm.paginationConf.pageSize ,
                userId:USER_ID,
                applicationId:APPLICATION_ID,
                dimensionParentId:0 ,
                dimensionName: $scope.vm.getDimension
            },function(response){
                if(response.status == 10005){
                    layer.msg("查询到记录为空！");
                    $scope.vm.listData = [];
                    $scope.vm.paginationConf ={
                        pageSize: 5,//第页条目数
                        pagesLength: 10//分页框数量
                    }
                }else{
                    $scope.vm.listData = response.data.dimensionList;
                    $scope.vm.paginationConf.totalItems = response.data.total ;
                    $scope.vm.paginationConf.numberOfPages = response.data.total/$scope.vm.paginationConf.pageSize ;
                }
            },function(error){console.log(error)})
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
            $scope.vm.simpleOperateTitle = "是否确定删除" ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/base/public_html/simple_operate.html","300px",function(){
                configurationServer.removeDimension.save({
                    applicationId:APPLICATION_ID ,
                    dimensionId:dimensionId
                },function(data){
                    if(data.status == 10000){
                        layer.msg("存在知识使用该维度，请修改后删除");
                    }else if(data.status == 10013) {
                        getData(1);
                        layer.msg("维度删除成功!");
                    }
                },function(error){console.log(error)})
            }) ;
        }
        //删除子集维度
        function deleteItem(item){
            console.log(item.dimensionId);
            configurationServer.removeChildDimension.save({
                dimensionId:item.dimensionId
            },function(response){
                $scope.vm.oldDimension.remove(item);
            },function(error){console.log(error)})
        }
        //添加添加校验
        function verifyRelease(){
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
            if($scope.vm.childDimensionList.length == 0){
                layer.msg("请至少添加一个维度表示!");
                $scope.vm.allowSubmit=0;
                return 0;
            }
            return 1;
        }
        function operateDimension(data){
            console.log(data)
            if(data){  // 编辑
                $scope.vm.dimensionName = data.dimensionName;// 数据展示
                $scope.vm.switchTurn = data.dimensionStatusId ;
                //angular.forEach(data.dimensionChildList,function(item){
                //    var obj = {
                //        dimensionName : item.dimensionName ;
                //    };
                //    obj.dimensionName = item.dimensionName;
                //    obj.dimensionId = item.dimensionId;
                //    $scope.vm.oldDimension.push(obj);
                //    $scope.vm.oldDimensionName.push(item.dimensionName);
                //});
                $scope.vm.childDimensionList = angular.copy(data.dimensionChildList) ;
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,"/static/application_manage/config/dimension_manage/operate_dimension.html","",function(){
                var parameter = {    // 参数
                    applicationId: APPLICATION_ID,
                    userId: USER_ID,
                    dimensionName: $scope.vm.dimensionName,
                    dimensionStatusId: $scope.vm.switchTurn,
                    dimensionParentId: 0,
                    dimensionNameArray: $scope.vm.childDimensionList
                } ;
                if(data){  // 编辑
                    parameter.dimensionId = data.dimensionId;// 参数保存使用
                    console.log(data) ;
                    configurationServer.editDimension.save(parameter, function (response) {
                        if (response.status == 10002) {
                            layer.msg("该维度已经存在，请重新编辑!");
                            return;
                        }
                        getData(1);
                        layer.msg("维度修改成功!");
                    }, function (error) {console.log(error)}) ;
                }else{  // 新增
                    configurationServer.addDimension.save(parameter, function (response) {
                        if (response.status == 10002) {
                            layer.msg("维度名称重复，请重新添加！")
                        } else {
                            layer.msg("维度添加成功！") ;
                            getData(1);
                        }
                    }, function(error){console.log(error)})
                }

            },function(){

            },function(){
                $scope.vm.dimensionName = "";
                $scope.vm.switchTurn = 10001;
                $scope.vm.childDimensionList = [];
            }) ;
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