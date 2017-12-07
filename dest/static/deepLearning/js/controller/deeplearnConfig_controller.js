/**
 * 深度学习-配置控制器
 * add by zhanjian 2017年7月18日19:12:16
 */
angular.module('deepLearning').controller('deeplearnConfigController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams", "$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
    	
    	//页面跳转
        $state.go("deepLearning.deeplearnConfig");
        
        //作用域内全局变量
        $scope.vm = {
    		editOrView : editOrView,//编辑或查看功能
            del : del,//删除功能
            search : search,//页面搜索功能
            create : create,//新建功能
            verifyRelease : verifyRelease,//新增或者编辑时，参数校验
            crawlRecordId : $stateParams.crawlRecordId,
            allowSubmit : 1, //是否允许提交
            pageSize: 10, //默认显示10页
            cell:"RNN",
            activation:"ReLu",
            regularization:"l1"

        };
        
        //编辑（isEdit：0查看 or 1编辑)
        //编辑时，页面输入内容可以编辑，存在保存按钮；查看时，页面输入内容不能编辑，隐藏保存按钮。默认从参数中传过来
        function editOrView(data, isEdit){
        	
        	//将要展示的对象赋值给作用域的全局变量。
        	$scope.vm._name = data.name;
            $scope.vm.cell = data.cell;
            $scope.vm.activation = data.activation;
            $scope.vm.regularization = data.regularization;
            $scope.vm.regularizationRate = data.regularizationRate;
            $scope.vm.layers = data.layers;
            $scope.vm.neurons = data.neurons;
            $scope.vm.learningRate = data.learningRate;
            $scope.vm.maxGradient = data.maxGradient;
            $scope.vm.dropout = data.dropout;
            $scope.vm.batchSize = data.batchSize;
            $scope.vm.isEdit = isEdit;//当isEdit = 1时，弹出层默认显示保存按钮，当不为1时，页面默认显示查看功能页面，没有保存按钮。
            
            //弹出层展示 
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/deeplearnConfigModify.html",
                width:"600px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {//关闭回掉事件
                    if (e === 1) {
                    	if(isEdit == 1) {//isEdit == 1可以编辑
	                        if($scope.vm.allowSubmit) {//如果参数校验通过，允许提交
	                        	//请求后台
	                            httpRequestPost("/sprider/deeplearn/modify", getParams(), function (data) {
                                    layer.msg(data.info, {time:2000});
	                                $state.reload(); //刷新页面
	                            }, function () {
	                            	layer.msg("请求失败", {time:2000})
	                            })
	                        }
                    	}
                    } 
                    //保存的同时清空数据
                    $scope.vm._name = null;
                    $scope.vm.cell = null;
                    $scope.vm.activation = null;
                    $scope.vm.regularization = null;
                    $scope.vm.regularizationRate = null;
                    $scope.vm.layers = null;
                    $scope.vm.neurons = null;
                    $scope.vm.learningRate = null;
                    $scope.vm.maxGradient = null;
                    $scope.vm.dropout = null;
                    $scope.vm.batchSize = null;
                }
            });
        }
        
        //添加用户校验
        function verifyRelease(){
            /*if($scope.vm.knowledgeId == null || $scope.vm.knowledgeId == ""){
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
            }*/
            return 1;
        }

        //初始化页面-列表 数据加载
        search();
        function search(){
            getData(1);
        }
        
        //查询记录列表
        function getData(index){
            httpRequestPost("/sprider/deeplearn/queryByPage",{
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize,
                "name" : $scope.vm.name
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
            },function(err){
            	layer.msg("请求失败", {time:2000}) ;
            });
        }

        //监听当前页面的分页栏发生变化，进行重新查询
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
        
        //删除配置
        function del(name){
            var dialog = ngDialog.openConfirm({
                template:"/static/admin/deleteDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        httpRequestPost("/sprider/deeplearn/del",{name:name},
                        	function(data){
                        		layer.msg(data.info, {time:2000});
                        		$state.reload(); //刷新页面
	                        },function(){
	                        	layer.msg("请求失败", {time:2000}) ;
	                        }
                        )
                    }
                }
            });
        }
        
        //新建配置按钮
        function create(){
            var dialog = ngDialog.openConfirm({
                template: "/static/deepLearning/deeplearnConfigDialog.html",
                width:"600px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {//关闭回掉发生的事件
                    if (e === 1) {
                    	if ($scope.vm.allowSubmit) {//如果允许校验通过，允许提交
                        	$scope.vm.data = getParams();//获取页面输入参数
                            httpRequestPost("/sprider/deeplearn/add", getParams(), function (data) {
                                layer.msg(data.info, {time:2000})
                                $state.reload(); //刷新页面
                            }, function (err) {
                                layer.msg("请求失败", {time:2000}) ;
                            });
                        }
                    } 
                    //输入参数清空操作
                    $scope.vm._name = null;
                    $scope.vm.cell = null;
                    $scope.vm.activation = null;
                    $scope.vm.regularization = null;
                    $scope.vm.regularizationRate = null;
                    $scope.vm.layers = null;
                    $scope.vm.neurons = null;
                    $scope.vm.learningRate = null;
                    $scope.vm.maxGradient = null;
                    $scope.vm.dropout = null;
                    $scope.vm.batchSize = null;
                }
            });
        }
        
        // 获取参数
        function getParams(){
        	return  {
                "name" : $scope.vm._name,
                "cell": $scope.vm.cell ==null? "RNN" : $scope.vm.cell,
                "activation" : $scope.vm.activation ==null? "ReLu" : $scope.vm.activation,
                "regularization" : $scope.vm.regularization ==null? "l1" :$scope.vm.regularization,
                "regularizationRate": $scope.vm.regularizationRate ==null? "0" : $scope.vm.regularizationRate,
                "layers" : $scope.vm.layers ==null? "2" :$scope.vm.layers,
                "neurons" : $scope.vm.neurons ==null? "1024" :$scope.vm.neurons,
                "learningRate" : $scope.vm.learningRate ==null? "0.0003" :$scope.vm.learningRate,
                "maxGradient" : $scope.vm.maxGradient ==null? "5.0" :$scope.vm.maxGradient,
                "dropout" : $scope.vm.dropout ==null? "0.5" :$scope.vm.dropout,
                "batchSize" : $scope.vm.batchSize ==null? "64" :$scope.vm.batchSize
            };
        }
    }
]);

