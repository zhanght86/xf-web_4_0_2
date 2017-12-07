/**
 * @Author : MILES .
 * @Create : 2017/12/7.
 * @Module : 业务建模 api
 */
class BusinessModelingServer {
    constructor($resource) {
    }
}
BusinessModelingServer.$inject = ['$resource'];
module.exports = businessModelingModule =>{
    businessModelingModule.
    service("BusinessModelingServer",BusinessModelingServer)
} ;
