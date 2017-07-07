/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */

angular.module('knowledgeManagementModule').controller('knowViewController', [
    '$scope', '$location','$anchorScroll', "$interval",  "$timeout", "ngDialog","$stateParams","$state",
    "DetailService","$sce","KnowDocService",
    function ($scope, $location,$anchorScroll, $interval, $timeout, ngDialog,$stateParams,$state,
              DetailService,$sce,KnowDocService) {
        var self = this;
        $scope.knowDocId = $stateParams.knowDocId;

        //根据知识文档id查询相关知识条目
        self.queryKnowDocByDocId = function(){
            DetailService.queryKnowDocByDocId.save(
                {
                    "documentationId": $scope.knowDocId,
                },function(resource){
                if(resource.status == 200 && resource.data.status == 200){
                    $scope.docItems = resource.data.objs;
                    $scope.docItems.forEach(function(know){
                        var titleHtml = $sce.trustAsHtml(know.title);
                        var contentHtml = $sce.trustAsHtml(know.content);
                        know.titleHtml = titleHtml;
                        know.contentHtml = contentHtml
                    })
                }
            })
        }

        // self.queryKnowDocByDocId = function(){
        //     KnowDocService.queryDetailByDocId.save({
        //         "index": 0,
        //         "knowledgeDocumentation": {
        //             "documentationId": $scope.knowDocId,
        //     },
        //         "pageSize": 0,
        //         "requestId": "string",
        //     },function(resource){
        //             if(resource.status == 200){
        //                 $scope.knowDoc = resource.data;
        //             }
        //         },function(){
        //         })
        // }

        $scope.checkShow = function () {
            var url = $location.url();
            if(!url.toString().indexOf("/index/") > 0){
                return false;
            }else{
                return true;
            }
        }

        self.queryKnowDocByDocId();
        //self.queryKnowDocByDocId();

        $scope.jumper = function (key) {
            $location.hash(key);
            $anchorScroll();
        }
    }
])



    .directive("contentMore",function(){
        return{
            restrict: "AE",
            link: function(scope, elem, attrs) {
                //回答
                elem.on("click",function(e){
                    e.stopPropagation();
                    $(this).parent().siblings('.dd').css('max-height','inherit').siblings('.dn').show();
                    $(this).hide().siblings('.less').show();
                });
            }
        }
    })
    .directive("contentLess",function(){
        return{
            restrict: "AE",
            link: function(scope, elem, attrs) {
                //回答
                elem.on("click",function(e){
                    e.stopPropagation();
                    $(this).parent().siblings('.dd').css('max-height','130px').siblings('.dn').hide();
                    $(this).hide().siblings('.edit_more').show();
                });
            }
        }
    });
