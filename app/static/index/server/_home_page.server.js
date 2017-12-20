/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module : 首页服务
 */
class HomePageServer {
    constructor($resource) {
        /******************************
                     *应用*
                ********************************/
        // 用户退出登录
        this.login = $resource(API_USER+"/user/logout", {}, {});

    // 获取用户关联的应用
        this.qeuryApplicationAtUser = $resource(API_APPLICATION+"/application/get/user",{},{}) ;
    // 获取用户信息
        this.getUserRoleList = $resource(API_USER+"/user/get/role/by/user",{},{}) ;
    // 添加应用
        this.addApplication = $resource(API_APPLICATION+"/application/add",{},{}) ;
        /******************************
                        *权限*
                ********************************/
        // 用户
    // 获取用户列表
        this.queryUserList = $resource(API_USER+"/user/get/user/by/name	",{},{}) ;
    // 添加用户
        this.addUser = $resource(API_USER+"/user/add",{},{}) ;
    // 校验用户名
        this.checkUserName = $resource(API_USER+"/user/check",{},{}) ;
    // 更新用户
        this.updateUser = $resource(API_USER+"/user/update",{},{}) ;
    // 更新用户状态
        this.updateUserStatus = $resource(API_MS+"/application/update/status	",{},{}) ;
    // 删除用户
        this.deleteUser = $resource(API_USER+"/user/delete/user/by/ids",{},{}) ;
        // 角色
    // 查询所有角色
    this.queryRoleList = $resource(API_USER+"/role/get",{},{}) ;
    // 查询所有角色
    this.deleteRole = $resource(API_USER+"/role/delete/:id",{id:'@id'},{}) ;

    //查询所有应用
    this.queryAllApplication = $resource(API_APPLICATION+"/application/get", {}, {});

    // 查询所有权限
    this.queryPermissionList = $resource(API_USER+"/role/get/group",{},{}) ;

     /******************************
                        *上传记录*
                ********************************/   

    //上传记录
    this.uploadRecord=$resource(API_ANALYSIS+"/upload/record/find/list", {}, {});
    //文件下载
    this.recordDownload=$resource(API_MATERIAL+"/document/get/document/id", {}, {});

       
    }
}
HomePageServer.$inject = ['$resource'];
module.exports = homePageModule =>{
    homePageModule.
    service("HomePageServer",HomePageServer)} ;