/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('frameworkLibraryController', [
    '$scope', "$state", "$stateParams","ngDialog",
    function ($scope, $state, $stateParams, ngDialog) {
        
        $state.go("frameworkLibrary.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            addFramework: addFramework,
            

        };
        function addFramework(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/frameworkLibraryDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        


    }
]);