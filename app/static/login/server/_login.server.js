/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 登录服务
 */
class LoginServer {
    constructor($resource) {
        //登录
        this.login = $resource(API_USER+"/user/login", {}, {});
    }
}
LoginServer.$inject = ['$resource'];
module.exports = loginModule =>{
    loginModule.
    service("LoginServer",LoginServer)} ;