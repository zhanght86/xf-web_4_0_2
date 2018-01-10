/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  知识批量新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule
    .controller('KnowBatchAdditionsController',
    ['$scope', 'localStorageService' ,"$state","ngDialog","$cookieStore","$stateParams","$window","$rootScope","$filter",
    ($scope,localStorageService, $state,ngDialog,$cookieStore,$stateParams,$window,$rootScope,$filter)=> {
        //console.log($stateParams);
        $scope.vm = {
            downTemplate: downTemplate,  //新增点击事件
            upload : upload,
            fileName :'',
            templateType : 190, //添加默认值
        };
        //$.getScript('/js/common/config.js',function(e){
        //console.log(e)
        //    //newFun('"Checking new script"');//这个函数是在new.js里面的，当点击click后运行这个函数
        //});
        //上传
        function upload(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/knowledgeManagement/batchAdditions/uploadDialog.html",
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
                template: "/static/knowledgeManagement/batchAdditions/downTemplateDialog.html",
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
])};