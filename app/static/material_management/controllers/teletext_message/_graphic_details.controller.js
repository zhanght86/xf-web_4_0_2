/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('GraphicDetailsController', [
    '$scope',"$state","ngDialog", "$log","MaterialServer","$cookieStore","$stateParams","$timeout",
    ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout)=> {
        $state.go("MM.detail");
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
            MaterialServer.getImgText.get({
                "graphicMessageId" : graphicMessageId
            },{
                "graphicMessageId" : graphicMessageId
            },function(response){
                if(response.status == 200){
                    //console.log(response);
                    $scope.vm.title = response.data.title ;
                    $scope.vm.author = response.data.author ;
                    $scope.vm.ueditorText = response.data.content ;
                    $scope.vm.link = response.data.link ;
                    $scope.vm.imgSelected = response.data.coverPicId ;
                    $scope.vm.graphicCreateTime = response.data.modifyTime

                }else if(response.status == 500){
                    //    获取失败
                }
            },function(error){
                $log.log(error);
            });
        }

    }
    ])};

