/**
 * @Author : MILES .
 * @Create : 2017/12/7.
 * @Module : 业务建模 api
 */
class BusinessModelingServer {
    constructor($resource) {
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
