
/**
 * 打开回复框
 */
angular.module('knowledgeManagementModule').directive("answer", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {
            //回答
            elem.on("click",function(e){
                e.stopPropagation();
                $(this).parents("li").addClass("bg").find(".act-comment").show();
            });
        }
    }
});

/**
 * 取消回复
 */
angular.module('knowledgeManagementModule').directive("cancelAnswer", function() {
    return {
        restrict: "AE",
        link: function(scope, elem, attrs) {
            elem.on("click",function(e){
                $(this).parents(".act-comment").hide();
                $(this).parents("li").removeClass("bg");
            });
        }
    }
});

knowledge_static_web.directive("docView", function(RecursionHelper,PortalService) {
    return {
        restrict: "E",
        replace: true,
        template:'<div id="swfMain" style="height:600px;"></div>',
        link:function(scope, elem, attrs){
            $('#swfMain').FlexPaperViewer(
                { config : {
                    SwfFile: escape("/back/knowaccess/docimport/docmanager/viewKnowDoc/"+scope.knowDocId),
                    jsDirectory:'swf/print/FlexPaperViewer',
                    Scale : 0.6,
                    ZoomTransition : 'easeOut',
                    key: "@1bb10db124f45f30fb1$a98113c5cbb8921df84",
                    ZoomTime : 0.5,
                    ZoomInterval : 0.2,
                    FitPageOnLoad : false,
                    FitWidthOnLoad : true,
                    FullScreenAsMaxWindow : false,
                    ProgressiveLoading : false,
                    MinZoomSize : 0.2,
                    MaxZoomSize : 5,
                    SearchMatchAll : false,
                    InitViewMode : 'Portrait',
                    PrintPaperAsBitmap: false,
                    RenderingOrder : 'flash',
                    StartAtPage : '',
                    ViewModeToolsVisible : true,
                    ZoomToolsVisible : true,
                    NavToolsVisible : true,
                    CursorToolsVisible : true,
                    SearchToolsVisible : true,
                    localeChain: 'zh_CN'
                }}
            );
        }
    }
});






