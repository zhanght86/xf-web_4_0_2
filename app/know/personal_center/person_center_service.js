/**
 * Created by Administrator on 2016/6/6.
 */
angular.module('know.center').factory('PersonalCenterService',['$resource',function ($resource) {
    var personalCenterService = {};
    personalCenterService.connGetUserInfoCon = $resource('/back/system/user/loadUser', {}, {});
    personalCenterService.connGetOriginPwdCon = $resource('/back/system/user/queryUserPwd', {}, {});
    personalCenterService.connTestUploadMeMberCon = $resource('/back/system/user/testUploadMember', {}, {});
    personalCenterService.connConfirmPwdCon = $resource('/back/system/user/updatePwd', {}, {});
    personalCenterService.connKnowCheckNoticeCon = $resource('pre/checkNotice/notice/getCheckNotice', {}, {});
    personalCenterService.connKnowUpdateNoticeCon = $resource('pre/checkNotice/notice/updataNoticeStatus', {}, {});
    personalCenterService.connSubmitUserInfoCon = $resource('/back/system/user/updateUserInfo', {}, {});
    personalCenterService.connUpdataNoticeStatusCon = $resource('pre/checkNotice/notice/updataNoticeStatus', {}, {});
    personalCenterService.connExamNoticeCon = $resource('/back/exam/liveexam/informationtest', {}, {});
    personalCenterService.connShowExamDetailCon = $resource('/back/exam/liveexam/randomtest', {}, {});
    personalCenterService.connSaveExamPaperCon = $resource('/back/exam/liveexam/savetesTestinformation', {}, {});
    personalCenterService.connMycollectCon = $resource('/back/repository/knowlog/queryMyCollect', {}, {});
    personalCenterService.conndelecollectCon = $resource('/back/repository/knowlog/removeMyCollect', {}, {});
    personalCenterService.connMyCommentCon = $resource('/back/repository/knowlog/queryMyComment', {}, {});
    personalCenterService.connCommentMeCon = $resource('/back/repository/knowlog/queryCommentForMe', {}, {});
    personalCenterService.connMyQuestionCon = $resource('/back/repository/knowlog/queryMyQuestion', {}, {});
    personalCenterService.connMyAnswerCon = $resource('/back/repository/knowlog/queryMyAnswer', {}, {});
    personalCenterService.connColumnManagerCon = $resource('/pre/Topic/queryTopic', {}, {});
    personalCenterService.connAddFirstPageCon = $resource('/pre/Topic/addTopicToPage', {}, {});
    personalCenterService.connCancelTopicPageCon = $resource('/pre/Topic/cancelTopicPage', {}, {});
    personalCenterService.connDeleColumnCon = $resource('/pre/Topic/deleteTopic', {}, {});
    personalCenterService.connCreateColumnCon = $resource('/pre/Topic/createTopic', {}, {});
    return personalCenterService;
}])