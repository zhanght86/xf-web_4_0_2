
/**
 * Created by 41212 on 2017/3/23.
 */
/**
 * Created by Administrator on 2016/6/3.
 * 控制器
 */

angular.module('businessModelingModule').controller('businessConceptManageController', [
    '$scope', 'localStorageService' ,"$state" ,"ngDialog","$timeout","$interval",function ($scope,localStorageService, $state,ngDialog,$timeout,$interval) {
        setCookie("applicationId","360619411498860544");
        setCookie("userName","admin1");
        $scope.vm = {
            applicationId : getCookie("applicationId"),
            addBusiness : addBusiness,
            editBusiness : editBusiness,
            deleteBusiness:deleteBusiness,
            listData : "",   // table 数据
            singleDel : singleDel,    //單條刪除
            singleAdd : singleAdd,
            paginationConf : ""  ,//分页条件
            pageSize : 5  , //默认每页数量
            //查詢
            search : search,
            searchVal : "",
            searchType : "businessConceptKey",
            timeStart : "",
            timeEnd : "",
            //新增
            key: "" ,
            modifier: getCookie("userName"),
            term: "",
            weight: "1" ,   //默認權重

            dialogTitle : "",

            inputSelect : [],
            inputVal : "",

            delSingleTerm : delSingleTerm,      //添加 删除  term
            addSingleTerm : addSingleTerm,
            addSingleTermVal : "",

        };

        //$scope.$watch("vm.addSingleTermVal",function (val) {
        //    console.log(val)
        //},true);

        /**
         * 加载分页条
         * @type {{currentPage: number, totalItems: number, itemsPerPage: number, pagesLength: number, perPageOptions: number[]}}
         */
        getAggre(1);
        //console.log($scope.vm.applicationId)
        //请求列表
        function getAggre(index){
            //size=size?size:5;   //设置pageSize默认是5
            httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "index" :index==1?0:index,
                "pageSize": $scope.vm.pageSize
            },function(data){
                //console.log(data);
                $scope.vm.listData = data.data;
                    //console.log(data)
                $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                };
                $scope.$apply();
            },function(){
                layer.msg("请求失败")
            })
        }
        $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                //console.log(current,$scope.vm.pageSize);
                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(){
                    getAggre(current);
                },function(){
                })
            }
        });
        //编辑
        function editBusiness(item){
             $scope.vm.dialogTitle="编辑停用概念";
             $scope.vm.key = item.businessConceptKey;
             $scope.vm.term =  item.businessConceptTerm;
             $scope.vm.weight =  item.businessConceptWeight;
             addDelDialog(singleEdit,item);
        }
        function search(){
            if($scope.vm.searchType == "businessConceptModifier"){
                searchByUser()
            }else{
                searchByType()
            }
        }
        //查询
        function searchByUser(){
            console.log($scope.vm.searchVal);
            httpRequestPost("/api/modeling/concept/business/listByModifier",{
                "businessConceptModifier":$scope.vm.searchVal,
                "businessConceptApplicationId": $scope.vm.applicationId,
                "index":0,
                "pageSize":10
            },function(data){
                console.log(data);
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
        function searchByType(){
            var data;
            if($scope.vm.searchType != "businessConceptModifyTime"){
                var key = angular.copy($scope.vm.searchType);
                var data =  {
                     key: $scope.vm.searchVal,
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }else{
                console.log( "time"+$scope.vm.timeStart,$scope.vm.timeStart);
                data =  {
                    "startTimeRequest": $scope.vm.timeStart,
                    "endTimeRequest": $scope.vm.timeEnd,
                    "businessConceptApplicationId": $scope.vm.applicationId,
                    "index":0,
                    "pageSize":1
                }
            }
            httpRequestPost("/api/modeling/concept/business/listByAttribute",data,function(data){
                $scope.vm.listData = data.data
            },function(){
                layer.msg("查询没有对应信息")
            });
        }
       var  key = angular.copy($scope.vm.searchType);
        console.log([key]);

        //添加 窗口
        function addBusiness(){
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        console.log($scope.vm.key);
                        httpRequestPost("/api/modeling/concept/business/repeatCheck",{
                            "businessConceptApplicationId": $scope.vm.applicationId,
                            "businessConceptKey": $scope.vm.key
                        },function(data){          //类名重複
                            if(data.status===10002){
                                layer.msg("概念类名重复");
                                httpRequestPost("/api/modeling/concept/business/listByAttribute",{
                                    "businessConceptApplicationId": $scope.vm.applicationId,
                                    "businessConceptKey":$scope.vm.key,
                                    "index":0,
                                    "pageSize":1
                                },function(data){
                                    $scope.vm.dialogTitle="修改停用概念";
                                    console.log(data);
                                    addDelDialog(singleEdit,data.data[0]);
                                    $scope.vm.key = data.data[0].businessConceptKey;
                                    $scope.vm.term =  data.data[0].businessConceptTerm;
                                    $scope.vm.weight =  data.data[0].businessConceptWeight;
                                },function(){
                                });
                             }else{
                                //类名无冲突
                                $scope.vm.dialogTitle="增加业务概念";
                                //key: "",
                                // "modifier": getCookie("userName"),
                                    $scope.vm.term="";
                                    $scope.vm.weight="1" ;   //默認權重
                                    addDelDialog(singleAdd);
                            }
                        },function(){
                            layer.msg("添加失敗")
                        })
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            });
        }

        //編輯彈框   添加公用
        function addDelDialog(callback,item){
            //編輯
            //if(item){
            //     $scope.vm.key = item.businessConceptKey;
            //     $scope.vm.term =  item.businessConceptTerm;
            //     $scope.vm.weight =  item.businessConceptWeight;
            //}
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/business/businessConceptManageDialog2.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                         $scope.vm.key = "";
                         $scope.vm.term = "";
                         $scope.vm.weight =  1;
                    }
                }
            });
        }
        //   刪除 彈框
        function deleteBusiness(id){
            //console.log(id);
            var dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/ConceptManageDialog.html",
                scope: $scope,
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        singleDel(id)
                    }
                }
            });
        }
        //編輯事件
        function singleEdit(item){
            httpRequestPost("/api/modeling/concept/business/update",{
                "businessConceptId":item.businessConceptId,
                "businessConceptApplicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": item.businessConceptModifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                //console.log(item);
                //console.log(item.businessConceptId,$scope.vm.applicationId,$scope.vm.key,typeof $scope.vm.modifier,$scope.vm.term, $scope.vm.weight);
                //console.log(data);
                layer.msg("编辑成功");
                $state.reload()
            },function(){
                layer.msg("编辑失败")
            })
        }
        //单条新增
        function singleAdd(){
            console.log( $scope.vm.applicationId,$scope.vm.key,$scope.vm.modifier,$scope.vm.term, $scope.vm.weight)
            httpRequestPost("/api/modeling/concept/business/add",{
                "businessConceptApplicationId": $scope.vm.applicationId,
                "businessConceptKey":  $scope.vm.key,
                "businessConceptModifier": $scope.vm.modifier,
                "businessConceptTerm": $scope.vm.term,
                "businessConceptWeight": $scope.vm.weight
            },function(data){
                console.log(data);
                layer.msg("添加成功");
                $state.reload()
            },function(){
                layer.msg("添加失败")
            })
        }
        //单条刪除
        function singleDel(id){
            httpRequestPost("/api/modeling/concept/business/delete",{
                "businessConceptId":id
            },function(data){
                //console.log(data)
               layer.msg("刪除成功");
                $state.reload()
            },function(){
                layer.msg("刪除失敗")
            })
        }

        function delSingleTerm(item){
            var str = angular.copy($scope.vm.term.split("；"));
            str.remove(item);
            $scope.vm.term = str.join("；");
        }
        function addSingleTerm(e){
                  var keycode = window.event?e.keyCode:e.which;
                  if(keycode==13){
                      $(e.target).blur();
                      var str = $scope.vm.term?angular.copy($scope.vm.term.split("；")):new Array()
                        if($scope.vm.addSingleTermVal.length==0){
                          console.log($scope.vm.addSingleTermVal,"second");
                          $scope.vm.addSingleTermVal = "";
                          layer.msg("扩展名不能为空");
                            $(e.target).focus();
                      }else if($.inArray($scope.vm.addSingleTermVal, str)==-1){
                          console.log($scope.vm.addSingleTermVal);
                          str.push($scope.vm.addSingleTermVal);
                          console.log(str);
                          $scope.vm.term = str.join("；");
                          $scope.vm.addSingleTermVal = "";
                          console.log($scope.vm.term);
                            $(e.target).focus();
                      }else{
                          console.log($scope.vm.addSingleTermVal );
                          $scope.vm.addSingleTermVal = "";
                          layer.msg("扩展名重复,请重新填写");
                            $(e.target).focus();
                      }
                  }
        }

    }
]);