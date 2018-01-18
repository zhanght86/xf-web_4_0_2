/**
 * @Author : MILES .
 * @Create : 2017/10/26.
 * @Module : 路由配置
 */
module.exports = (angular) => {
    //  导航条 公共
    let nav = require("../static/index/views/home_page/nav.html"),
    // 定义basePath
        loginPath = "../static/login" , // 登录
        homePath         = "../static/index" , // 应用管理
        applicationPath  = "../static/login" , // 应用管理
        knowledgePath    = "../static/login" , // 知识管理
        modelingPath     = "../static/login" , // 业务建模
        testingPath      = "../static/login" , // 测试功能
        analysisPath     = "../static/login" , // 应用分析
        materialgPath    = "../static/login" , // 素材管理
        deepLearningPath = "../static/login",  // 深度学习
        systemPath       = "../static/login" ; // 系统监控
    /**
     *   权限管理
     *   @1   没有不在权限范围内的  permission : ""
     *   @2   父级权限以上都为父级权限  ，自身不在权限表内   permission ： {id:"",pid:"2"}
     *   @2   父级,自身都在权限内   permission ： {id:"2-1",pid:"2"}
     * */
    const map = [
    {
        "id":"1",
        "name":"首页",
        "description":"homepage",
        "pId":"0"
    },
    {
        "id":"1-1",
        "name":"知识总览",
        "description":"homeknowledgeoverview",
        "pId":"1"
    },
    {
        "id":"1-2",
        "name":"业务建模",
        "description":"businessmodeling",
        "pId":"1"
    },
    {
        "id":"1-3",
        "name":"测试功能",
        "description":"testfunction",
        "pId":"1"
    },
    {
        "id":"1-4",
        "name":"素材管理",
        "description":"materialmanage",
        "pId":"1"
    },
    {
        "id":"1-5",
        "name":"文档自学习",
        "description":"knowledgeautogenerate",
        "pId":"1"
    },
    //  权限 区别
    {
        "id":"2",
        "name":"应用管理",
        "description":"application",
        "pId":"0"
    },
    {
        "id":"2-1",
        "name":"应用信息",
        "description":"applicationconfig",
        "pId":"2"
    },
    {
        "id":"2-2",
        "name":"应用配置",
        "description":"applicationrelease",
        "pId":"2"
    },
    {
        "id":"2-3",
        "name":"应用发布",
        "description":"applicationrelease",
        "pId":"2"
    },
    {
        "id":"3",
        "name":"业务建模",
        "description":"modeling",
        "pId":"0"
    },
    {
        "id":"3-1",
        "name":"BOT",
        "description":"classify",
        "pId":"3"
    },
    {
        "id":"3-2",
        "name":"框架库",
        "description":"frame",
        "pId":"3"
    },
    {
        "id":"3-3",
        "name":"概念库",
        "description":"concept",
        "pId":"3"
    },
    {
        "id":"4",
        "name":"知识管理",
        "description":"knowledge",
        "pId":"0"
    },
    {
        "id":"4-1",
        "name":"知识总览",
        "description":"overview",
        "pId":"4"
    },
    {
        "id":"4-2",
        "name":"文档自学习",
        "description":"documentautoknowledge",
        "pId":"4"
    },
    {
        "id":"4-3",
        "name":"对话知识添加",
        "description":"dialogknowledgeadd",
        "pId":"4"
    },
    {
        "id":"4-4",
        "name":"知识批量新增",
        "description":"knowledgebatchadd",
        "pId":"4"
    },
    {
        "id":"5",
        "name":"素材管理",
        "description":"material",
        "pId":"0"
    },
    {
        "id":"5-1",
        "name":"图片库",
        "description":"image",
        "pId":"5"
    },
    {
        "id":"5-2",
        "name":"图文消息库",
        "description":"richtext",
        "pId":"5"
    },
    {
        "id":"5-3",
        "name":"文档库",
        "description":"document",
        "pId":"5"
    },
    {
        "id":"5-4",
        "name":"语音库",
        "description":"voice",
        "pId":"5"
    },
    {
        "id":"5-5",
        "name":"聊天知识库",
        "description":"chatknowledge",
        "pId":"5"
    },
    {
        "id":"6",
        "name":"系统工具",
        "description":"systemtool",
        "pId":"0"
    },
    {
        "id":"6-1",
        "name":"测试工具",
        "description":"testtool",
        "pId":"6"
    },
    {
        "id":"6-2",
        "name":"分词工具",
        "description":"wordsegmentool",
        "pId":"6"
    },
    {
        "id":"6-3",
        "name":"知识学习",
        "description":"knowledgelearning",
        "pId":"6"
    },
    {
        "id":"6-4",
        "name":"标签重要性推荐",
        "description":"tagimportantrecommend",
        "pId":"6"
    },
    {
        "id":"7",
        "name":"统计分析",
        "description":"analysis",
        "pId":"0"
    },
    {
        "id":"7-1",
        "name":"访问统计",
        "description":"access",
        "pId":"7"
    },
    {
        "id":"7-2",
        "name":"未匹配问题统计",
        "description":"unmatchedquestion",
        "pId":"7"
    },
    {
        "id":"7-3",
        "name":"会话明细统计",
        "description":"detail",
        "pId":"7"
    },
    {
        "id":"7-4",
        "name":"满意度统计",
        "description":"satification",
        "pId":"7"
    },
    {
        "id":"7-5",
        "name":"解决率统计",
        "description":"reslove",
        "pId":"7"
    },
    {
        "id":"8",
        "name":"系统监控",
        "description":"systemnonitoring",
        "pId":"0"
    },
    {
        "id":"8-1",
        "name":"操作日志",
        "description":"operationlog",
        "pId":"8"
    },
    {
        "id":"8-2",
        "name":"资源监控",
        "description":"resourcemonitoring",
        "pId":"8"
    },
    {
        "id":"8-3",
        "name":"服务监控",
        "description":"servicemonitoring",
        "pId":"8"
    },
    {
        "id":"9",
        "name":"权限管理",
        "description":"authority",
        "pId":"0"
    },
    {
        "id":"9-1",
        "name":"用户管理",
        "description":"user",
        "pId":"9"
    },
    {
        "id":"9-2",
        "name":"角色管理",
        "description":"role",
        "pId":"9"
    },
    {
        "id":"10",
        "name":"历史查看",
        "description":"uploadhistory",
        "pId":"0"
    },
    {
        "id":"10-1",
        "name":"上传历史",
        "description":"uploadhistory",
        "pId":"10"
    },

    ];
    return [
//--------------------------------------------------
//           ##登录页面##
//--------------------------------------------------
        {
            name: "login",
            url: "/login",
            permission : "",
            data: {
                roles: []
            },
            title : "登录" ,
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/login/views/login.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller: "LoginController",
            resolve:
                {
                    loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                        let defer = $q.defer();
                        require.ensure([], ()=> {
                            let loginModule = require("../static/login/module/_login.module.js")(angular);   //动态加载Module
                            $ocLazyLoad.load({
                                name: "loginModule"                                           //name就是你module的名称
                            });
                            defer.resolve(loginModule);
                        });
                        return defer.promise;
                    }]
                }
        },
//--------------------------------------------------
//          ##首页##
//--------------------------------------------------
        {
            name: "HP",
            url: "/HP",
            permission : "",
            title : "首页容器加载依赖" ,
            template : require("../static/index/main.html"),
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let homePageModule = require("../static/index/module/_home_page.module.js")(angular);   //动态加载Module
                        $ocLazyLoad.load({
                            name: "homePageModule"                                           //name就是你module的名称
                        });
                        defer.resolve(homePageModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // 首页
        {
            name: "HP.define",
            url: "/define",
            permission : {
                id  : "1" ,
                pid : "0"
            },
            parent : "HP",
            title : "首页" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/home_page/content.html"),
                    controller: "HomePageContentController"
                }
            }
        },
        // 选择应用
        {
            name: "HP.management",
            url: "/management",
            permission : "",
            parent : "HP",
            title : "选择应用管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/switch_application/content.html"),
                    controller: "ApplicationController"
                }
            }
        },
        // 权限管理
        {
            name: "HP.permission",
            url: "/permission",
            permission : {
                id  : "9" ,
                pid : "0"
            },
            parent : "HP",
            title : "默认首页" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/permission_management/permission.html"),
                }
            }
        },
        //角色管理
        {
            name: "HP.permission.role",
            url: "/role",
            permission : {
                id  : "9-2" ,
                pid : "9"
            },
            parent : "HP.permission",
            title : "角色管理" ,
            views: {
                "content@HP.permission": {
                    template: require("../static/index/views/permission_management/role.html"),
                    controller: "RoleController"
                }
            }
        },
        //用户管理
        {
            name: "HP.permission.user",
            url: "/user",
            permission : {
                id  : "9-1" ,
                pid : "9"
            },
            parent : "HP.permission",
            title : "用户管理" ,
            views: {
                "content@HP.permission": {
                    template: require("../static/index/views/permission_management/user.html"),
                    controller: "UserController"
                }
            }
        },


        // 上传记录
        {
            name: "HP.uploadRecord",
            url: "/uploadRecord",
            permission : "",
            data: {
                roles: []
            },
            parent : "HP",
            title : "上传记录" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/upload_record/upload_record.html"),
                    controller: "uploadRecordController"
                }
            }
        },

//-------------------------------------------------
        //##系统工具
//--------------------------------------------
        {
            name: "ST",
            url: "/ST",
            permission : {
                id  : "6" ,
                pid : "0"
            },
            title : "系统工具",
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/functional_testing/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller : "SystemToolsController" ,
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let functionalTestModule = require("../static/functional_testing/module/_functional_test.module")(angular);
                        $ocLazyLoad.load({
                            name: "functionalTestModule"
                        });
                        defer.resolve(functionalTestModule);
                    });
                    return defer.promise;
                }]
            }
        },
        //----------测试工具----------
        {
            name: "ST.test",
            url: "/test",
            permission : {
                id  : "6-1" ,
                pid : "6"
            },
            parent : "ST",
            title : "测试工具" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/test_tools/main.html"),
                    //controller: "TestToolsController"
                }
            }
        },
        {
            name: "ST.test.question",
            url: "/question",
            permission : "",
            parent : "ST.test",
            title : "问法测试" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/test_tools/question_test/question_test.html"),
                    controller: "QuestionTestController"
                }
            }
        },
        {
            name: "ST.test.session",
            url: "/session",
            permission : "",
            parent : "ST.test",
            title : "聊天测试" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/test_tools/session_test/session_test.html"),
                    controller: "SessionTestController"
                }
            }
        },
        {
            name: "ST.test.batch",
            url: "/batch",
            permission : "",
            parent : "ST.test",
            title : "批量测试" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/test_tools/batch_test/batch_test.html"),
                    controller: "BatchTestController"
                }
            }
        },


        //----------分词工具------------
        {
            name: "ST.participle",
            url: "/participle",
            permission : {
                id  : "6-2" ,
                pid : "6"
            },
            parent : "ST",
            title : "分词工具" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/participle_tool/participle.html"),
                    controller: "ParticipleController"
                }
            }
        },
        // {
        //     name: "ST.participleResult",
        //     url: "/participleResult",
        //     data: {
        //         roles: []
        //     },
        //     parent : "ST",
        //     title : "分词工具" ,
        //     views: {
        //         "header": {
        //             template: nav,
        //             controller: "NavController"
        //         },
        //         "content": {
        //             template: require("../static/functional_testing/views/participle_tool/participle_result.html"),
        //             controller: "ParticipleResultController"
        //         }
        //     }
        // },


        //----------知识学习-------------
        {
            name: "ST.study",
            url: "/study",
            permission : {
                id  : "6-3" ,
                pid : "6"
            },
            parent : "ST",
            title : "知识学习" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/division_knowledge/main.html"),
                    //controller: "TestToolsController"
                }
            }
        },
        {
            name: "ST.study.correction",
            url: "/correction",
            permission : "",
            parent : "ST.study",
            title : "知识学习" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/division_knowledge/correction_learning/correction_learning.html"),
                    controller: "CorrectionLearnController"
                }
            }
        },
        {
            name: "ST.study.reinforcement",
            url: "/reinforcement",
            permission : "",
            parent : "ST.study",
            title : "知识学习" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/division_knowledge/reinforcement_learn/reinforcement_learn.html"),
                    controller: "ReinforcementLearnController"
                }
            }
        },
        {
            name: "ST.study.newKnow",
            url: "/newKnow",
            permission :"",
            parent : "ST.study",
            title : "知识学习" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/functional_testing/views/division_knowledge/new_know_discovery_learn/new_know_discovery_learn.html"),
                    controller: "NewKnowDiscoveryLearnController"
                }
            }
        },


//--------------------------------------------------
//          ##应用管理AM##
//--------------------------------------------------
        {
            name: "AM",
            url: "/AM",
            permission : {
                id  : "2" ,
                pid : "0"
            },
            title : "应用管理",
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/application_management/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller : "ApplicationSettingController" ,
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let applicationManagementModule = require("../static/application_management/module/_application_management.module")(angular);
                        $ocLazyLoad.load({
                            name: "applicationManagementModule"
                        });
                        defer.resolve(applicationManagementModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // --------------------应用信息-------------------- //
        {
            name: "AM.info",
            url: "/info",
            permission : {
                id  : "2-1" ,
                pid : "2"
            },
            parent : "AM",
            title : "应用信息" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/info/info.html"),
                    controller: "ApplicationInfoController"
                }
            }
        },
        // --------------------应用配置-------------------- //
        // 备份还原
        {
            name: "AM.restore",
            url: "/restore",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "备份还原" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/backup_restore/backup_restore.html"),
                    controller: "BackupRestoreController"
                }
            }
        },
        // 机器人设置
        {
            name: "AM.robot",
            url: "/robot",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "机器人设置" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/robot_setup/robot_setup.html"),
                    controller: "RobotSetupController"
                }
            }
        },
        // 参数设置
        {
            name: "AM.parameter",
            url: "/parameter",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "参数设置" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/parameter_setup/parameter_setup.html"),
                    controller: "ParameterSetupController"
                }
            }
        },
        // 转人工
        {
            name: "AM.manual",
            url: "/manual",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "转人工" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/manual_setting/manual_setting.html"),
                    controller: "ManualSettingController"
                }
            }
        },
        // 授权管理
        {
            name: "AM.authorization",
            url: "/authorization",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "授权管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/authorization_management/authorization_management.html"),
                    controller: "AuthorizationManagementController"
                }
            }
        },
        // 热点知识配置
        {
            name: "AM.hot",
            url: "/hot",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "转人工" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/hot_knowledge_setup/hot_knowledge_setup.html"),
                    controller: "HotKnowledgeSetupController"
                }
            }
        },
        // 交互管理
        {
            name: "AM.interaction",
            url: "/scene",
            permission : {
                id  : "" ,
                pid : "2-2"
            },
            parent : "AM",
            title : "交互管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/interaction/interaction.html"),
                    controller: "InteractionManageController"
                }
            }
        },
        // --------------------应用发布-------------------- //
        // 发布管理
        {
            name: "AM.release",
            url: "/release",
            permission : {
                id  : "" ,
                pid : "2-3"
            },
            parent : "AM",
            title : "发布管理",
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/release/release_manage/release_manage.html"),
                    controller: "ReleaseManageController"
                }
            }
        },
        // 节点管理
        {
            name: "AM.node",
            url: "/node",
            permission : {
                id  : "" ,
                pid : "2-3"
            },
            parent : "AM",
            title : "节点管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/release/node_manage/node_manage.html"),
                    controller: "NodeManageController"
                }
            }
        },

//--------------------------------------------------
//          ##业务建模BM##
//--------------------------------------------------
        {
            name: "BM",
            url: "/BM",
            permission : {
                id  : "3" ,
                pid : "0"
            },
            title : "业务建模容器加载依赖" ,
            template : require("../static/business_modeling/main.html"),
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let businessModelingModule = require("../static/business_modeling/module/_business_modeling.module")(angular);
                        $ocLazyLoad.load({
                            name: "businessModelingModule"
                        });
                        defer.resolve(businessModelingModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // bot
        {
            name: "BM.bot",
            url: "/bot",
            permission : {
                id  : "3-1" ,
                pid : "3"
            },
            parent : "BM",
            title : "bot" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/business_modeling/views/bot/bot.html"),
                    controller: "BotController"
                }
            }
        },
        {
            name: "BM.botApply",
            url: "/botApply",
            permission : {
                id  : "" ,
                pid : "3-1"
            },
            parent : "BM",
            title : "类目库套用" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/business_modeling/views/bot/bot_apply.html"),
                    controller: "BotApplyController"
                }
            }
        },
        // 框架库
        {
            name: "BM.frame",
            url: "/frame",
            permission : {
                id  : "3-2" ,
                pid : "3"
            },
            parent : "BM",
            title : "框架库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/business_modeling/views/frame/framework_library.html"),
                    controller: "FrameLibraryController"
                }
            }
        },
        //-----------------概念库------------------//
        {
            name: "BM.concept",
            url: "/concept",
            permission : {
                id  : "3-3" ,
                pid : "3"
            },
            parent : "BM",
            title : "概念库" ,
            views: {
                "header@BM": {
                    template: nav,
                    controller: "NavController"
                },
                "content@BM": {
                    template: require("../static/business_modeling/views/concept/concept.html"),
                    // controller: "FrameLibraryController"
                }
            }
        },
            // 同义概念
        {
            name: "BM.concept.synonym",
            url: "/synonym",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "同义概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/synonym/synonym.html"),
                    controller: "SynonymConceptController"
                }
            }
        },
            // 集合概念
        {
            name: "BM.concept.aggregate",
            url: "/aggregate",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "集合概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/aggregate/aggregate.html"),
                    controller: "AggregateConceptController"
                }
            }
        },
            // 业务概念
        {
            name: "BM.concept.business",
            url: "/business",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "业务概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/business/business.html"),
                    controller: "BusinessConceptController"
                }
            }
        },
            // 敏感词概念
        {
            name: "BM.concept.sensitive",
            url: "/sensitive",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "敏感词概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/sensitive/sensitive.html"),
                    controller: "SensitiveConceptController"
                }
            }
        },
            // 停用词概念
        {
            name: "BM.concept.disable",
            url: "/disable",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "停用词概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/disable/disable.html"),
                    controller: "DisableConceptController"
                }
            }
        },
            // 强制分词概念
        {
            name: "BM.concept.enforcement",
            url: "/enforcement",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "强制分词概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/enforcement/enforcement.html"),
                    controller: "EnforcementConceptController"
                }
            }
        },
            // bot概念
        {
            name: "BM.concept.bot",
            url: "/bot",
            permission : {
                id  : "" ,
                pid : "3-3"
            },
            parent : "BM.concept",
            title : "bot概念" ,
            views: {
                "content@BM.concept": {
                    template: require("../static/business_modeling/views/concept/bot/bot.html"),
                    controller: "BotConceptController"
                }
            }
        },

//--------------------------------------------------
//          ##知识管理KM##
//--------------------------------------------------
        {
            name: "KM",
            url: "/KM",
            permission : {
                id  : "4" ,
                pid : "0"
            },
            title : "知识管理容器加载依赖" ,
            template : require("../static/knowledge_management/main.html"),
            controller : "KnowledgeManagementController" ,
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let knowledgeManagementModule = require("../static/knowledge_management/module/_knowledge_management.module")(angular);
                        $ocLazyLoad.load({
                            name: "knowledgeManagementModule"
                        });
                        defer.resolve(knowledgeManagementModule);
                    });
                    return defer.promise;
                }]
            }
        },
    // 知识总览
        {
            name: "KM.overview",
            url: "/overview",
            permission : {
                id  : "4-1" ,
                pid : "4"
            },
            parent : "KM",
            title : "知识总览" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/overview/custOverview.html"),
                    controller: "CustOverviewController"
                }
            }
        },
        {
            name: "KM.preview",
            url: "/preview/:id/:type",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "知识查看" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/overview/custPreview.html"),
                    controller: "CustPreviewController"
                }
            }
        },
        {
            name: "KM.scan",
            url: "/scan",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "知识查看" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/public_html/scan.html"),
                    controller: "KnowledgeScanController"
                }
            }
        },
    // 知识单条新增
        //faq
            // 新增
        {
            name: "KM.faq",
            url: "/faq/:knowledgeId",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "faq 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/faq/faq.html"),
                    controller: "FaqNewController"
                }
            }
        },
        // faq编辑
        {
            name: "KM.faq.edit",
            url: "/faq/edit/:knowledgeId",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "faq 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/faq/faq.html"),
                    controller: "FaqEditController"
                }
            }
        },
        //列表
            // 新增
        {
            name: "KM.list",
            url: "/list",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "列表 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/list/list.html"),
                    controller: "ListNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.list.edit",
            url: "/list/edit/:knowledgeId",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "列表 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/list/list.html"),
                    controller: "ListEditController"
                }
            }
        },
        //要素
            // 新增
        {
            name: "KM.factor",
            url: "/factor",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "要素 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/factor/factor.html"),
                    controller: "FactorNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.factor.edit",
            url: "/factor/edit/:knowledgeId",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "要素 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/factor/factor.html"),
                    controller: "FactorEditController"
                }
            }
        },
        //概念
            // 新增
        {
            name: "KM.concept",
            url: "/concept",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "概念 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/rich_text/rich_text.html"),
                    controller: "RichTextNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.concept.edit",
            url: "/concept/edit/:knowledgeId",
            permission : {
                id  : "" ,
                pid : "4-1"
            },
            parent : "KM",
            title : "概念 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/rich_text/rich_text.html"),
                    controller: "RichTextEditController"
                }
            }
        },
        //对话知识
            // 新增
        {
            name: "KM.dialogue",
            url: "/dialogue",
            permission : {
                id  : "4-3" ,
                pid : "4"
            },
            parent : "KM",
            title : "对话 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/dialogue/dialogue.html"),
                    controller: "DialogueNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.dialogue.edit",
            url: "/dialogue/edit/:knowledgeId",
            permission : {
                id  : "4-3" ,
                pid : "4"
            },
            parent : "KM",
            title : "对话 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/dialogue/dialogue.html"),
                    controller: "DialogueEditController"
                }
            }
        },
    // 知识批量新增
        {
            name: "KM.batch",
            url: "/batch",
            permission : {
                id  : "4-4" ,
                pid : "4"
            },
            parent : "KM",
            title : "批量 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/batch/batch.html"),
                    controller: "KnowBatchAdditionsController"
                }
            }
        },
    // 文档加工
    //     {
    //         name: "KM.document",
    //         url: "/document",
    //         data: {
    //             roles: []
    //         },
    //         parent : "KM",
    //         title : "批量 新增" ,
    //         views: {
    //             "header": {
    //                 template: nav,
    //                 controller: "NavController"
    //             },
    //             "content": {
    //                 template: require("../static/knowledge_management/views/batch/batch.html"),
    //                 controller: "KnowBatchAdditionsController"
    //             }
    //         }
    //     },
    // 历史查看
        /*
        {
            name: "KM.history",
            url: "/history",
            data: {
                roles: []
            },
            parent : "KM",
            title : "历史查看" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/history/history.html"),
                    controller: "HistoryViewController"
                }
            }
        },
        */
//--------------------------------------------------
//          ##统计分析##
//--------------------------------------------------

     {
            name: "ANM",
            url: "/ANM",
            permission : {
                id  : "7" ,
                pid : "0"
            },
            title : "统计分析" ,
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/application_analysis/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller: "applAnalysisController",
            // controllerAs : "SystemMonitoringCtr" ,
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let applAnalysisModule = require("../static/application_analysis/module/_appl_analysis.module")(angular);   //动态加载Module
                        $ocLazyLoad.load({
                            name: "applAnalysisModule"                                           //name就是你module的名称
                        });
                        defer.resolve(applAnalysisModule);
                    });
                    return defer.promise;
                }]
            }
        },
         // 访问统计
        {
            name: "ANM.accessStatistics",
            url: "/accessStatistics",
            permission : {
                id  : "7-1" ,
                pid : "7"
            },
            parent : "ANM",
            title : "访问统计" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/access_statistics/access_statistics.html"),
                    controller: "accessStatisticsController"
                }
            }
        },

         // 未匹配问题统计
        {
            name: "ANM.knowledgeRanking",
            url: "/knowledgeRanking",
            permission : {
                id  : "7-2" ,
                pid : "7"
            },
            parent : "ANM",
            title : "未匹配问题统计" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/knowledge_ranking/knowledge_ranking.html"),
                    controller: "knowledgeRankingController"
                }
            }
        },
         // 会话明细统计
        {
            name: "ANM.sessionDetails",
            url: "/sessionDetails",
            permission : {
                id  : "7-3" ,
                pid : "7"
            },
            parent : "ANM",
            title : "会话明细统计" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/session_details/session_details.html"),
                    controller: "sessionDetailsController"
                }
            }
        },
         // 会话满意度统计
        {
            name: "ANM.satisfactionDegree",
            url: "/satisfactionDegree",
            permission : {
                id  : "7-4" ,
                pid : "7"
            },
            parent : "ANM",
            title : "会话满意度统计" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/satisfaction_degree/satisfaction_degree.html"),
                    controller: "satisfactionDegreeController"
                }
            }
        },

         // 问答解决率统计
        {
            name: "ANM.resolutionStatistics",
            url: "/resolutionStatistics",
            permission : {
                id  : "7-5" ,
                pid : "7"
            },
            parent : "ANM",
            title : "问答解决率统计" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/resolution_statistics/resolution_statistics.html"),
                    controller: "resolutionStatisticsController"
                }
            }
        },
/*

         // 会话日志
        {
            name: "ANM.sessionLog",
            url: "/sessionLog",
            data: {
                roles: []
            },
            parent : "ANM",
            title : "会话日志" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_analysis/views/session_log/session_log.html"),
                    controller: "sessionLogController"
                }
            }
        },
 */
//--------------------------------------------------
//          ##素材管理##
//--------------------------------------------------
        {
            name: "MM",
            url: "/MM",
            permission : {
                id  : "5" ,
                pid : "0"
            },
            title : "素材管理" ,
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/material_management/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller: "MaterialController",
            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let materialModule = require("../static/material_management/module/_material.module")(angular);   //动态加载Module
                        $ocLazyLoad.load({
                            name: "materialModule"                                           //name就是你module的名称
                        });
                        defer.resolve(materialModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // 聊天知识库
        {
            name: "MM.chat",
            url: "/chat",
            permission : {
                id  : "5-5" ,
                pid : "5"
            },
            parent : "MM",
            title : "聊天知识库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/chat/knowledge_base/chat_knowledge_base.html"),
                    controller: "KnowledgeBaseController"
                }
            }
        },
        // 聊天知识库-新增
        {
            name: "MM.chatAdd",
            url: "/chatAdd",
            permission : {
                id  : "" ,
                pid : "5-5"
            },
            parent : "MM",
            title : "聊天知识库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/chat/know_add/know_add.html"),
                    controller: "KnowAddController"
                }
            }
        },
        // 聊天知识库-编辑
        {
            name: "MM.chatEdit",
            url: "/chatEdit/:knowTextId",
            permission : {
                id  : "" ,
                pid : "5-5"
            },
            parent : "MM",
            title : "聊天知识库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/chat/know_edit/know_edit.html"),
                    controller: "KnowEditController"
                }
            }
        },
        // 图片库
        {
            name: "MM.pic",
            url: "/pic",
            permission : {
                id  : "5-1" ,
                pid : "5"
            },
            parent : "MM",
            title : "图片库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/picture_library/picture_library.html"),
                    controller: "PictureLibraryController"
                }
            }
        },
        // 语音库
        {
            name: "MM.voice",
            url: "/voice",
            permission : {
                id  : "5-4" ,
                pid : "5"
            },
            parent : "MM",
            title : "语音库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/voice_library/voice_library.html"),
                    controller: "VoiceLibraryController"
                }
            }
        },
        // 文档库库
        {
            name: "MM.doc",
            url: "/doc",
            permission : {
                id  : "5-3" ,
                pid : "5"
            },
            parent : "MM",
            title : "文档库" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/document_library/document_library.html"),
                    controller: "DocumentLibraryController"
                }
            }
        },
        // 图文消息库
        {
            name: "MM.teletext",
            url: "/teletext",
            permission : {
                id  : "5-2" ,
                pid : "5"
            },
            parent : "MM",
            title : "图文消息" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/teletext_message/teletext_message.html"),
                    controller: "TeletextMessageController"
                }
            }
        },
        // 添加图文消息
        {
            name: "MM.addTw",
            url: "/addTw/:imgTextId",
            permission : {
                id  : "" ,
                pid : "5-2"
            },
            parent : "MM",
            title : "添加图文消息" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/teletext_message/add_tw_mes.html"),
                    controller: "AddTwMesController"
                }
            }
        },
        // 图文消息详情
        {
            name: "MM.detail",
            url: "/detail/:imgTextId",
            permission : {
                id  : "" ,
                pid : "5-2"
            },
            parent : "MM",
            title : "图文消息详情" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/material_management/views/teletext_message/graphic_details.html"),
                    controller: "GraphicDetailsController"
                }
            }
        },
//--------------------------------------------------
//          ##深度学习##
//--------------------------------------------------

//--------------------------------------------------
//          ##系统监控##
//--------------------------------------------------
        {
            name: "SisM",
            url: "/SisM",
            permission : {
                id  : "8" ,
                pid : "0"
            },
            title : "系统监控" ,
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/system_monitoring/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller: "SystemMonitoringController",

            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let systemMonitoringModule = require("../static/system_monitoring/module/_system_monitoring.module")(angular);   //动态加载Module
                        $ocLazyLoad.load({
                            name: "systemMonitoringModule"                                           //name就是你module的名称
                        });
                        defer.resolve(systemMonitoringModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // 操作日志
        {
            name: "SisM.operationLog",
            url: "/operationLog",
            permission : {
                id  : "8-1" ,
                pid : "8"
            },
            parent : "SisM",
            title : "操作日志" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/system_monitoring/views/operation_log/operation_log.html"),
                    controller: "OperationLogController"
                }
            }
        },
        // 资源监控
        {
            name: "SisM.resource",
            url: "/resource",
            permission : {
                id  : "8-2" ,
                pid : "8"
            },
            parent : "SisM",
            title : "资源监控" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/system_monitoring/views/resource_monitoring/resource_monitoring.html"),
                    controller: "ResourceMonitoringController"
                }
            }
        },
        // 服务监控
        {
            name: "SisM.service",
            url: "/service",
            permission : {
                id  : "8-3" ,
                pid : "8"
            },
            parent : "SisM",
            title : "服务监控" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/system_monitoring/views/service_monitoring/service_monitoring.html"),
                    controller: "ServiceMonitoringController"
                }
            }
        },
//--------------------------------------------------
//          ##帮助中心##
//--------------------------------------------------
        {
            name: "HC",
            url: "/HC",
            permission : "",
            title : "帮助中心" ,
            templateProvider:
                ["$q", function ($q) {
                    let deferred = $q.defer();
                    require.ensure([], function () {
                        let template = require("../static/help_center/main.html");
                        deferred.resolve(template);
                    });
                    return deferred.promise;
                }],
            controller: "HelpCenterController",

            resolve:
            {
                loadDep: ["$q", "$ocLazyLoad", ($q, $ocLazyLoad)=> {
                    let defer = $q.defer();
                    require.ensure([], ()=> {
                        let helpCenterModule = require("../static/help_center/module/_help_center.module")(angular);   //动态加载Module
                        $ocLazyLoad.load({
                            name: "helpCenterModule"                                           //name就是你module的名称
                        });
                        defer.resolve(helpCenterModule);
                    });
                    return defer.promise;
                }]
            }
        },
        // 常见问题
        {
            name: "HC.problem",
            url: "/problem",
            permission : "",
            parent : "HC",
            title : "常见问题" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/help_center/views/common_problem/common_problem.html"),
                    controller: "CommonProblemController"
                }
            }
        },
    ];};
