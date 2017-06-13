/**
 * Created by 41212 on 2017/4/24.
 */
(function() {
    "use strict";
    angular.module("knowledgeManagementModule").service("knowledgeAddServer", knowledgeAddServer);
    knowledgeAddServer.$injector = ["$resource"];
    function knowledgeAddServer($resource) {
        var services = {
            getDimensions: getDimensions,  //��ȡ  ����
            getChannels : getChannels ,    //�@ȡ�S��
            getFrame : getFrame    ,        //    �@ȡ���
            faqSave : faqSave,
            conceptGetExtensionByDialogTitle : conceptGetExtensionByDialogTitle,
            getDataServer : getDataServer
        };
        return services;


        //统一使用 方法
        //url, data, sucCallBack,falCallback, needToken, ajaxType,timeout,timeoutCall
        function getDataServer(url ,params, onSuccess, onError ,needToken, ajaxType,timeout,timeoutCall) {
            var url = url;
            var header = {
                'Accept': 'text/plain,text/html,application/json',
                'Content-Type': 'application/json'
            };
            var _resource = $resource(url, {}, {
                create: {
                    method: ajaxType?ajaxType:'POST',
                    params: {},
                    timeout: timeout?timeout:10000, //超时时间设置为10秒；
                    headers: header,
                    //interceptor: {
                    //    response: function (d) {
                    //        console.log(d);
                    //    },
                    //    responseError: function (d) {
                    //        console.log(d);
                    //    }
                    //}
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }


        function getDimensions(params, onSuccess, onError) {
            var url = '/api/application/dimension/list';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {}
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