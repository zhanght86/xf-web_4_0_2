'use strict';
knowledge_static_web
    .directive('knowledgeitem',[ 'KnowledgePortalService','ngDialog', function (KnowledgePortalService) {
        return {
            templateUrl: 'know_index/base/knowledge_item/directives/knowledge_item.html',
            restrict: 'E',
            replace: true,
            //scope:{},
            link: function (scope, element) {
                scope.focusKnowItem = function (knowItem) {
                    KnowledgePortalService.focus(knowItem)
                }

                scope.toShareKnowItem = function (selectedKnowItem) {
                    KnowledgePortalService.toShareKnowItem(selectedKnowItem)
                };

                scope.showCommentContainer = function (knowItemId) {
                    if($('#commentContent'+knowItemId).is(":hidden")){
                        $('#commentContent'+knowItemId).attr('class','show');
                        scope.comment = "";
                    }else{
                        $('#commentContent'+knowItemId).attr('class','hide');
                    }
                };

                scope.submitComment = function(knowItemId){
                    var comment = $('#commentContent'+knowItemId).find('textarea').val();
                    if(comment ==null ||  $.trim(comment)=='')
                        return;
                    KnowledgePortalService.replyKnowItem(knowItemId,comment);
                }
            }
        }
    }]);


