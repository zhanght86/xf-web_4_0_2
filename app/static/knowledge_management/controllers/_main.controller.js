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
            selectChannel : selectChannel , //选择渠道
            isExtensionTagRepeat : isExtensionTagRepeat  ,  // 检测扩展问标签是否重复    营销 概念 列表 富文本知识新增
            rmeoveExtToLocal : rmeoveExtToLocal ,           //删除扩展问并添加到localStorage , 应用于所有知识编辑
            setKnowParamHasDialog : setKnowParamHasDialog ,  //弹框重置参数  应用于概念，faq
            isBotRepeat : isBotRepeat ,// 验证Bot 是否重复      For 知识新增bot添加
            botTreeOperate : botTreeOperate ,
            searchBotAutoTag : searchBotAutoTag,
            keyEnter : keyEnter
        };
        function selectChannel(self,channelId){
            if(self.vm.channelIdList.inArray(channelId)){
                self.vm.channelIdList.remove(channelId);
            }else{
                self.vm.channelIdList.push(channelId);
            }
        }
        /**
         * 检测扩展问标签是否重复
         * false   return   ；  true  return ext
         * */
        function isExtensionTagRepeat(current,allExtension,title,weight){
            console.log(allExtension) ;
            var isRepeat = true ;
            var tag = [] ;
            angular.forEach(current,function(tagList){
                angular.forEach(tagList.extensionQuestionTagList,function(item){
                    if(item.exist){   //标签存在情况下
                        tag.push(item.tagName);
                    }
                });
            });
            angular.forEach(allExtension,function(extension){
                var tagLen = 0 ;
                var itemTag = [] ;
                angular.forEach(extension.extensionQuestionTagList,function(item){
                    if(item.exist){       //存在标签
                        itemTag.push(item.tagName);
                    }
                    if(tag.inArray(item.tagName) && item.exist){   //标签重复数量
                        tagLen += 1;
                    }
                }) ;
                if(tagLen == itemTag.length && tag.length == itemTag.length && weight==extension.extensionQuestionType){
                    layer.msg('根据"'+ title+ '"生成扩展问重复,已阻止添加') ;
                    return   isRepeat = false ;
                }
            }) ;
            //判断是否是重复
            if(isRepeat != false){
                var extension = {
                    "extensionQuestionTitle" : title ,
                    "extensionQuestionType" : weight ,
                    "extensionQuestionTagList" : []
                }  ;
                angular.forEach(current,function(tagList){
                    angular.forEach(tagList.extensionQuestionTagList,function(item){
                        var tagTem = {
                            "exist" : item.exist ,
                            "tagClass" : item.tagClass ,
                            "tagName" : item.tagName ,
                            "tagType" : item.tagType
                        };
                        extension.extensionQuestionTagList.push(tagTem) ;
                    });
                });
                isRepeat = extension
            }
            return isRepeat
        }
        /**
         *  知识编辑 删除扩展问 本地备份
         *  isEdit  在编辑情况下使用
         *  概念 ： cust_concept_ext   ； faq ： cust_faq_ext
         *  列表 ： cust_list_ext      ；要素 ： cust_factor_ext
         *  富文本 ： cust_rich_text_ext
         * */
        function rmeoveExtToLocal(isEdit,localName,item){
            //
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
            self.vm.channelIdList = [];
            self.vm.question = 1;    //显示相关问
            self.vm.tip = 1;   //在提示
            self.vm.tail =1;   //弹出评价小尾巴
            self.vm.knowledgeRelevantContentList = [] ;//业务扩展问
            self.vm.dimensionArr = [];
        }
        function isBotRepeat(id,path,type,allBot){
            //className  classificationId  classificationType(不推送)
            //重复 提示   不重复返回bot对象
            // 校验对象  className
            var result = {             //定义bot对象
                "className" : path,
                "classificationId" : id,
                "classificationType" : type?type:67
            } ;    //返回對象
            var len = allBot.length;  //所有bot 長度
            // 集合转为string 便于比较  并不改变原数组
            var backUpPath = angular.copy(path).join("/") ;
            if(len){                  //需要验证
                angular.forEach(allBot,function(item){
                    console.log(item.className.join("/"),backUpPath) ;
                    if(item.className.join("/") == backUpPath){
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

                                       // 叶子节点 node
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
                                       html+=              '<i class="'+typeClass + backImage +'" data-option="'+response.data[i].id+'"></i>' ;
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
            //return tree ;
        }
        //BOT搜索自动补全
        function searchBotAutoTag(el,url,callback){
            $(el).autocomplete({
                serviceUrl: url,
                type:'POST',
                params:{
                    "categoryName":$(el).val(),
                    "categoryAttributeName":"node",
                    "categoryApplicationId":APPLICATION_ID
                },
                paramName:'categoryName',
                dataType:'json',
                transformResult:function(data){
                    var result = {
                        suggestions : []
                    };
                    if(data.data){
                        angular.forEach(data.data,function(item){
                            result.suggestions.push({
                                data:item.categoryId,
                                value:item.categoryName,
                                type : item.categoryTypeId
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
        // 键盘事件
        function keyEnter(e,callback) {
            var  srcObj = e.srcElement ? e.srcElement : e.target;
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                srcObj.blur();
                callback();
            }
        }
}])};