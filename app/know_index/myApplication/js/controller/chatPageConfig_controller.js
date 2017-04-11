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

angular.module('knowledgeManagementModule').controller('chatPageConfigController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",function ($scope,localStorageService, $state,ngDialog) {
        setCookie("applicationId","360619411498860544");
        setCookie("userId","368191545326702592");
        $scope.vm = {
            listData : "",   // table 数据
            listDataTotal : "", //总数
            userId:getCookie("userId"),
            applicationId:getCookie("applicationId"),
            paginationConf : "", //分页条件
            deleteIds : [],
            selectAllCheck : false,
            //========================方法=========================
            getData : getData, //返回知识列表数据
            addHotIssues : addHotIssues,  //添加方法
            toTop : toTop, //知识置顶
            move : move, //知识上移
            down : down,  //知识下移
            deleteKnowledge : deleteKnowledge, //删除知识
            selectAll : selectAll,
            selectSingle : selectSingle

        };


        function selectAll(ev){
            //var self = $(ev.target);
            if(!$scope.vm.selectAllCheck){
                $scope.vm.selectAllCheck = true;
                $scope.vm.deleteIds = [];
                angular.forEach($scope.vm.listData,function(item){
                    $scope.vm.deleteIds.push(item.hotQuestionId);
                });
            }else{
                $scope.vm.selectAllCheck = false
                $scope.vm.deleteIds = [];
            }

            console.log( $scope.vm.deleteIds)
        }
       function selectSingle(ev,id){
           var self = $(ev.target);
           if(self.attr('checked')){
               self.attr('checked',false);
               $scope.vm.deleteIds.remove(id);
               $(".selectAllBtn").attr("checked",false)
           }else{
               $(".selectAllBtn").attr("checked",false)
               $scope.vm.deleteIds.push(id)
           }
           console.log( $scope.vm.deleteIds)
       }
        //加载列表
        getData();
        function getData(){
            httpRequestPost("/api/application/hotQuestion/getHotQuestionList",{
                index:0,
                pageSize:10,
                applicationId:$scope.vm.applicationId
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data.hotQuestionList;
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
        //删除知识
        function deleteKnowledge(){
            httpRequestPost("/api/application/hotQuestion/deleteHotQuestionByIds",{
                applicationId :  $scope.vm.applicationId,
                ids :  $scope.vm.deleteIds
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }

        //知识置顶
        function toTop(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/top",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
             $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }
        //知识上移
        function move(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/moveUp",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }

        //知识下移
        function down(item){
            console.log(item.hotQuestionId);
            httpRequestPost("/api/application/hotQuestion/moveDown",{
                applicationId : $scope.vm.applicationId,
                hotQuestionId : item.hotQuestionId,
                hotQuestionOrder : item.hotQuestionOrder,
            },function(data){
                $state.reload();
            },function(){
                layer.msg("请求失败")
            })
        }

        function addHotIssues(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/myApplication/applicationConfig/chatPageConfigDialog.html",
                //controller:function($scope){
                //    $scope.show = function(){
                //
                //        console.log(6688688);
                //        $scope.closeThisDialog(); //关闭弹窗
                //    }},
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                    }
                }
            });
        }
      

    }
]);