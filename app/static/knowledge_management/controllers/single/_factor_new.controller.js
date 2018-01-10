/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  要素知识新增
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('FactorNewController',
     ['$scope', 'localStorageService' ,"KnowledgeService","$state" ,"ngDialog","$cookieStore","$timeout","$compile",
    "$window","$stateParams","$interval","$rootScope","$filter",
    ($scope,localStorageService,KnowledgeService, $state,ngDialog,$cookieStore,$timeout,$compile,
     $window,$stateParams,$interval,$rootScope,$filter) =>{ $state.go("KM.factor");
        $scope.parameter = {
            "title"	                : "",   //知识标题
            "expDateStart"          : "",   //知识有效期开始时间
            "expDateEnd"            : "",   //知识有效期结束时间
            "origin"                : 120,  //数据来源
            "classifyList"          : [],   //所属类目ID集合
            "extensionQuestionList" : [""], //扩展问集合
            "contents"              :  [
                                            {
                                                "content":["对象名称"]
                                            }
                                        ]  ,  //内容集合
            "slotList"              : []    //槽对象集合
        } ;
        $scope.vm = {
            ctrName             : "list" ,
            titleTip            : "",
            localExtensionName  : "cust_factor_ext" ,    // 本地存储字段 用于编辑扩展问二次添加
            isTimeTable         : false,  //时间表隐藏
            frames              : [],      //业务框架
            tableRow            : null,   //行
            tableColumn         : null,  //刪除用
            listTableType       : "",
            data                : "",
            column              : "" ,
            limitSave           : false ,//限制多次打标
            enterEvent          : enterEvent,  //鍵盤事件
            editColumn          : editColumn ,// 修改新增列
            tableRemove         : tableRemove, //删除行或列
            addRow              : addRow,   //添加行
            skipNewLine         : skipNewLine,
            save                : save ,   //保存
            scan                : scan ,   //预览
        };
        //弹框
        $scope.column = {
            "name" : "",  //要素名称
            "type" : 80,  //类型
            "ask"  : ""   //反问
        };
        let tableRowHtml = require("../../views/single/factor/column.html");
        function tableRemove(type){
            switch (type){
                case 1:
                    if($scope.vm.tableRow==0){
                        layer.msg("不可删除第一行")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的行")
                    }else{
                        $scope.vm.tableList.data.listTable.splice($scope.vm.tableRow,1);
                        $scope.vm.tableRow = null
                    }
                    break;
                case 2:
                    if($scope.vm.tableColumn==0){
                        layer.msg("不可删除第一列")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的列")
                    }else{
                        angular.forEach($scope.vm.tableList.data.listTable,function(item,tableRow){
                            angular.forEach(item,function(val,index){
                                if(index == $scope.vm.tableColumn){
                                    $scope.vm.tableList.data.listTable[tableRow].splice(index,1)
                                }
                            })
                        });
                        $scope.vm.tableList.data.listTableType.splice($scope.vm.tableColumn,1) ;
                        $scope.vm.tableColumn = null
                    }
                    break;
            }
        }
        // 添加一行
        function addRow(){
            let len = $scope.parameter.contents[0].content.length;
            let obj = {
                "content":new Array(len).fill("")
            };
            $scope.parameter.contents.push(obj);
        }
        // 添加编辑列
        function editColumn(column){
            console.log(column)
            let callback, newSlot;
            if(!column){  // 新增
                $scope.column.name = "";
                $scope.column.type = 80;
                $scope.column.ask = "";
                callback = function(){
                    angular.forEach($scope.parameter.contents,function(item,index){
                        let element = index?"":$scope.column.name ;
                        $scope.parameter.contents[index].content.push(element)
                    });
                    newSlot = {
                        "name" : $scope.column.name,  //要素名称
                        "type" : $scope.column.type,  //类型
                        "ask"  : $scope.column.ask   //反问
                    };
                    $scope.parameter.slotList.push(newSlot);
                }
            }else{
                $scope.column.name = $scope.parameter.slotList[column-1].name;
                $scope.column.type = $scope.parameter.slotList[column-1].type;
                $scope.column.ask  = $scope.parameter.slotList[column-1].ask;
                callback = function(){
                    $scope.parameter.contents[0].content[column] = $scope.column.name;
                    newSlot = {
                        "name" : $scope.column.name,  //要素名称
                        "type" : $scope.column.type,  //类型
                        "ask"  : $scope.column.ask   //反问
                    };
                    $scope.parameter.slotList[column-1].name = $scope.column.name;
                    $scope.parameter.slotList[column-1].type = $scope.column.type;
                    $scope.parameter.slotList[column-1].ask  = $scope.column.ask;
                }
            }
            $scope.$parent.$parent.MASTER.openNgDialog($scope,tableRowHtml,"695px",function(){
                callback() ;
            })
        }
        //限制一个知识多次保存
        var limitTimer ;
        function save() {
            if (!checkSave() || $scope.vm.limitSave) {
                return false
            } ;
            $timeout.cancel(limitTimer) ;
            $scope.vm.limitSave = true ;
            limitTimer = $timeout(function(){
                $scope.vm.limitSave = false ;
            },180000) ;
            let params = angular.copy($scope.parameter) ;
            params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
            params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!="")) ;
            params.contents = JSON.stringify(params.contents) ;
            KnowledgeService.storeFactorKnow.save($scope.parameter,function (response) {
                if (response.status == 200) {
                    // $state.go('knowledgeManagement.custOverview');
                } else {
                    layer.msg(response.info) ;
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.limitSave = false ;
                    console.log($scope.vm.limitSave)
                }
            }, function (error) {
                $timeout.cancel(limitTimer) ;
                $scope.vm.limitSave = false ;
            })

        }
        function scan(){
            if(!checkSave() || $scope.vm.limitSave){
                return false
            }
            $window.knowledgeScan = {
                api : api ,
                params : $scope.parameter,
            };
            var url = $state.href('knowledgeManagement.knowledgeScan');
            $window.open(url,'_blank');

        }
//        提交 检验参数
        function checkSave(){
            var params =  $scope.parameter ;
            if(!params.title){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!params.classifyList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false;
            }else if(params.contents[0].length<=1){
                layer.msg("请完善表格知识");
                return false;
            }else{
                return true
            }
        }
        // 扩展问换行
        function skipNewLine(e) {
            let len = $scope.parameter.extensionQuestionList.length ;
            e = e || window.event ;
            if((e!="blur" && (e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])) || e=="blur"&& nullCheck($scope.parameter.extensionQuestionList[len-1])){
                $scope.parameter.extensionQuestionList.push("") ;
            }
            $timeout(function(){
                $(e.target).parent().next().find("input").focus();
            },)
        }
    }])};