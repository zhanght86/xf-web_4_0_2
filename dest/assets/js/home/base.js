//$(function(){
//	$(".header").pin();
//	$(window).resize(function() {
//	  $(".header").pin();
//	});
//	$('input, textarea').placeholder();
//
//	//asdie 二级菜单
//	$(".aside-nav2 .slide-a").on("click",function(){
//
//		if($(this).hasClass("slideActive")){
//			$(this).removeClass("slideActive").next(".menu_1").stop().slideToggle();
//		}else{
//			$(this).addClass("slideActive").next(".menu_1").stop().slideToggle();
//		}
//	});
//
//	//asdie N级菜�?
//	$(".aside-navn .slide-a").on("click",function(){
//
//		if($(this).hasClass("slideActive")){
//			$(this).removeClass("slideActive").next(".menu_1").stop().slideToggle();
//		}else{
//			$(this).addClass("slideActive").next(".menu_1").stop().slideToggle();
//		}
//	});
//
//	//文本框聚�?
//	$(".ipt-txt").on("focus keyup",function(){
//
//		if($(this).val().length>0)
//		{
//			$(this).next(".btn-empty").show();
//		}else{
//			$(this).next(".btn-empty").hide();
//
//		}
//	})
//
//	$(".ipt-txt").on("blur",function(){
//		$(this).next(".btn-empty").hide();
//	})
//
//	$(".btn-empty").on("click",function(){
//		$(this).hide().prev(".ipt-txt").val("");
//	})
//
//	//头像上传 弹窗显示
//	$(".js-jdbtn").on("click",function(){
//		$(".js-jdPop,.modal-backdrop").show();
//	})
//
//	//头像上传 弹窗显示
//	$(".js-zdybtn").on("click",function(){
//		$(".js-zdyPop,.modal-backdrop").show();
//	})
//
//	$(".pop-close").on("click",function(){
//		$(".pop_layer,.modal-backdrop").hide();
//	})
//
//	//树形菜单
//	$(".slide-a").on("click",function(){
//		if($(this).hasClass("slideActive")){
//			$(this).removeClass("slideActive").next(".menus").stop().slideToggle();
//		}else{
//			$(this).addClass("slideActive").next(".menus").stop().slideToggle();
//		}
//	})
//
//});
//
//
//
//$(function(){
//
//		/*多�??*/
//     	var evTimeStamp = 0;
//		$('.my-checkbox label').click(function(e){
//		 var now = +new Date();
//		 if (now - evTimeStamp < 100) {
//			 return;
//		 }
//		 evTimeStamp = now;
//		 console.log(2);
//		if($(this).hasClass('my-checkbox-on')==true){
//			$(this).removeClass('my-checkbox-on');
//			}
//		else {
//			$(this).addClass('my-checkbox-on');
//			}
//		});
//
//})
//
////下拉组件
//var baseSelect =
//{
//    resetSelect: function (e) {
//        if (e == undefined) {
//            //模拟下拉�?
//            $(".my-select").unbind("click").click(function () {
//                if (!$(this).find(".my-option").is(":visible")) {
//                    hideSelect($(".my-select"));
//                    selectHander($(this));
//                } else {
//                    hideSelect($(".my-select"));
//                    $(this).removeClass('my-on-select');
//                }
//            });
//            //失去焦点时隐藏list
//            $(document).click(function () {
//                hideSelect($(".my-select"));
//                $(".my-select").removeClass('my-on-select');
//            })
//            //阻止冒泡事件
//            $(".my-select").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//            $(".my-option dd").unbind("click").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//
////          //鼠标hover效果
////          $(".my-option dd").hover(function () {
////              $(this).css({color: "#eb8b00" });
////          }, function () {
////              $(this).css({color: "#2a3336" });
////          });
//
//            //鼠标点击效果
//            $(".my-option dd").click(function () {
//                hideSelect($(".my-select"));
//                setValue($(this));
//            });
//
//        } else {
//            //模拟下拉�?
//            $(e + " .my-select").unbind("click").click(function () {
//                if (!$(this).find(".my-option").is(":visible")) {
//                    hideSelect($(e + " .my-select"));
//                    selectHander($(this));
//                } else {
//                    hideSelect($(e + " .my-select"));
//                    $(this).removeClass('my-on-select');
//                }
//            });
//            //失去焦点时隐藏list
//            $(document).click(function () {
//                hideSelect($(e + " .my-select"));
//                $(e + " .my-select").removeClass('my-on-select');
//            })
//            //阻止冒泡事件
//            $(e + " .my-select").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//            $(e + " .my-option dd").unbind("click").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//
//            //鼠标hover效果
//            $(e + " .my-option dd").hover(function () {
//                $(this).css({color: "#eb8b00" });
//            }, function () {
//                $(this).css({color: "#2a3336" });
//            });
//
//            //鼠标点击效果
//            $(e + " .my-option dd").click(function () {
//                hideSelect($(e + " .my-select"));
//                setValue($(this));
//            });
//
//        }
//    },
//    resetSelect1: function (e) {
//        if (e == undefined) {
//            //模拟下拉�?
//            $(".my-select").unbind("click").click(function () {
//                if (!$(this).find(".my-option").is(":visible")) {
//                    hideSelect($(".my-select"));
//                    selectHander($(this));
//                } else {
//                    hideSelect($(".my-select"));
//                    $(this).removeClass('my-on-select');
//                }
//            });
//            //失去焦点时隐藏list
//            $(document).click(function () {
//                hideSelect($(".my-select"));
//                $(".my-select").removeClass('my-on-select');
//
//            })
//            //阻止冒泡事件
//            $(".my-select").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//            $(".my-option dd").unbind("click").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//
//            //鼠标hover效果
//            $(".my-option dd").hover(function () {
//                $(this).css({color: "#eb8b00" });
//            }, function () {
//                $(this).css({color: "#2a3336" });
//            });
//
//            //鼠标点击效果
//            $(".my-option dd").click(function () {
//                hideSelect($(".my-select"));
//                setValue1($(this));
//            });
//        } else {
//            //模拟下拉�?
//            $(e + " .my-select").unbind("click").click(function () {
//                if (!$(this).find(".my-option").is(":visible")) {
//                    hideSelect($(e + " .my-select"));
//                    selectHander($(this));
//                } else {
//                    hideSelect($(e + " .my-select"));
//                    $(this).removeClass('my-on-select');
//                }
//            });
//            //失去焦点时隐藏list
//            $(document).click(function () {
//                hideSelect($(e + " .my-select"));
//                $(e + " .my-select").css({ zIndex: "1" });
//            })
//            //阻止冒泡事件
//            $(e + " .my-select").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//            $(e + " .my-option dd").unbind("click").click(function (e) {
//                e ? e.stopPropagation() : event.cancelBubble = true;
//            });
//
//            //鼠标hover效果
//            $(e + " .my-option dd").hover(function () {
//                $(this).css({color: "#eb8b00" });
//            }, function () {
//                $(this).css({color: "#2a3336" });
//            });
//
//            //鼠标点击效果
//            $(e + " .my-option dd").click(function () {
//                hideSelect($(e + " .my-select"));
//                setValue1($(this));
//            });
//        }
//    }
//}
//
//$(function () {
//    baseSelect.resetSelect();
//});
//
//function hideSelect(val) {
//    $('.my-option>dl').height('');
//    val.find(".my-option").hide();
//    $(".my-select").removeClass('my-on-select');
//}
//
//function selectHander(tar) {
//    tar.find(".my-option").show();
//    if (tar.find(".my-option dl").height() > 184) {
//        tar.find(".my-option dl").height(184);
//    }
//    tar.addClass('my-on-select');
//    //ie6下宽�?-2像素
//}
//
//function setValue(e) {
//    var txt = e.text();
//    var label = e.parents(".my-select").find("label");
//    var input = e.parents(".my-select").find("input");
//
//    if (input.length == 0) {
//        label.text(txt);
//        var val = e.attr("val");
//        label.attr("val", val);
//    } else {
//        input.val(txt);
//    }
//
//
//}
//
//$(function () {
//    //客服应用信息
//    //修改名字弹窗
//    $(".msgR-name > span").click(function () {
//        $("#namePopupBG").css("display","block")
//    })
//    //删除确认弹窗
//    $("#deletePop").click(function () {
//        $("#delPopupBG").css("display","block")
//    })
//
//    $(".namePopupClose").click(function () {
//        $(".namePopupBG").css("display","none")
//    })
//
//    //机器人设�? 聊天弹窗
//    $(".mail").click(function () {
//        $(".chaPopBG").css("display","block")
//    });
//    $(".chaPopBGClose").click(function () {
//        $(".chaPopBG").css("display","none")
//    })
//
//    $(".chatPopRightNav li").click(function () {
//        $(".chatPopRightNav li").removeClass("chatPopRightNavOn");
//        $(this).addClass("chatPopRightNavOn");
//        var index=$(this).index();
//        if(index==0){
//            $(".hotIndex").css("display","block");
//            $(".hotPBM").css("display","none");
//            $(".hotPromotion").css("display","none");
//        }else if(index==2){
//            $(".hotIndex").css("display","none");
//            $(".hotPBM").css("display","block");
//            $(".hotPromotion").css("display","none");
//        }else if(index==4){
//            $(".hotIndex").css("display","none");
//            $(".hotPBM").css("display","none");
//            $(".hotPromotion").css("display","block");
//        }
//    })
//
//    //概念知识新增弹窗
//    $(".addBth").click(function () {
//        $(".namePopupBG").css("display","block")
//    });
//    $(".checkboxAddress .my-select").hover(function () {
//        $(this).find("[class='deleteAddress']").css("display","block");
//        $(this).find("em").css("display","none")
//    },function () {
//        $(this).find("[class='deleteAddress']").css("display","none");
//        $(this).find("em").css("display","block")
//    });
//    $(".deleteAddress").click(function () {
//        $(this).parents("[class='my-select']").remove();
//    });
//
//    $("#ipt-txt").focus(function () {
//        $(".aside-navs2").slideDown()
//    });
//    $(".btn-menu_1").click(function () {
//        $(".aside-navs2").slideDown();
//    });
//    $(document).click(function () {
//        $(".aside-navs2").slideUp()
//    });
//    $("#ipt-txt,.btn-menu_1,.aside-navs2").click(function(e){//自己要阻�?
//
//        e.stopPropagation();//阻止冒泡到body
//
//    });
//})
//
