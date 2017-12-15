/**
 * Created by 41212 on 2017/7/21.
 */
//LoginrLogs(137, "登录日志"),
//    LogOutLogs(138,"退出登录"),
//    AddKnowledgeLogs(139, "添加知识日志"),
//    UpdateKnowledgeLogs(133, "修改知识日志"),
//    DeleteKnowledgeLogs(134, "删除知识日志"),
//    ReleaseApplicationLogs(135, "发布应用日志"),
//    DeleteApplicationLogs(136, "删除应用日志"),
module.exports = module=>{
    module
    .filter("operateState",function(){
        return function(val,title){
            var  result ;
            if(title==null){
                title = "";
            };
            switch (val){
                case "133" :
                    result = "修改知识:"+title ;
                    break ;
                case "134" :
                    result = "删除知识:"+title ;
                    break ;
                case "135" :
                    result = "发布应用" ;
                    break ;
                case "136" :
                    result = "删除应用" ;
                    break ;
                case "137" :
                    result = "登录系统" ;
                    break ;
                case "138" :
                    result = "退出系统" ;
                    break ;
                case "139" :
                    result = "添加知识:"+title ;
                    break ;
            }
            return result ;
        }
    })
};


