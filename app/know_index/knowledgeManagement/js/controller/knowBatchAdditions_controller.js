/**
 * Created by dinfo on 2017/3/28.
 */

angular.module('knowledgeManagementModule').controller('knowBatchAdditionsController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$cookieStore","$timeout","$compile","FileUploader","$stateParams","knowledgeAddServer","$window","$rootScope","$filter",
    function ($scope,localStorageService, $state,ngDialog,$cookieStore,$timeout,$compile,FileUploader,$stateParams,knowledgeAddServer,$window,$rootScope,$filter) {
        //console.log($stateParams);
        $scope.vm = {
            downTemplate: downTemplate,  //新增点击事件
            upload : upload,
            fileName :'',
            changeKonwledge:changeKonwledge,
            templateType : 191,
        };

        //上传
        function upload(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/knowledgeManagement/batchAdditions/uploadDialog.html",
                width:"450px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }

        function changeKonwledge(id){
            switch(id){
                case "190" :
                    $scope.vm.templateType = "190";
                    break;
                case "192":
                    $scope.vm.templateType = "192";
                    break;
                case "191" :
                    $scope.vm.templateType = "191";
            }

        }

        //打开下载模板
        function downTemplate(callback){
            var dialog = ngDialog.openConfirm({
                template: "/know_index/knowledgeManagement/batchAdditions/downTemplateDialog.html",
                width:"450px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    if (e === 1) {

                    } else {

                    }
                }
            });
        }


    }
]);