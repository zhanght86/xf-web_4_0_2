webpackHotUpdate(0,{

/***/ 69:
/***/ (function(module, exports) {

	module.exports = "<!--引导页头部遮罩-->\r\n<div class=\"shadow_div dn\" style=\"height:60px;\" ></div>\r\n<!--引导页头部遮罩end-->\r\n<div class=\"main warp knowledgeFaq\">\r\n\r\n    <div class=\"addContent pd30\">\r\n        <div class=\"cl\">\r\n            <div class=\"r-cont-hd L\">\r\n                <span ng-if=\"!vm.knowledgeId\" style=\"color:#666;\">FAQ知识新增</span>\r\n                <span ng-if=\"vm.knowledgeId\" style=\"color:#666;\">FAQ知识编辑</span>\r\n            </div>\r\n            <a href=\"javascript:;\" class=\"c_green R\" ng-click=\"vm.showTip();\">使用帮助</a>\r\n        </div>\r\n        <div class=\"r-cont-bd oh pr\">\r\n            <!--<form novalidate=\"novalidate\" name=\"form\">-->\r\n            <div class=\"jqrsz-item\">\r\n                <div class=\"item-line\">\r\n                    <div class=\"lable\">\r\n                        知识标题：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\" style=\"width:100%;\">\r\n                            <input class=\"ipt-txt bd \" type=\"text\" autofocus style=\"width:407px;height:32px;\" ng-model=\"vm.title\" name=\"title\" ng-focus=\"vm.titleTip=''\" ng-minlength=\"1\" ng-maxlength=\"1000\" required />\r\n                            <i class=\"btn-empty\"></i>\r\n                            <p class=\"c-error pd-5\"  ng-if=\"vm.titleTip\">{{vm.titleTip}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- 时间-->\r\n                <span select-start-end-time=\"dialog\"></span>\r\n                <!--  bot -->\r\n                <span bot-class-tree=\"dialog\" ></span>\r\n <!--bot  類目數 点击生成  -->\r\n                <div class=\"item-line mb-10\" ng-if=\"vm.creatSelectBot.length\" ng-repeat=\"item in  vm.creatSelectBot track by $index\">\r\n                    <div class=\"lable\"> BOT路径：</div>\r\n                    <div class=\"value Div clearfix\" >\r\n                        <div class=\"ipt-txt-box L mr-10\">\r\n                            <div class=\"ipt-txt\" style=\"overflow:hidden;line-height:24px;width:407px;\">\r\n                                <a title=\"{{item.className.join('/')}}\">{{item.className.join(\"/\")}}</a>\r\n                            </div>\r\n                        </div>\r\n                        <a href=\"javascript:;\" class=\"L mr-10 mt-5\"  ng-click=\"vm.creatSelectBot.splice($index,1)\"><img src=\"../../../../images/images/delete_img.png\"  alt=\"\"></a>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"item-line\">\r\n                    <div class=\"row cl mb-10\">\r\n                        <div class=\"lable\" style=\"width:245px;\">业务框架：</div>\r\n                        <!--<label class=\"form-label col-xs-4 col-sm-2 text-r\">业务框架：</label>-->\r\n                        <div class=\"formControls col-xs-8 col-sm-9\" style=\"padding-left:0;\">\r\n                            <select  class=\"input-text pickFrame\" style=\"width:407px;\"  ng-model=\"vm.frameId\" ng-options=\"frame.frameId as frame.frameTitle for frame in vm.frames\">\r\n                                <option value=\"\" ng-if=\"vm.frames.length\">--请选择以上业务框架--</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\" style=\"overflow: visible\">\r\n                <span concept-extension=\"dialog\" tag=\"false\" api=\"queryFaqExtension\"></span>\r\n<!--手动添加 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensions\" ng-repeat=\"item in vm.extensions track by $index\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                           {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"$parent.knowCtr.rmeoveExtToLocal(vm.knowledgeId,'cust_faq_ext',item);vm.extensions.splice($index,1);\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>-->\r\n                    </div>\r\n                </div>\r\n<!-- 業務框架 生成 -->\r\n                <div class=\"item-line mb-10\"  style=\"overflow: visible\" ng-if=\"vm.extensionsByFrame\" ng-repeat=\"item in vm.extensionsByFrame\">\r\n                    <div class=\"lable\" ng-class=\"'milesVh'\">\r\n                        扩展问题：\r\n                    </div>\r\n                    <div class=\"value clearfix\" >\r\n                        <div class=\"bd tag_box L mr-10\" style=\"padding-left: 6px;\">\r\n                            {{item.extensionQuestionTitle}}\r\n                        </div>\r\n                        <span class=\"tag_s mr-10 L\">{{item.extensionQuestionType==60?'普通':'否定'}}</span>\r\n                        <a href=\"javascript:;\" ng-click=\"vm.backUpExt(item);vm.extensionsByFrame.splice($index,1)\" class=\"L mr-10\" ><img src=\"../../../../images/images/delete_img.png\" alt=\"\" ></a>\r\n                        <!--<a href=\"javascript:;\" class=\"L edit_a mr-10 mt-5\" ng-click=\"vm.KnowledgeEdit()\"></a>-->\r\n                        <span class=\"L\" ng-if=\"item.source\"><b>来源于: </b> <span>{{item.source}}</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-item\">\r\n                <div ng-if=\"vm.scanContent\" ng-repeat=\"(itemIndex,item) in vm.scanContent\">\r\n                    <div class=\"item-line\">\r\n                        <div class=\"lable\" style=\"padding-right:10px;box-sizing:border-box;\">\r\n                           内容{{itemIndex+1}}:\r\n                        </div>\r\n                        <div class=\"value\">\r\n                            <div class=\"ipt-txt-box clearfix\">\r\n                                <div class=\"textareaDiv textareaDiv1 textareaDiv2 L\">\r\n                                    <p ng-repeat=\"text in item.knowledgeContent.split('\\n') \">{{text}}</p>\r\n                                </div>\r\n                                <a href=\"javascript:;\" ng-click=\"vm.scanContent.splice($index,1)\" class=\"delete_a ml-10 L mt-20\"></a>\r\n                                <a href=\"javascript:;\" class=\"edit_a L mt-20 ml-10\" ng-click=\"vm.knowledgeAdd(vm.scanContent[$index],$index)\"></a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"item-line item_line\" >\r\n                        <div class=\"left\"></div>\r\n                        <div class=\"optionDiv\">渠道：\r\n                            <span class=\"mr-10\" ng-repeat=\"val in item.channelIdList\"><span ng-if=\"!$first\">, </span>{{val | channel:$parent.$parent.MASTER.channelList}}</span>\r\n                        </div>\r\n                    </div>\r\n                    <!--<div class=\"item-line item_line\" >-->\r\n                        <!--<div class=\"left\"></div>-->\r\n                        <!--<div class=\"optionDiv\">-->\r\n                            <!--维度:-->\r\n                            <!--<span class=\"mr-10\"  ng-repeat=\"val in item.dimensionIdList\"><span ng-if=\"!$first\">, </span>{{val | dimension:$parent.$parent.MASTER.dimensionList}}</span>-->\r\n                        <!--</div>-->\r\n                    <!--</div>-->\r\n                </div>\r\n                <div class=\"item-line\" style=\"margin-top: 15px\">\r\n                    <div class=\"lable\">\r\n                        知识内容：\r\n                    </div>\r\n                    <div class=\"value\">\r\n                        <div class=\"ipt-txt-box\">\r\n                            <input class=\"addBth\" ng-click=\"vm.knowledgeAdd('',(vm.scanContent.length)?(vm.scanContent.length):0)\" type=\"button\" value=\"+ 新增\"/>\r\n                            <i class=\"btn-empty\"></i>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"jqrsz-btn-box\" style=\"margin-bottom:120px;\">\r\n                <input class=\"btn btn-blue mr10\" value=\"保存\" type=\"button\"  ng-disabled=\"vm.limitSave\" ng-click=\"vm.save(vm.knowledgeId?'updateFaqKnow':'storeFaqKnow')\">\r\n                <a class=\"btn btn-gray\" href=\"javascript:;\" style=\"background: #2bcacc; color: #fff;\" ng-click=\"vm.scan()\">预览</a>\r\n            </div>\r\n            <!--引导-->\r\n            <div class=\"shadow_div dn\" ></div>\r\n            <div class=\"step_div \" >\r\n                <div class=\"step_one dn\" id=\"step_one\" >\r\n                    <div class=\"step_one_s\">1</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识标题：您需要填写这个知识的标准的提问方式哦~~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_two dn\" id=\"step_two\">\r\n                    <div class=\"step_one_s\">2</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>BOT:除了自动生成的BOT路径，您还可以点击选择按钮选择您所希望的BOT类目路径。选好了别忘了点击后面的加号，路径可以添加多个哦~</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_three dn\" id=\"step_three\">\r\n                    <div class=\"step_one_s\">3</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>业务框架：选择完毕路径之后，我们根据目前所选择的BOT，为您列出符合要求的业务框架，您可以选择对应的业务框架以节省编写扩展问的时间。业务框架可以添加多个哦~\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_four dn\" id=\"step_four\">\r\n                    <div class=\"step_one_s\">4</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>扩展问题：您可以自行填写扩展问题，应对问题的多样化.\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_five dn\" id=\"step_five\">\r\n                    <div class=\"step_one_s\">5</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>知识内容：知识内容就是答案，可以根据渠道维度的不同填写多个哦!\r\n                        </p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">跳出</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  class=\"introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"step_one step_six dn\" id=\"step_six\">\r\n                    <div class=\"step_one_s\">6</div>\r\n                    <div class=\"step_one_arrow\"></div>\r\n                    <div class=\"step_one_con\">\r\n                        <p>最后一步：编辑完知识可以选择预览，或者保存，就可以啦!</p>\r\n                        <div class=\"tr introjs-tooltipbuttons\">\r\n                            <button  class=\"introjs-button introjs-skip\" ng-click=\"vm.hideTip()\">完成</button>\r\n                            <button  class=\"introjs-button introjs-prev\" ng-click=\"vm.prevDiv($event)\">上一步</button>\r\n                            <button  disabled class=\"c-999 introjs-button introjs-next\" ng-click=\"vm.nextDiv($event)\">下一步</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!--引导end-->\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n"

/***/ })

})