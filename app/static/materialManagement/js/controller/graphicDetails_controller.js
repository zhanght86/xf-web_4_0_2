/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
angular.module('materialManagement').controller('graphicDetailsController', [
    '$scope',"$state","ngDialog", "$cookieStore","$stateParams","$timeout",
    function ($scope,$state,ngDialog,$cookieStore,$stateParams,$timeout) {
        $state.go("materialManagement.graphicDetails");
        $scope.vm = {
            raphicMessageId :"" , //图文知识id
            title : '',                     //标题
            author :'',                     //作者
            link : "" ,                      // 链接
            imgSelected : "" ,       //已选择图片库选择封面图片
            ueditorText : "",    //编辑器内容
            graphicCreateTime : "" // 时间
        };
        if($stateParams.imgTextId){
            $scope.vm.graphicMessageId = $stateParams.imgTextId ;
            getImgText($stateParams.imgTextId)
        }else{
            $state.go("materialManagement.teletextMessage")
        }
         function getImgText(graphicMessageId){
            httpRequestPost("/api/ms/graphicMessage/findOneGraphicMessage",{
                "graphicMessageId" : graphicMessageId ,
                "applicationId": APPLICATION_ID
            },function(response){
                if(response.status == 200){
                    $scope.$apply(function(){
                        $scope.vm.title = response.data.graphicMessageTitle ;
                        $scope.vm.author = response.data.graphicMessageAuthor ;
                        $scope.vm.ueditorText = response.data.graphicMessageText ;
                        $scope.vm.link = response.data.graphicMessageTextLink ;
                        $scope.vm.graphicCreateTime = response.data.graphicCreateTime ;
                    })
                }else if(response.status == 500){
                    //    获取失败
                }
            },function(error){console.log(error)})
        }

    }
]);

