/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('backModule').controller('backController', [
    '$scope', '$location', "$interval", "$timeout", "$state",
    "IndexService", "AuthService",
    function ($scope, $location, $interval, $timeout, $state,
              IndexService , AuthService) {
        $state.go("back.gateway");
        // var self = this;
        // $scope.active = function(path){
        //     var url = $location.absUrl();
        //     return new RegExp(path).test(url)?'current':"";
        // };
        //
        // // $scope.activeBase = function(path){
        // //     var url = $location.absUrl();
        // //     return new RegExp(path).test(url)?'current':"";
        // // };
        //
        // //存放权限集合
        // var permissionList =[];
        // //添加服务器请求 获取当前用户登录信息
        // AuthService.checkLoginStatus({}, function (data) {
        //     $scope.setCurrentUser(data);
        //     permissionList = data.privileges;
        // });
        // //权限验证
        // $scope.isAuth = function(privilege){
        //     var flag = false;
        //     if(permissionList != null && permissionList.length>0 ){
        //         if(permissionList.indexOf(privilege)!= -1) {
        //             flag = true;
        //         }
        //     }
        //     return flag;
        // }
        //
        // //按钮权限验证
        // $scope.buttonHas = function (buttonPri) {
        //     for(var i = 0;i< buttonPri.length; i++){
        //         var pri = buttonPri[i]
        //         if("back.gateway" == pri || "back.adapter" == pri){
        //             if(permissionList.indexOf('back.gateway')!= -1) {
        //                 $state.go('back.gateway','{isGo:true}');
        //                 break;
        //             }
        //             if(permissionList.indexOf('back.adapter')!= -1) {
        //                 $state.go('back.adapter','{isGo:true}');
        //                 break;
        //             }
        //         }else{
        //             if(permissionList.indexOf(pri)!= -1) {
        //                 $state.go(pri);
        //                 break;
        //             }
        //         }
        //
        //     }
        // }

      

    }
])