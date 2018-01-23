/**
 * @Author : MILES .
 * @Create : 2017/12/5.
 * @Module :  授权管理
 */
module.exports = applicationManagementModule =>{
    applicationManagementModule.
    controller('AuthorizationManagementController',
    ['$scope', 'localStorageService' ,"ApplicationServer", "$state" ,"ngDialog",'$http', "$cookieStore","$rootScope",
    ($scope,localStorageService, ApplicationServer ,$state,ngDialog,$http,$cookieStore,$rootScope) =>{
        $scope.info = {

        } ;
        $scope.vm = {
            authorize : authorize
        };
        getInfo() ;
        function getInfo() {
            let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false, time:100000}) ;
            ApplicationServer.getLicenseInfo.get({
                "applicationId":APPLICATION_ID
            },function (response) {
                layer.close(i) ;
                $scope.info = response.data
            },function (error) {
                layer.close(i) ;
                console.log(error)
            })
        }
        function authorize() {
            if(!$scope.info.license){
                return layer.msg("请填写授权码")
            }
            ApplicationServer.updateLicense.save({
                "license":$scope.info.license
            },function (response) {
                if(response.status == 200){
                    getInfo();
                     layer.msg(response.info,{time:1000})
                }else{
                     layer.msg(response.info,{time:1000})
                }
            })
        }
        }
    ])
};
