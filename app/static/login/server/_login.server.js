/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 登录服务
 */
class LoginServer {
    constructor($resource) {
        /******************************
         *应用配置*
         ********************************/
//   渠道管理
        //请求渠道列表
        this.login = $resource(API_USER+"/userLogin", {}, {});
    }
}
LoginServer.$inject = ['$resource'];
module.exports = loginModule =>{
    loginModule.
    service("LoginServer",LoginServer)} ;