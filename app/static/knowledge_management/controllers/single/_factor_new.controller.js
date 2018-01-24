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
            "extensionQuestionList" : [{"title":""}], //扩展问集合
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
            tableRow            : null,    //行
            tableColumn         : null,    //刪除用
            listTableType       : "",
            data                : "",
            column              : "" ,
            knowLearningIdList  : [],     //知识学习id
            saveLimitTimer      : true ,//限制多次打标
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
        let limitTimer ;
        // 知识学习  （知识学习>新知识发现>学习）
        if($stateParams.knowledgeLearning){
            getNewKnowledgeLearningList();
        }
        function tableRemove(type){
            switch (type){
                case 1:
                    if($scope.vm.tableRow==0){
                        layer.msg("不可删除第一行")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的行")
                    }else{
                        $scope.parameter.contents.splice($scope.vm.tableRow,1);
                        $scope.vm.tableRow = null
                    }
                    break;
                case 2:
                    if($scope.vm.tableColumn==0){
                        layer.msg("不可删除第一列")
                    }else if($scope.vm.tableRow==null){
                        layer.msg("请先选择要删除的列")
                    }else{
                        angular.forEach($scope.parameter.contents,function(item,tableRow){
                            $scope.parameter.contents[tableRow].content.splice($scope.vm.tableColumn,1)
                        });
                        $scope.parameter.slotList.splice($scope.vm.tableColumn,1)
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
        function save() {
            let resultParams = checkSave();
            if (!resultParams||!$scope.vm.saveLimitTimer) {
                return false
            }
            $timeout.cancel(limitTimer) ;
            $scope.vm.saveLimitTimer = true ;
            limitTimer = $timeout(function(){
                $scope.vm.saveLimitTimer = false ;
            },180000) ;
            //  转换字符串
            angular.forEach(resultParams.contents,function (item,index) {
                resultParams.contents[index].content =JSON.stringify(item.content)
            });
            KnowledgeService.storeFactorKnow.save(resultParams,function (response) {
                if (response.status == 200) {
                    layer.confirm('是前往总览页面查看？', {
                        btn: ['是','继续添加'] ,//按钮
                        closeBtn:false
                    }, function(){
                        $state.go("KM.overview")
                    },function(){
                        $state.reload("KM.factor")
                    });
                    //保存成功，删除知识 //保存成功，删除知识--end
                    if($stateParams.knowledgeLearning){
                        KnowledgeService.batchIgnore.save({
                            "idList":$scope.vm.knowLearningIdList
                        },function(data){
                            if(data.status==200){
                                // layer.msg("文件忽略成功");
                            }
                            if(data.status==500){
                                layer.msg(data.info,{time:10000});
                            }
                        },function(err){
                            console.log(err);
                        });
                    }
                    //保存成功，删除知识--end

                } else {
                    layer.msg(response.info) ;
                    $timeout.cancel(limitTimer) ;
                    $scope.vm.saveLimitTimer = true ;
                    console.log($scope.vm.saveLimitTimer)
                }
            }, function (error) {
                $timeout.cancel(limitTimer) ;
                $scope.vm.saveLimitTimer = true ;
            })

        }
        function scan(){
            if(!checkSave()){
                return false
            }else{
                var obj = {};
                obj.params = angular.copy($scope.parameter);
                obj.params.extensionQuestionList = obj.params.extensionQuestionList.filter((item)=>(item.title!=""&&item.title!=null)) ;
                obj.type = 103;
                obj.back = "KM.factor" ;
                obj.save = save ;
                $window.knowledge = obj;
                var url = $state.href('KM.scan');
                $window.open(url,'_blank');
            }

        }
//        提交 检验参数
        function checkSave(){
            let result = false ;
            let params = angular.copy($scope.parameter) ;
            params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
            params.extensionQuestionList = params.extensionQuestionList.map((item)=>(item.title)) ;
            params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!=""&&item!=null)) ;
            if(!params.title){
                layer.msg("知识标题不能为空，请填写");
                return false;
            }else if(!params.classifyList.length){
                layer.msg("知识类目不能为空，请选择分类");
                return false;
            }else if(params.contents[0].content.length<=1){
                layer.msg("请完善表格知识");
                return false;
            } else {
                // angular.forEach(params.contents,function (item,index) {
                //     params.contents[index].content =JSON.stringify(item.content)
                // });
                result = params
            }
            return result ;
        }
        // 扩展问换行
        function skipNewLine(e) {
            let len = $scope.parameter.extensionQuestionList.length ;
            e = e || window.event ;
            // if((e!="blur" && (e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])) || e=="blur"&& nullCheck($scope.parameter.extensionQuestionList[len-1])){
            //     $scope.parameter.extensionQuestionList.push("") ;
            // }
            if((e.keyCode|| e.which)==13 && nullCheck($scope.parameter.extensionQuestionList[len-1])){
                $scope.parameter.extensionQuestionList.push({
                    "title":""
                }) ;
                $timeout(function(){
                    $(e.target).parent().parent().children().last().find("input").focus();
                })
            }
        }

        //获取本地存储
        function getNewKnowledgeLearningList(){
            var str = localStorageService.get("localStorageKey");
            var json = JSON.parse(str);
            console.log("本地存储的"+json);
            // {   "title":null,
            //     "extension":[
            //         {"question":"信用卡办理","id":"460141182823956489"},
            //         {"question":"咋办信用卡","id":"460141182823956490"},
            //         {"question":"我想办个信用卡","id":"460141182823956491"},
            //         {"question":"范德萨范德萨发","id":"460141182823956492"}
            //      ]
            // }
            $scope.parameter.title = json.title;
            var arr=json.extension;
            angular.forEach(arr,function(obj){
                $scope.vm.knowLearningIdList.push(obj.id);
                $scope.parameter.extensionQuestionList.push({"title":obj.question});
            });
            console.log("获取的"+$scope.parameter.title);
            console.log($scope.parameter.extensionQuestionList);
            console.log($scope.vm.knowLearningIdList);
        }
    }])};