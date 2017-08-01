/**
 * Created by mileS on 2016/6/3.
 * 控制器
 */

angular.module('materialManagement').controller('chatKnowledgeBaseController', [
    '$scope',"$state", "$cookieStore","$timeout","$window","$location",
    function ($scope,$state,$cookieStore,$timeout,$window,$location) {
        $state.go("materialManagement.chatKnowledgeBase");
        $scope.vm = {
            title : "" ,           //知识标题
            search : search,  //查询
            exportExcel:exportExcel,//知识导出
            seeDtails:seeDtails,//标题预览
            //searchList : "",   //查询数据结果
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            getType : 0 ,    // 默认请求 0    查找 1
//刪除知识
            getDel : getDel,
            delKnowledge : delKnowledge,
            delArr : [],
//高级查询
            searchHeighFlag : false ,
            "chatKnowledgeModifier": "",
            "modifyTimeType": 0,
            "chatKnowledgeTopic": "",
            "chatQuestionContent": "",
            selectTimeType : selectTimeType
        };
        //$.Huimodalalert('我是消息框，2秒后我自动滚蛋！',2000)
        function getDel(ev,id){
            var  self =$(ev.target);
            if(self.prop("checked")){
                $scope.vm.delArr.push(id)
            }else{
                $scope.vm.delArr.remove(id)
            }
        }
        function delKnowledge(){
            console.log($scope.vm.delArr) ;
            if(!$scope.vm.delArr.length){
                layer.msg("请选择要删除的知识")
            }else{
                layer.confirm('是否确定删除该条知识？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    httpRequestPost("/api/ms/chatKnowledge/deleteConceCptChatKnowledge",{
                        "applicationId": APPLICATION_ID,
                        "ids":$scope.vm.delArr
                    },function(){
                        layer.msg("删除成功") ;
                        $state.reload();
                    })
                });
            }
        }
        $scope.$watch("vm.searchHeighFlag",function(val){
            if(val){
                $('.advanced_search').slideDown();

            }else{
                $('.advanced_search').slideUp();
            }
        });
// 时间   1   仅三天   2  近七天   3  近一个月
        function search(index){
            $scope.vm.getType = 1;
            $scope.vm.searchHeighFlag = false ;
            console.log($scope.vm.chatQuestionContent);
            httpRequestPost("/api/ms/chatKnowledge/queryChatKnowledge",{
                "chatKnowledgeTopic": $scope.vm.chatKnowledgeTopic,
                "chatKnowledgeModifier": $scope.vm.chatKnowledgeModifier,
                "modifyTimeType":  $scope.vm.modifyTimeType,
                "chatQuestionContent": $scope.vm.chatQuestionContent,
                "index": (index-1)*$scope.vm.pageSize,
                "pageSize":$scope.vm.pageSize,
            },function(data){
                if(data.data==10005){
                    $scope.$apply(function(){
                        $scope.vm.delArr = [] ;
                        $scope.vm.listData = data.data.objs;
                        $scope.vm.paginationConf.totalItems = 0 ;
                        layer.msg("查询无此相关知识")
                    });
                }else{
                    $scope.$apply(function(){
                        $scope.vm.delArr = [] ;
                        $scope.vm.listData = data.data.objs;
                        $scope.vm.paginationConf = {
                            currentPage: index,//当前页
                            totalItems: data.data.total, //总条数
                            pageSize: $scope.vm.pageSize,//第页条目数
                            pagesLength: 8,//分页框数量
                        };
                        $scope.vm.title = null;
                    });
                }

            },function(err){})
        }

        /**
         * 知识导出
         */
        function exportExcel(){
            var urlParams =
                "?applicationId="+APPLICATION_ID+"&chatKnowledgeTopic="+$scope.vm.chatKnowledgeTopic+"&chatKnowledgeModifier="+$scope.vm.chatKnowledgeModifier +
                "&chatQuestionContent="+$scope.vm.chatQuestionContent;
            var url = "/api/ms/chatKnowledge/exportExcel"+urlParams  ;//请求的url
            $window.open(url,"_blank") ;

           /* httpRequestPost("/api/ms/chatKnowledge/exportExcel",{
                "applicationId": APPLICATION_ID,
                "chatKnowledgeTopic": $scope.vm.chatKnowledgeTopic,
                "chatKnowledgeModifier": $scope.vm.searchHeighFlag?$scope.vm.chatKnowledgeModifier:null,
                "modifyTimeType":  $scope.vm.searchHeighFlag?$scope.vm.modifyTimeType:null,
                "chatQuestionContent": $scope.vm.searchHeighFlag?$scope.vm.chatQuestionContent:null,
            },function(data){
                if(data.status==500){
                    layer.msg("导出失败")
                }else{
                    window.open("/api/ms/chatKnowledge/downloadExcel?fileName="+ data.data,"_blank");
                }
            },function(err){})*/

        }
        function selectTimeType(type){
            $scope.vm.modifyTimeType = type;
        }
         getData(1) ;
        //请求列表
        function getData(index){
            $scope.vm.getType = 0 ;
            httpRequestPost("/api/ms/chatKnowledge/queryChatKnowledge",{
                "applicationId": APPLICATION_ID,
                "index" :(index-1)*$scope.vm.pageSize,
                "pageSize": $scope.vm.pageSize
            },function(data){
                $scope.vm.delArr = [] ;
                $scope.vm.listData = data.data.objs;
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: data.data.total, //总条数
                    pageSize: $scope.vm.pageSize,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(err){
                console.log(err)
            })
        }

        //分页 查询
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    if($scope.vm.getType==1 ){
                        search(current)
                    }else if($scope.vm.getType==0){
                        getData(current);
                    }
                }, 100)
            }
        });
        //点击标题预览内容
        function seeDtails(data){
            console.log(data);
            var params = {
                standardQuestion : data.chatKnowledgeTopic,
                extendedQuestionArr :data.chatQuestionList,
                contentArr : data.chatKnowledgeContentList,
                applicationId: APPLICATION_ID,
                chatKnowledgeModifier : data.chatKnowledgeModifier,
                chatKnowledgeId : data.chatKnowledgeId,
                chatKnowledgeSource:data.chatKnowledgeSource,   //类型 101  概念      100 faq
                editUrl : data.chatKnowledgeSource==100?"materialManagement.faqChat":"materialManagement.conceptChat",
                type : data.chatKnowledgeSource
            };
            $state.go("materialManagement.chatKnowledgeBasePreview",{scanData:angular.toJson(params)});
        }
    }
]);