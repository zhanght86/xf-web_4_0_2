/**
 * Created by mileS on 2017/7/21.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('PictureLibraryController', [
    '$scope',"$state","ngDialog","MaterialServer", "$cookieStore","$stateParams","$location","$timeout","$window",
    ($scope,$state,ngDialog,MaterialServer,$cookieStore,$stateParams,$location,$timeout,$window)=> {
        $state.go("MM.pic");
        $scope.vm = {
            getPicList : getPicList , //获取图片列表
            imageList : "" ,        //所有图片列表
            paginationConf : {
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: getPicList ,
                location:true
            },
            changeName:changeName,
            pictureId :'',
            pictureIds : [],
            pictureName:'',
            editPictureName :'',
            //napSearch:napSearch,
            exportExcel:exportExcel,
            batchDeletePicture:batchDeletePicture,
            isSelectAll  : false ,  // 全选 删除
            selectAll : selectAll  ,//选择全部
            singleAdd : singleAdd , //单个添加
            uploadParemeter : {
                queueNumber : 0 ,
                uploadNumber : 0 ,
                process : "0%"
            },
            checkName : checkName
        };
        //查询
        // function  napSearch(){
        //     getPicList(1) ;
        // }
        //
        getPicList($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function getPicList(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:5000}) ;
            MaterialServer.getList.get({
                "index": (index-1)*pageSize,
                "pageSize": pageSize,
                "name" : $scope.vm.pictureName,

            },function(data){
                layer.close(i);
                console.log(data);
                if(data.status == 200){
                    initBatchTest() ;
                    $scope.vm.imageList = data.data ;
                    $scope.vm.paginationConf.currentPage =index ;
                    $scope.vm.paginationConf.totalItems =data.data.total ;
                    $scope.vm.paginationConf.numberOfPages = data.data.total/$scope.vm.paginationConf.pageSize ;
                    console.log($scope.vm.paginationConf)
                }
                if(data.status == 500){
                    console.log('查询失败');
                    $scope.vm.imageList= [];
                    $scope.vm.paginationConf.totalItems=0;
                }
            },function(err){
                layer.close(i);
                console.log(err);
            });
        }

        /**
         * 删除图片
         */
        function batchDeletePicture(pictureIds){
            if(!pictureIds.length){
                layer.msg("请选择要删除的图片")
            }else{
                layer.confirm('确认删除图片？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    MaterialServer.deleteImg.save({
                        "pictureIds": pictureIds
                    },{
                        "pictureIds": pictureIds
                    },function(data){
                        if(data.status == 200){
                            layer.msg("图片删除成功") ;
                            $state.reload();
                        }else if(data.status == 500){
                            layer.msg("图片删除失败") ;
                        }
                    },function(err){
                        console.log(err);
                    });

                }, function(error){
                    console.log(error);
                });
            }
        }
        /**
         * 图片导出  没有查询条件导出全部，有查询条件导出查询出的结果；
         */
        function exportExcel(){
            var urlParams =
                "?name="+$scope.vm.pictureName;
               // "?applicationId="+APPLICATION_ID+"&name="+$scope.vm.pictureName;
            //var url = "/api/ms/picture/exportExcel"+urlParams  ;//请求的url
            //$window.open(url,"_blank") ;

            var url= MaterialServer.exportImg+urlParams;
            downLoadFiles($(".picLib")[0],url);

        }

        /**
         * 修改名称
         */
        function changeName(item){
            // $scope.vm.pictureName=item.name;
            $scope.vm.editPictureName = item.name;
            $scope.vm.pictureId=item.id;

            let change_html = require("../../views/picture_library/change_name.html") ;
            $scope.$parent.$parent.MASTER.openNgDialog($scope,change_html,"400px",function(){

            },"",function(){

            })

            // $scope.$parent.$parent.MASTER.openNgDialog($scope,'/static/material_management/views/picture_library/change_name.html','400px',function(){
            //     //updateImg();
            //
            // },function(){
            //
            // });
        }
        /**
        ***名称校验
        **/
        function checkName(){
            if(!$scope.vm.editPictureName){
                layer.msg("请输入图片名称");
            }else{
                MaterialServer.checkName.get({
                    "name": $scope.vm.editPictureName
                },function(data){
                    if(data.code==10006){
                        layer.msg("图片名称重复,请重新输入");
                    }else{
                        ngDialog.close();
                        updateImg();
                    }
                },function(err){
                    console.log(err);
                });
            }

        }
        function updateImg(){
            MaterialServer.updateImg.save({
                //"name":$scope.vm.pictureName,
                "name": $scope.vm.editPictureName,
                "id":$scope.vm.pictureId,
                "modifierId":USER_ID
            },function(data){
                if(data.status == 200){
                    layer.msg('图片名称修改成功');
                    //getPicList(1)
                    $state.reload();
                }else if(data.status == 500){
                    layer.msg("名称根寻失败") ;
                }
            },function(err){
                console.log(err);
            });
        }

        /**
         * 全选
         */
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll = false ;
                $scope.vm.pictureIds = [] ;
            }else{
                $scope.vm.isSelectAll = true ;
                $scope.vm.pictureIds = [] ;
                angular.forEach($scope.vm.imageList.objs,function(val){
                    $scope.vm.pictureIds.push(val.id)
                });
            }
            //console.log($scope.vm.pictureIds);
        }
        /**
         * 单选
         */        
        function singleAdd(id){
            if($scope.vm.pictureIds.inArray(id)){
                $scope.vm.pictureIds.remove(id);
                $scope.vm.isSelectAll = false;
            }else{
                $scope.vm.pictureIds.push(id);

            }
            if($scope.vm.pictureIds.length==$scope.vm.imageList.objs.length){
                $scope.vm.isSelectAll = true;
            }
            console.log( $scope.vm.pictureIds);
        }
        /**
         * 全选清空选择按钮；
         */
        function initBatchTest(){
            $scope.vm.pictureIds = [] ;
            $scope.vm.isSelectAll = false;
        }
    }
    ])};

