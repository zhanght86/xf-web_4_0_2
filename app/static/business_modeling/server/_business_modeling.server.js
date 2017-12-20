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
        this.classifyNameCheck=$resource(API_MS+"/classify/check/name", {}, {});
        //获取类目的全路径
        this.classifyGetFullname=$resource(API_MS+"/classify/get/fullname/:userId", {userId:'id'}, {});
        //根据类目名称获取信息
        this.classifyGetPath=$resource(API_MS+"/classify/get/path", {}, {});  


    	 /******************************
                        *同义词概念管理*
                ********************************/   

    //列表展示
    this.conceptGetParam=$resource(API_MS+"/concept/collective/get/param", {}, {});  
    //概念新增
    this.conceptAdd=$resource(API_MS+"/concept/collective/add", {}, {})  
    //概念修改
    this.conceptUpdate=$resource(API_MS+"/concept/collective/update", {}, {}) 
    //概念删除
    this.conceptDelete=$resource(API_MS+"/concept/collective/delete", {}, {})
    //概念批量删除
    this.conceptAllDelete=$resource(API_MS+"/concept/collective/batch/delete", {}, {})
    //判断重复
    this.conceptRepeat=$resource(API_MS+"/concept/collective/repeat", {}, {})

    }
}
BusinessModelingServer.$inject = ['$resource'];
module.exports = businessModelingModule =>{
    businessModelingModule.
    service("BusinessModelingServer",BusinessModelingServer)
} ;
