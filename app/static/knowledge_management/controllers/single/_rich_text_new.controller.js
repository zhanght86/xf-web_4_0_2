/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  要素知识新增
 */
module.exports = knowledgeManagementModule => {
    knowledgeManagementModule.controller('RichTextNewController', [
        '$scope', 'localStorageService', "$state", "ngDialog", "$cookieStore", "$timeout", "$compile", "KnowledgeService",
        "$window", "$stateParams", "$interval", "$filter",
        ($scope, localStorageService, $state, ngDialog, $cookieStore, $timeout, $compile, KnowledgeService,
         $window, $stateParams, $interval, $filter)=> {$state.go("KM.concept");
            $scope.parameter = {
                idArr:[],               //新知识id
                "title"                 : "",   //知识标题
                "expDateStart"          : "",   //知识有效期开始时间
                "expDateEnd"            : "",   //知识有效期结束时间
                "origin"                : 120,  //数据来源
                "classifyList"          : [],   //所属类目ID集合
                "extensionQuestionList" : [{"title":""}], //扩展问集合
                "contents"              : []    //内容集合
            };
            $scope.newKnow = {
                "isNewContent"          : -1 ,
                "content"               : "", //知识内容
                "type"                  : "", //类型
                "channel"               : "", //渠道
                "name"                  : "", //名称展示用
                "voiceKeyWord"          : "", //语音搜索关键字
                "imageList"             : [], //图片列表
                "imgSelected"           : "", //已选图片
                "voiceList"             : "", //声音列表
                "voiceSelected"         : "", //已选声音
                "imgTextList"           : "", //图文列表
                "imgTextSelected"       : "", //已选图文
                "imgPaginationConf"     : {   //图片分页
                    currentPage: 1,
                    pageSize: 10,
                    pagesLength: 10,
                    location: false,
                    search: getPicList
                },
                "voicePaginationConf"  : {    //声音分页
                    currentPage: 1,
                    pageSize: 10,
                    pagesLength: 10,
                    location: false,
                    search: getVoiceList
                },
                "imgTextPaginationConf": {    //图文分页
                    currentPage: 1,
                    pageSize: 10,
                    pagesLength: 10,
                    location: false,
                    search: queryImgText
                },
                "getVoiceList"         : getVoiceList  // 获取声音列表方法
            };
            $scope.vm = {
                "imageApi"            : "/api/material/picture/get/img/id?pictureId=" ,  // 图片请求地址
                "localNameOfExt"      : "cust_rich_text_ext",    // 本地存储字段 用于编辑扩展问二次添加
                "frames"              : [],                      //业务框架
                "knowledgeAdd"        : knowledgeAdd,             //新增点击事件
                "save"                : save,                     //保存
                "scan"                : scan,                     //预览
                "newKnowCheck"        : newKnowCheck,             //知识新增弹框保存按钮
                "addMultimedia"       : addMultimedia ,
                "saveLimitTimer"      : true,
                "selectMultimedia"    : selectMultimedia  ,       //图片，语音，图文选择弹出框
                "showFrame"           : showFrame                 //选择业务框架
            };
            let contentHtml = require("../../views/single/rich_text/content.html"),
                imageHtml = require("../../views/single/rich_text/select_image.html"),
                imageTextHtml = require("../../views/single/rich_text/select_imgage_text.html"),
                voiceHtml = require("../../views/single/rich_text/select_voice.html"),
                limitTimer;
            // 知识学习  （知识学习>新知识发现>学习）
            if($stateParams.knowledgeId){
                getNewKnowledgeLearningList();
            }
            function showFrame(scope){
                if(!$scope.parameter.classifyList.length){
                    return layer.msg("请先选择添加类目")
                }
                let html = "<div frame='101'></div>";
                scope.$parent.$parent.MASTER.openNgDialog($scope,html,"650px",function(){

                },"",function(){

                });
            }
            function knowledgeAdd(data, index) {
                if(!data){
                    if(($scope.parameter.contents.length==1 && $scope.parameter.contents[0].channel == 130) || $scope.parameter.contents.length==3){
                        return layer.msg("已添加所有渠道内容");
                    }
                }else{
                    $scope.newKnow.isNewContent = index ;
                }
                valuation(data,index) ;
                $scope.$parent.$parent.MASTER.openNgDialog($scope, contentHtml, "650px", function () {
                    addNewOrEditKnow(index)
                },"",function () {
                    $scope.newKnow.isNewContent = -1 ;
                });
            }
            // 更新内容
            function addNewOrEditKnow(index) {
                let content = $scope.parameter.contents[index]||{} ;
                if ($scope.newKnow.type == 1010) {
                    content.content = $scope.newKnow.content;
                } else if ($scope.newKnow.type == 1018) {
                    content.content = $scope.newKnow.imgSelected.id;
                    content.name    = $scope.newKnow.imgSelected.name;
                } else if ($scope.newKnow.type == 1019) {
                    content.content = $scope.newKnow.imgTextSelected.id;
                    content.name    = $scope.newKnow.imgTextSelected.name;
                    content.url     = $scope.newKnow.imgTextSelected.url;
                } else if ($scope.newKnow.type == 1020) {
                    content.content = $scope.newKnow.voiceSelected.id;
                    content.name    = $scope.newKnow.voiceSelected.name;
                }
                content.type                     = $scope.newKnow.type;
                content.channel                  = $scope.newKnow.channel;
                content.contentRelevantList      = $scope.vm.knowledgeRelevantContentList;
                $scope.parameter.contents[index] = content;
            }
            //弹出选择媒体对话框
            function selectMultimedia(type) {
                if (type == 1018) {
                    getPicList(1, $scope.newKnow.imgPaginationConf.pageSize).$promise.then(function () {
                        $scope.$parent.$parent.MASTER.openNgDialog($scope, imageHtml, "900px", "", "", "", 2);
                    })
                } else if (type == 1019) {
                    queryImgText(1, $scope.newKnow.imgTextPaginationConf.pageSize).$promise.then(function () {
                        $scope.$parent.$parent.MASTER.openNgDialog($scope, imageTextHtml, "900px", "", "", "", 2);
                    })
                } else {
                    getVoiceList(1, $scope.newKnow.voicePaginationConf.pageSize).$promise.then(function () {
                        $scope.$parent.$parent.MASTER.openNgDialog($scope, voiceHtml, "640px", "", "", "", 2);
                    })
                }
            }
            // 选择媒体文件
            function addMultimedia(type, item, close) {
                if (type == 1018) {       // 111 图片
                    $scope.newKnow.imgSelected = {
                        "id"  : item.id,
                        "name": item.name,
                    };
                } else if (type == 1020) {//    声音
                    $scope.newKnow.voiceSelected = {
                        "id"  : item.id,
                        "name": item.name,
                    };
                } else if (type == 1019) {//    图文
                    $scope.newKnow.imgTextSelected = {
                        "id"  : item.id,
                        "name": item.title,
                        "url" : item.coverPicId
                    };
                }
                close(1);
            }
            function newKnowCheck(close) {
                // 验证是否可以保存   内容  渠道两部分
                // 验证是否可以保存   内容  渠道两部分
                let channelUnique = false ;
                if($scope.newKnow.isNewContent==-1){  // 新增
                    if($scope.newKnow.channel==130 && $scope.parameter.contents.length ){
                        channelUnique = true ;
                    }else if (!$scope.parameter.contents.every(item=>item.channel!=$scope.newKnow.channel)) {
                        channelUnique = true ;
                    }
                }else{
                    let existChannel = $scope.parameter.contents.filter((item,index)=>index!=$scope.newKnow.isNewContent).map(item=>item.channel);
                    if(($scope.newKnow.channel==130 && existChannel.length) || (existChannel.inArray($scope.newKnow.channel))){
                        channelUnique = true ;
                    }
                }
                let isContentExist =
                    ($scope.newKnow.type == 1010 && $scope.newKnow.content) ||
                    ($scope.newKnow.type == 1018 && $scope.newKnow.imgSelected.id) ||
                    ($scope.newKnow.type == 1019 && $scope.newKnow.imgTextSelected.id) ||
                    ($scope.newKnow.type == 1020 && $scope.newKnow.voiceSelected.id);
                if (!isContentExist) {
                    layer.msg("请完善知识内容后保存")
                } else if (!$scope.newKnow.channel) {
                    layer.msg("请选择渠道后保存")
                } else if (!isContentExist && !$scope.newKnow.channel) {
                    layer.msg("请完善知识内容,并选择渠道后保存")
                } else if(channelUnique){
                    layer.msg("添加渠道重复，请重新选择");
                }else {
                    close(1);
                }
            }
            // 获取图片列表
            function getPicList(index, pageSize) {
                return  KnowledgeService.queryConceptImage.get({
                    "name": "",
                    "index": (index - 1) * pageSize,
                    "pageSize": pageSize
                }, function (response) {
                    $scope.newKnow.imageList = response.data.objs;
                    $scope.newKnow.imgPaginationConf.currentPage = index;
                    $scope.newKnow.imgPaginationConf.totalItems = response.data.total;
                }, function (error) {
                    console.log(error)
                })
            }
            // 获取声音列表
            function getVoiceList(index, pageSize) {
                return KnowledgeService.queryConceptVoice.get({
                    "name": $scope.newKnow.voiceKeyWord,
                    "index": (index - 1) * pageSize,
                    "pageSize": pageSize
                }, function (response) {
                    $scope.newKnow.voiceList = response.data.objs;
                    $scope.newKnow.voicePaginationConf.currentPage = index;
                    $scope.newKnow.voicePaginationConf.totalItems = response.data.total;
                }, function (error) {
                    console.log(error)
                })
            }
            // 获取图文列表
            function queryImgText(index, pageSize) {
                return KnowledgeService.queryConceptImageText.get({
                    "title": "",
                    "index": (index - 1) * pageSize,
                    "pageSize": pageSize
                }, function (response) {
                    $scope.newKnow.imgTextList = response.data.objs;
                    $scope.newKnow.imgTextPaginationConf.currentPage = index;
                    $scope.newKnow.imgTextPaginationConf.totalItems = response.data.total;
                }, function (error) {
                    console.log(error)
                })
            }
            function valuation(params,index){
                $scope.newKnow.voiceKeyWord  = "" ;
                $scope.newKnow.content = "";
                $scope.newKnow.imgSelected = "" ;
                $scope.newKnow.imgTextSelected = "";
                $scope.newKnow.voiceSelected = "" ;
                if(params){
                    switch (parseInt(params.type)) {
                        case  1010 :    //文本
                            $scope.newKnow.content = params.content;
                            break;
                        case  1018 :  //图片
                            $scope.newKnow.imgSelected = {
                                "name": params.name,
                                "id": params.content,
                            };
                            break;
                        case  1020 :  // 图文
                            $scope.newKnow.voiceSelected = {
                                "id": params.content,
                                "name": params.name,
                            };
                            break;
                        case  1019: //声音
                            $scope.newKnow.imgTextSelected = {
                                "name": params.name,
                                "id": params.content,
                                "url": params.url
                            };
                            break;
                    }
                    $scope.newKnow.type = params.type;
                    $scope.newKnow.channel = params.channel;
                    $scope.vm.knowledgeRelevantContentList = params.contentRelevantList;
                }else{
                    $scope.newKnow.type                = 1010 ;
                    $scope.newKnow.content             = "" ;
                    $scope.newKnow.channel             = "" ;
                    $scope.vm.knowledgeRelevantContentList = [] ;
                    $scope.newKnow.name                = "" ;
                }
            }
            //保存
            function save() {
                let resultParams = checkSave()
                if (!resultParams||!$scope.vm.saveLimitTimer) {
                    return false
                }
                $timeout.cancel(limitTimer);
                $scope.vm.saveLimitTimer = false;
                limitTimer = $timeout(function () {
                    $scope.vm.saveLimitTimer = true;
                }, 180000);
                let i = layer.msg('资源加载中...', {icon: 16,shade: [0.5, '#000'],scrollbar: false, time:100000}) ;
                KnowledgeService.storeConceptKnow.save(resultParams,function (response) {
                    layer.close(i);
                    if(response.status == 200){
                        layer.confirm('是前往总览页面查看？', {
                            btn: ['是','继续添加'] //按钮
                        }, function(){
                            $state.go("KM.overview")
                        },function(){
                            $state.reload("KM.concept")
                        });
                        //保存成功，删除知识 //保存成功，删除知识--end
                        if($stateParams.knowledgeId){
                            KnowledgeService.batchIgnore.save({
                                "idList":$scope.parameter.idArr
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

                    }else{
                        $scope.vm.saveLimitTimer = true;
                        layer.msg(response.info)
                    }
                },function(error){console.log(error);$scope.vm.saveLimitTimer = true;});
            }
            // 预览d
            function scan() {
                if(!checkSave()){
                    return false
                }else{
                    var obj = {};
                    obj.params = $scope.parameter;
                    obj.type = 100;
                    obj.back = "KM.concept" ;
                    $window.knowledge = obj;
                    var url = $state.href('KM.scan');
                    $window.open(url,'_blank');
                }
            };

            function checkSave() {
                let result = false ;
                let params = angular.copy($scope.parameter);
                params.classifyList = angular.copy($scope.parameter.classifyList).map(item=>item.classifyId) ;
                params.extensionQuestionList = params.extensionQuestionList.map((item)=>(item.title)) ;
                params.extensionQuestionList = params.extensionQuestionList.filter((item)=>(item!=""&&item!=null)) ;
                angular.forEach(params.contents,function(item,index){
                    if(item.name){
                        delete params.contents[index].name ;
                    }else if(item.url){
                        delete params.contents[index].url ;
                    }
                    item.contentRelevantList.map(value=>item.id)
                });
                console.log(params);
                if (!params.title) {
                    layer.msg("知识标题不能为空，请填写");
                } else if (!nullCheck(params.classifyList)) {
                    layer.msg("知识类目不能为空，请选择分类");
                } else if (!nullCheck(params.contents)) {
                    layer.msg("知识内容不能为空，请点击新增填写");
                } else {
                    result = params
                }
                return result
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
                    $scope.parameter.idArr.push(obj.id);
                    $scope.parameter.extensionQuestionList.push({"title":obj.question});
                })
                console.log("获取的"+$scope.parameter.title);
                console.log($scope.parameter.extensionQuestionList);
                console.log($scope.parameter.idArr);
            }
}])};