/**
 * 深度学习-数据采集-知识页面控制器JS
 * add by zhanjian 2017年7月18日18:58:02
 */
angular.module('deepLearning').controller('acquisitionDetailsController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams", "$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("deepLearning.acquisitionDetails");//页面跳转
        
        //定义作用域范围内变量
        $scope.vm = {
        	editOrView : editOrView,//编辑 or 查看
            del : del,//删除
            napSearch : napSearch,//页面搜索
            verifyRelease : verifyRelease,//参数校验，主要用于编辑或新增
            crawlRecordId : $stateParams.crawlRecordId,
            allowSubmit : 1, //是否允许提交
            pageSize: 10 //默认每页展示数量
        };
        
        //编辑（isEdit：0查看 or 1编辑)
        //编辑时，页面输入内容可以编辑，存在保存按钮；查看时，页面输入内容不能编辑，隐藏保存按钮。默认从参数中传过来
        function editOrView(data, isEdit){
        	//将要展示的对象赋值给作用域的全局变量。
        	$scope.vm.knowledgeId = data.knowledgeId;
            $scope.vm.crawlQuestion = data.crawlQuestion;
            $scope.vm.crawlAnswer = data.crawlAnswer;
            $scope.vm.knowledgeQuestion = data.knowledgeQuestion;
            $scope.vm.knowledgeAnswer = data.knowledgeAnswer;
            $scope.vm.isEdit = isEdit;
            
            //（编辑 or查看）弹出层
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/acquisitionDetailsDialog.html",
                width:"900px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {//关闭回掉汗水
                    if (e === 1) {
                    	if(isEdit == 1) {
	                        if($scope.vm.allowSubmit) {//如果参数校验通过，允许提交
	                        	//请求后台
	                            httpRequestPost("/sprider/knowledge/editByKnowledgeId", {
	                            	knowledgeId: $scope.vm.knowledgeId,
	                                knowledgeQuestion: $scope.vm.knowledgeQuestion,
	                                knowledgeAnswer: $scope.vm.knowledgeAnswer,
	                            }, function (data) {
	                            	layer.msg(data.info, {time:2000});
	                                $state.reload(); //刷新页面
	                            }, function () {
	                            	layer.msg("请求失败", {time:2000});
	                            })
	                        }
                    	}
                    } 
                    //保存的同时清空数据
                    $scope.vm.knowledgeId = "";
                    $scope.vm.crawlQuestion = "";
                    $scope.vm.crawlAnswer = "";
                    $scope.vm.knowledgeQuestion = "";
                    $scope.vm.knowledgeAnswer = "";
                }
            });
        }
        
        //添加输入参数校验
        function verifyRelease(){
            if($scope.vm.knowledgeId == null || $scope.vm.knowledgeId == ""){
                layer.msg("知识序号为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.knowledgeQuestion == null || $scope.vm.knowledgeQuestion == ""){
                layer.msg("处理后问题不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            if($scope.vm.knowledgeAnswer == null || $scope.vm.knowledgeAnswer == ""){
                layer.msg("处理后回答不能为空!")
                $scope.vm.allowSubmit=0;
                return 0;
            }
            return 1;
        }

        //页面初始化-加载列表
        napSearch();
        function napSearch(){
            getData(1);
        }
        //查询记录列表
        function getData(index){
            httpRequestPost("/sprider/knowledge/getByRecordId",{
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "crawlRecordId" : $scope.vm.crawlRecordId
            },function(data){
            	if(data.status == 200) {
            		if(data.data.objs == null || data.data.objs.length <= 0) {
            			layer.msg("没有查询到任何数据", {time:2000});
            			return false;
            		}
            		$scope.vm.listData = data.data.objs;
            		$scope.vm.paginationConf = {
            				currentPage: index,//当前页
            				totalItems: data.data.total, //总条数
            				pageSize: $scope.vm.pageSize,//第页条目数
            				pagesLength: 10,//分页框数量
            		};
            		$scope.$apply();
            		return true;
            	} else {
            		layer.msg(data.info, {time:2000});
            	}
            }, function () {
            	layer.msg("请求失败", {time:2000});
            });
        }

        //监听分页栏currentPage改变事件
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
        
        //删除知识
        function del(knowledgeId){
            var dialog = ngDialog.openConfirm({
                template:"/static/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/sprider/knowledge/delByKnowledgeId",{
                            knowledgeId:knowledgeId,
                        },function(data){
                        	layer.msg(data.info, {time:2000});
                            $state.reload();
                        }, function () {
                        	layer.msg("请求失败", {time:2000});
                        })
                    }
                }
            });
        }
    }
]);

