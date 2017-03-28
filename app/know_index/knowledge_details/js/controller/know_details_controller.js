/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('knowDetailsModule').controller('knowDetailsController', [
    '$scope', '$location', "$routeParams", "$interval", "$timeout", "ngDialog","$stateParams",
    "DetailService","HomeService","$sce","TipService",
    function ($scope, $location, $routeParams, $interval, $timeout, ngDialog,$stateParams,
              DetailService,HomeService,$sce,TipService ) {
        /**
         * 初始化当前页参数
         */
        var self = this;

        $scope.knowItemId = $stateParams.knowItemId;
        $scope.queryKey = $stateParams.queryKey;

        self.initSearch = function () {
            if (!$scope.SearchPOJO) {
                $scope.SearchPOJO = $scope.initSearchPOJO();
            }
            $scope.SearchPOJO.pageSize =3;
            $scope.SearchPOJO.queryPage = true;
            $scope.SearchPOJO.knowItemId = $stateParams.knowItemId;

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

            $scope.paginationConf1 = {
                currentPage: $scope.SearchPOJO.currentPage,//当前页
                totalItems: 0, //总条数
                pageSize: $scope.SearchPOJO.pageSize,//第页条目数
                pagesLength: 6//分页框数量
            };
        }

        /**
         * 方法定义
         */
        //字数限制
        $scope.checkText = function (type,index) {
            if(type == 1){
                if ($scope.comment.length > 500) {
                    //alert("内容过长");
                    $scope.comment = $scope.comment.substr(0, 500);
                }
            }else if (type == 2){
                if ($scope.require[index].length > 500) {
                    //alert("内容过长");
                    $scope.require[index] = $scope.require[index].substr(0, 500);
                }
            }
        };
        
        //查询知识条目详情
        self.getKnowItemById = function(){
            DetailService.getKnowledgeDetail.get({
                id:$scope.knowItemId,
                queryKey:$scope.queryKey
            },function(resource){
                if(resource.status == 200){
                    $scope.knowItem = resource.data;
                    var know =  $scope.knowItem;
                    var title = $sce.trustAsHtml(know.title);
                    var content = $sce.trustAsHtml(know.content);
                    know.titleHtml = title;
                    know.contentHtml = content;
                }
            })
        }


        //查询关联的知识条目
        self.queryLinkKnowItems = function(){
            DetailService.queryLinkKnowItems.get({id:$scope.knowItemId},function(resource){
                if(resource.status == 200){
                    $scope.linkKnowItems = resource.data;
                }
            })
        }


        //查询该知识条目下的评论列表
        self.queryCommentByKnowItem = function(){
            DetailService.queryCommentByKnowItem.get({
                //type:0,
                knowItemId:$scope.SearchPOJO.knowItemId ,
                pageNo:$scope.SearchPOJO.currentPage ,
                pageSize:$scope.SearchPOJO.pageSize ,
                queryPage: $scope.SearchPOJO.queryPage
            },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.comments = resource.data.data.data;
                    $scope.paginationConf.totalItems = resource.data.data.total;

                }
            })
        }

        //查询该知识评论回复列表
        $scope.queryRequireByComment = function(userId){
            DetailService.queryRequireByComment.get({
                type:1,
                userId:userId ,
                knowItemId:$scope.SearchPOJO.knowItemId ,
                // pageNo:$scope.SearchPOJO.currentPage ,
                // pageSize:$scope.SearchPOJO.pageSize ,
                queryPage: $scope.SearchPOJO.queryPage
            },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.requires = resource.data.data.data;
                    //$scope.paginationConfRequire.total = resource.data.data.total;
                }
            })

        }


        //添加评论回复的方法
        $scope.require = [];
        $scope.addAnswer = function(knowItemId,targetId,index){
            var require = $scope.require[index];
            var flag = false;
            if(require == null){
                alert("回复不能为空！")
                return;
            }
            if(require != null){
                flag = true;
            }
            if(flag) {
                HomeService.createComment.save({
                    content: require,
                    knowItemId: knowItemId,
                    targetId: targetId,
                    type: 1
                }, function (resource) {
                    if (resource.status == 200) {
                        $scope.result = resource.data;
                        if ($scope.result) {
                            TipService.setMessage('回复成功!',"success");
                            //$scope.require[index] =null;
                            //$scope.queryRequireByComment();
                        } else {
                            TipService.setMessage('回复失败!',"error");
                        }
                    } else {
                        TipService.setMessage('回复失败!',"error");
                    }
                    $scope.SearchPOJO.currentPage = 1;
                    self.queryCommentByKnowItem();
                });
            }

        };

        
        //添加评论的方法
        $scope.addComment = function(){
            var comment = $scope.comment;
            var flag = false;
            if(comment == null || comment == ''){
                alert("评论不能为空！")
                return;
            }
            if(comment != null){
                flag = true;
            }
            if(flag) {
                HomeService.createComment.save({
                    content: comment,
                    knowItemId: $scope.knowItemId,
                    type:0,
                    targetId:$scope.knowItem.userId
                }, function (resource) {
                    if (resource.status == 200) {
                        $scope.comment = "";
                        TipService.setMessage('评论成功!',"success");
                    } else {
                        TipService.setMessage('评论失败!',"error");
                    }
                    $scope.SearchPOJO.currentPage = 1;
                    self.queryCommentByKnowItem();
                });
            }
        };


        //取消评论
        $scope.cancelComment = function(){
            $scope.comment = "";
        }

        //知识条目点赞
        $scope.likeKnowItem = function(status,knowItemId,libraryId,libName){
            // HomeService.agree.save({
            //     knowId:knowItemId,
            //     optType:3,
            //     libraryId:libraryId,
            //     libraryName:libName
            // },function (resource) {
            //     if(resource.status==500){
            //         $scope.result = resource.err;
            //         if($scope.result == "您已点赞！"){
            //             TipService.setMessage('已点赞!',"error");
            //         }
            //     }
            // });

            if(!status){
                HomeService.agree.save({
                    knowId:knowItemId,
                    optType:3,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('点赞成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }else if(status){
                HomeService.agree.save({
                    knowId:knowItemId,
                    optType:3,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('取消点赞成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }
        };

        //收藏知识条目
        $scope.collectKnowItem = function(status,knowItemId,libraryId,libName){
            if(!status){
                HomeService.collect.save({
                    knowId:knowItemId,
                    optType:4,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('收藏成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }else if(status){
                HomeService.collect.save({
                    knowId:knowItemId,
                    optType:4,
                    libraryId:libraryId,
                    libraryName:libName
                },function (resource) {
                    if(resource.status==200){
                        TipService.setMessage('取消收藏成功!',"success");
                    }
                    self.getKnowItemById();
                });
            }

        };
        //判断是否可点赞
        $scope.canAgree = function(agreeStatus){
            if(agreeStatus){
                return "icon icoimg dz_s";
            }else{
                return "icon icoimg dz";
            }

        }
        //判断是否可收藏
        $scope.canCollect = function(collectStatus){
            if(collectStatus){
                return "icon icoimg sc_s";
            }else{
                return "icon icoimg sc";
            }
        }
        //删除回复
        $scope.deleteComment = function (commentId) {
            DetailService.deleteComment.save({
                commentId:commentId
            },function (resource) {
                if(resource.status==200){
                    TipService.setMessage('操作成功!',"success");
                    self.queryCommentByKnowItem();
                }else{
                    TipService.setMessage('操作失败!',"error");
                }
            });
        }

        self.initSearch();
        self.getKnowItemById();

        $scope.$watch('SearchPOJO',self.queryCommentByKnowItem,true)

    }
])
