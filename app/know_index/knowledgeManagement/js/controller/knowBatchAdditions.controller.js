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
            templateType : SCENE_ID==1?"190":"192", //添加默认值
            sceneId : SCENE_ID
        };
        //$.getScript('/js/common/config.js',function(e){
        //console.log(e)
        //    //newFun('"Checking new script"');//这个函数是在new.js里面的，当点击click后运行这个函数
        //});
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