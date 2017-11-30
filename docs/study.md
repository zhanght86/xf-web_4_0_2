angular 差件  https://segmentfault.com/a/1190000003858219

概念管理的 antucomplete 自动查询功能
 插件
http://www.qdfuns.com/notes/18303/17c4cf0cc6561e7ed8d634078df98f8b.html

1  时间表格    bug ： ng-model 取值失败  huck ： 添加onchange=""

        <input type="text" id="startTime" onchange=""  ng-model="vm.timeStart"  onclick="WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endTime\')}'})" class="input-text Wdate "  style="width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;" placeholder="yyyy-mm-dd" readonly>
                    -
        <input type="text" id="endTime"   onchange="" ng-model="vm.timeEnd" onclick="WdatePicker({startDate:'%y',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startTime\')}'})" class="input-text Wdate "  style="width:185px;border:1px solid #e1e1e1;height: 35px;font-size: 15px;color: #333!important;" placeholder="yyyy-mm-dd" readonly>
2  处理中文问题   bug： ng-model 不更新  hack ： blur   focus

3
    https://github.com/likeastore/ngDialog/blob/master/example/index.html
   dialog = ngDialog.openConfirm({
                template:"/know_index/businessModeling/aggregate/aggregateConceptManageDialog2.html",
                scope: $scope,
                Returns : {a:1},
                closeByDocument:false,
                closeByEscape: true,
                showClose : true,
                backdrop : 'static',
                preCloseCallback:function(e){    //关闭回掉
                    if(e === 1){
                        callback(item)
                    }else{
                        $scope.vm.key = "";
                        $scope.vm.term = "";
                        $scope.vm.weight =  1;
                    }
                }
            }).then(function (value) {
                console.log($(".concept_div").html(1));
                console.log('Modal promise resolved. Value: ', value);
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });

4 参数 传属性 需要 用 ‘’   并且在 方法里 用 【】  来包起来

5  <select class="sel bd L mr-5" id="channel_id" ng-model="vm.dimensionId" ng-options="site.dimensionId as site.dimensionName for site in vm.dimensions">
         <option  value="" >全部维度</option>
    </select>


6   checkbox    http://blog.csdn.net/csdn_lihe/article/details/49782947

7   <td class="color-blue2">{{item.collectiveConceptWeight | weightFilter}}</td>
   <td class="color-blue2">{{item.collectiveConceptTerm | strReplace}}</td>
    <td>{{item.collectiveConceptModifyTime | date : 'yyyy-MM-dd hh:mm:ss'}}</td>


 8    if(arr.inArray(id)){
                arr.remove(id)
            }else{
                arr.push(id)
            }

9    $scope.vm.paginationConf = {
                    currentPage: index,//当前页
                    totalItems: Math.ceil(data.total/5), //总条数
                    pageSize: 1,//第页条目数
                    pagesLength: 8,//分页框数量
                    numberOfPages  : Math.ceil(data.data.total/5)
                };
	 $scope.$watch('vm.paginationConf.currentPage', function(current){
            if(current){
                httpRequestPost("/api/modeling/concept/collective/listByAttribute",{
                    "collectiveConceptApplicationId": $scope.vm.applicationId,
                    "index" :current*$scope.vm.pageSize,
                    "pageSize": $scope.vm.pageSize
                },function(data){
                    $scope.listData = data.data;
                },function(){
                })
            }
        });

10  键盘      $scope.enterEvent = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.clickEvent();
        }
    }


11   http://www.cnblogs.com/benpaodexiaopangzi/p/5864087.html



12、angularJS三种定义全局变量的方法 :
    >>1.var 定义在js方法外部的全局变量
    >>2.value中储存的值是可以被修改的，但是constant的一经声明就无法修改，可以理解为常量，这样的话，我们可以根据需求
    >>>>来定义可以修改的全局变量还是不可修改的全局变量

    >>3.constant可以注入到.config()中，但是value却不可以，这是在底层代码中就做好了限制的

13、angular 内部 三元法 拓展
       >> {
       >>>>404 : "" ,
       >>>>403 : ""
       >>}[response.status]

14、调用html页面为ajax请求，如果在$httpProvider中添加过滤器，注意是否会影响到
15、oclazyload 出现问题题
	 //resolve : {
                    //    deps:["$ocLazyLoad",function($ocLazyLoad){
                    //        return $ocLazyLoad.load("/static/login/controllers/loginController");
                    //    }]
                    //}
	加入js文件有问题，会导致template加载出问题
16、/* 2017/11/6 miles 圆角兼容 */
    >>.XXXX {
       >>>> -moz-border-radius: 15px; /* Firefox */
       >>>> -webkit-border-radius: 15px; /* Safari 和 Chrome */
       >>>> border-radius: 15px; /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
       >>>> -moz-box-shadow: 10px 10px 20px #000; /* Firefox */
       >>>> -webkit-box-shadow: 10px 10px 20px #000; /* Safari 和 Chrome */
       >>>> box-shadow: 10px 10px 20px #000; /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
       >>>> behavior: url(../libs/ie_radius/ie-css3.htc); /* 通知IE浏览器调用脚本作用于'box'类 */
   }
########################################################################################################################################
API 列表
    https://max.book118.com/html/2015/0717/21207843.shtm

    http://www.jb51.net/article/102052.htm
    https://angularjs.shujuwajue.com/constantvaluerunfang_fa.html

    echart http://blog.csdn.net/kebi007/article/details/68488694

    https://stackoverflow.com/questions/25778149/explaining-the-order-of-the-ngmodel-pipeline-parsers-formatters-viewchangelis
    http://localhost:63342/dishui-web/js/pagination/index.html
    https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
    引导 https://www.zhihu.com/question/21292844

    uploader    https://my.oschina.net/u/3354666/blog/858285
                http://blog.csdn.net/lai_xu/article/details/49535847

    http://www.jb51.net/article/96714.htm