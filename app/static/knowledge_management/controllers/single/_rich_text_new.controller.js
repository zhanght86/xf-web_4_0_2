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
         $window, $stateParams, $interval, $filter)=> {
            $state.go("KM.concept");
            $scope.parameter = {
                "title": "",   //知识标题
                "expDateStart": "",   //知识有效期开始时间
                "expDateEnd": "",   //知识有效期结束时间
                "origin": 120,  //数据来源
                "classifyList": [],   //所属类目ID集合
                "extensionQuestionList": [""], //扩展问集合
                "contents": []    //内容集合
            };
            $scope.newKnow = {
                "content": "",           //知识内容
                "type": "",          //类型
                "channel": "",           //渠道
                "name": "",           //名称
                "contentRelevantList": [],
                "voiceKeyWord": "",
                "imageList": [],     //所有图片文件
                "imgSelected": "",    // 已选图片
                "voiceList": "",                //所有声音文件
                "voiceSelected": "",    //以选择声音文件
                "imgTextList": "",
                "imgTextSelected": "",
                "imgPaginationConf": {
                    currentPage: 1,
                    pageSize: 10,//第页条目数
                    pagesLength: 10,//分页框数量
                    location: false,
                    search: getPicList
                },
                "voicePaginationConf": {
                    currentPage: 1,
                    pageSize: 10,//第页条目数
                    pagesLength: 10,//分页框数量
                    location: false,
                    search: getVoiceList
                },
                "imgTextPaginationConf": {
                    currentPage: 1,
                    pageSize: 10,//第页条目数
                    pagesLength: 10,//分页框数量
                    location: false,
                    search: queryImgText
                },
                "getVoiceList": getVoiceList
            };
            $scope.vm = {
                localNameOfExt: "cust_rich_text_ext",    // 本地存储字段 用于编辑扩展问二次添加
                frames: [],      //业务框架
                channelList: [],
                skipNewLine: skipNewLine,
                knowledgeAdd: knowledgeAdd,  //新增点击事件
                save: save,   //保存
                scan: scan,   //预览
                newKnowCheck: newKnowCheck, //知识新增弹框保存按钮
                addMultimedia : addMultimedia ,
                enterEvent: enterEvent,
                limitSave: false,
                selectMultimedia: selectMultimedia,   //图片，语音，图文选择弹出框
            };
            let contentHtml = require("../../views/single/rich_text/content.html"),
                imageHtml = require("../../views/single/rich_text/select_image.html"),
                imageTextHtml = require("../../views/single/rich_text/select_imgage_text.html"),
                voiceHtml = require("../../views/single/rich_text/select_voice.html");
            init() ;
            function knowledgeAdd(data, index) {
                if (data) {    //增加
                    switch (data.type) {
                        case  "1010" :    //文本
                            $scope.newKnow.content = data.content
                            break;
                        case  "1018" :  //图片
                            $scope.newKnow.imgSelected = {
                                "name": data.name,
                                "id": data.content,
                                "url": data.url
                            };
                            break;
                        case  "1020" :  // 图文
                            $scope.newKnow.imgTextSelected = {
                                "id": data.content,
                                "name": data.name,
                                "url": data.url
                            };
                            break;
                        case  "1019": //声音
                            $scope.newKnow.voiceSelected = {
                                "name": data.name,
                                "id": data.content,
                                "url": data.url
                            };
                            break;
                    }
                    $scope.newKnow.type = data.type;
                    $scope.newKnow.isEditIndex = index;
                    $scope.newKnow.channel = data.channel;
                    $scope.newKnow.appointRelativeGroup = data.knowledgeRelevantContentList;
                } else {
                    if ($scope.vm.channelList.inArray(130)) {
                        layer.msg("已添加全渠道内容");
                        return;
                    }
                    $scope.newKnow.type = 1010;
                    $scope.newKnow.isEditIndex = index;
                    $scope.newKnow.channel = "";
                    $scope.newKnow.appointRelativeGroup = data.knowledgeRelevantContentList;
                }
                $scope.$parent.$parent.MASTER.openNgDialog($scope, contentHtml, "650px", function () {
                    addNewOrEditKnow(index)
                }, function () {
                    $scope.vm.isEditIndex = -1
                });
            }
            // 更新内容
            function addNewOrEditKnow(index) {
               let content = $scope.parameter.contents[index]||{} ;
                if ($scope.newKnow.type == 1010) {
                    content.conent = $scope.newKnow.content;
                    content.name   = $scope.newKnow.content;
                } else if ($scope.newKnow.type == 1018) {
                    content.conent = $scope.newKnow.imgSelected.id;
                    content.name   = $scope.newKnow.imgSelected.name;
                } else if ($scope.newKnow.type == 1019) {
                    content.conent = $scope.newKnow.imgTextSelected.id;
                    content.name   = $scope.newKnow.imgTextSelected.name;
                } else if ($scope.newKnow.type == 1020) {
                    content.conent = $scope.newKnow.voiceSelected.id;
                    content.name   = $scope.newKnow.voiceSelected.name;
                }
                $scope.parameter.contents[index] = content;
            }

            //限制一个知识多次保存
            var limitTimer;
            function save() {
                if (!checkSave()) {
                    return false
                } else {
                    if (!$scope.vm.limitSave) {
                        $timeout.cancel(limitTimer);
                        $scope.vm.limitSave = true;
                        limitTimer = $timeout(function () {
                            $scope.vm.limitSave = false;
                        }, 180000);
                        var params;   // 保存參數
                        var api;                    // 返回編輯的 url
                        if ($scope.vm.knowledgeId) {
                            //编辑
                            api = "/api/ms/richtextKnowledge/editKnowledge";
                            params.knowledgeId = $scope.vm.knowledgeId;
                        } else {
                            //新增
                            api = "/api/ms/richtextKnowledge/addKnowledge"
                        }
                        httpRequestPost(api, params, function (data) {
                            if (data.status == 200) {
                                //if ($scope.vm.docmentation) {
                                //    $scope.vm.knowledgeClassifyCall();knowledgeAdd
                                //}else{
                                $state.go('knowledgeManagement.custOverview');
                                //}
                            } else if (data.status == 500) {
                                layer.msg("知识保存失败");
                                $timeout.cancel(limitTimer);
                                $scope.$apply(function () {
                                    $scope.vm.limitSave = false;
                                });
                            }
                        }, function (err) {
                            $timeout.cancel(limitTimer);
                            $scope.$apply(function () {
                                $scope.vm.limitSave = false;
                            });
                            console.log(err)
                        });
                    }
                }
            }

            function scan() {
                if (!checkSave()) {
                    return false
                } else {
                    var obj = {};
                    var params;
                    console.log(params);
                    obj.params = params;
                    obj.editUrl = "knowledgeManagement.markKnow";
                    if ($scope.vm.knowledgeId) {
                        //编辑
                        obj.api = "/api/ms/richtextKnowledge/editKnowledge";
                        params.knowledgeId = $scope.vm.knowledgeId;
                    } else {
                        //新增
                        obj.api = "/api/ms/richtextKnowledge/addKnowledge"
                    }
                    obj.params = params;
                    obj.knowledgeType = 106;
                    $window.knowledgeScan = obj;
                    //    var url = $state.href('knowledgeManagement.knowledgeScan',{knowledgeScan: 111});
                    var url = $state.href('knowledgeManagement.knowledgeScan');
                    $window.open(url, '_blank');
                }
            };

            function checkSave() {
                var params;
                console.log(params);
                if (!params.knowledgeTitle) {
                    layer.msg("知识标题不能为空，请填写");
                    return false;
                } else if (!nullCheck(params.classificationAndKnowledgeList)) {
                    layer.msg("知识类目不能为空，请选择分类");
                    return false
                } else if (!nullCheck(params.knowledgeContents)) {
                    layer.msg("知识内容不能为空，请点击新增填写");
                    return false;
                } else if (!nullCheck(params.classificationAndKnowledgeList)) {
                    layer.msg("分类知识Bot不能为空")
                } else {
                    return true
                }
            }
            function newKnowCheck(close) {
                // 验证是否可以保存   内容  渠道两部分
                let isContentExist = (
                    ($scope.newKnow.type == 1010 && !$scope.vm.content) ||
                    ($scope.newKnow.type == 1018 && !$scope.newKnow.imgTextSelected.id) ||
                    ($scope.newKnow.type == 1019 && !$scope.newKnow.imgTextSelected.id) ||
                    ($scope.newKnow.type == 1020 && !$scope.newKnow.voiceSelected.id)
                ) ;
                if (!isContentExist) {
                    layer.msg("请填写知识内容后保存")
                } else if (!$scope.newKnow.channel) {
                    layer.msg("请选择渠道后保存")
                } else if (!isContentExist && !$scope.newKnow.channel) {
                    layer.msg("请填写知识内容,并选择渠道后保存")
                } else if ($scope.vm.channelList.inArray($scope.newKnow.channel)) {
                    layer.msg("已添加此渠道内容");
                } else {
                    close(1);
                }
            }

//*******************       2017/7/14  BEGIN    *******************//
            //弹出选择媒体对话框
            function selectMultimedia(type) {
                if (type == 1018) {
                    $scope.$parent.$parent.MASTER.openNgDialog($scope, imageHtml, "900px", "", "", "", 2);
                } else if (type == 1019) {
                    $scope.$parent.$parent.MASTER.openNgDialog($scope, imageTextHtml, "900px", "", "", "", 2);
                } else {
                    $scope.$parent.$parent.MASTER.openNgDialog($scope, voiceHtml, "640px", "", "", "", 2);
                }
            }
            function addMultimedia(type, item, close) {
                if (type == 1018) {// 111 图片
                    $scope.newKnow.imgSelected = {
                        "id": item.id,
                        "name": item.name,
                        "url": item.id
                    };
                } else if (type == 1020) {//    声音
                    $scope.newKnow.voiceSelected = {
                        "id": item.id,
                        "name": item.name,
                        "url": item.id
                    };
                } else if (type == 1019) {//    图文
                    $scope.newKnow.imgTextSelected = {
                        "id": item.id,
                        "name": item.title,
                        "url": item.coverPicId
                    };
                }
                close(1);
            }
            // 获取图片列表
            function getPicList(index, pageSize) {
                KnowledgeService.queryConceptImage.get({
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
                KnowledgeService.queryConceptVoice.get({
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
                KnowledgeService.queryConceptImageText.get({
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
            function init(){
                getPicList(1, $scope.newKnow.imgPaginationConf.pageSize);
                getVoiceList(1, $scope.newKnow.voicePaginationConf.pageSize);
                queryImgText(1, $scope.newKnow.imgTextPaginationConf.pageSize);
            }
// 扩展问换行
            function skipNewLine(e) {
                let len = $scope.parameter.extensionQuestionList.length;
                e = e || window.event;
                if ((e != "blur" && (e.keyCode || e.which) == 13 && nullCheck($scope.parameter.extensionQuestionList[len - 1])) || e == "blur" && nullCheck($scope.parameter.extensionQuestionList[len - 1])) {
                    $scope.parameter.extensionQuestionList.push("");
                }
                $timeout(function () {
                    $(e.target).parent().next().find("input").focus();
                },)
            }
        }])
};