/**
 * Created by dinfo on 2017/3/28.
 */
/**
 * Created by 41212 on 2017/3/28.
 */

/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('dimensionManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval) {
        setCookie("applicationId","360619411498860544");
        setCookie("userId","368191545326702592");
        $scope.vm = {
            addDimension : addDimension,
            editDimension : editDimension,
            listData : "",   // table 数据
            listDataTotal : "",
            deleteDimension:deleteDimension,
            deleteItem : deleteItem,
            findDimension : findDimension,
            getData : getData, //返回维度列表
            savePro : savePro, //x向数组中添加数据
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "", //分页条件
            switchTurn :10001,
            newDimensions : [],
            dimensionVal : "",
            dimensionName : "",
            dimensionStatusId: "",
            dimensionParentId:"",
            dimensionId:"",
            dimensionNameArray: [],
            dimensionUpdateNameArray :[],
            dimensionIdArray:[],

            oldDimension : [],
        };

        getData();
        function getData(){
            httpRequestPost("/api/application/dimension/listDimension",{
                index:0,
                pageSize:10,
                userId:$scope.vm.userId,
                applicationId:$scope.vm.applicationId
            },function(data){
              console.log(data);
                $scope.vm.listData = data.data.dimensionList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.vm.paginationConf = {
                    currentPage: 0,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }

        //删除维度
        function deleteDimension(dimensionId){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/admin/deleteDialog.html",
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
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
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
            httpRequestPost("/api/application/dimension/findByDimensionName",{
                dimensionName:$scope.vm.dimensionName,
                applicationId:$scope.vm.applicationId,
                dimensionParentId : 0
            },function(data){
                $scope.vm.listData = data.data.dimensionList;
                $scope.vm.listDataTotal = data.data.total;
                $scope.$apply()
            },function(){
                layer.msg("请求失败")
            })
        }

        function addDimension(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/dimensionManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/dimension/addDimension",{
                            applicationId:$scope.vm.applicationId,
                            userId:$scope.vm.userId,
                            dimensionName : $scope.vm.dimensionName,
                            dimensionStatusId : $scope.vm.switchTurn,
                            dimensionParentId : 0,
                            dimensionNameArray : $scope.vm.newDimensions
                        },function(data){
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }
                }
            });
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
            });
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/dimensionManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/api/application/dimension/updateDimensionById",{
                            dimensionName : $scope.vm.dimensionName,
                            userId:$scope.vm.userId,
                            applicationId:$scope.vm.applicationId,
                            dimensionId:$scope.vm.dimensionId,
                            dimensionStatusId : $scope.vm.switchTurn,
                            dimensionNameArray : $scope.vm.newDimensions
                        },function(data){
                            $state.reload()
                        },function(){
                            layer.msg("请求失败")
                        })
                    }else{
                        $scope.vm.oldDimension = []
                    }
                }
            });
        }
        //数组中添加数据
        function savePro(vm,arr){
            if(arr.indexOf(vm)){
                arr.push(vm)
            }
            console.log(arr)
        }
    }
]);