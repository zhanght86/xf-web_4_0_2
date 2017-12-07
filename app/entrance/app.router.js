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

    const map = {
        name : "xf_map",
        nodes : [
            {
                describe : "登录" ,
                permissionId : "" ,
                name : "login" ,
                url  : "/login" ,
                children : ""
            }
        ]
    };
    return [
//--------------------------------------------------
//           ##登录页面##
//--------------------------------------------------
        {
            name: "login",
            url: "/login",
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
            data: {
                roles: []
            },
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
            data: {
                roles: []
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
        // 应用 管理
        {
            name: "HP.management",
            url: "/management",
            data:   {
                roles: []
            },
            parent : "HP",
            title : "应用管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/user_control/switch_application/content.html"),
                    controller: "homePageContentController"
                }
            }
        },
        // 权限管理
        {
            name: "HP.permission",
            url: "/permission",
            data: {
                roles: []
            },
            parent : "HP",
            title : "默认首页" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/index/views/user_control/permission_management/permission.html"),
                    controller: "PermissionController"
                }
            }
        },
//--------------------------------------------------
//          ##应用管理MP##
//--------------------------------------------------
        {
            name: "AM",
            url: "/AM",
            data: {
                roles: []
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
        // 应用信息
        {
            name: "AM.info",
            url: "/info",
            data: {
                roles: []
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
        // 备份还原
        {
            name: "AM.restore",
            url: "/restore",
            data: {
                roles: []
            },
            parent : "AM",
            title : "备份还原" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/info/backup_restore.html"),
                    controller: "BackupRestoreController"
                }
            }
        },
        // --------------------应用配置-------------------- //
        // 机器人设置
        {
            name: "AM.robot",
            url: "/robot",
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
        // 场景管理
        {
            name: "AM.scene",
            url: "/scene",
            data: {
                roles: []
            },
            parent : "AM",
            title : "场景管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/scene_manage/scene_manage.html"),
                    controller: "SceneManageController"
                }
            }
        },
        // 渠道管理
        {
            name: "AM.channel",
            url: "/channel",
            data: {
                roles: []
            },
            parent : "AM",
            title : "渠道管理" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/application_management/views/configuration/channel_manage/channel_manage.html"),
                    controller: "ChannelManageController"
                }
            }
        },
        // --------------------应用发布-------------------- //
        // 发布管理
        {
            name: "AM.release",
            url: "/release",
            data: {
                roles: []
            },
            parent : "AM",
            title : "渠道管理" ,
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            url: "/preview",
            data: {
                roles: []
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
    // 知识单条新增
        //faq
            // 新增
        {
            name: "KM.faq",
            url: "/faq",
            data: {
                roles: []
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
            data: {
                roles: []
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
        //概念
            // 新增
        {
            name: "KM.concept",
            url: "/concept",
            data: {
                roles: []
            },
            parent : "KM",
            title : "概念 新增" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/concept/concept.html"),
                    controller: "ConceptNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.concept.edit",
            url: "/concept/edit/:knowledgeId",
            data: {
                roles: []
            },
            parent : "KM",
            title : "概念 编辑" ,
            views: {
                "header": {
                    template: nav,
                    controller: "NavController"
                },
                "content": {
                    template: require("../static/knowledge_management/views/single/concept/concept.html"),
                    controller: "ConceptEditController"
                }
            }
        },
        //列表
            // 新增
        {
            name: "KM.list",
            url: "/list",
            data: {
                roles: []
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
                    controller: "ConceptNewController"
                }
            }
        },
            // 编辑
        {
            name: "KM.list.edit",
            url: "/list/edit/:knowledgeId",
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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
        //富文本
            // 新增
        {
            name: "KM.richText",
            url: "/richText",
            data: {
                roles: []
            },
            parent : "KM",
            title : "富文本 新增" ,
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
            name: "KM.richText.edit",
            url: "/richText/edit/:knowledgeId",
            data: {
                roles: []
            },
            parent : "KM",
            title : "富文本 编辑" ,
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
            data: {
                roles: []
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
            data: {
                roles: []
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
            data: {
                roles: []
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

//--------------------------------------------------
//          ##测试功能##
//--------------------------------------------------

//--------------------------------------------------
//          ##应用分析##
//--------------------------------------------------

//--------------------------------------------------
//          ##素材管理##
//--------------------------------------------------

//--------------------------------------------------
//          ##深度学习##
//--------------------------------------------------

//--------------------------------------------------
//          ##系统监控##
//--------------------------------------------------

    ];
};
