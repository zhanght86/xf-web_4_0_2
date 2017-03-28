/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.home').factory('HomeService',['$resource',function ($resource) {
    var homeService = {};
    homeService.queryknowitem = $resource('pre/homepage/queryknowitem', {}, {});
    homeService.queryTopic = $resource('pre/Topic/queryTopic', {}, {});
    homeService.createComment = $resource('pre/Comment/createComment', {}, {});
    //知识条目点赞收藏
    homeService.agree = $resource('back/repository/knowlog/addLogForKnow', {}, {});
    homeService.collect = $resource('back/repository/knowlog/addLogForKnow', {}, {});
    //我的栏目
    homeService.queryMyCollect = $resource('pre/homepage/querymycollect', {}, {});
    homeService.queryMyTopKnow = $resource('pre/homepage/queryMyTopKnow', {}, {});

    homeService.queryknowitemrank = $resource('pre/homepage/queryknowitemrank', {}, {});
    homeService.queryknowitemhot = $resource('pre/homepage/queryknowitemhot', {}, {});

    homeService.queryUserOrderByPart = $resource('back/system/user/queryUserOrderByPart', {}, {});

    /**
     * 后台首页的方法
     */

    homeService.queryMyTask = $resource('/back/Workflow/queryUserTask', {}, {});


    return homeService;
}])