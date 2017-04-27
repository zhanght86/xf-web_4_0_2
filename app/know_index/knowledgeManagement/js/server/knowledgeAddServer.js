/**
 * Created by 41212 on 2017/4/24.
 */
(function() {
    "use strict";
    angular.module("knowledgeManagementModule").service("knowledgeAddServer", knowledgeAddServer);
    knowledgeAddServer.$injector = ["$resource"];
    function knowledgeAddServer($resource) {
        var services = {
            getDimensions: getDimensions,  //获取  渠道
            getChannels : getChannels ,    //獲取維度
            getFrame : getFrame    ,        //    獲取框架
            faqSave : faqSave
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
        //functtionqueryKnowDocByDocId = $resource('/api/knowledgeDocumentation/selectDocumentationById', {}, {});
    }
})();