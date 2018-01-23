/**
 * @Author : MILES .
 * @Create : 2017/12/6.
 * @Module :  知识管理总控制器
 */
module.exports = knowledgeManagementModule =>{
    knowledgeManagementModule.controller('KnowledgeManagementController', [
    '$scope', 'localStorageService' ,"$state" ,"KnowledgeService","$timeout",
    ($scope,localStorageService, $state,KnowledgeService,$timeout) =>{
        $state.go("KM.overview");
        $scope.knowCtr = {
            rmeoveExtToLocal : rmeoveExtToLocal ,           //删除扩展问并添加到localStorage , 应用于所有知识编辑
            setKnowParamHasDialog : setKnowParamHasDialog ,  //弹框重置参数  应用于概念，faq
            isBotRepeat : isBotRepeat ,// 验证Bot 是否重复      For 知识新增bot添加
            botTreeOperate : botTreeOperate ,
            searchBotAutoTag : searchBotAutoTag,
            keyEnter : keyEnter,
            introduction : {
                showTip : showTip,
                hideTip : hideTip,
                prevDiv : prevDiv,
                nextDiv : nextDiv
             } ,
            skipNewLine : skipNewLine ,// 跳转到新的行
            removeExtention :removeExtention,
            showFrame :showFrame ,             //业务框架弹框
            extensionUnique : extensionUnique  //扩展问重复判断
        };
        /**
         *  业务框架
         *
         * */
        function showFrame(scope){
            if(!scope.parameter.classifyList.length){
                return layer.msg("请先选择添加类目")
            }
            let html = "<div frame='100' type='100'></div>";
            scope.$parent.$parent.MASTER.openNgDialog($scope,html,"650px",function(){

            },"",function(){

            });

        }
        /**
         * 检测扩展问标签是否重复
         * false   return   ；  true  return ext
         * */
        function extensionUnique(all,msg){
            console.log(all);
            let cur = -1 ;
            let repeatExt ;
            let allExt = all.map(ext=>ext.title).filter(ext=>ext) ;
            let newExt = [];
            angular.forEach(allExt,function(ext,index){
                if(!newExt.inArray(ext)){
                    newExt.push(ext)
                }else{
                    cur       = index;
                    repeatExt = ext  ;
                }
            });
            if(repeatExt){
                layer.msg(msg?msg:''+'"'+repeatExt+'"'+"添加重复，请修改，否在会在保存时自动清楚",{time:1000})
            }
            return cur
        }
          /**
         * 扩展问 跳转到新的行
         *
         * */
        function skipNewLine(scope,e,index,list) {
              let len = scope.parameter.extensionQuestionList.length ,
                  focusCur = index ;
              e = e || window.event ;
              // @1本行为空，提示填写
              // @2本行存在 |
              //             ----存在空行  -- 焦点移动
              //             ----存在重复  -- 焦点移动

              if((((e.keyCode|| e.which)==13) || e.type=="blur")  && nullCheck(scope.parameter.extensionQuestionList[len-1])){
                  if(!scope.parameter.extensionQuestionList[index].title){
                      if(e.type=="blur"){
                          return
                      }else{
                          return layer.msg("请填写完整") ;
                      }
                  }else{
                      if(list && scope.parameter.extensionQuestionList[index].title.match(/#\S+#/g)==null){
                         return layer.msg("用户问法必须含有#概念词/集合词#")
                      }
                      let repeatIndex = extensionUnique(scope.parameter.extensionQuestionList);
                      if(repeatIndex!=-1){
                          // focusCur = repeatIndex;
                          focusCur = 0;
                      }else{
                          if(scope.parameter.extensionQuestionList.every(item=>item.title)){
                              scope.parameter.extensionQuestionList.unshift({
                                  "title":""
                              }) ;
                              focusCur = 0 ;
                          }else{
                              focusCur = 0 ;
                              // focusCur = scope.parameter.extensionQuestionList.findIndex(item=>!item.title) ;
                          }
                      }
                  }
                  $timeout(function(){
                      $(e.target).parent().parent().children().eq(focusCur).find("input").focus().select();
                  })
              }
          }
        function removeExtention(scope,index) {
            if(index == 0){
                scope.parameter.extensionQuestionList[0].title = ""
            }else{
                scope.parameter.extensionQuestionList.splice(index,1)
            }
        }
        /**
         *  知识编辑 删除扩展问 本地备份
         *  isEdit  在编辑情况下使用
         *  概念 ： cust_concept_ext   ； faq ： cust_faq_ext
         *  列表 ： cust_list_ext      ；要素 ： cust_factor_ext
         *  富文本 ： cust_rich_text_ext
         * */
        function rmeoveExtToLocal(isEdit,localName,item){
            if(isEdit){
                //localStorageService.clearAll() ;
                var local = localStorageService.get(localName) ;
                if(local){
                    local.push(item) ;
                    localStorageService.set(localName,local) ;
                }else{
                    localStorageService.set(localName,new Array(item)) ;
                }
                console.log(localStorageService.get(localName))
            }
        }
        function setKnowParamHasDialog(self) {
            self.vm.newTitle = "";
            self.vm.channelIdList = "";
            self.vm.knowledgeRelevantContentList = [] ;//业务扩展问
        }
        function isBotRepeat(id,path,allBot){
            //className  classificationId  classificationType(不推送)
            //重复 提示   不重复返回bot对象
            console.log(1) ;
            var result = {             //定义bot对象
                "value" : path ,
                "classifyId"    : id
            } ;    //返回對象
            var len = allBot.length;  //所有bot 長度
            // 集合转为string 便于比较  并不改变原数组
            if(len){                  //需要验证
                angular.forEach(allBot,function(item){
                    if(item.value == path){
                        result = false ;
                        return  layer.msg("添加分类重复，已阻止添加");
                    }
                });
            }
            return result;
        }
        /*bot*/
        function botTreeOperate(self,selectCall,searchAutoUrl){
            var tree = {
                init : function(){
                    KnowledgeService.queryChildNodes.get({"id":"root"},function (response) {
                        self.vm.botRoot = response.data;
                    },function (error) {
                        console.log(error)
                    }) ;
                } ,
                getChildNode : getChildNode ,
                selectNode : selectNode ,
            } ;
            function getChildNode(){
                $(".aside-navs").on("click",'i',function(){
                    var id = $(this).attr("data-option");
                    var that = $(this);
                    if(!that.parent().parent().siblings().length){
                        that.css("backgroundPosition","0% 100%");
                        KnowledgeService.queryChildNodes.get({"id":id},function (response) {
                           if(response.status == 200){
                               if(response.data){
                                   var  html = '<ul class="menus">';
                                   for(var i=0;i<response.data.length;i++){
                                       var typeClass ;
                                       var edgeClass = "";
                                       // 叶子节点 node
                                       if(response.data[i].relation == "edge"){
                                           edgeClass = " edge_class"
                                       }
                                       if((response.data[i].leaf == 0)){
                                           typeClass = "bot-leaf"　;
                                       }else if((response.data[i].leaf != 0) && (response.data[i].relation == "edge" )){
                                           typeClass = "bot-edge"　;
                                       }else if((response.data[i].leaf != 0) && (response.data[i].relation == "node" )){
                                           typeClass = "icon-jj"
                                       }
                                       var  backImage ;
                                       switch(response.data[i].type){
                                           case 160 :
                                               backImage = " bot-divide" ;
                                               break  ;
                                           case 161 :
                                               backImage = " bot-process";
                                               break  ;
                                           case 162 :
                                               backImage = " bot-attr" ;
                                               break  ;
                                           case 163 :
                                               backImage = " bot-default" ;
                                               break  ;
                                       }
                                       html+= '<li>' +
                                           '<div class="slide-a">'+
                                           ' <a class="ellipsis" href="javascript:;">' ;
                                       html+=              '<i class="'+typeClass + edgeClass + backImage +'" data-option="'+response.data[i].id+'"></i>' ;
                                       html+=              '<span>'+response.data[i].name+'</span>'+
                                           '</a>' +
                                           '</div>' +
                                           '</li>'
                                   }
                                   html+="</ul>";
                                   $(html).appendTo((that.parent().parent().parent()));
                                   that.parent().parent().next().slideDown()
                               }
                           }
                        },function (error) {
                            console.log(error)
                        }) ;
                    }else{
                        if(that.css("backgroundPosition")=="0% 0%"){
                            that.css("backgroundPosition","0% 100%");
                            that.parent().parent().next().slideDown()
                        }else{
                            that.css("backgroundPosition","0% 0%");
                            that.parent().parent().next().slideUp()
                        }
                    }
                });
            }
            function selectNode(){
                $(".aside-navs").on("click","span",function(){
                    //类型节点
                    var pre = $(this).prev() ;
                    if(pre.hasClass("edge_class")){
                        return layer.msg("只能选择node类型添加",{time:1000})
                    }
                    angular.element(".icon-jj").css("backgroundPosition","0% 0%");
                    var id = pre.attr("data-option");
                    selectCall(id) ;   //添加bot分類
                    angular.element(".rootClassfy,.menus").slideToggle();
                });
            }
            tree.init() ;
            $timeout(function(){
                tree.getChildNode() ;
                tree.selectNode() ;
            },200) ;
        }
        //BOT搜索自动补全
        function searchBotAutoTag(el,url,callback){
            $(el).autocomplete({
                serviceUrl: url,
                type:'GET',
                params:{
                    "name":$(el).val(),
                    "relation"  :"node"
                },
                paramName:'name',
                dataType:'json',
                transformResult:function(data){
                    var result = {
                        suggestions : []
                    };
                    if(data.data){
                        angular.forEach(data.data,function(item){
                            result.suggestions.push({
                                classifyId:item.id,
                                value:item.name,
                            })
                        }) ;
                    }
                    return result;
                },
                onSelect: function(suggestion) {
                    console.log(suggestion) ;
                    callback(suggestion) ;
                }
            });
        }

        //*********************************************     faq  概念知识    ****************************************************************//
        // function concept
        /**
         *  知识编辑 删除扩展问 本地备份
         *  isEdit  在编辑情况下使用
         *  概念 ： cust_concept_ext   ； faq ： cust_faq_ext
         *  列表 ： cust_list_ext      ；要素 ： cust_factor_ext
         *  富文本 ： cust_rich_text_ext
         * */
        // 键盘事件
        function keyEnter(e,callback) {
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                srcObj.blur();
                callback();
            }
        }
        //引导页方法
        function showTip(){
            $('.shadow_div').show();
            $('.step_div').show();
            $('#step_one').show().siblings().hide();

        }
        function hideTip(){
            $('.shadow_div').hide();
            $('.step_div').hide();
        }
        //上一个
        function prevDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().prev()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().prev().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().prev().offset().top-20
                }, 500);
            }else{
                // $(obj).attr('disabled',true);
                return;
            }
        }
        //下一个
        function nextDiv(e){
            var  obj = e.srcElement ? e.srcElement : e.target;
            if($(obj).parent().parent().parent().next()){
                $(obj).parent().parent().parent().hide();
                $(obj).parent().parent().parent().next().show();
                $('html, body').animate({
                    scrollTop: $(obj).parent().parent().parent().next().offset().top-20
                }, 500);
            }else{
                //$(obj).attr('disabled',true);
                return;
            }
        }
}])};