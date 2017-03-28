/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.search').factory('SearchService',['$resource',function ($resource) {
    var searchService = {};
    searchService.connKnowQueryHistoryCon = $resource('pre/knowsquery/searchhistory', {}, {});
    searchService.connKnowQueryHotCon = $resource('pre/knowsquery/queryknowitemhot', {}, {});
    searchService.connKnowQueryAdvancedCon = $resource('pre/knowsquery/seniorsearch', {}, {});
    searchService.connKnowQueryLeadSearchCon = $resource('pre/knowsquery/leadsearch', {}, {});
    searchService.connKnowQueryAllLibraryCon = $resource('pre/knowsquery/queryAllLibrary', {}, {});
    searchService.connKnowQueryKnowOntoCon = $resource('/back/repository/library/queryLibClassify', {}, {});
    searchService.connKnowSaveSearchSettingCon = $resource('pre/knowsquery/searchset', {}, {});
    searchService.connQueryNewCon = $resource('pre/knowsquery/queryNewKeyWord', {}, {});
    searchService.connQueryLibOecTreeCon = $resource('/back/repository/library/queryLibFirstOrderClassify', {}, {});//查询oec分类树
    return searchService;
}])

/**
 * select2 内置查询功能
 */
// angular.module('know.search').factory('select2Query', function ($timeout) {
//     return {
//         testAJAX: function () {
//             var config = {
//                 minimumInputLength: 1,
//                 ajax: {
//                     url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
//                     dataType: 'jsonp',
//                     data: function (term) {
//                         return {
//                             q: term,
//                             page_limit: 10,
//                             apikey: "ju6z9mjyajq2djue3gbvv26t"
//                         };
//                     },
//                     results: function (data, page) {
//                         return {results: data.movies};
//                     }
//                 },
//                 formatResult: function (data) {
//                     return data.title;
//                 },
//                 formatSelection: function (data) {
//                     return data.title;
//                 }
//             };
//
//             return config;
//         }
//     }
// });