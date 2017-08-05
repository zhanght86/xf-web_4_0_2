/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.auth').service('Session', function () {
    this.create = function (userId) {
        this.userId = userId;
    };
    this.destroy = function () {
        this.userId = null;
    };
    return this;
})