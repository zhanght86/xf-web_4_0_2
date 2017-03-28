/**
 * Created by Administrator on 2016/6/13.
 */
angular.module('pagination',[]).directive('pagination',[function(){
    return {
        restrict : 'EA',
        templateUrl: 'know_index/base/page/template.html',
        replace:true,
        scope:{
            conf:'='
        },
        link: function(scope,element,attrs){
            //改变当前页
            scope.changeCurrentPage = function(item){
                if(item == '...'){
                    return;
                }else{
                    scope.conf.currentPage = item;
                    $(window).scrollTop(0);

                }
            }

            function getPagination(newValve, oldValue){
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
            }
            
            //上一页
            scope.prevPage = function(){
                if(scope.conf.currentPage > 1){
                    scope.conf.currentPage -= 1;
                }
            }
            //下一页
            scope.nextPage = function(){
                if(scope.conf.currentPage < scope.conf.numberOfPages){
                    scope.conf.currentPage += 1;
                }
            }
            //检查输入
            scope.checkInput=function(){
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
            }
            // 跳转页
            scope.jumpToPage = function (e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    if(scope.jumpPageNum !== ''){
                        scope.conf.currentPage = scope.jumpPageNum;
                    }
                }
            }
            scope.$watch(function(){
                return scope.conf.totalItems +' '+scope.conf.currentPage +' '+scope.conf.pageSize;
            },getPagination);
        }
    }
}]);
