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
                        *BOT类目库*
                ********************************/   
        //添加类目        
        this.libraryAdd=$resource(API_MS+"/classify/library/add", {}, {});
        //修改类目
        this.libraryUpdate=$resource(API_MS+"/classify/library/update", {}, {});  
        //删除类目
        this.libraryDelete=$resource(API_MS+"/classify/library/delete", {}, {});
        //查询下级类目
        this.libraryGetChildren=$resource(API_MS+"/classify/library/get/children", {}, {});
        //检查类目名称
        this.libraryNameCheck=$resource(API_MS+"/classify/library/check/name", {}, {});
        //获取类目的全路径
        this.libraryGetFullname=$resource(API_MS+"/classify/library/get/fullname/:userId", {userId:'id'}, {});
        //根据类目名称获取信息
        this.libraryGetPath=$resource(API_MS+"/classify/library/get/path", {}, {});
        //类目库套用
        this.libraryQuote=$resource(API_MS+"/classify/quote/library", {}, {})

        /******************************
                        *框架库*
                ********************************/   
      
        //检查类目名称
        this.frameRepeatTtitle=$resource(API_MS+"/frame/repeat/title", {}, {});
    
	 /******************************
	                        *同意词概念管理*
	                ********************************/   
   //列表展示
    this.synConceptGetParam=$resource(API_MS+"/concept/synonym/get/param", {}, {}); 
    //概念新增
    this.synConceptAdd=$resource(API_MS+"/concept/synonym/add", {}, {}) ;
    //概念修改
    this.synConceptUpdate=$resource(API_MS+"/concept/synonym/update", {}, {}) ;
    //概念删除
    this.synConceptDelete=$resource(API_MS+"/concept/synonym/delete", {}, {});
    //概念批量删除
    this.synConceptAllDelete=$resource(API_MS+"/concept/synonym/batch/delete", {}, {});
    //判断重复
    this.synConceptRepeat=$resource(API_MS+"/concept/synonym/repeat", {}, {});
    	 /******************************
                        *集合词词概念管理*
                ********************************/   

    //列表展示
    this.colConceptGetParam=$resource(API_MS+"/concept/collective/get/param", {}, {}); 
    //概念新增
    this.colConceptAdd=$resource(API_MS+"/concept/collective/add", {}, {}) ;
    //概念修改
    this.colConceptUpdate=$resource(API_MS+"/concept/collective/update", {}, {}) ;
    //概念删除
    this.colConceptDelete=$resource(API_MS+"/concept/collective/delete", {}, {});
    //概念批量删除
    this.colConceptAllDelete=$resource(API_MS+"/concept/collective/batch/delete", {}, {});
    //判断重复
    this.colConceptRepeat=$resource(API_MS+"/concept/collective/repeat", {}, {});


     /******************************ni
                        *业务词概念管理*
                ********************************/   

    //列表展示
    this.busConceptGetParam=$resource(API_MS+"/concept/business/get/param", {}, {});  
    //概念新增
    this.busConceptAdd=$resource(API_MS+"/concept/business/add", {}, {});  
    //概念修改
    this.busConceptUpdate=$resource(API_MS+"/concept/business/update", {}, {});
    //概念删除
    this.busConceptDelete=$resource(API_MS+"/concept/business/delete", {}, {});
    //概念批量删除
    this.busConceptAllDelete=$resource(API_MS+"/concept/business/batch/delete", {}, {});
    //判断重复
    this.busConceptRepeat=$resource(API_MS+"/concept/business/repeat", {}, {});



     /******************************
                        *敏感词概念管理*
                ********************************/   

    //列表展示
    this.senConceptGetParam=$resource(API_MS+"/concept/sensitive/get/param", {}, {});
    //概念新增
    this.senConceptAdd=$resource(API_MS+"/concept/sensitive/add", {}, {});  
    //概念修改
    this.senConceptUpdate=$resource(API_MS+"/concept/sensitive/update", {}, {});
    //概念删除
    this.senConceptDelete=$resource(API_MS+"/concept/sensitive/delete", {}, {});
    //概念批量删除
    this.senConceptAllDelete=$resource(API_MS+"/concept/sensitive/batch/delete", {}, {});
    //判断重复
    this.senConceptRepeat=$resource(API_MS+"/concept/sensitive/repeat", {}, {});

  /******************************
                        *停用词概念管理*
                ********************************/   

    //列表展示
    this.stopConceptGetParam=$resource(API_MS+"/concept/stop/get/param", {}, {});
    //概念新增
    this.stopConceptAdd=$resource(API_MS+"/concept/stop/add", {}, {});  
    //概念修改
    this.stopConceptUpdate=$resource(API_MS+"/concept/stop/update", {}, {});
    //概念删除
    this.stopConceptDelete=$resource(API_MS+"/concept/stop/delete", {}, {});
    //概念批量删除
    this.stopConceptAllDelete=$resource(API_MS+"/concept/stop/batch/delete", {}, {});
    //判断重复
    this.stopConceptRepeat=$resource(API_MS+"/concept/stop/repeat", {}, {}); 
/******************************
                        *强制分词概念管理*
                ********************************/   

    //列表展示
    this.forceConceptGetParam=$resource(API_MS+"/concept/forceSegment/get/param", {}, {});
    //概念新增
    this.forceConceptAdd=$resource(API_MS+"/concept/forceSegment/add", {}, {});  
    //概念修改
    this.forceConceptUpdate=$resource(API_MS+"/concept/forceSegment/update", {}, {});
    //概念删除
    this.forceConceptDelete=$resource(API_MS+"/concept/forceSegment/delete", {}, {});
    //概念批量删除
    this.forceConceptAllDelete=$resource(API_MS+"/concept/forceSegment/batch/delete", {}, {});
    //判断重复
    this.forceConceptRepeat=$resource(API_MS+"/concept/forceSegment/repeat", {}, {});   

/******************************
                        *bot概念管理*
                ********************************/   

    //列表展示
    this.botConceptGetParam=$resource(API_MS+"/concept/bot/get/param", {}, {});
    //概念新增
    this.botConceptAdd=$resource(API_MS+"/concept/bot/add", {}, {});  
    //概念修改
    this.botConceptUpdate=$resource(API_MS+"/concept/bot/update", {}, {});
    //概念删除
    this.botConceptDelete=$resource(API_MS+"/concept/bot/delete", {}, {});
    //概念批量删除
    this.botConceptAllDelete=$resource(API_MS+"/concept/bot/batch/delete", {}, {});
    //判断重复
    this.botConceptRepeat=$resource(API_MS+"/concept/bot/repeat", {}, {});     

    }
}
BusinessModelingServer.$inject = ['$resource'];
module.exports = businessModelingModule =>{
    businessModelingModule.
    service("BusinessModelingServer",BusinessModelingServer)
} ;
