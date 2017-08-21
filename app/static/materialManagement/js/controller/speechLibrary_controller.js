/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */ 
angular.module('materialManagement').controller('speechLibraryController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.speechLibrary");
        $scope.vm = {
            getVoiceList : getVoiceList , //获取图片列表
            voiceList : [] ,        //所有声音列表
            removeVoice : removeVoice , //刪除
            paginationConf : {
                pageSize: 9,//第页条目数
                pagesLength: 10,//分页框数量
            } ,
            uploadSpeech :uploadSpeech,
            voiceTitle :"",
            isUploadStart : false,
            changeName:changeName,
        };
        getVoiceList(1) ;
        function getVoiceList(index){
            httpRequestPost("/api/ms/voiceManage/queryVioce ",{
                "index": (index-1)*$scope.vm.paginationConf.pageSize,
                "pageSize": $scope.vm.paginationConf.pageSize ,
                "applicationId":APPLICATION_ID
            },function(data){
                if(data.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.voiceList = data.data ;
                        $scope.vm.paginationConf.currentPage =index ;
                        $scope.vm.paginationConf.totalItems =data.data.total ;
                        $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                        console.log($scope.vm.paginationConf)
                    })
                }
            },function(err){
                console.log(err)
            }) ;
        }
        function removeVoice(item,index){

            layer.confirm('确认删除该语音？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                httpRequestPost("/api/ms/voiceManage/deleteVoice",{
                    "voiceUrl": item.voiceUrl,
                    "voiceId": item.voiceId
                },function(data){
                    if(data.status == 200){
                        layer.msg("语音删除成功") ;
                        getVoiceList(1) ;
                    }else if(data.status == 500){
                        layer.msg("语音删除失败") ;
                    }
                },function(err){
                    console.log(err)
                }) ;
            }, function(){
            });
        }
        var timeout ;
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                if (timeout) {
                    $timeout.cancel(timeout)
                }
                timeout = $timeout(function () {
                    getVoiceList(current);
                }, 100)

            }
        },true);
        function uploadSpeech(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/materialManagement/speechLibrary/speechLibraryDialog.html",
                width:"900px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉
                    $scope.vm.isUploadStart = false ;
                    //if (e === 1) {
                    //
                    //} else {
                    //
                    //}
                }
            });
        }

        //修改名称
        function changeName(callback){
            var dialog = ngDialog.openConfirm({
                template: "/static/materialManagement/speechLibrary/changeName.html",
                width:"400px",
                scope: $scope,
                closeByNavigation: false,
                overlay: true,
                closeByDocument: false,
                closeByEscape: true,
                showClose: true,
                preCloseCallback: function (e) {    //关闭回掉

                }
            });
        }
    }
]);

