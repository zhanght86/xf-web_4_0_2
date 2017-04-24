/**
 * Created by 41212 on 2017/4/24.
 */

angular.module('knowledgeManagementModule').factory('knowledgeAddServer',['$resource',function ($resource) {
    var knowledgeAdd = {};
    knowledgeAdd.getDimension = $resource('/api/application/dimension/list', {}, {});
    return knowledgeAdd;
}]);
