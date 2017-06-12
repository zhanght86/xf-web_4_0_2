/**
 * Created by 41212 on 2017/4/24.
 */
(function() {
    "use strict";
    angular.module("knowledgeManagementModule").service("knowledgeAddServer", knowledgeAddServer);
    knowledgeAddServer.$injector = ["$resource"];
    function knowledgeAddServer($resource) {
        var services = {
            getDimensions: getDimensions,  //获取维度
            getChannels : getChannels ,    //获取渠道
            getFrame : getFrame ,        //    �@ȡ���
            faqSave : faqSave,
            conceptGetExtensionByDialogTitle : conceptGetExtensionByDialogTitle ,
            //getKnowledge : getKnowledge，
            getDataServer : getDataServer
        };
        return
        ;
        //统一使用 方法
        //url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall
        function getDataServer(url ,params, onSuccess, onError ,needToken, ajaxType,timeout,timeoutCall) {
                var url = url;
                var _resource = $resource(url, {}, {
                    create: {
                        method: 'POST',
                        params: {},
                        //interceptor: {
                        //    response: function (d) {
                        //        console.log(d);
                        //    },
                        //    responseError: function (d) {
                        //        console.log(d);//这里的是随便写的地址，所以执行了error里的函数，可打印看参数及结果
                        //    }
                        //}
                    }
                });
                return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }

            //function getKnowledge(params, onSuccess, onError) {
        //    var url = '/api/ms/elementKnowledgeAdd/findElementKnowledgeByKnowledgeId';
        //    var _resource = $resource(url, {}, {
        //        create: {
        //            method: 'POST',
        //            params: {}
        //        }
        //    });
        //    return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        //}


        function getDimensions(params, onSuccess, onError) {
            var url = '/api/application/dimension/list';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {},
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }
        function getChannels(params, onSuccess, onError) {
            var url = '/api/application/channel/listChannels';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {}
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }
        //function faqSave(params, onSuccess, onError) {
        //    return $resource('/api/ms/faqKnowledge/addFAQKnowledge', {}, {});
        //}
        function faqSave(params, onSuccess, onError) {
            var url = '/api/ms/faqKnowledge/addFAQKnowledge';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {}
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }

        function getFrame(id){
            return $resource("/api/ms/modeling/frame/listbyattribute", {}, {}).save();
        }

        function conceptGetExtensionByDialogTitle(params, onSuccess, onError) {
            var url = '/api/ms/conceptKnowledge/productExtensionQuestion';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {}
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }
        //functtionqueryKnowDocByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationById', {}, {});
    }
})();