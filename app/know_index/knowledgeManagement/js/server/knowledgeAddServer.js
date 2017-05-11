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
            conceptGetExtensionByDialogTitle : conceptGetExtensionByDialogTitle
        };
        return services;
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
        //    return $resource('/api/faqKnowledge/addFAQKnowledge', {}, {});
        //}
        function faqSave(params, onSuccess, onError) {
            var url = '/api/faqKnowledge/addFAQKnowledge';
            var _resource = $resource(url, {}, {
                create: {
                    method: 'POST',
                    params: {}
                }
            });
            return _resource.create(JSON.stringify(params)).$promise.then(onSuccess, onError);
        }

        function getFrame(id){
            return $resource("/api/modeling/frame/listbyattribute", {}, {}).save();
        }

        function conceptGetExtensionByDialogTitle(params, onSuccess, onError) {
            var url = '/api/conceptKnowledge/productExtensionQuestion';
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