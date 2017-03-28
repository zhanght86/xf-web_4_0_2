/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('indexModule').controller('indexController', [
    '$scope', '$location', "$interval", "$timeout", "$state",
    "IndexService", "AuthService","PersonalCenterService",
    function ($scope, $location, $interval, $timeout, $state,
              IndexService , AuthService,PersonalCenterService) {

        var self = this;

        // //页面跳转
        // self.goUrl = function(menu,menuClick){
        //     if(!$location.absUrl().split('/index/')[1] || menuClick){
        //         $state.go(menu.url);
        //     }
        // }
        $scope.active = function(path){
            var url = $location.absUrl();
            return new RegExp(path).test(url)?'active':"";
        };
        //加载左侧树
        // self.loadLeftTree = function(topMenu,menuClick){
        //     IndexService.queryTopButtons({menuId: topMenu.id}, function (result) {
        //         $scope.treeButtons = result.data;
        //         if (result.data.length > 0) {
        //             self.goUrl(result.data[0],menuClick);
        //         }else{
        //             self.goUrl(topMenu,menuClick);
        //         }
        //     });
        // }

        //头菜单的点击事件
        // $scope.changeTopMenu = function(item){
        //     var currentState = $state.$current.name;
        //     if(currentState != item.url)
        //         self.loadLeftTree(item,true);
        // }

        //定义退出登录的方法
        $scope.logout = function () {
            AuthService.logout(function (data) {
                
            }, function (errMsg) {
                $scope.errMsg = errMsg;
            });
        };

        //添加服务器请求 获取当前用户登录信息
        AuthService.checkLoginStatus({}, function (data) {
            $scope.setCurrentUser(data);
        });


        //存放权限集合
        var permissionList =[];
        //添加服务器请求 获取当前用户登录信息
        AuthService.checkLoginStatus({}, function (data) {
            $scope.setCurrentUser(data);
            permissionList = data.privileges;
        });

        //跳转
        $scope.toBack = function () {
            if(permissionList.indexOf('back.gateway')!= -1) {
                $state.go('back.gateway')
                return;
            }
            if(permissionList.indexOf('back.task')!= -1) {
                $state.go('back.task')
                return;
            }
            if(permissionList.indexOf('back.manageBase')!= -1) {
                $state.go('back.manageBase')
                return;
            }
            if(permissionList.indexOf('back.application')!= -1) {
                $state.go('back.application')
                return;
            }
            if(permissionList.indexOf('back.system')!= -1) {
                $state.go('back.system')
                return;
            }
        }

        //加载头菜单
        // IndexService.queryTopButtons({menuId: 0}, function (result) {
        //     if (result.data.length > 0) {
        //         $scope.topButtons = result.data;
        //         for(var i=0;i<result.data.length;i++){
        //             var menu = result.data[i];
        //             if($location.absUrl().indexOf(menu.url.split('.')[1])>0){
        //                 self.loadLeftTree(menu);
        //                 return;
        //             }
        //         }
        //         self.loadLeftTree(result.data[0]);
        //     }
        // });
        //加载主页时钟
        // $interval(function () {
        //     $scope.now = new Date();
        // }, 1000);

        // $scope.initKnowCheckNoticeView = function(){
        //     PersonalCenterService.connKnowCheckNoticeCon.get(
        //         {
        //             flag:1,
        //             pageNo:$scope.SearchPOJO.currentPage,
        //             pageSize:5
        //         },function(resource){
        //             var resultData = resource.data;
        //             // $("#knowCheckNotice").css("display","block");
        //             $scope.resultCheckNoticeList = resultData.data;
        //             $scope.resultCheckNoticeTotal = resultData.total;
        //             // console.log($scope.resultCheckNoticeTotal);
        //         })
        // }
        // $scope.initKnowCheckNoticeView();

    }
])