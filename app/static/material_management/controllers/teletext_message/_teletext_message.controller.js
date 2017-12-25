/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('TeletextMessageController', [
    '$scope',"$state","ngDialog", "$log","MaterialServer","$cookieStore","$stateParams","$timeout","$location",
    ($scope,$state,ngDialog,$log,MaterialServer,$cookieStore,$stateParams,$timeout,$location)=> {
        $state.go("MM.teletext");
        $scope.vm = {
            paginationConf : {
                pageSize : $location.search().pageSize?$location.search().pageSize:8,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: showImg ,
                location:true
            },
            titAuthor:'',
            imageList : [] ,        //所有图片列表
            showImg : showImg,
            removeImg : removeImg,
        };

        showImg($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        /**
         * 查询
         */
        function showImg(index,pageSize,reset) {
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
            MaterialServer.showImg.get({
                title : $scope.vm.titAuthor,
                author : $scope.vm.titAuthor,
                index : (index - 1)*pageSize,
                pageSize : pageSize

            },function(data){
                layer.close(i);
                if(data.status == 500){
                    layer.msg("请求失败",{time:1000});
                    $scope.vm.imageList=[];
                    $scope.vm.paginationConf.totalItems=0;
                }else if(data.status == 200){
                    console.log(data);
                    $scope.vm.imageList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf);
                }
            },function(err){
                layer.close(i);
                $log.log(err);
            });
        }


        /**
         * 删除图片
         */
        function removeImg(item,index){
            layer.confirm('确认删除该图文消息？', {
                btn: ['确定','取消'] //按钮
            }, function(){
               // alert(1);
                MaterialServer.removeImg.save({
                    "ids" : new Array(item.id)
                },{
                    "ids" : new Array(item.id)
                },function(data){
                    if(data.status == 200){
                        layer.msg("图文消息删除成功") ;
                        //showImg(1)
                        $state.reload();
                    }else if(data.status == 500){
                        layer.msg("图文消息删除失败") ;
                    }
                },function(err){
                    $log.log(err);
                })
            }, function(){
            });
        }

    }
    ])};

