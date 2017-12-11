/**
 * @Author : MILES .
 * @Create : 2017/12/11.
 * @Module : 如果直接写路径到iframe标签里的ng-src中会出现报错；如果在src属性中用了{{path}}也会出错
 */
module.exports = module =>{
    module
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
        return function(val) {
            return $sce.trustAsResourceUrl(val);
        };
    }])} ;