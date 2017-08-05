/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
angular.module('deepLearning').controller('dataAcquisitionController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$stateParams","$cookieStore","$timeout",
    function ($scope,localStorageService, $state,ngDialog,$stateParams,$cookieStore,$timeout) {
        $state.go("deepLearning.dataAcquisition");
        $scope.vm = {

            crawlStartTime : "", //查询的采集开始日期
            crawlEndTime : "", //查询的采集截止日期
            crawlRecordData : "",   // 采集的记录列表数据
            paginationConf : ""  ,//分页条件
            pageSize : 5 , //默认每页数量
            dataTotal: "", //数据记录总数
            listCrawlRecordData : listCrawlRecordData, //分页查询
            clearDate : clearDate, //情况日期查询
            save : save,//新建任务保存
            newTask : newTaskDialog, //新建任务弹窗
            exportToChat : exportToChat //导入到闲聊库
        };

        //清空日期查询
        function clearDate(){
            $scope.vm.crawlStartTime="";
            $scope.vm.crawlEndTime="";
            listCrawlRecordData(1);
        }
        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        listCrawlRecordData(1);
        //请求采集数据列表
        function listCrawlRecordData(index){
            httpRequestPost("/sprider/record/getCrawlRecord",{
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "crawlStartTime": $scope.vm.crawlStartTime,
                "crawlEndTime": $scope.vm.crawlEndTime
            },function(data){
                $scope.vm.crawlRecordData = data.data;
                console.log(data.data);
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
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    listCrawlRecordData(current);
                }, 100)
            }
        },true);

        //根据采集批次导入数据到闲聊库
        function exportToChat(crawlRecordId){
            httpRequestPost("/sprider/record/exportDataToChat",{
                "crawlRecordId": crawlRecordId
            },function(data){
                if(data.status==200){
                    layer.msg("数据导入中，请稍后查看闲聊库！");
                }else{
                    layer.msg("数据导入失败");
                }
            },function(){
                layer.msg("数据导入失败");
            });
        }

        //新建任务弹窗
        function newTaskDialog(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/dataAcquisitionDialog.html",
                width:"500px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {
                    } else {
                    }
                }
            });
        }

        //新建任务 获取参数
        function getParams(){
            var params =  {
                "crawlSource" : $scope.vm.crawlSource,
                "crawlDate": $scope.vm.crawlDate,
                "crawlCount" : $scope.vm.crawlCount
            };
            return params
        }
        
        //新建任务 检验参数
        function checkSave(){
            var params = getParams();
            if(!params.crawlSource){
                layer.msg("数据源不能为空，请填写");
                return false
            }else if(!params.crawlDate.length){
                layer.msg("采集日期不能为空，请选择时间");
                return false
            }else if(!params.crawlCount.length){
                layer.msg("采集数量不能为空，请填写");
                return false
            }else{
                return true
            }
        }

        //新建任务保存
        function save(){
            if (!checkSave()) {
                return false
            } else {
            	$scope.vm.data = getParams();
                httpRequestPost("/sprider/record/createCrawlRecord", getParams(), function (data) {
                    if (data.status == 200) {
                        $state.go('deepLearning.dataAcquisition');
                    } else {
                        layer.msg("新建采集任务失败") ;
                    }
                }, function (err) {
                    layer.msg("新建采集任务失败") ;
                });

            }
        }
    }
]);

