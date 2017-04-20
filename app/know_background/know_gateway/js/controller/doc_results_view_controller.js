/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */


angular.module('knowGatewayModule').controller('doc_results_viewController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog",
    function ($scope,localStorageService, $state,ngDialog) {

        $scope.vm={
            addDocView :addDocView,
            addDocView2 :addDocView2,
            addDocViewAdd :addDocViewAdd,

        }
        function addDocView(){
            var dialog = ngDialog.openConfirm({
                template:"/know_background/know_gateway/doc_results_viewDialog.html",
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
        function addDocView2(){
            var dialog = ngDialog.openConfirm({
                template:"/know_background/know_gateway/doc_results_viewDialog2.html",
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
        function addDocViewAdd(){
            var dialog = ngDialog.openConfirm({
                template:"/know_background/know_gateway/doc_results_viewDialog_add.html",
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
])