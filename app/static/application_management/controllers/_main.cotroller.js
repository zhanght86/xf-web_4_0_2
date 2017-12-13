module.exports = applicationManagementModule =>{
    applicationManagementModule
    .controller('ApplicationSettingController',
    ['$scope', "$state", "$stateParams","$cookieStore","$rootScope","ApplicationServer",
    ($scope,$state, $stateParams,$cookieStore,$rootScope,ApplicationServer)=> {
        //$state.go("admin.manage",{userPermission:$stateParams.userPermission});
        $scope.vm = {
            isSlide : isSlide,
            isSlide2 : isSlide2,
            robotName : "" //机器人名称
        };
        //获取应用的头像
        findRobotHead();

        function isSlide(event){
            var self = event.target;
            if($(self).hasClass("slideActive")){
                $(self).removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).addClass("slideActive").next(".menu_1").stop().slideToggle();
            }
        }
        function isSlide2(event){
            var self=event.target;
            if($(self).parent().hasClass("slideActive")){
                $(self).parent().removeClass("slideActive").next(".menu_1").stop().slideToggle();
            }else{
                $(self).parent().addClass("slideActive").next(".menu_1").stop().slideToggle();
            }
        }
        //获取应用的头像
        function findRobotHead(){
            ApplicationServer.queryRobotParameter.get({
                "id": APPLICATION_ID
            },function(response){          //类名重複
                if(response.status===200){
                    setCookie('avatarUrl',response.data.imgUrl);
                    setCookie('avatarId',response.data.avatarDocId);
                    setCookie('robotName',response.data.name);

                    $scope.$parent.MASTER.avatarUrl = response.data.imgUrl ;
                    $scope.$parent.MASTER.avatarId = response.data.avatarDocId ;
                    $scope.$parent.MASTER.robotName = response.data.name; //机器人名称
                }
            },function(error){
                console.log(error);
            })
        }
    }
])};