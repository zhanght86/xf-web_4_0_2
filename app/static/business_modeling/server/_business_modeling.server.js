/**
 * @Author : MILES .
 * @Create : 2017/12/7.
 * @Module : 业务建模 api
 */
class BusinessModelingServer {
    constructor($resource) {

    	/******************************
                        *BOT*
                ********************************/   
        //添加类目        
        this.classifyAdd=$resource(API_MS+"/classify/add", {}, {});
        //修改类目
        this.classifyUpdate=$resource(API_MS+"/classify/update", {}, {});  
        //删除类目
        this.classifyDelete=$resource(API_MS+"/classify/delete", {}, {});
        //查询下级类目
        this.classifyGetChildren=$resource(API_MS+"/classify/get/children", {}, {});
        //检查类目名称
        this.classifyNameCheck=$resource(API_MS+"/classify/name/check", {}, {});
        //获取类目的全路径
        this.classifyGetFullname=$resource(API_MS+"/classify/get/fullname/:userId", {userId:'id'}, {});
        //根据类目名称获取信息
        this.classifyGetPath=$resource(API_MS+"/classify/get/path", {}, {});  


    	 /******************************
                        *同义词概念管理*
                ********************************/   

    //上传记录
    this.synonymListByAttribute=$resource(API_MS+"/modeling/concept/synonym/listByAttribute", {}, {});           
       
    }
}
BusinessModelingServer.$inject = ['$resource'];
module.exports = businessModelingModule =>{
    businessModelingModule.
    service("BusinessModelingServer",BusinessModelingServer)
} ;
