/**
 * Created by 41212 on 2017/7/21.
 */

module.exports = module=>{
    module
    .filter("operateState",function(){
        return function(value){
            var  result ;
            switch (value){
                case 120 :
                    result = "用户登录系统" ;
                    break ;
                case 121 :
                    result = "用户退出系统" ;
                    break ;
                case 122 :
                    result = "添加操作" ;
                    break ;
                case 123 :
                    result = "删除操作" ;
                    break ;
                case 124 :
                    result = "修改操作" ;
                    break ;
                case 125 :
                    result = "发布" ;
                    break ;
                case 126 :
                    result = "重启" ;
                    break ;
                case 127:
                    result = "上线";
                    break;
                case 128:
                    result = "下线";
                    break;
            }
            return result ;
        }
    })
    .filter("moduleType",function(){
        return function(value){
            var result;
            switch(value){
                case 997:
                    result ="应用管理/热点知识";
                    break;
                case 998:
                    result ="应用管理/节点管理";
                    break;
                case 999:
                    result ="应用管理";
                    break;
                case 1000:
                    result ="应用管理/发布管理";
                    break;
                case 1001:
                    result ="类目";
                    break;
                case 1002:
                    result ="类目库";
                    break;
                case 1003:
                    result ="框架库";
                    break;
                case 1004:
                    result ="知识管理/FAQ知识";
                    break;
                case 1005:
                    result ="知识管理/概念知识";
                    break;
                case 1006:
                    result ="知识管理/列表知识";
                    break;
                case 1007:
                    result ="知识管理/任务知识";
                    break;
                case 1008:
                    result ="知识管理/对话知识";
                    break;
                case 1009:
                    result ="同义词词库";
                    break;
                case 1010:
                    result ="集合词词库";
                    break;
                case 1011:
                    result ="业务词词库";
                    break;
                case 1012:
                    result ="敏感词词库";
                    break;
                case 1013:
                    result ="纠错词词库";
                    break;
                case 1014:
                    result ="停用词词库";
                    break;
                case 1015:
                    result ="强制分词词库";
                    break;
                case 1016:
                    result ="情感词库";
                    break;
                case 1017:
                    result ="BOT词库";
                    break;
                case 1018:
                    result ="素材库/图片";
                    break;
                case 1019:
                    result ="素材库/图文";
                    break;
                case 1020:
                    result ="素材库/语音";
                    break;
                case 1021:
                    result ="素材库/聊天知识库";
                    break;
                case 1022:
                    result ="应用管理/应用配置/机器人配置";
                    break;
                case 1023:
                    result ="应用管理/应用配置/参数配置";
                    break;
                case 1024:
                    result ="应用管理/应用配置/授权管理";
                    break;
                case 1025:
                    result ="应用管理/应用配置/备份还原";
                    break;
                case 1026:
                    result ="应用管理/应用配置/转人工设置";
                    break;
                case 1027:
                    result ="应用管理/应用配置/交互设置";
                    break;
                case 1028:
                    result ="权限管理/用户";
                    break;
                case 1029:
                    result ="权限管理/角色";
                    break;
                case 1030:
                    result ="权限管理/修改密码";
                    break;
            }
            return result;
        }
    })
};


