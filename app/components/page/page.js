/**
 * @Author : MILES .
 * @Create : 2017/12/13.
 * @Module : 分页插件
 */

/*
* -currentPage      //当前页数
* +pageSize         //每页数量
* -numberOfPages    //分页狂数量
* -totalItems       //数据总数
* -pagesLength      //显示分页块数量
* -location         //是否在地址栏使用
* -sizeName         //url 地址栏对应的 参数名称 默认 pageSize
* -currentName      //url 地址栏对应的 参数名称 默认 currentPage
* +search           //翻页数据更新方法
* */

module.exports = module =>{
    module
        .directive('pagination',function($sce,$timeout,$location){
            return{
                restrict:'EA',
                template :require("./template.html"),
                replace:true,
                scope:{
                    conf:'='
                },
                link: function(scope,element,attrs){
                    let pageTimer = "time"+new Date().getTime() ; //声明 定时器name
                    let currentName = scope.conf.currentName?scope.conf.currentName:"currentPage";
                    let sizeName = scope.conf.sizeName?scope.conf.sizeName:"pageSize";
                    scope.conf.pageSize = $location.search()[sizeName] || scope.conf.pageSize || 5  ;
                    scope.conf.currentPage = $location.search()[currentName] || scope.conf.currentPage || 1  ;
                    scope.conf.pagesLength =  scope.conf.pagesLength || 8  ;
                    //改变当前页
                    scope.changeCurrentPage = function(item){
                        if(item == '...'){
                            return;
                        }else{
                            scope.conf.currentPage = item;
                            $(window).scrollTop(0);
                        }
                    };
                    function getPagination(newValve, oldValue){
                        console.log(newValve,oldValue);
                        //console.log(newValve);
                        //当前页
                        scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;

                        //总条数
                        scope.conf.totalItems = parseInt(scope.conf.totalItems) ? parseInt(scope.conf.totalItems) : 0;

                        //每页条目数(default:15)
                        scope.conf.pageSize = parseInt(scope.conf.pageSize) ? parseInt(scope.conf.pageSize) : 15;

                        //总页数
                        scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.pageSize);
                        if(scope.conf.currentPage < 1){
                            scope.conf.currentPage = 1;
                        }
                        //页数上限限制
                        if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
                            scope.conf.currentPage = scope.conf.numberOfPages;
                        }

                        //跳转页数
                        scope.jumpPageNum = scope.conf.currentPage;

                        scope.pageList = [];
                        if(scope.conf.numberOfPages <= scope.conf.pagesLength){
                            //总页数如果小于等于分页的长度，则直接显示
                            for(var i = 1; i <= scope.conf.numberOfPages; i++){
                                scope.pageList.push(i);
                            }
                        }else{
                            // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                            // 计算中心偏移量
                            var offset = scope.conf.pagesLength % 2 == 0 ?  scope.conf.pagesLength / 2 : (scope.conf.pagesLength - 1 ) / 2;
                            if(scope.conf.currentPage <= offset){
                                //左边没有‘...’
                                for(var i = 1; i <= offset+1; i++){
                                    scope.pageList.push(i);
                                }
                                scope.pageList.push('...');
                                scope.pageList.push(scope.conf.numberOfPages);
                            }else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
                                scope.pageList.push(1);
                                scope.pageList.push('...');
                                for(i = offset; i >= 1; i--){
                                    scope.pageList.push(scope.conf.numberOfPages - i);
                                }
                                scope.pageList.push(scope.conf.numberOfPages);
                            }else{
                                //两边都有‘...’
                                scope.pageList.push(1);
                                scope.pageList.push('...');
                                for(var i = Math.ceil(offset/2)-1; i >=1; i--){
                                    scope.pageList.push(scope.conf.currentPage - i);
                                }
                                scope.pageList.push(scope.conf.currentPage);

                                for(var i = 1; i <= (offset/2); i++){
                                    scope.pageList.push(scope.conf.currentPage + i);
                                }
                                scope.pageList.push('...');
                                scope.pageList.push(scope.conf.numberOfPages);
                            }
                        }
                        if(scope.conf.onClick){
                            // 防止初始化两次请求问题
                            if(!(oldValue != newValve && oldValue[0] == 0)) {
                                scope.conf.onClick(scope.conf);
                            }
                        }
                        //scope.$parent.paginationConf = scope.conf;
                        //console.log("执行一次");
                        if(scope.conf.target){
                            scope.conf.target.currentPage = scope.conf.currentPage;
                        }else if(scope.$parent.SearchPOJO){
                            scope.$parent.SearchPOJO.currentPage = scope.conf.currentPage;
                        }else if(scope.conf.methodFn){
                            scope.conf.methodFn(scope.conf);
                        }
                        getCurrentPageNumber()
                    }

                    //上一页
                    scope.prevPage = function(){
                        if(scope.conf.currentPage > 1){
                            scope.conf.currentPage -= 1;
                        }
                    };
                    //下一页
                    scope.nextPage = function(){
                        if(scope.conf.currentPage < scope.conf.numberOfPages){
                            scope.conf.currentPage += 1;
                        }
                    };
                    //检查输入
                    scope.checkInput=function(){
                        scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');

                    };
                    // 跳转页
                    scope.jumpToPage = function (e){
                        var keycode = window.event?e.keyCode:e.which;
                        if(keycode==13){
                            if(scope.jumpPageNum !== ''){
                                scope.conf.currentPage = scope.jumpPageNum;
                            }
                        }
                    };
                    // 获取当前页 数据长度
                    var getCurrentPageNumber = function (){
                        if(scope.conf.numberOfPages <=1 ){
                            scope.conf.currentPageNumber = scope.conf.totalItems
                        }else{
                            if(scope.conf.currentPage != scope.conf.numberOfPages){
                                scope.conf.currentPageNumber = scope.conf.pageSize
                            }else{
                                scope.conf.currentPageNumber = (scope.conf.totalItems-(scope.conf.numberOfPages-1)*scope.conf.pageSize)
                            }
                        }
                        console.log(scope.conf.currentPageNumber)
                    } ;

                    scope.$watch(function(){
                        return scope.conf.numberOfPages  +' '+scope.conf.currentPage +' '+scope.conf.pageSize;
                    },getPagination);
                    scope.$watch('conf', function(current,old){
                        if((current.currentPage != old.currentPage) || (current.pageSize != old.pageSize )){
                            if(scope.conf.location){
                                // var locationUrl = {} ;
                                // locationUrl[currentName] = current.currentPage ;
                                // locationUrl[sizeName] = current.pageSize ;
                                $location.search(currentName,current.currentPage ) ;
                                $location.search(sizeName,current.pageSize);
                            } ;
                            if (pageTimer) {
                                $timeout.cancel(pageTimer)
                            }
                            pageTimer = $timeout(function () {
                                scope.conf.search(current.currentPage,current.pageSize) ;
                            }, 0)
                        }
                    },true);
                }
            }
        })
};

