/**
 * Created by Administrator on 2016/6/3.
 * index 的service
 */
angular.module('know.index').factory('IndexService', ['$resource', function ($resource) {

    return $resource('privilege/:action', {}, {
        queryTopButtons: {
            method: 'GET',
            params: {action: 'getMenu'},
            isArray: false
        }
    });
}])