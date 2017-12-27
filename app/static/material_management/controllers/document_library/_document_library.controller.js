/**
 * Created by mileS on 2017/6/3.
 * 控制器
 */
module.exports=materialModule => {
    materialModule
    .controller('DocumentLibraryController', [
    '$scope',"$state","ngDialog","MaterialServer", "$cookieStore","$stateParams","$location","$timeout",
    ($scope,$state,ngDialog,MaterialServer,$cookieStore,$stateParams,$location,$timeout)=> {
        $state.go("MM.doc");
        $scope.vm = {
            paginationConf:{
                pageSize : $location.search().pageSize?$location.search().pageSize:5,        //每页条目数量
                currentPage: $location.search().currentPage?$location.search().currentPage:1,
                search: searchDoc ,
                location:true
            },
            docList:[],              //文档列表
            docName:"",
            editDocName :"",
            docId:"",
            docIds:[],               //id集合
            uploadParemeter:{
                queueNumber:0,            //添加文档数量
                uploadNumber:0,           //上传数量
                process:"0%"              //进度条
            },
            searchDoc : searchDoc,        //查询
            selectAll:selectAll,
            isSelectAll:false,
            selectSingle:selectSingle,
            //changeName:changeName,
            exportDoc : exportDoc,          //导出
            //checkName : checkName,
            batchDeleteDoc : batchDeleteDoc      //删除
        };
        /**
        ** 查询
        **/
        searchDoc($scope.vm.paginationConf.currentPage,$scope.vm.paginationConf.pageSize);
        function searchDoc(index,pageSize,reset){
            if(reset){
                $scope.vm.paginationConf.currentPage = 1;
                $location.search("currentPage",1);
            }
            var i= layer.msg("资源加载中...",{icon:16,shade:[0.5,'#000'],scrollbar:false,time:100000});
            MaterialServer.searchDoc.get({
                "name": $scope.vm.docName,
                "index": (index-1)*pageSize,
                "pageSize": pageSize
            },{
                "name": $scope.vm.docName,
                "index": (index-1)*pageSize,
                "pageSize": pageSize
            },function(data){
                layer.close(i);
                if(data.status==200){
                    console.log(data);
                    $scope.vm.docList=data.data;
                    $scope.vm.paginationConf.currentPage=index;
                    $scope.vm.paginationConf.totalItems=data.data.total;
                    $scope.vm.paginationConf.numberOfPages=data.data.total/$scope.vm.paginationConf.pageSize;
                }else if(data.status==500){
                    layer.msg("查询失败");
                    $scope.vm.docList=[];
                    $scope.vm.paginationConf.totalItems=0;
                }

            },function(err){
                layer.close(i);
                console.log(err);
            });
        }


        /**
         ** 批量删除
         **/
        function batchDeleteDoc(docIds){
            if(!docIds.length){
                layer.msg("请选择要删除的文档");
            }else{
                layer.confirm('确认删除文档？',{
                    btn:["确定","取消"]
                },function(data){
                    MaterialServer.deleteDoc.save({
                        "ids": docIds
                    },{
                        "ids":docIds
                    },function(data){
                        if(data.status==200){
                            initBatchTest();
                            layer.msg("文档删除成功");
                            $state.reload();
                        }else if (data.status==500){
                            layer.msg("文档删除失败");
                        }
                    },function(){

                    });
                },function(err){
                    console.log(err);
                });
            }
        }
        /**
         ** 全选
         **/
        function selectAll(){
            if($scope.vm.isSelectAll){
                $scope.vm.isSelectAll=false;
                $scope.vm.docIds=[];
            }else{
                $scope.vm.isSelectAll=true;
                $scope.vm.docIds=[];
                angular.forEach($scope.vm.docList.objs,function(val){
                    $scope.vm.docIds.push(val.id);
                });
            }
            console.log($scope.vm.docIds);
        }
        /**
         ** 单选
         **/
        function selectSingle(id){
            if($scope.vm.docIds.inArray(id)){
                $scope.vm.docIds.remove(id);
                $scope.vm.isSelectAll=false;
            }else{
                $scope.vm.docIds.push(id);
            }
            if($scope.vm.docIds.length==$scope.vm.docList.objs.length){
                $scope.vm.isSelectAll=true;
            }
            console.log($scope.vm.docIds);
        }
        /**
         ** 全选清空
         **/
        function initBatchTest(){
            $scope.vm.isSelectAll=false;
            $scope.vm.docIds=[];
        }
        /**
         ** 导出
         **/
        function exportDoc(){
            var urlParams="?name="+$scope.vm.docName;
            var url=MaterialServer.exportDoc + urlParams;
            downLoadFiles($(".docWrap")[0],url);
        }




    }
    ])};

