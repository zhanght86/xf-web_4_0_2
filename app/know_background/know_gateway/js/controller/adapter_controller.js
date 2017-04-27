/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('adapterController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog",
    "AdapterService",'TipService','TemplateService',
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,
              AdapterService,TipService,TemplateService) {
        var self = this;
        $scope.targetId = '';
        
        self.initSearch = function (column) {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            
            /**
             * 加载分页条
             * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
             */
            $scope.paginationConf = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        /**
         * 初始化知识库列表
         */
        // self.queryLibList = function () {
        //     ManageBaseService.connQueryKnowBaseListByCon.get({
        //     },function(resource){
        //         if(resource.status == 200){
        //                 $scope.libList = resource.data.list
        //
        //         }
        //     })
        // }


        /**
         * 初始化模板列表
         */
        self.queryTemList = function () {
        }


        $scope.queryAdaptor = function(){
            AdapterService.queryAdaptor.get({
                pageNo:$scope.SearchPOJO.currentPage,
                pageSize:$scope.SearchPOJO.pageSize,
                name:$scope.SearchPOJO.name
            },function(resource){
                if(resource.status == 200){
                    $scope.adapters = resource.data.data
                    $scope.paginationConf.totalItems = resource.data.total;
                }
            })
        };

        $scope.TemSearchPOJO = {
            pageSize:5,
            currentPage:1
        };

        $scope.temPaginationConf = {
            currentPage: $scope.TemSearchPOJO.currentPage,//当前页
            totalItems: 0, //总条数
            pageSize: $scope.TemSearchPOJO.pageSize,//第页条目数
            pagesLength: 6,//分页框数量
            target:$scope.TemSearchPOJO
        };

        $scope.getAdType = function(type){
            if(type == 1){
                return "DB";
            }else if(type == 2){
                return "Hadoop";
            }else if(type == 3){
                return "FTP";
            }else if(type == 4){
                return "DOC";
            }
        }

        $scope.getAdStatus = function(type){
            if(type == 1){
                return "开";
            }else if(type == 2){
                return "关";
            }
        }

        $scope.checkAdStatus = function(status){
            if(status == 2){
                return "on_off_active";
            }
        }

        $scope.updateAdStatus = function(id,status){
            if(status == 1){
                status = 2;
            }else if(status == 2){
                status = 1;
            }
            AdapterService.updateAdStatus.save({
                id:id,
                status:status
            },function(re){
                if(re.status == 200 && re.data.status == 200){
                    TipService.setMessage('更新成功!',"success");
                    $scope.queryAdaptor();
                }else if(re.data.err){
                    TipService.setMessage(re.data.err,"error");
                }
            })
        }

        $scope.setAdapter = function(adaptor){

            var synchronizingTime = adaptor.synchronizingTime/60000;
            $scope.AdapterPOJO = {
                name:adaptor.name,
                type:adaptor.type,
                synchronizingTime:synchronizingTime,
                dbtype:adaptor.dbType,
                url:adaptor.url,
                userName:adaptor.userName,
                password:adaptor.password,
                sql:adaptor.sqlStr,
                titleCol:adaptor.titleCol,
                contentCol:adaptor.contentCol,
                tagCol:adaptor.tagCol,
                id:adaptor.id

            };
        }

        $scope.addAdaptor = function(){
            if(!$scope.AdapterPOJO.name || $scope.AdapterPOJO.name ==''){
                alert("请输入适配器名称");
                return;
            }
            if($scope.CheckStr($scope.AdapterPOJO.name)){
                alert("名称包含非法字符!");
                return;
            }
            if(!$scope.AdapterPOJO.type || $scope.AdapterPOJO.type ==''){
                alert("请选择适配器类型");
                return;
            }

            if($scope.AdapterPOJO.type == 1){
                if(!$scope.AdapterPOJO.dbtype || $scope.AdapterPOJO.dbtype ==''){
                    alert("请选择数据库类型");
                    return;
                }
                if(!$scope.AdapterPOJO.url || $scope.AdapterPOJO.url ==''){
                    alert("请输入URL");
                    return;
                }
                if(!$scope.AdapterPOJO.userName || $scope.AdapterPOJO.userName ==''){
                    alert("请输入用户名");
                    return;
                }
                if(!$scope.AdapterPOJO.password || $scope.AdapterPOJO.password ==''){
                    alert("请输入密码");
                    return;
                }
                if(!$scope.AdapterPOJO.sql || $scope.AdapterPOJO.sql ==''){
                    alert("请输入SQL语句");
                    return;
                }
                if(!$scope.AdapterPOJO.titleCol || $scope.AdapterPOJO.titleCol ==''){
                    alert("请输入标题列");
                    return;
                }
                if(!$scope.AdapterPOJO.contentCol || $scope.AdapterPOJO.contentCol ==''){
                    alert("请输入内容列");
                    return;
                }
                if(!$scope.AdapterPOJO.tagCol || $scope.AdapterPOJO.tagCol ==''){
                    alert("请输入标记列");
                    return;
                }
                if(!$scope.AdapterPOJO.synchronizingTime ||  isNaN($scope.AdapterPOJO.synchronizingTime) || $scope.AdapterPOJO.synchronizingTime < 0){
                    alert("请输入正确的时间间隔");
                    return;
                }
            }else if($scope.AdapterPOJO.type == 4){
                if(!$scope.AdapterPOJO.synchronizingTime ||  isNaN($scope.AdapterPOJO.synchronizingTime) || $scope.AdapterPOJO.synchronizingTime < 0){
                    alert("请输入正确的时间间隔");
                    return;
                }

                if(!$scope.AdapterPOJO.docPath || $scope.AdapterPOJO.docPath ==''){
                    alert("请输入文档路径");
                    return;
                }
            }

            var synchronizingTime = $scope.AdapterPOJO.synchronizingTime*60*1000;
            var ob = {
                //通用
                name:$scope.AdapterPOJO.name,
                type:$scope.AdapterPOJO.type,
                synchronizingTime:synchronizingTime,
                status:2,
                //JDBC属性
                dbType:$scope.AdapterPOJO.type,
                url:$scope.AdapterPOJO.url,
                userName:$scope.AdapterPOJO.userName,
                password:$scope.AdapterPOJO.password,
                sqlStr:$scope.AdapterPOJO.sql,
                titleCol:$scope.AdapterPOJO.titleCol,
                contentCol:$scope.AdapterPOJO.contentCol,
                tagCol:$scope.AdapterPOJO.tagCol,
                remoteStatus:100,
                //文件夹属性
                docPath:$scope.AdapterPOJO.docPath,
                temId:$scope.temId,
                id:$scope.AdapterPOJO.id,
                libId:$scope.AdapterPOJO.libId
            };
            if(ob.id){
                AdapterService.updateAdStatus.save(ob,function(resource){
                    if(resource.status == 200 && resource.data.status == 200){
                        $scope.reset();
                        $scope.queryAdaptor();
                        $('.popup_wrap').hide();
                        TipService.setMessage('更新成功!',"success");
                    }else if(resource.data.err){
                        alert(resource.data.err);
                    }
                })
            }else{
                AdapterService.addAdaptor.save(ob,function(resource){
                    if(resource.status == 200 && resource.data.status == 200){
                        $scope.reset();
                        $scope.queryAdaptor();
                        $('.popup_wrap').hide();
                        TipService.setMessage('创建成功!',"success");
                    }else if(resource.data.err){
                        alert(resource.data.err);
                    }
                })
            }
        }
        $scope.reset = function(){
            $scope.AdapterPOJO = {};
            $scope.targetId = '';
        }

        $scope.convertSS2mm = function(time){
            return time/(60*1000);
        }
        
        $scope.deleteAdapter = function(id){
            AdapterService.deleteAdaptor.get({id:id},function(re){
                if(re.status == 200 && re.data.status == 200){
                    TipService.setMessage('删除成功!',"success");
                    $scope.queryAdaptor();
                }else if(re.data.err){
                    TipService.setMessage(re.data.err,"error");
                }
            })
        }
        
        var timeout;
        $scope.$watch('SearchPOJO', function (SearchPOJO) {
            if (timeout) {
                $timeout.cancel(timeout)
            }
            timeout = $timeout(function () {
                $scope.storeParams(SearchPOJO);
                $scope.queryAdaptor();
            }, 350)
        }, true)

        // var timeout3;
        // $scope.$watch('TemSearchPOJO', function (SearchPOJO) {
        //     if (timeout3) {
        //         $timeout.cancel(timeout3)
        //     }
        //     timeout = $timeout(function () {
        //         $scope.queryTemplate();
        //     }, 350)
        // }, true)

        self.initSearch();
        //self.queryLibList();
        //self.queryTemList();

    }
])